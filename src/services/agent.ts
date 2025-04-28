import SDK from "@hyperledger/identus-edge-agent-sdk";
import { ShortFormDIDResolverSample } from "@/utils/index";
import { logger } from "@/utils/logger";
import { config } from "@/config";

export class AgentService {
  private apollo: SDK.Apollo;
  private config: typeof config;
  private logger: typeof logger;

  constructor(
    apollo: SDK.Apollo,
    config: typeof config,
    logger: typeof logger
  ) {
    this.apollo = apollo;
    this.config = config;
    this.logger = logger;
  }

  async fetchMediatorDID(
    mediatorEndpoint: string,
    didMethod: string
  ): Promise<SDK.Domain.DID> {
    this.logger.log("Agent", `Fetching mediator DID from: ${mediatorEndpoint}`);
    try {
      const response = await fetch(`${mediatorEndpoint}/did`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch mediator DID: ${response.status}`);
      }
      const did = SDK.Domain.DID.fromString(await response.text());
      this.logger.log(
        "Agent",
        "Mediator DID fetched successfully",
        did.toString()
      );
      return did;
    } catch (err) {
      this.logger.error("Agent", "Error fetching mediator DID", err);
      const fallbackDID = SDK.Domain.DID.fromString(`did:${didMethod}:12345`);
      this.logger.log(
        "Agent",
        "Using fallback mediator DID",
        fallbackDID.toString()
      );
      return fallbackDID;
    }
  }

  generateSeedAndMnemonics(): { mnemonics: string[]; seed: SDK.Domain.Seed } {
    this.logger.log("Agent", "Generating seed and mnemonics");
    const { seed, mnemonics } = this.apollo.createRandomSeed();
    this.logger.log(
      "Agent",
      "Seed and mnemonics generated",
      mnemonics.join(" ")
    );
    return { mnemonics, seed };
  }

  private async buildAgentDependencies(pluto: SDK.Domain.Pluto) {
    this.logger.log("Agent", "Creating agent dependencies");
    const mediatorDID = await this.fetchMediatorDID(
      this.config.MEDIATOR_URL,
      "did"
    );
    const extraResolvers = [ShortFormDIDResolverSample];
    const api = new SDK.ApiImpl();
    const castor = new SDK.Castor(this.apollo, extraResolvers);
    const didcomm = new SDK.DIDCommWrapper(this.apollo, castor, pluto);
    const mercury = new SDK.Mercury(castor, didcomm, api);
    this.logger.log("Agent", "Agent dependencies created successfully");
    return { apollo: this.apollo, pluto, castor, mercury, mediatorDID, api };
  }

  async startAgent(
    pluto: SDK.Pluto,
    seed: SDK.Domain.Seed
  ): Promise<SDK.Agent> {
    this.logger.log("Agent", "Starting agent service");
    try {
      const agentDependencies = await this.buildAgentDependencies(pluto);
      const agent = SDK.Agent.initialize({
        mediatorDID: agentDependencies.mediatorDID,
        pluto,
        api: agentDependencies.api,
        apollo: agentDependencies.apollo,
        castor: agentDependencies.castor,
        mercury: agentDependencies.mercury,
        seed,
      });
      await agent.start();
      const mediator = agent.currentMediatorDID;
      if (!mediator) {
        throw new Error("Mediator not available");
      }
      this.setupMessageHandlers(agent, pluto);
      this.logger.log("Agent", "Agent started successfully");
      return agent;
    } catch (err) {
      this.logger.error("Agent", "Failed to start agent", err);
      throw err;
    }
  }

  private setupMessageHandlers(agent: SDK.Agent, pluto: SDK.Pluto) {
    try {
      agent.addListener(SDK.ListenerKey.MESSAGE, async (messages) => {
        for (const message of messages) {
          if (message instanceof SDK.Domain.Message) {
            if (message.piuri === SDK.ProtocolType.DidcommOfferCredential) {
              this.logger.log("Agent", "Received credential offer", message);
              const existingMessage = await pluto.getMessage(message.id);
              if (!existingMessage) {
                await pluto.storeMessage(message);
                this.logger.log(
                  "Agent",
                  "Message stored successfully",
                  message.id
                );
              } else {
                this.logger.log(
                  "Agent",
                  "Message already exists, skipping",
                  message.id
                );
              }
            } else if (
              message.piuri === SDK.ProtocolType.DidcommIssueCredential
            ) {
              this.logger.log("Agent", "Received credential issue", message);
              const attachment = message.attachments.at(0);
              if (attachment) {
                const encodedCompactSDJWT = attachment.payload;
                const credential =
                  SDK.SDJWTCredential.fromJWS(encodedCompactSDJWT);
                await pluto.storeCredential(credential);
                this.logger.log("Agent", "Credential stored successfully");
              }
            } else if (
              message.piuri === SDK.ProtocolType.DidcommRequestPresentation
            ) {
              this.logger.log(
                "Agent",
                "Received presentation request",
                message
              );
              await this.acceptPresentationRequest(agent, message);
              this.logger.log("Agent", "Presentation request accepted");
            }
          }
        }
      });
    } catch (error) {
      this.logger.error("Agent", "Failed to set up message handlers", error);
    }
  }

  async acceptCredentialOffer(
    agent: SDK.Agent,
    message: SDK.Domain.Message
  ): Promise<void> {
    if (message.body.goal_code !== "Offer Credential") {
      throw new Error("Invalid credential offer type");
    }
    const credentialOffer = SDK.OfferCredential.fromMessage(message);
    const requestCredential = await agent.prepareRequestCredentialWithIssuer(
      credentialOffer
    );
    const requestMessage = requestCredential.makeMessage();
    await agent.sendMessage(requestMessage);
  }

  async acceptPresentationRequest(
    agent: SDK.Agent,
    message: SDK.Domain.Message
  ): Promise<void> {
    const requestPresentation = SDK.RequestPresentation.fromMessage(message);
    const credentials = await agent.pluto.getAllCredentials();
    const credential = credentials[0]; // Simplified selection
    if (!credential) throw new Error("No credentials available");
    const presentation = await agent.createPresentationForRequestProof(
      requestPresentation,
      credential
    );
    const msg = presentation.makeMessage();
    await agent.sendMessage(msg);
  }

  async acceptInvitationUrl(agent: SDK.Agent, url: string): Promise<void> {
    const parsed = await agent.parseOOBInvitation(new URL(url));
    await agent.acceptInvitation(parsed, "AcceptInvitationUrl");
  }
}

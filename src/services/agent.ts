import SDK from "@hyperledger/identus-edge-agent-sdk";
import { ShortFormDIDResolverSample } from "@/utils/index";
import { CLOUD_AGENT_URL, config, MEDIATOR_URL } from "@/config";
import { connectPluto } from "./pluto";
import { HttpMethod } from "@hyperledger/identus-edge-agent-sdk/build/domain";

class CustomApi extends SDK.ApiImpl {
  async request(
    method: HttpMethod,
    path: string,
    params?: any,
    body?: any,
    headers?: any
  ): Promise<any> {
    const url = `${CLOUD_AGENT_URL}${path}`; // Prepend cloud base URL to all paths
    // Call the parent request method with the full URL
    console.log("Sending to:", url);
    return super.request(method, url, params, body, headers);
  }
}
export class AgentService {
  private apollo: SDK.Apollo;
  // FIXME: the type of logger shhould be fixed
  private logger: any;
  private config: any;
  private pluto: SDK.Pluto | null = null;

  constructor(apollo: SDK.Apollo, logger) {
    this.apollo = apollo;
    this.config = config;
    this.logger = logger;
  }

  async initializePluto(forceNew: boolean): Promise<SDK.Pluto | null> {
    this.logger.log("AgentService", "Initializing Pluto");
    if (!this.pluto || forceNew) {
      this.pluto = await connectPluto(forceNew);
    }
    this.logger.log("AgentService", "Pluto initialized", this.pluto);
    return this.pluto;
  }

  async startAgent(
    seed: SDK.Domain.Seed,
    forceNew: boolean = false
  ): Promise<SDK.Agent> {
    this.logger.log("Agent", "Starting agent service");
    try {
      if (!this.pluto) {
        await this.initializePluto(forceNew);
      }
      const agentDependencies = await this.buildAgentDependencies(this.pluto!);
      const mediator = agentDependencies.mediatorDID;
      if (!mediator) {
        throw new Error("Mediator not available");
      }

      const customApi = new CustomApi();
      const agent = SDK.Agent.initialize({
        mediatorDID: mediator,
        pluto: this.pluto!,
        api: customApi,
        apollo: agentDependencies.apollo,
        castor: agentDependencies.castor,
        mercury: agentDependencies.mercury,
        seed,
      });
      await agent.start();
      this.setupMessageHandlers(agent, this.pluto!);
      this.logger.log("Agent", "Agent started successfully");
      return agent;
    } catch (err) {
      this.logger.error("Agent", "Failed to start agent", err);
      throw err;
    }
  }

  async fetchMediatorDID(
    mediatorEndpoint: string
  ): Promise<SDK.Domain.DID | null> {
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
      this.logger.log("Agent", "No mediator DID found");
      return null;
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
    const mediatorDID = await this.fetchMediatorDID(MEDIATOR_URL);
    const extraResolvers = [ShortFormDIDResolverSample];
    const api = new SDK.ApiImpl();
    const castor = new SDK.Castor(this.apollo, extraResolvers);
    const didcomm = new SDK.DIDCommWrapper(this.apollo, castor, pluto);
    const mercury = new SDK.Mercury(castor, didcomm, api);
    this.logger.log("Agent", "Agent dependencies created successfully");
    return { apollo: this.apollo, pluto, castor, mercury, mediatorDID, api };
  }

  private setupMessageHandlers(agent: SDK.Agent, pluto: SDK.Pluto) {
    try {
      agent.addListener(SDK.ListenerKey.MESSAGE, async (messages) => {
        for (const message of messages as SDK.Domain.Message[]) {
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
    // FIXME: This is a simplified selection of credentials
    // In a real-world scenario, you would need to select the appropriate credential
    // based on the requestPresentation and the available credentials.
    // For example, you might want to check the schema or type of the credential
    // against the requestPresentation.
    // const credential = credentials.find((cred) => {
    //   return cred.schemaId === requestPresentation.schemaId;
    // });
    // For now, we will just take the first credential available.
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

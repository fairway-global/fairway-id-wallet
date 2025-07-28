import { create } from "zustand";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import { apollo } from "../services/pluto";
import { AgentService } from "../services/agent";
import { CryptoUtils } from "../utils/crypto";
import { logger } from "@/utils/logger";
import { config } from "../config";

interface AgentState {
  agent: SDK.Agent | null;
  agentLoading: boolean;
  initError: string | null;
}

interface AgentActions {
  startAgent: (forceNew?: boolean) => Promise<SDK.Agent>;
  stopAgent: () => Promise<void>;
  acceptCredentialOffer: (message: SDK.Domain.Message) => Promise<void>;
  acceptPresentationRequest: (message: SDK.Domain.Message) => Promise<void>;
  acceptInvitationUrl: (url: string) => Promise<void>;
}

// Create AgentService instance
const agentService = new AgentService(apollo, logger);

export const useAgentStore = create<AgentState & AgentActions>((set, get) => ({
  agent: null,
  agentLoading: false,
  initError: null,

  async startAgent(forceNew = false) {
    set({ agentLoading: true, initError: null });
    logger.log("Agent", "Starting agent");
    try {
      // MODIFIED: Validate and handle localStorage early
      let data;
      try {
        data = JSON.parse(
          localStorage.getItem(config.LOCAL_STORAGE_NAME) ?? "{}"
        );
      } catch (parseErr) {
        logger.error("Agent", "Corrupt localStorage data", parseErr);
        localStorage.removeItem(config.LOCAL_STORAGE_NAME); // Clear corrupt data
        throw new Error("Invalid stored data. Cleared storage.");
      }

      if (!data.encryptedSeed) throw new Error("No encrypted seed found");
      const seedHex = CryptoUtils.decrypt(
        data.encryptedSeed,
        config.SECRET_KEY
      );
      if (Buffer.from(seedHex, "hex").length !== 64)
        throw new Error("Invalid seed length");

      const seed = { value: Buffer.from(seedHex, "hex") };
      const agent = await agentService.startAgent(seed, forceNew);
      set({ agent, agentLoading: false });
      return agent;
    } catch (err) {
      logger.error("Agent", "Error starting agent", err);
      set({ agentLoading: false, initError: err.message });
      throw err;
    }
  },

  async stopAgent() {
    logger.log("Agent", "Stopping agent");
    try {
      const { agent } = get();
      if (agent) {
        await agent.stop();
      }
      set({ agent: null });
      logger.log("Agent", "Agent stopped successfully");
    } catch (err) {
      logger.error("Agent", "Error stopping agent", err);
      throw err;
    }
  },

  // Accept a credential offer
  async acceptCredentialOffer(message) {
    logger.log("Agent", "Accepting credential offer");
    try {
      const agent = get().agent;
      if (!agent) throw new Error("Agent not initialized");
      if (message.body.goal_code !== "Offer Credential") {
        throw new Error("Invalid acceptCredentialOffer type");
      }
      await agentService.acceptCredentialOffer(agent, message);
      logger.log("Agent", "Credential offer accepted successfully");
    } catch (err) {
      logger.error("Agent", "Failed to accept credential offer", err);
      throw err;
    }
  },

  // Accept a presentation request
  async acceptPresentationRequest(message) {
    logger.log("Agent", "Accepting presentation request");
    try {
      const agent = get().agent;
      if (!agent) throw new Error("Agent not initialized");
      await agentService.acceptPresentationRequest(agent, message);
      logger.log("Agent", "Presentation request accepted successfully");
    } catch (err) {
      logger.error("Agent", "Failed to accept presentation request", err);
      throw err;
    }
  },

  // Accept an invitation URL
  async acceptInvitationUrl(url) {
    logger.log("Agent", "Accepting invitation URL");
    try {
      const agent = get().agent;
      if (!agent) throw new Error("Agent not initialized");
      await agentService.acceptInvitationUrl(agent, url);
      logger.log("Agent", "Invitation URL accepted successfully");
    } catch (err) {
      logger.error("Agent", "Failed to accept invitation URL", err);
      throw err;
    }
  },
}));

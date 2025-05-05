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
}

interface AgentActions {
  startAgent: (forceNew?: boolean) => Promise<SDK.Agent>;
  stopAgent: () => Promise<void>;
  acceptCredentialOffer: (message: SDK.Domain.Message) => Promise<void>;
  acceptPresentationRequest: (message: SDK.Domain.Message) => Promise<void>;
  acceptInvitationUrl: (url: string) => Promise<void>;
}

// Create AgentService instance with required dependencies
const agentService = new AgentService(apollo, logger);

// Create the agent store
export const useAgentStore = create<AgentState & AgentActions>((set, get) => ({
  // Initial state
  agent: null,
  isAgentActive: false,
  agentLoading: false,

  // Start the agent (preserves original logic including localStorage retrieval)
  async startAgent(forceNew = false) {
    set({ agentLoading: true }); // Set loading to true when starting agent
    logger.log("Agent", "Starting agent");
    try {
      let agent = get().agent;
      if (agent) {
        await agent.start();
        set({ agentLoading: false });
        return agent;
      }

      // Retrieve and decrypt seed from localStorage
      const localStorageData = localStorage.getItem(config.LOCAL_STORAGE_NAME);
      const parsedLocalStorageData = localStorageData
        ? JSON.parse(localStorageData)
        : null;
      const encryptedSeed = parsedLocalStorageData?.encryptedSeed;
      if (!encryptedSeed) {
        throw new Error("No seed found in localStorage");
      }

      const seedBytes = CryptoUtils.decrypt(encryptedSeed);
      const seed = { value: Buffer.from(seedBytes, "hex") };
      if (seed.value.length !== 64) {
        throw new Error(
          `Invalid seed length: expected 64 bytes, got ${seed.value.length}`
        );
      }

      // Start the agent using AgentService
      agent = await agentService.startAgent(seed, forceNew);
      set({ agent, agentLoading: false });
      logger.log("AgentStore", "Agent started successfully", agent);
      return agent;
    } catch (err) {
      logger.error("AgentStore", "Error starting agent", err);
      set({ agentLoading: false });
      throw err;
    }
  },

  // Stop the agent
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

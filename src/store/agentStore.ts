import { create } from "zustand";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import { connectPluto, removeAllDatabases } from "../services/pluto";
import { logger } from "@/utils/logger";
import { apollo } from "../services/pluto";
import { config } from "../config";
import { AgentService } from "../services/agent";
import { CryptoUtils } from "../utils/crypto";

// Define the state and actions interfaces
interface AgentState {
  agent: SDK.Agent | null;
  pluto: SDK.Pluto | null;
  isAgentActive: boolean;
  agentLoading: boolean; // New loading state
}

interface AgentActions {
  initializePluto: (forceNew: boolean) => Promise<SDK.Pluto>;
  startAgent: () => Promise<SDK.Agent>;
  stopAgent: () => Promise<void>;
  acceptCredentialOffer: (message: SDK.Domain.Message) => Promise<void>;
  acceptPresentationRequest: (message: SDK.Domain.Message) => Promise<void>;
  acceptInvitationUrl: (url: string) => Promise<void>;
}

// Create AgentService instance with required dependencies
const agentService = new AgentService(apollo, config, logger);

// Create the agent store
export const useAgentStore = create<AgentState & AgentActions>((set, get) => ({
  // Initial state
  agent: null,
  pluto: null,
  isAgentActive: false,
  agentLoading: false, // Initialize loading state

  // Initialize Pluto (handles existing or new Pluto instances)
  async initializePluto(forceNew) {
    logger.log("Agent", "Initializing Pluto");
    let pluto = get().pluto;
    if (!pluto || forceNew) {
      pluto = await connectPluto(forceNew);
      set({ pluto });
    } else {
      await pluto.start();
    }
    logger.log("Agent", "Pluto initialized", pluto);
    return pluto;
  },

  // Start the agent (preserves original logic including localStorage retrieval)
  async startAgent() {
    set({ agentLoading: true }); // Set loading to true when starting agent
    logger.log("Agent", "Starting agent");
    try {
      let agent = get().agent;
      if (agent) {
        await agent.start();
        set({ isAgentActive: true, agentLoading: false });
        return agent;
      }

      // Check if wallet exists by initializing Pluto and checking mediators
      const pluto = await get().initializePluto(false); // Default to not forcing new
      const mediators = await pluto.getAllMediators();
      const hasLocalStorageData =
        localStorage.getItem("fairway-wallet-storage") !== null;
      const walletExists = mediators?.length > 0 && hasLocalStorageData;

      // Re-initialize Pluto based on wallet existence
      const finalPluto = await get().initializePluto(
        walletExists ? false : true
      );
      if (!finalPluto) {
        throw new Error("Failed to initialize Pluto");
      }

      // Retrieve encrypted seed from localStorage (as in original)
      const localStorageData = localStorage.getItem("fairway-wallet-storage");
      const parsedLocalStorageData = localStorageData
        ? JSON.parse(localStorageData)
        : null;
      const encryptedSeed = parsedLocalStorageData?.encryptedSeed;
      if (!encryptedSeed) {
        throw new Error("No seed found in localStorage");
      }

      // Decrypt the seed using config.SECRET_KEY
      const seedBytes = CryptoUtils.decrypt(encryptedSeed);
      const seed = { value: Buffer.from(seedBytes, "hex") };
      if (seed.value.length !== 64) {
        throw new Error(
          `Invalid seed length: expected 64 bytes, got ${seed.value.length}`
        );
      }

      // Start the agent using AgentService
      agent = await agentService.startAgent(finalPluto, seed);
      set({ agent, isAgentActive: true, agentLoading: false });
      logger.log("Agent", "Agent started successfully", agent);
      return agent;
    } catch (err) {
      logger.error("Agent", "Error starting agent", err);
      const pluto = get().pluto;
      if (pluto) await pluto.stop();
      set({ agentLoading: false }); // Reset loading state on error
      throw err;
    }
  },

  // Stop the agent
  async stopAgent() {
    logger.log("Agent", "Stopping agent");
    try {
      const { agent, pluto } = get();
      if (agent) {
        await agent.stop();
      }
      if (pluto) {
        await pluto.stop();
        await removeAllDatabases();
      }
      set({ agent: null, pluto: null, isAgentActive: false });
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

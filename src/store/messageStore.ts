import { create } from "zustand";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import { useAgentStore } from "./agentStore";
import { logger } from "@/utils/logger";

export type FormattedMessage = Partial<SDK.Domain.Message> & {
  id: string;
  type: string;
  content?: Record<string, unknown>;
  timestamp: string;
  from?: string;
  to?: string;
  status: "pending" | "processed" | "error";
};

interface MessageState {
  messages: FormattedMessage[];
  rawMessages: SDK.Domain.Message[];
  fetchMessages: () => Promise<void>;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  rawMessages: [],

  async fetchMessages() {
    logger.log("Messages", "Fetching messages");
    try {
      const agent = useAgentStore.getState().agent;
      if (!agent) throw new Error("Agent not initialized");
      const storedMessages = await agent.pluto.getAllMessages();
      const messagesFormated: FormattedMessage[] = storedMessages
        .map((msg: any) => ({
          id: msg.id || crypto.randomUUID(),
          type: msg.piuri || "unknown",
          content: msg.body || {},
          timestamp: msg.createdTime
            ? new Date(msg.createdTime * 1000).toISOString()
            : new Date().toISOString(),
          from: msg.from?.toString(),
          to: msg.to?.toString(),
          status: "processed" as const, // Simplified for this example
        }))
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      set({ messages: messagesFormated, rawMessages: storedMessages });
    } catch (err) {
      logger.error("Messages", "Failed to fetch messages", err);
      set({ messages: [], rawMessages: [] });
    }
  },
}));

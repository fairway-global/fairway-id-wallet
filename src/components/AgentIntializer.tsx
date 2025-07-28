"use client";
import { useEffect } from "react";
import { useAgentStore } from "../store/agentStore";
import { toast } from "sonner";

const AgentInitializer = () => {
  const { agent, startAgent, initError } = useAgentStore();

  useEffect(() => {
    if (!agent) {
      startAgent().catch(() => {
        toast.error("Failed to initialize agent. Please restart.");
      });
    }
  }, [agent, startAgent]);

  useEffect(() => {
    if (initError) {
      toast.error(initError);
    }
  }, [initError]);

  return null; // No UI, just init logic
};

export default AgentInitializer;

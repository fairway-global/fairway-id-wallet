"use client";

import { HeroUIProvider } from "@heroui/react";
import ErrorBoundary from "../components/ErrorBoundary";
import { AgentProvider } from "../context/AgentContext";
import { useAgentStore } from "../store/agentStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { agent, agentLoading } = useAgentStore();
  const agentState = { agent, agentLoading };

  return (
    <AgentProvider state={agentState}>
      <ErrorBoundary>
        <HeroUIProvider>{children}</HeroUIProvider>
      </ErrorBoundary>
    </AgentProvider>
  );
}

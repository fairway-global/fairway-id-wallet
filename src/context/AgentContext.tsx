import { createContext, useContext } from "react";
import SDK from "@hyperledger/identus-edge-agent-sdk";

interface AgentContextType {
  agent: SDK.Agent | null;
  agentLoading: boolean;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};

export const AgentProvider = ({
  state,
  children,
}: {
  state: { agent: SDK.Agent | null; agentLoading: boolean };
  children: React.ReactNode;
}) => {
  const { agent, agentLoading } = state;

  return (
    <AgentContext.Provider value={{ agent, agentLoading }}>
      {children}
    </AgentContext.Provider>
  );
};

"use client";

import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "sonner";
import { useAgentStore } from "../store/agentStore";
import { AgentProvider } from "../context/AgentContext";

// Client-only component to handle Zustand store usage
const ClientAgentProvider = ({ children }: { children: React.ReactNode }) => {
  const { agent, agentLoading } = useAgentStore();

  // During SSR, provide default values; on client, use store values
  const agentState = { agent, agentLoading };

  return <AgentProvider state={agentState}>{children}</AgentProvider>;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Toaster />
        <ClientAgentProvider>
          <Providers>{children}</Providers>
        </ClientAgentProvider>
      </body>
    </html>
  );
}

"use client";
import Welcome from "@/components/Welcome";
import PageLoader from "../components/PageLoader";
import { useAgentStore } from "../store/agentStore"; // MODIFIED: Use store for loading

export default function Root() {
  const { agentLoading } = useAgentStore(); // MODIFIED: Use agent loading state

  if (agentLoading) {
    return <PageLoader loaderText="wallet booting up..." />;
  }

  return <Welcome />;
}

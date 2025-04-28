"use client";
import Welcome from "@/components/Welcome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAgentStore } from "../store/agentStore";

export default function Root() {
  const router = useRouter();
  const [userAgent, setUserAgent] = useState("");

  useEffect(() => {
    setUserAgent(navigator.userAgent);

    // Simple check for mobile devices
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (!isMobile) {
      router.replace("/error");
    }
  }, [router]); // Dependencies to avoid unnecessary re-renders

  const { startAgent, stopAgent, agentLoading, agent } = useAgentStore();

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        if (!agent && !agentLoading) {
          await startAgent();
        }
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to initialize agent:", error);
        alert("Failed to initialize agent. Please try again.");
        router.push("/");
      }
    };
    initializeAgent();
    // Cleanup function to stop the agent when the component unmounts
    // This is important to prevent memory leaks and ensure proper shutdown of the agent
    async function cleanup() {
      try {
        await stopAgent();
        console.log("Agent stopped successfully");
      } catch (error) {
        console.error("Failed to stop agent:", error);
      }
    }
    return () => {
      cleanup();
    };
  }, [agent]);

  // Check if userAgent is available
  if (!userAgent) {
    return null;
  }

  return <Welcome />;
}

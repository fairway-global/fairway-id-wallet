"use client";
import Welcome from "@/components/Welcome";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAgentStore } from "../store/agentStore";

export default function Root() {
  const router = useRouter();
  const { startAgent, stopAgent, agentLoading, agent } = useAgentStore();

  useEffect(() => {
    // Simple check for mobile devices
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (!isMobile) {
      router.replace("/error");
    }
  }, [router]);

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        if (!agent && !agentLoading) {
          await startAgent();
          if (agent) {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Failed to initialize agent:", error);
        alert("Failed to initialize agent. Please try again.");
        router.push("/");
      }
    };

    initializeAgent();

    // return () => {
    //   const cleanup = async () => {
    //     try {
    //       await stopAgent();
    //       console.log("Agent stopped successfully");
    //     } catch (error) {
    //       console.error("Failed to stop agent:", error);
    //     }
    //   };
    //   cleanup();
    // };
  }, []);

  return <Welcome />;
}

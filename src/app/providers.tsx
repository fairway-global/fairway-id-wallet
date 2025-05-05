// "use client";

// import { HeroUIProvider } from "@heroui/react";
// import ErrorBoundary from "../components/ErrorBoundary";
// import { AgentProvider } from "../context/AgentContext";
// import { useAgentStore } from "../store/agentStore";

// export function Providers({ children }: { children: React.ReactNode }) {
//   const { agent, agentLoading } = useAgentStore();
//   const agentState = { agent, agentLoading };

//   return (
//     <AgentProvider state={agentState}>
//       <ErrorBoundary>
//         <HeroUIProvider>{children}</HeroUIProvider>
//       </ErrorBoundary>
//     </AgentProvider>
//   );
// }

"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner, HeroUIProvider, Image } from "@heroui/react";
import ErrorBoundary from "../components/ErrorBoundary";
import { AgentProvider } from "../context/AgentContext";
import { useAgentStore } from "../store/agentStore";
import { useWalletStore } from "../store/walletStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { agent, agentLoading, startAgent } = useAgentStore();
  const { checkWalletExists, hasWallet, checkingWallet } = useWalletStore();

  const isMobile = useMemo(() => {
    // Enhanced mobile check with broader regex and touch event detection
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
      navigator.userAgent
    );
  }, [navigator.userAgent]);

  // separate useEffect for mobile check
  useEffect(() => {
    if (!isMobile) {
      router.replace("/error");
    }
  }, [isMobile]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkWalletExists();
        if (hasWallet) {
          await startAgent();
          if (pathname === "/") {
            router.push("/dashboard");
          }
        } else {
          if (pathname !== "/") {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error initializing wallet and agent:", error);
        router.push("/");
      }
    };

    setTimeout(() => initialize(), 500);
  }, [hasWallet, checkingWallet, pathname]);

  if (checkingWallet || agentLoading) {
    // Show a loading state while checking for wallet and agent
    // Create a more sophisticated loading spinner or animation from hero-ui
    return (
      <div
        className="flex flex-col items-center justify-center h-screen bg-gray-900"
        aria-label="Loading"
      >
        {/* Pulsing Logo */}
        <div className="animate-pulse mb-8">
          <Image
            src="/fw-logo-white.png"
            alt="Logo"
            width={240}
            height={160}
            className="object-contain"
          />
        </div>

        {/* Centered Spinner */}
        <Spinner color="success" size="lg" />
      </div>
    );
  }

  const agentState = { agent, agentLoading };

  return (
    <AgentProvider state={agentState}>
      <ErrorBoundary>
        <HeroUIProvider>{children}</HeroUIProvider>
      </ErrorBoundary>
    </AgentProvider>
  );
}

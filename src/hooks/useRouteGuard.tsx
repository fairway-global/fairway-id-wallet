import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAgentStore } from "../store/agentStore";
import { useWalletStore } from "../store/walletStore";

export function useRouteGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { agent, agentLoading } = useAgentStore(); // MODIFIED: Removed agentLoading check (handled globally)
  const { hasWallet } = useWalletStore(); // MODIFIED: Use hasWallet from agentStore

  useEffect(() => {
    if (agent && pathname === "/") {
      router.push("/dashboard");
    } else if (!agent && !agentLoading && pathname !== "/" && !hasWallet) {
      // If no agent and not loading, redirect to home
      router.push("/");
    }
  }, [agent, pathname, router]);
}

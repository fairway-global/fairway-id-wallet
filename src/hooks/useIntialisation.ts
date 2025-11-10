import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAgentStore } from "../store/agentStore";
import { useWalletStore } from "../store/walletStore";
import { toast } from "sonner";

export function useInitialization() {
  const router = useRouter();
  const { checkWallet } = useWalletStore();
  const { agent, startAgent } = useAgentStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { success } = await checkWallet();
        if (success) {
          console.log("Wallet found, starting agent...");
          const startedAgent = await startAgent();
          if (startedAgent?.state === "running") {
            router.push("/dashboard"); // Navigate to dashboard on success
          }
        } else {
          console.log("No wallet detected.");
          toast.info("Please create or recover a wallet to proceed:");
          router.push("/"); // Navigate to home if no wallet
        }
      } catch (err) {
        console.error("Initialization error:", err);
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during initialization";
        setError(message);
        toast.error("Initialization failed. Please try again.");
        router.push("/"); // Navigate to home on error
      } finally {
        console.log("Initialization complete");
        setIsInitializing(false);
      }
    };

    if (!agent) {
      initialize();
    }
  }, [agent, checkWallet, router, startAgent]);

  return { isInitializing, error };
}

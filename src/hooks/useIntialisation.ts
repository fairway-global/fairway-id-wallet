import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAgentStore } from "../store/agentStore";
import { useWalletStore } from "../store/walletStore";
import { toast } from "sonner";
import { FAYDA_LOGIN_ROUTE, FAYDA_SESSION_KEY } from "@/constants/auth";

const BYPASS_FAYDA = process.env.NEXT_PUBLIC_BYPASS_FAYDA === "true";

export function useInitialization() {
  const router = useRouter();
  const pathname = usePathname();
  const { checkWallet } = useWalletStore();
  const { agent, startAgent } = useAgentStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { success } = await checkWallet();
        if (!success) {
          console.log("No wallet detected.");
          if (pathname !== "/") {
            toast.info("Please create or recover a wallet to proceed:");
            router.replace("/");
          }
          return;
        }

        if (typeof window === "undefined") {
          return;
        }

        const isLoggedIn =
          window.localStorage.getItem(FAYDA_SESSION_KEY) === "true";

        if (!isLoggedIn && !BYPASS_FAYDA) {
          router.replace(FAYDA_LOGIN_ROUTE);
          return;
        }

        console.log("Wallet found, starting agent...");
        const startedAgent = await startAgent();
        if (startedAgent?.state === "running") {
          router.replace("/dashboard/credentials"); // Navigate to dashboard on success
        }
      } catch (err) {
        console.error("Initialization error:", err);
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during initialization";
        setError(message);
        toast.error("Initialization failed. Please try again.");
        if (pathname !== "/") {
          router.replace("/");
        }
      } finally {
        console.log("Initialization complete");
        setIsInitializing(false);
      }
    };

    if (!agent) {
      initialize();
    } else {
      setIsInitializing(false);
    }
  }, [agent, checkWallet, pathname, router, startAgent]);

  return { isInitializing, error };
}

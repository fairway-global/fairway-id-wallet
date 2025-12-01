import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAgentStore } from "../store/agentStore";
import { useWalletStore } from "../store/walletStore";
import { toast } from "sonner";
import { FAYDA_LOGIN_ROUTE, FAYDA_SESSION_KEY } from "@/constants/auth";

const BYPASS_FAYDA = process.env.NEXT_PUBLIC_BYPASS_FAYDA === "true";
const INITIALIZATION_TIMEOUT = 30000; // 30 seconds max

export function useInitialization() {
  const router = useRouter();
  const pathname = usePathname();
  const { checkWallet } = useWalletStore();
  const { agent, startAgent } = useAgentStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const initialize = async () => {
      try {
        console.log("Starting initialization...");

        // Set overall timeout
        timeoutId = setTimeout(() => {
          if (!isCancelled) {
            setError(
              "Initialization timed out. Please refresh the page and try again."
            );
            setIsInitializing(false);
            toast.error(
              "Connection timeout. Please check your internet and try again."
            );
          }
        }, INITIALIZATION_TIMEOUT);

        const { success } = await checkWallet();

        if (isCancelled) return;

        if (!success) {
          console.log("No wallet detected.");
          setIsInitializing(false);
          if (pathname !== "/") {
            toast.info("Please create or recover a wallet to proceed.");
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
          setIsInitializing(false);
          router.replace(FAYDA_LOGIN_ROUTE);
          return;
        }

        console.log("Wallet found, starting agent...");

        try {
          const startedAgent = await startAgent();

          if (isCancelled) return;

          if (startedAgent?.state === "running") {
            console.log("Agent started successfully");
            clearTimeout(timeoutId);
            setIsInitializing(false);
            router.replace("/dashboard/credentials");
          } else {
            throw new Error("Agent failed to reach running state");
          }
        } catch (agentError) {
          if (isCancelled) return;

          console.error("Agent start error:", agentError);

          // Clear timeout on error
          clearTimeout(timeoutId);

          // Parse the error to provide user-friendly messages
          let errorMessage = "Failed to initialize wallet connection";

          if (agentError instanceof Error) {
            const msg = agentError.message.toLowerCase();

            // Better error messages for common issues
            if (msg.includes("castor") && msg.includes("resolve")) {
              errorMessage =
                "Unable to connect to the mediator. Please check your internet connection or try again later.";
            } else if (msg.includes("mediator")) {
              errorMessage =
                "Mediator service is unavailable. Please try again later.";
            } else if (msg.includes("timeout")) {
              errorMessage =
                "Connection timed out. Please check your internet and try again.";
            } else if (msg.includes("network") || msg.includes("fetch")) {
              errorMessage =
                "Network error. Please check your internet connection.";
            } else if (msg.includes("did") && msg.includes("resolve")) {
              errorMessage =
                "Unable to resolve DID. The mediator may be unavailable.";
            } else {
              errorMessage = agentError.message;
            }
          }

          setError(errorMessage);
          toast.error(errorMessage, {
            duration: 5000,
            action: {
              label: "Retry",
              onClick: () => window.location.reload(),
            },
          });

          setIsInitializing(false);
        }
      } catch (err) {
        if (isCancelled) return;

        clearTimeout(timeoutId);
        console.error("Initialization error:", err);

        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during initialization";

        setError(message);
        toast.error("Initialization failed. Please try again.", {
          action: {
            label: "Retry",
            onClick: () => window.location.reload(),
          },
        });

        setIsInitializing(false);

        if (pathname !== "/") {
          router.replace("/");
        }
      }
    };

    if (!agent) {
      initialize();
    } else {
      setIsInitializing(false);
    }

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [agent, checkWallet, pathname, router, startAgent]);

  return { isInitializing, error };
}

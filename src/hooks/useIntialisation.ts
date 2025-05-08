// import { useEffect, useMemo, useState } from "react";
// import { useAgentStore } from "../store/agentStore";
// import { useWalletStore } from "../store/walletStore";

// export function useInitialization() {
//   const { checkWallet } = useWalletStore();
//   const [hasWallet, setHasWallet] = useState(false);
//   const { agent, startAgent, agentLoading } = useAgentStore();
//   const [loading, setLoading] = useState(true);
//   const [error, setErr] = useState<string>("");

//   const isInitializing = useMemo(() => {
//     // Check if the agent is loading or if the wallet is being checked
//     return agentLoading || loading;
//   }, [agentLoading, loading]);

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const { success, error } = await checkWallet();
//         if (success) {
//           console.log("Wallet found, starting agent...");
//           setHasWallet(true);
//           await startAgent();
//         } else {
//           console.log("No wallet detected.");
//           setHasWallet(false);
//           setErr(error || "Unknown error");
//         }
//       } catch (error) {
//         console.error("Initialization error:", error);
//         setErr(error || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Ensure client-side execution
//     if (typeof window !== "undefined") {
//       initialize();
//     }
//   }, [checkWallet, startAgent]);

//   return { isInitializing, agent, error, hasWallet };
// }

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAgentStore } from "../store/agentStore";
import { useWalletStore } from "../store/walletStore";
import { toast } from "sonner";

export function useInitialization() {
  const router = useRouter();
  const { checkWallet } = useWalletStore();
  const { startAgent, agentLoading } = useAgentStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { success, error } = await checkWallet();
        if (success) {
          console.log("Wallet found, starting agent...");
          await startAgent();
          router.push("/dashboard"); // Navigate to dashboard on success
        } else {
          console.log("No wallet detected.");
          toast.info("Please create or recover a wallet to proceed.");
          router.push("/"); // Navigate to home if no wallet
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || "An error occurred during initialization");
        toast.error("Initialization failed. Please try again.");
        router.push("/"); // Navigate to home on error
      } finally {
        setIsInitializing(false);
      }
    };

    if (typeof window !== "undefined") {
      initialize();
    }
  }, [checkWallet, startAgent, router]);

  return { isInitializing, error };
}

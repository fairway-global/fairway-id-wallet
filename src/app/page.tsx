"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Welcome from "@/components/Welcome";
import PageLoader from "../components/PageLoader";
import { useInitialization } from "../hooks/useIntialisation";
import { useWalletStore } from "../store/walletStore";
import { FAYDA_LOGIN_ROUTE, FAYDA_SESSION_KEY } from "@/constants/auth";

export default function Root() {
  const router = useRouter();
  const { isInitializing } = useInitialization();
  const { checkWallet } = useWalletStore();
  const [showSplash, setShowSplash] = useState(false);
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);

  useEffect(() => {
    const checkWalletAndRedirect = async () => {
      if (hasCheckedWallet || isInitializing) return;

      try {
        const { success } = await checkWallet();
        setHasCheckedWallet(true);

        if (!success) {
          // No wallet found - show splash screen and redirect to Fayda login
          setShowSplash(true);

          // Check if user is already logged in to Fayda
          if (typeof window !== "undefined") {
            const isLoggedIn =
              window.localStorage.getItem(FAYDA_SESSION_KEY) === "true";

            if (isLoggedIn) {
              // User is logged in but no wallet - show Welcome to create wallet
              setTimeout(() => {
                setShowSplash(false);
              }, 1500);
            } else {
              // Not logged in - redirect to Fayda login after splash
              setTimeout(() => {
                router.replace(FAYDA_LOGIN_ROUTE);
              }, 2000);
            }
          }
        } else {
          // Wallet exists - let initialization handle the rest
          setShowSplash(false);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
        setHasCheckedWallet(true);
        setShowSplash(false);
      }
    };

    // Only check if not initializing (initialization hook will handle logged-in users)
    if (!isInitializing) {
      checkWalletAndRedirect();
    }
  }, [checkWallet, router, hasCheckedWallet, isInitializing]);

  // Show splash screen when no wallet is found
  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1224] via-[#0f1530] to-[#121a3a] text-white">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-24 h-24 border-4 border-t-transparent border-fwNewGreen rounded-full animate-spin"></div>
          <p className="text-lg text-gray-300">Redirecting to Fayda Login...</p>
        </div>
      </div>
    );
  }

  return isInitializing ? (
    <PageLoader loaderText="Connecting to identity network" showProgress />
  ) : (
    <Welcome />
  );
}

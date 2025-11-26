"use client";

import FWLogoBox from "@/components/ui/FWLogoBox";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWalletStore } from "../../store/walletStore";
import { useEffect, useState } from "react";
import { logger } from "../../utils/logger";
import { useAgentStore } from "../../store/agentStore";
import { FAYDA_LOGIN_ROUTE, FAYDA_SESSION_KEY } from "@/constants/auth";

const Seed = () => {
  const router = useRouter();
  const { getMnemonics } = useWalletStore();
  const { startAgent } = useAgentStore();
  const [mnemonics, setMnemonics] = useState<string[]>([]);

  useEffect(() => {
    const fetchMnemonics = async () => {
      try {
        const mnemonics = await getMnemonics();
        setMnemonics(mnemonics.split(" "));
      } catch (error) {
        console.error("Error fetching mnemonics:", error);
        return [];
      }
    };
    fetchMnemonics();
  }, [getMnemonics]);

  const copySeedToClipboard = () => {
    navigator.clipboard
      .writeText(mnemonics.join(","))
      .then(() => {
        toast("Copied to clipboard", { position: "top-center" });
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard: ", err);
      });
  };

  const handleConfirmMnemonic = async () => {
    logger.log("UI", "Confirming mnemonic and initializing wallet");
    try {
      await startAgent();
      logger.log(
        "UI",
        "Wallet initialization successful, redirecting to Fayda login"
      );
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(FAYDA_SESSION_KEY);
      }
      router.replace(FAYDA_LOGIN_ROUTE);
    } catch (err) {
      logger.error("UI", "Failed to initialize wallet", err);
      const message =
        err instanceof Error
          ? err.message
          : "Unable to initialize wallet. Check mediator connectivity and try again.";
      toast.error(message, { position: "top-center" });
    }
  };

  return (
    <div
      className={"bg-black py-8 px-2 flex flex-col items-start"}
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <FWLogoBox />
      <div
        className={
          "self-center rounded-2xl bg-[#1D212C] flex flex-col items-center gap-2 max-w-96 mt-8 p-5 pb-12"
        }
      >
        <p className={"font-bold text-md text-white"}>Create a new Wallet</p>
        <p className={"text-gray-400"}>
          For your eyes only anyone who has these words can access your entire
          wallet! I&apos;ve saved these words
        </p>

        <div
          className={
            "relative w-full gap-x-2 p-4 text-lg font-semibold gap-y-1 bg-[#303841] text-white rounded-lg grid grid-cols-3 pb-12"
          }
        >
          {mnemonics.map((word, i) => (
            <div key={i} className="flex">
              <b className="text-fwNewGreen pr-2">{i + 1}</b>
              {word}
            </div>
          ))}
          <Button
            color="default"
            className={
              "absolute ml-[25%] -bottom-4 z-20 flex rounded-full gap-2 px-6 w-max mt-4"
            }
            onPress={copySeedToClipboard}
          >
            {
              <span>
                <span>📋</span>
                <span>Copy to clipboard</span>
              </span>
            }
          </Button>
        </div>
      </div>

      <Button
        color="warning"
        className={
          "self-center mt-auto mb-0 flex justify-between w-full max-w-96"
        }
        isDisabled={false}
        onPress={handleConfirmMnemonic}
      >
        <span>Continue</span>
        <span>&#8594;</span>
      </Button>
    </div>
  );
};

export default Seed;

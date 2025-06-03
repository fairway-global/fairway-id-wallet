"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/react";
import React, { useMemo, useState } from "react";
import FWLogoBox from "@/components/ui/FWLogoBox";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorIcon } from "@/components/ui/ErrorIcon";
import { logger } from "@/utils/logger";
import { useWalletStore } from "../../../store/walletStore";

const Password = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [passwordVal, setPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { generateSeedPhrase, clearSeedData } = useWalletStore();

  const hasSpecialChar = useMemo(() => {
    const specialCharTest = (str: string) => /[!@#$%^&*(),.?":{}|<>]/.test(str);
    return specialCharTest(passwordVal) || specialCharTest(confirmPasswordVal);
  }, [passwordVal, confirmPasswordVal]);
  const isEnoughLength = useMemo(() => {
    return passwordVal.length > 8 || confirmPasswordVal.length > 8;
  }, [passwordVal, confirmPasswordVal]);
  const passwordsMatch = useMemo(() => {
    return JSON.stringify(passwordVal) === JSON.stringify(confirmPasswordVal);
  }, [passwordVal, confirmPasswordVal]);

  const isPasswordValid = useMemo(() => {
    return isEnoughLength && passwordsMatch && hasSpecialChar;
  }, [isEnoughLength, passwordsMatch, hasSpecialChar]);

  const handleGenerateSeed = async () => {
    setIsLoading(true);
    logger.log("UI", "Generating seed phrase");
    try {
      clearSeedData(); // Clear any previous seed data
      await generateSeedPhrase(passwordVal);
      router.push("/setup");
      logger.log("UI", "Seed phrase generation successful");
      toast.success("Seed phrase generated successfully", {
        position: "top-center",
      });
    } catch (err) {
      logger.error("UI", "Failed to generate seed", err);
      toast.error("Failed to generate seed phrase", { position: "top-center" });
    }
  };

  return (
    <div
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      className={"bg-black py-8 px-2 flex flex-col items-start"}
    >
      <FWLogoBox />
      <div
        className={
          "self-center rounded-2xl bg-[#1D212C] flex flex-col items-center gap-2 max-w-96 mt-8 p-5 pb-12"
        }
      >
        <p className={"font-bold text-md text-white"}>Set Password</p>
        <p className={"text-gray-400"}>
          This password will unlock your wallet only on this device. We cannot
          recover it.
        </p>
        <div className="flex flex-col gap-2 max-w-96 mt-4 text-white">
          <Input
            className="max-w-xs"
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => setIsVisible((prev) => !prev)}
              >
                {isVisible ? (
                  <EyeIcon className="h-6 w-6 text-gray-500 pointer-events-none" />
                ) : (
                  <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                )}
              </button>
            }
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
          />
          <Input
            className="max-w-xs"
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => setIsVisible((prev) => !prev)}
              >
                {isVisible ? (
                  <EyeIcon className="h-6 w-6 text-gray-500 pointer-events-none" />
                ) : (
                  <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                )}
              </button>
            }
            label="Confirm Password"
            placeholder="Confirm your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={confirmPasswordVal}
            onChange={(e) => setConfirmPasswordVal(e.target.value)}
          />
          <p className="flex gap-2">
            <ErrorIcon err={!hasSpecialChar} />
            contains at least one special character{" "}
          </p>
          <p className="flex gap-2">
            <ErrorIcon err={!isEnoughLength} />
            must be at least 8 characters
          </p>
          <p className="flex gap-2">
            <ErrorIcon err={!passwordsMatch} />
            passwords match
          </p>
        </div>
      </div>

      <Button
        color="warning"
        className={
          "self-center mt-auto mb-0 flex justify-between w-full max-w-96"
        }
        isDisabled={!isPasswordValid}
        onPress={handleGenerateSeed}
        isLoading={isLoading}
      >
        <span>Continue</span>
        <span>&#8594;</span>
      </Button>
    </div>
  );
};

export default Password;

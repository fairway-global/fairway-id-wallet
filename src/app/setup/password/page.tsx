"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/react";
import React, { useMemo, useState } from "react";
import FWLogoBox from "@/components/ui/FWLogoBox";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorIcon } from "@/components/ui/ErrorIcon";

const Password = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [passwordVal, setPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const onSavePassword = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast("Wallet created successfully", { position: "top-center" });
      router.push("/setup/final");
    }, 3000);
  };

  return (
    <div className={"h-screen bg-black py-8 px-2 flex flex-col items-start"}>
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
        // FIXME: enable after demo
        isDisabled={!isPasswordValid}
        onPress={onSavePassword}
        isLoading={isLoading}
      >
        <span>Continue</span>
        <span>&#8594;</span>
      </Button>
    </div>
  );
};

export default Password;

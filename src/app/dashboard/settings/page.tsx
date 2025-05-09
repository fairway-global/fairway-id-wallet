"use client";

import { ExpandableBox } from "@/components/ui/ExpandableBox";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@heroui/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ErrorIcon } from "@/components/ui/ErrorIcon";
import { useWalletStore } from "../../../store/walletStore";

export default function Settings() {
  const { resetWallet } = useWalletStore();
  const [isVisible, setIsVisible] = useState(false);
  const [passwordVal, setPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

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
      toast("Password updated Successfully", { position: "top-center" });
    }, 3000);
  };

  const onReset = async () => {
    setIsResetLoading(true);
    const resetSuccessful = await resetWallet();
    setTimeout(() => {
      setIsResetLoading(false);
      if (!resetSuccessful) {
        toast.error("Failed to reset wallet", { position: "top-center" });
        return;
      }
      toast("Wallet reset Successfully", { position: "top-center" });
    }, 3000);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col gap-4">
      <ExpandableBox title="Change Password">
        <div className="flex flex-col">
          <div
            className={
              "self-center rounded-2xl bg-[#1D212C] text-white flex flex-col items-center gap-2 max-w-96 p-5"
            }
          >
            <div className="flex flex-col gap-2 max-w-96">
              <Input
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
                label="Current Password"
                labelPlacement="outside"
                placeholder="Enter current password"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={passwordVal}
                onChange={(e) => setPasswordVal(e.target.value)}
                style={{ color: "white" }}
                classNames={{
                  label: "text-white",
                  inputWrapper: "max-w-xs mb-2",
                }}
              />
              <Input
                classNames={{
                  label: "text-white",
                  inputWrapper: "max-w-xs mb-2",
                }}
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
                label="New Password"
                labelPlacement="outside"
                placeholder="Add new password"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={confirmPasswordVal}
                onChange={(e) => setConfirmPasswordVal(e.target.value)}
              />
              <p className="flex gap-2 text-xs items-center">
                <ErrorIcon err={!hasSpecialChar} />
                contains at least one special character{" "}
              </p>
              <p className="flex gap-2 text-xs items-center">
                <ErrorIcon err={!isEnoughLength} />
                must be at least 8 characters
              </p>
              <p className="flex gap-2 text-xs items-center">
                <ErrorIcon err={!passwordsMatch} />
                passwords match
              </p>
            </div>

            <div className="flex items-center gap-2 w-full mt-4">
              <Button
                className={"self-center mt-auto mb-0 w-full bg-fwNewGreen"}
                // FIXME: enable after demo
                isDisabled={!isPasswordValid}
                onPress={onSavePassword}
                isLoading={isLoading}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </ExpandableBox>
      <ExpandableBox title="Archive Wallet">
        <div className="flex flex-col items-center gap-4">
          <ErrorIcon err={true} className={"!w-16 !h-16"} />
          <p className="text-white">
            Are you sure you want to archive this wallet? Archiving will make
            the wallet inactive and prevent further transactions. You can
            restore it later, but it will not be accessible for day-to-day
            operations while archived. This action does not delete the wallet or
            its data.
          </p>
          <div className="w-full mt-4">
            <Button
              className={"self-center mt-auto mb-0 w-full bg-fwNewRed"}
              isDisabled={isResetLoading}
              onPress={onReset}
              isLoading={isResetLoading}
              size={"sm"}
            >
              Archive
            </Button>
          </div>
        </div>
      </ExpandableBox>
    </div>
  );
}

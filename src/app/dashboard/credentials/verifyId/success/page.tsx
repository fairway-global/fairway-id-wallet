"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "@heroui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { FAYDA_LOGIN_ROUTE } from "@/constants/auth";

export default function IdentityVerificationSuccess() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("fw_wallet_identity_verified", "true");
  }, []);

  useEffect(() => {
    router.prefetch(FAYDA_LOGIN_ROUTE);
  }, [router]);

  const handleContinue = () => {
    router.replace(FAYDA_LOGIN_ROUTE);
  };

  return (
    <div
      className="flex flex-col items-center justify-start px-4 pt-8 text-white text-center"
      style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
    >
      <Card className="bg-[#1D212C] text-white max-w-md w-full shadow-2xl border border-white/10">
        <CardBody className="flex flex-col items-center gap-4 py-10">
          <div className="bg-fwNewGreen/20 rounded-full p-4">
            <CheckCircleIcon className="h-16 w-16 text-fwNewGreen" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Identity Verified</h1>
            <p className="text-gray-300 text-sm">
              Your ID credential has been successfully verified and added to
              your wallet. You can now use it for future interactions within the
              Fairway ecosystem.
            </p>
          </div>

          <div className="w-full pt-4">
            <Button
              fullWidth
              color="success"
              className="bg-fwNewGreen text-white"
              onPress={handleContinue}
            >
              Continue to Fayda Login
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

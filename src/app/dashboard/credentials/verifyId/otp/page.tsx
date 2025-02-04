"use client";

import { FormEvent, useState } from "react";
import { Button, InputOtp } from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";
import IDVerificationResult from "@/components/IdVerificationResult";
import useLoading from "@/hooks/useLoading";
import useStore from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { IIdentityCredential } from "../../../../../utils/types";

const OTP = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIdentityCredential } = useStore();
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleSubmit = (e: FormEvent) => {
    console.log("");
    e.preventDefault();
    if (otp !== "123456") {
      setOtpErrorMsg("OTP input is not correct. please try again");
      return;
    }

    startLoading();
    setTimeout(() => {
      setOtpVerified(true);
      stopLoading();
      const fullName = searchParams.get("fullName");
      const birthDate = searchParams.get("birthDate");
      const faydaNumber = searchParams.get("faydaNumber");

      const id: IIdentityCredential = {
        id: 234,
        did: "did:0x1234567890abcdef01234567890abcdef01234567",
        fullName: fullName ?? "N/A",
        idProvider: "Faydaa",
        birthDate: birthDate ?? "",
        providerIdentifier: faydaNumber ? parseInt(faydaNumber) : 0,
        phoneNumber: "+251934765432",
        gender: "M",
        city: "Addis Ababa",
        country: "Ethiopia",
        status: "pending",
      };
      setIdentityCredential(id);
      toast("OTP verified successfully, Identity Verified.");
    }, 3000);
  };

  return (
    <div>
      {!otpVerified ? (
        <form
          className="flex flex-col items-center gap-4 w-full"
          onSubmit={handleSubmit}
        >
          <Image
            alt="National ID/Fayda Logo"
            src="/nid-logo.png"
            height={200}
            width={200}
          />
          <InputOtp
            value={otp}
            onValueChange={(val) => {
              setOtp(val);
              setOtpErrorMsg("");
            }}
            required
            errorMessage={otpErrorMsg}
            isInvalid={!!otpErrorMsg}
            length={6}
          />
          <Button
            className="max-w-fit"
            type="submit"
            color={"warning"}
            variant="solid"
            isLoading={isLoading}
            isDisabled={otp.length < 6 || isLoading}
          >
            Verify OTP
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <IDVerificationResult />
          <Button
            className="max-w-fit mt-4"
            onPress={() => {
              router.push("/dashboard/credentials");
            }}
            color={"warning"}
            variant="solid"
            isDisabled={otp.length < 6}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default OTP;

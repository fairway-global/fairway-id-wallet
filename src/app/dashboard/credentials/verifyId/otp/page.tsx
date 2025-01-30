"use client";

import { FormEvent, useState } from "react";
import { Button, InputOtp } from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/router";
import IDVerificationResult from "@/components/IdVerificationResult";
import useLoading from "@/hooks/useLoading";
import useStore from "@/store/store";

const OTP = () => {
  const router = useRouter();
  const { fullName, birthDate, faydaNumber } = router.query;
  const { setIdentityCredential } = useStore();
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoading();

  console.log("name", fullName);
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

      const id: IIdentityCredential = {
        id: 234,
        did: "did:0x1234567890abcdef01234567890abcdef01234567",
        fullName: "Biniam Beyene Bayisa",
        idProvider: "Faydaa",
        birthDate: "08/02/1994",
        phoneNumber: "+251934765432",
        gender: "M",
        city: "Addis Ababa",
        country: "Ethiopia",
        status: "pending",
      };
      setIdentityCredential(id);
      toast("OTP verified successfully, Identity Verified.");
      router.push("/dashboard/credentials");
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
        <>
          <IDVerificationResult />
          <Button
            className="max-w-fit"
            type="submit"
            color={"warning"}
            variant="solid"
            isDisabled={otp.length < 6}
          >
            Continue
          </Button>
        </>
      )}
    </div>
  );
};

export default OTP;

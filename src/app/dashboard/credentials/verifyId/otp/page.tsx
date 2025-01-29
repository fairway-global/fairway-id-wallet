"use client";

import { FormEvent, useState } from "react";
import IDVerificationResult from "../../../../../components/IdVerificationResult";
import { Button, InputOtp } from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const OTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");

  const handleSubmit = (e: FormEvent) => {
    console.log("");
    e.preventDefault();
    if (otp !== "123456") {
      setOtpErrorMsg("OTP input is not correct. please try again");
      return;
    }
    toast("OTP verified successfully, Identity Verified.");
  };

  const onMove = () => {};

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
            isDisabled={otp.length < 6}
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

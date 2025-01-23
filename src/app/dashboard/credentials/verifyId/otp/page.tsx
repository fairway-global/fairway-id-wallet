"use client";

import { useState } from "react";
import IDVerificationResult from "@/components/IdVerificationResult";
import useLoading from "@/hooks/useLoading";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();

  const onVerify = () => {
    startLoading();
    setTimeout(() => {
      setOtpVerified(true);
      stopLoading();
    }, 3000);
  };

  return <div>{otpVerified && <IDVerificationResult />}</div>;
};

export default OTP;

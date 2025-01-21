"use client";

import { useState } from "react";
import IDVerificationResult from "../../../../../components/IdVerificationResult";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const onVerify = () => {};

  return <div>{otpVerified && <IDVerificationResult />}</div>;
};

export default OTP;

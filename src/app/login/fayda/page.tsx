"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { toast } from "sonner";

import PageLoader from "@/components/PageLoader";
import { useAgentStore } from "@/store/agentStore";
import { config } from "@/config";
import {
  FAYDA_FAN_NUMBER_KEY,
  FAYDA_LOGIN_ROUTE,
  FAYDA_SESSION_KEY,
} from "@/constants/auth";

export default function FaydaLoginPage() {
  const router = useRouter();
  const { startAgent } = useAgentStore();
  const [fanNumber, setFanNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const walletExists = Boolean(
      window.localStorage.getItem(config.LOCAL_STORAGE_NAME)
    );
    if (!walletExists) {
      router.replace("/");
      return;
    }

    const isAlreadyLoggedIn =
      window.localStorage.getItem(FAYDA_SESSION_KEY) === "true";
    if (isAlreadyLoggedIn) {
      router.replace("/dashboard/credentials");
      return;
    }

    setIsBootstrapping(false);
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{16}$/.test(fanNumber)) {
      toast.error("Enter a valid 16 digit Fayda FAN number.");
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    setIsSubmitting(true);
    try {
      // Mock verification
      await startAgent();
      window.localStorage.setItem(FAYDA_FAN_NUMBER_KEY, fanNumber);
      window.localStorage.setItem(FAYDA_SESSION_KEY, "true");
      toast.success("Signed in with Fayda.");
      router.replace("/dashboard/credentials");
    } catch (error) {
      console.error("Fayda sign-in failed:", error);
      toast.error("Unable to complete Fayda sign-in. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBootstrapping) {
    return <PageLoader loaderText="Preparing Fayda sign-in..." />;
  }

  return (
    <div
      className="flex flex-col justify-center items-center px-4 text-white"
      style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
    >
      <Card className="w-full max-w-md bg-[#101428] border border-white/10 shadow-2xl">
        <CardBody className="flex flex-col gap-6 p-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Login with Fayda
            </p>
            <h1 className="text-2xl font-bold mt-2">
              Ethiopian National ID (e-Signet)
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Mock flow for testing. Enter your 16 digit FAN to continue.
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="FAN Number"
              type="text"
              inputMode="numeric"
              maxLength={16}
              pattern="\d{16}"
              value={fanNumber}
              variant="bordered"
              classNames={{
                label: "text-gray-300",
                inputWrapper: "bg-[#161b33] border-white/10",
                input: "text-white text-center tracking-[0.3em]",
              }}
              onChange={(event) =>
                setFanNumber(event.target.value.replace(/\D/g, ""))
              }
              description="Use demo FAN: 2398123498123498"
              required
            />
            <Button
              type="submit"
              color="success"
              className="bg-fwNewGreen text-black font-semibold"
              isLoading={isSubmitting}
            >
              Continue
            </Button>
          </form>
        </CardBody>
      </Card>
      <p className="text-xs text-gray-500 mt-6 text-center">
        Looking for the official experience? Visit{" "}
        <a
          className="text-fwNewGreen underline"
          href="https://resident.fayda.et/"
          target="_blank"
          rel="noreferrer"
        >
          resident.fayda.et
        </a>
        .
      </p>
    </div>
  );
}

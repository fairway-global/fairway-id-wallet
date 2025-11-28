"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { decodeJwt } from "jose";
import axios from "axios";
import { toast } from "sonner";

type FaydaProfile = {
  name?: string;
  email?: string;
  gender?: string;
  phone?: string;
  nationality?: string;
  birthdate?: string;
  address?: string;
  picture?: string;
  fan?: string;
  [key: string]: unknown;
};

export default function FaydaCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<FaydaProfile | null>(null);
  const [status, setStatus] = useState<string>("Waiting for Fayda response…");
  const [debugSteps, setDebugSteps] = useState<string[]>([]);

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const state = useMemo(() => searchParams.get("state"), [searchParams]);

  useEffect(() => {
    if (!code) {
      setIsLoading(false);
      toast.error("Missing authorization code");
      return;
    }

    const fetchToken = async (authCode: string) => {
      setIsLoading(true);
      setStatus("Exchanging code for token…");
      try {
        const response = await axios.post("/api/token", {
          code: authCode,
        });

        const { access_token } = response.data;
        console.log("Access token:", access_token);

        if (!access_token) {
          throw new Error("No access token returned");
        }

        toast.success("Token received successfully");
        setStatus("Retrieving verified attributes…");

        const userInfoResponse = await axios.post("/api/userinfo/", {
          access_token: access_token,
        });

        console.log("User info response:", userInfoResponse.data);
        const decodedUserInfo = await decodeUserInfoResponse(
          userInfoResponse.data
        );
        console.log("Decoded user info:", decodedUserInfo);

        if (!decodedUserInfo || Object.keys(decodedUserInfo).length === 0) {
          throw new Error("No user information received");
        }

        // Store the decoded user info in state
        setProfile(normalizeProfile(decodedUserInfo));
        setStatus("Verified data received");
        toast.success("Fayda sign-in successful");
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching token or user info:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error fetching token or user info";
        toast.error(errorMessage);
        setIsLoading(false);
        setStatus(`Error: ${errorMessage}`);
        setProfile(null);
        setDebugSteps((prev) => [...prev, `Error: ${errorMessage}`]);
      }
    };

    fetchToken(code);
  }, [code]);

  const hasProfile = Boolean(profile && Object.keys(profile).length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1224] via-[#0f1530] to-[#121a3a] text-white gap-4">
        <div className="w-12 h-12 border-4 border-t-transparent border-fwNewGreen rounded-full animate-spin"></div>
        <p className="text-sm text-gray-300">
          {status || "Loading Fayda profile..."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#0b1224] via-[#0f1530] to-[#121a3a] text-white"
      style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
    >
      {hasProfile ? (
        <Card className="w-full max-w-3xl bg-white/5 border border-white/10 shadow-2xl">
          <CardHeader className="flex items-center gap-4 border-b border-white/10">
            <Avatar
              isBordered
              color="success"
              size="lg"
              src={profile?.picture}
              name={profile?.name || "Fayda User"}
            />
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
                Fayda Success
              </p>
              <h1 className="text-2xl font-bold">Identity Verified</h1>
              <p className="text-sm text-gray-300">
                State:{" "}
                <span className="font-mono text-fwNewGreen">
                  {state ?? "—"}
                </span>
              </p>
            </div>
            <div className="ml-auto">
              <p className="text-sm text-gray-300">{status}</p>
            </div>
          </CardHeader>
          <CardBody className="grid gap-6 p-8 md:grid-cols-2">
            <InfoRow label="Name" value={profile?.name} />
            <InfoRow label="Email" value={profile?.email} />
            <InfoRow label="Gender" value={profile?.gender} />
            <InfoRow label="Phone" value={profile?.phone} />
            <InfoRow label="Nationality" value={profile?.nationality} />
            <InfoRow
              label="Date of Birth"
              value={
                profile?.birthdate
                  ? profile.birthdate.replace(/-/g, "/")
                  : undefined
              }
            />
            <InfoRow
              label="Address"
              value={profile?.address}
              span="md:col-span-2"
            />
            {profile?.picture && (
              <div className="md:col-span-2 flex justify-center">
                <img
                  src={profile.picture}
                  alt="Fayda portrait"
                  className="rounded-2xl border border-white/10 shadow-lg max-h-64 object-cover"
                />
              </div>
            )}
          </CardBody>
          <div className="flex justify-end gap-3 border-t border-white/10 px-8 py-6">
            <Button
              variant="light"
              className="text-gray-200"
              onClick={() => router.replace("/login/fayda")}
            >
              Start Over
            </Button>
            <Button
              color="success"
              className="bg-fwNewGreen text-black font-semibold"
              onClick={() => router.push("/dashboard")}
            >
              Go to Wallet
            </Button>
          </div>
          {debugSteps.length > 0 && (
            <div className="border-t border-white/10 px-8 py-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Debug
              </p>
              <pre className="text-xs bg-black/30 rounded-xl p-3 text-gray-200 whitespace-pre-wrap">
                {debugSteps
                  .map((step, idx) => `${idx + 1}. ${step}`)
                  .join("\n")}
              </pre>
            </div>
          )}
        </Card>
      ) : (
        <Card className="w-full max-w-2xl bg-white/5 border border-red-400/40 shadow-2xl">
          <CardHeader className="flex items-center gap-3 border-b border-white/10">
            <Avatar isBordered color="danger" size="lg" name="!" />
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
                Fayda Error
              </p>
              <h1 className="text-2xl font-bold text-red-400">
                No verified data received
              </h1>
              <p className="text-sm text-gray-300">
                State:{" "}
                <span className="font-mono text-red-300">{state ?? "—"}</span>
              </p>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-8">
            <p className="text-sm text-gray-200">
              We could not read any verified attributes from Fayda. Please
              return to the login page and try again.
            </p>
            <div className="flex gap-3">
              <Button
                variant="light"
                className="text-gray-200"
                onClick={() => router.replace("/login/fayda")}
              >
                Back to Login
              </Button>
              <Button
                color="success"
                className="bg-fwNewGreen text-black font-semibold"
                onClick={() => router.replace("/login/fayda")}
              >
                Retry Fayda Login
              </Button>
            </div>
          </CardBody>
          {debugSteps.length > 0 && (
            <div className="border-t border-white/10 px-8 py-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Debug
              </p>
              <pre className="text-xs bg-black/30 rounded-xl p-3 text-gray-200 whitespace-pre-wrap">
                {debugSteps
                  .map((step, idx) => `${idx + 1}. ${step}`)
                  .join("\n")}
              </pre>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

const decodeUserInfoResponse = async (
  userinfoJwtToken: unknown
): Promise<FaydaProfile> => {
  try {
    if (!userinfoJwtToken) return {};

    // Handle string JWT token
    if (typeof userinfoJwtToken === "string") {
      return decodeJwt(userinfoJwtToken) as FaydaProfile;
    }

    // Handle object with userinfo property
    const candidate = (userinfoJwtToken as any).userinfo ?? userinfoJwtToken;

    if (typeof candidate === "string") {
      return decodeJwt(candidate) as FaydaProfile;
    }

    if ((candidate as any).id_token) {
      return decodeJwt((candidate as any).id_token) as FaydaProfile;
    }

    if (typeof candidate === "object") {
      return candidate as FaydaProfile;
    }

    return {};
  } catch (error) {
    console.error("Error decoding JWT user info:", error);
    return {};
  }
};

type InfoRowProps = {
  label: string;
  value?: string;
  span?: string;
};

function InfoRow({ label, value, span }: InfoRowProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border border-white/5 bg-white/5 p-4 ${
        span ?? ""
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
        {label}
      </p>
      <p className="text-base font-semibold text-white">{value || "—"}</p>
    </div>
  );
}

function normalizeProfile(profile: FaydaProfile): FaydaProfile {
  if (!profile) return {};

  const normalized: FaydaProfile = { ...profile };

  // Normalize common alternate keys
  const anyProfile = profile as any;
  normalized.phone =
    profile.phone ?? anyProfile.phone_number ?? anyProfile.phoneNumber;
  normalized.nationality = profile.nationality ?? anyProfile.nationality_name;
  normalized.birthdate =
    profile.birthdate ?? anyProfile.birth_date ?? anyProfile.dob;
  normalized.address =
    profile.address ??
    [anyProfile.city, anyProfile.state, anyProfile.country]
      .filter(Boolean)
      .join(", ");
  normalized.picture = profile.picture ?? anyProfile.photo ?? anyProfile.avatar;
  normalized.name = profile.name ?? anyProfile.fullname ?? anyProfile.full_name;
  normalized.fan =
    profile.fan ?? anyProfile.fanNumber ?? anyProfile.faydaId ?? anyProfile.sub;

  return normalized;
}

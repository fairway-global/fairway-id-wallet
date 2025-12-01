"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, Button, Card, CardBody, CardHeader } from "@heroui/react";
import axios from "axios";
import { decodeJwt } from "jose";
import { toast } from "sonner";

type UserInfo = {
  name?: string;
  email?: string;
  gender?: string;
  phone_number?: string;
  phone?: string;
  nationality?: string;
  birthdate?: string;
  address?:
    | {
        zone?: string;
        woreda?: string;
        region?: string;
      }
    | string;
  picture?: string;
  [key: string]: unknown;
};

const SESSION_KEYS = {
  verifier: "fayda_pkce_verifier",
};

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string>("Waiting for Fayda response…");
  const hasProcessedRef = useRef(false); // Prevent duplicate requests

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const state = useMemo(() => searchParams.get("state"), [searchParams]);

  useEffect(() => {
    // Prevent duplicate processing of the same code
    if (!code || hasProcessedRef.current) {
      if (!code) {
        setIsLoading(false);
        toast.error("Missing authorization code");
      }
      return;
    }

    hasProcessedRef.current = true;

    const fetchToken = async (authCode: string) => {
      try {
        setIsLoading(true);
        setStatus("Exchanging code for token…");

        // Retrieve code_verifier from sessionStorage (must match the code_challenge sent in authorization request)
        const codeVerifier =
          typeof window !== "undefined"
            ? sessionStorage.getItem(SESSION_KEYS.verifier)
            : null;

        if (!codeVerifier) {
          throw new Error(
            "Missing code_verifier. Please restart the login process."
          );
        }

        const response = await axios.post("/api/token", {
          code: authCode,
          code_verifier: codeVerifier,
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
        const normalized = normalizeProfile(decodedUserInfo);
        setUserInfo(normalized);
        setStatus("Verified data received");
        toast.success("Fayda sign-in successful");

        // Set Fayda session in localStorage for authentication
        if (typeof window !== "undefined") {
          window.localStorage.setItem("fw_fayda_session", "true");

          // Mark identity as verified after successful Fayda login
          window.localStorage.setItem("fw_wallet_identity_verified", "true");

          // Store user profile data if available
          if (normalized.name) {
            window.localStorage.setItem("fw_wallet_full_name", normalized.name);
          }
          if (normalized.picture) {
            window.localStorage.setItem("fw_wallet_avatar", normalized.picture);
          }
          if (normalized.sub || (normalized as any).fan) {
            window.localStorage.setItem(
              "fw_fayda_fan",
              String(normalized.sub || (normalized as any).fan || "")
            );
          }

          // Cleanup sessionStorage after successful authentication
          sessionStorage.removeItem(SESSION_KEYS.verifier);

          // Auto-redirect to dashboard after a short delay
          setTimeout(() => {
            router.replace("/dashboard/credentials");
          }, 1500);
        }
      } catch (error: any) {
        console.error("Error fetching token or user info:", error);

        // Handle specific error types
        const errorData = error.response?.data;
        let errorMessage = error.message || "Error fetching token or user info";

        if (errorData?.error === "invalid_transaction") {
          errorMessage =
            "Transaction was interrupted. Please restart the login process.";
          // Reset the ref so user can retry
          hasProcessedRef.current = false;
        } else if (errorData?.error) {
          errorMessage = errorData.error_description || errorData.error;
        }

        toast.error(errorMessage);
        setStatus(`Error: ${errorMessage}`);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken(code);
  }, [code, router]);

  const hasProfile = Boolean(userInfo && Object.keys(userInfo).length > 0);

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
              src={userInfo?.picture}
              name={userInfo?.name || "Fayda User"}
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
            <InfoRow label="Name" value={userInfo?.name} />
            <InfoRow label="Email" value={userInfo?.email} />
            <InfoRow label="Gender" value={userInfo?.gender} />
            <InfoRow
              label="Phone"
              value={userInfo?.phone_number || userInfo?.phone}
            />
            <InfoRow label="Nationality" value={userInfo?.nationality} />
            <InfoRow
              label="Date of Birth"
              value={
                userInfo?.birthdate
                  ? userInfo.birthdate.replace(/-/g, "/")
                  : undefined
              }
            />
            <InfoRow
              label="Address"
              value={
                typeof userInfo?.address === "string"
                  ? userInfo.address
                  : userInfo?.address && typeof userInfo.address === "object"
                  ? [
                      userInfo.address.zone,
                      userInfo.address.woreda,
                      userInfo.address.region,
                    ]
                      .filter(Boolean)
                      .join(", ") || undefined
                  : undefined
              }
              span="md:col-span-2"
            />
            {userInfo?.picture && (
              <div className="md:col-span-2 flex justify-center">
                <img
                  src={userInfo.picture}
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
              onClick={() => router.replace("/dashboard/credentials")}
            >
              Go to Wallet
            </Button>
          </div>
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
        </Card>
      )}
    </div>
  );
}

const decodeUserInfoResponse = async (
  userinfoJwtToken: unknown
): Promise<UserInfo> => {
  try {
    if (!userinfoJwtToken) return {};

    // Handle string JWT token
    if (typeof userinfoJwtToken === "string") {
      return decodeJwt(userinfoJwtToken) as UserInfo;
    }

    // Handle object with userinfo property
    const candidate = (userinfoJwtToken as any).userinfo ?? userinfoJwtToken;

    if (typeof candidate === "string") {
      return decodeJwt(candidate) as UserInfo;
    }

    if ((candidate as any).id_token) {
      return decodeJwt((candidate as any).id_token) as UserInfo;
    }

    if (typeof candidate === "object") {
      return candidate as UserInfo;
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

function normalizeProfile(profile: UserInfo): UserInfo {
  if (!profile) return {};

  const normalized: UserInfo = { ...profile };

  // Normalize common alternate keys
  const anyProfile = profile as any;
  normalized.phone =
    profile.phone ?? anyProfile.phone_number ?? anyProfile.phoneNumber;
  normalized.nationality = profile.nationality ?? anyProfile.nationality_name;
  normalized.birthdate =
    profile.birthdate ?? anyProfile.birth_date ?? anyProfile.dob;
  normalized.address =
    typeof profile.address === "string"
      ? profile.address
      : profile.address && typeof profile.address === "object"
      ? profile.address
      : typeof anyProfile.address === "string"
      ? anyProfile.address
      : [anyProfile.city, anyProfile.state, anyProfile.country]
          .filter(Boolean)
          .join(", ") || undefined;
  normalized.picture = profile.picture ?? anyProfile.photo ?? anyProfile.avatar;
  normalized.name = profile.name ?? anyProfile.fullname ?? anyProfile.full_name;

  return normalized;
}

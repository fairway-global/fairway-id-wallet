"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { decodeJwt } from "jose";
import { toast } from "sonner";

import {
  FAYDA_FAN_NUMBER_KEY,
  FAYDA_LOGIN_ROUTE,
  FAYDA_SESSION_KEY,
  FAYDA_PROFILE_NAME_KEY,
  FAYDA_PROFILE_IMAGE_KEY,
} from "@/constants/auth";

const SESSION_KEYS = {
  state: "fayda_state",
  nonce: "fayda_nonce",
  verifier: "fayda_pkce_verifier",
};

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

const FAYDA_API_BASE =
  process.env.NEXT_PUBLIC_FAYDA_API_BASE ?? "/api";
const FAYDA_TOKEN_URL = `${FAYDA_API_BASE.replace(/\/$/, "")}/token`;
const FAYDA_USERINFO_URL = `${FAYDA_API_BASE.replace(/\/$/, "")}/userinfo/`;
const FAYDA_CLIENT_ID =
  process.env.NEXT_PUBLIC_FAYDA_CLIENT_ID ??
  "crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0";
const FAYDA_REDIRECT_FALLBACK =
  process.env.NEXT_PUBLIC_FAYDA_REDIRECT_URI ?? "http://localhost:3000/callback";

const formatDate = (date: string | undefined) => {
  if (!date) return "—";
  return date.replace(/-/g, "/");
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

  const buildRedirectUri = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/callback`;
    }
    return FAYDA_REDIRECT_FALLBACK;
  };

  const logStep = (message: string, data?: unknown) => {
    const entry = data ? `${message} | ${JSON.stringify(data)}` : message;
    setDebugSteps((prev) => [...prev, entry]);
    console.info("[FaydaCallback]", message, data ?? "");
  };

  useEffect(() => {
    logStep("Callback landed", { code: Boolean(code), state });

    const fetchProfile = async (authCode: string) => {
      setStatus("Exchanging code for token…");
      logStep("Requesting token", { endpoint: FAYDA_TOKEN_URL });

       const storedState = typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEYS.state) : null;
       if (storedState && state && storedState !== state) {
         const msg = "State mismatch. Please restart Fayda login.";
         toast.error(msg);
         setStatus(msg);
         logStep("State mismatch", { expected: storedState, received: state });
         setIsLoading(false);
         return;
       }

       const verifier =
         (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEYS.verifier)) ||
         undefined;
       const redirectUri = buildRedirectUri();

      try {
        const tokenResponse = await fetch(FAYDA_TOKEN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: authCode,
            code_verifier: verifier,
            client_id: FAYDA_CLIENT_ID,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        });

        if (!tokenResponse.ok) {
          logStep("Token request failed", { status: tokenResponse.status });
          throw new Error(`Token request failed with status ${tokenResponse.status}`);
        }

        const { access_token: accessToken } = await tokenResponse.json();
        if (!accessToken) {
          throw new Error("No access token returned from Fayda");
        }

        logStep("Token received");
        setStatus("Retrieving verified attributes…");
        logStep("Requesting userinfo", { endpoint: FAYDA_USERINFO_URL });
        const userInfoResponse = await fetch(FAYDA_USERINFO_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        });

        if (!userInfoResponse.ok) {
          logStep("Userinfo request failed", { status: userInfoResponse.status });
          throw new Error(`User info request failed with status ${userInfoResponse.status}`);
        }

        const userInfo = await userInfoResponse.json();
        logStep("Userinfo payload received");
        const decoded = normalizeProfile(decodeUserInfo(userInfo));
        if (!decoded || Object.keys(decoded).length === 0) {
          setProfile(null);
          setStatus("No verified data returned. Please retry the login.");
          toast.error("No verified data returned from Fayda.");
          logStep("Decoded profile empty");
          setIsLoading(false);
          return;
        }

        setProfile(decoded);

        // Flag the session so protected routes see a signed-in Fayda user.
        if (typeof window !== "undefined" && decoded) {
          window.localStorage.setItem(FAYDA_SESSION_KEY, "true");
          const fanValue = decoded?.fan ?? decoded?.faydaId ?? decoded?.sub;
          if (fanValue) {
            window.localStorage.setItem(FAYDA_FAN_NUMBER_KEY, String(fanValue));
          }
          if (decoded?.name) {
            window.localStorage.setItem(FAYDA_PROFILE_NAME_KEY, decoded.name);
          }
          if (decoded?.picture) {
            window.localStorage.setItem(FAYDA_PROFILE_IMAGE_KEY, decoded.picture);
          } else {
            window.localStorage.removeItem(FAYDA_PROFILE_IMAGE_KEY);
          }
        }

        setStatus("Verified data received.");
        logStep("Profile stored", {
          name: decoded?.name,
          fan: decoded?.fan ?? decoded?.faydaId ?? decoded?.sub,
        });
        toast.success("Fayda sign-in successful.");

        // Cleanup transient auth data
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(SESSION_KEYS.state);
          sessionStorage.removeItem(SESSION_KEYS.nonce);
          sessionStorage.removeItem(SESSION_KEYS.verifier);
        }
      } catch (error) {
        console.error("[FaydaCallback] Error", error);
        const message =
          error instanceof Error ? error.message : "Could not complete Fayda sign-in.";
        toast.error(message);
        setStatus(`Something went wrong: ${message}`);
        logStep("Error during callback", { error: message });
      } finally {
        setIsLoading(false);
      }
    };

    if (!code) {
      setStatus("Missing authorization code. Redirecting to Fayda login…");
      logStep("Missing code; redirecting to login");
      const timer = setTimeout(() => router.replace(FAYDA_LOGIN_ROUTE), 1500);
      return () => clearTimeout(timer);
    }

    fetchProfile(code);
  }, [code, router, state]);

  const hasProfile = Boolean(profile && Object.keys(profile).length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1224] via-[#0f1530] to-[#121a3a] text-white">
        <Spinner size="lg" color="success" label="Loading Fayda profile..." />
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
              <p className="text-xs uppercase tracking-[0.25em] text-gray-300">Fayda Success</p>
              <h1 className="text-2xl font-bold">Identity Verified</h1>
              <p className="text-sm text-gray-300">
                State: <span className="font-mono text-fwNewGreen">{state ?? "—"}</span>
              </p>
            </div>
            <div className="ml-auto">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Spinner size="sm" color="success" /> {status}
                </div>
              ) : (
                <p className="text-sm text-gray-300">{status}</p>
              )}
            </div>
          </CardHeader>
          <CardBody className="grid gap-6 p-8 md:grid-cols-2">
            <InfoRow label="Name" value={profile?.name} />
            <InfoRow label="Email" value={profile?.email} />
            <InfoRow label="Gender" value={profile?.gender} />
            <InfoRow label="Phone" value={profile?.phone} />
            <InfoRow label="Nationality" value={profile?.nationality} />
            <InfoRow label="Date of Birth" value={formatDate(profile?.birthdate)} />
            <InfoRow label="Address" value={profile?.address} span="md:col-span-2" />
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
              onClick={() => router.replace(FAYDA_LOGIN_ROUTE)}
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
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Debug</p>
              <pre className="text-xs bg-black/30 rounded-xl p-3 text-gray-200 whitespace-pre-wrap">
                {debugSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}
              </pre>
            </div>
          )}
        </Card>
      ) : (
        <Card className="w-full max-w-2xl bg-white/5 border border-red-400/40 shadow-2xl">
          <CardHeader className="flex items-center gap-3 border-b border-white/10">
            <Avatar
              isBordered
              color="danger"
              size="lg"
              name="!"
            />
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-300">Fayda Error</p>
              <h1 className="text-2xl font-bold text-red-400">No verified data received</h1>
              <p className="text-sm text-gray-300">
                State: <span className="font-mono text-red-300">{state ?? "—"}</span>
              </p>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-8">
            <p className="text-sm text-gray-200">
              We could not read any verified attributes from Fayda. Please return to the login page and try again.
            </p>
            <div className="flex gap-3">
              <Button
                variant="light"
                className="text-gray-200"
                onClick={() => router.replace(FAYDA_LOGIN_ROUTE)}
              >
                Back to Login
              </Button>
              <Button
                color="success"
                className="bg-fwNewGreen text-black font-semibold"
                onClick={() => router.replace(FAYDA_LOGIN_ROUTE)}
              >
                Retry Fayda Login
              </Button>
            </div>
          </CardBody>
          {debugSteps.length > 0 && (
            <div className="border-t border-white/10 px-8 py-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Debug</p>
              <pre className="text-xs bg-black/30 rounded-xl p-3 text-gray-200 whitespace-pre-wrap">
                {debugSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}
              </pre>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function decodeUserInfo(raw: unknown): FaydaProfile {
  try {
    if (!raw) return {};

    // Some implementations return { userinfo: "<jwt|string|object>" }
    // Normalize the payload first.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candidate = (raw as any).userinfo ?? raw;

    if (typeof candidate === "string") {
      // Try to decode a JWT without verification to extract the claims.
      return decodeJwt(candidate) as FaydaProfile;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((candidate as any).id_token) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return decodeJwt((candidate as any).id_token) as FaydaProfile;
    }

    if (typeof candidate === "object") {
      return candidate as FaydaProfile;
    }

    return {};
  } catch (error) {
    console.error("Failed to decode user info", error);
    return {};
  }
}

type InfoRowProps = {
  label: string;
  value?: string;
  span?: string;
};

function InfoRow({ label, value, span }: InfoRowProps) {
  return (
    <div className={`flex flex-col gap-1 rounded-xl border border-white/5 bg-white/5 p-4 ${span ?? ""}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="text-base font-semibold text-white">{value || "—"}</p>
    </div>
  );
}

function normalizeProfile(profile: FaydaProfile): FaydaProfile {
  if (!profile) return {};

  const normalized: FaydaProfile = { ...profile };

  // Normalize common alternate keys
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyProfile = profile as any;
  normalized.phone = profile.phone ?? anyProfile.phone_number ?? anyProfile.phoneNumber;
  normalized.nationality = profile.nationality ?? anyProfile.nationality_name;
  normalized.birthdate = profile.birthdate ?? anyProfile.birth_date ?? anyProfile.dob;
  normalized.address =
    profile.address ??
    [anyProfile.city, anyProfile.state, anyProfile.country]
      .filter(Boolean)
      .join(", ");
  normalized.picture = profile.picture ?? anyProfile.photo ?? anyProfile.avatar;
  normalized.name = profile.name ?? anyProfile.fullname ?? anyProfile.full_name;
  normalized.fan = profile.fan ?? anyProfile.fanNumber ?? anyProfile.faydaId ?? anyProfile.sub;

  return normalized;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { toast } from "sonner";
import PageLoader from "@/components/PageLoader";

const FAYDA_SCOPE = "openid profile email";
const FAYDA_CLIENT_ID =
  process.env.NEXT_PUBLIC_FAYDA_CLIENT_ID ??
  "crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0";
const FAYDA_AUTH_BASE =
  process.env.NEXT_PUBLIC_FAYDA_AUTH_BASE ?? "https://esignet.ida.fayda.et";
const FAYDA_REDIRECT_FALLBACK =
  process.env.NEXT_PUBLIC_FAYDA_REDIRECT_URI ?? "http://localhost:3000/callback";

const SESSION_KEYS = {
  state: "fayda_state",
  nonce: "fayda_nonce",
  verifier: "fayda_pkce_verifier",
};

const base64UrlEncode = (buffer: ArrayBuffer | Uint8Array) => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const createRandomString = (length = 64) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(
    randomValues,
    (value) => charset[value % charset.length]
  ).join("");
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
};

const buildRedirectUri = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/callback`;
  }
  return FAYDA_REDIRECT_FALLBACK;
};

export default function FaydaLoginPage() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setIsBootstrapping(false);
  }, []);

  const handleStartFaydaLogin = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setStatusMessage("Preparing Fayda sign-in…");

    try {
      if (typeof window === "undefined") {
        throw new Error("Window object not available.");
      }

      const verifier = createRandomString(64);
      const challenge = await generateCodeChallenge(verifier);
      const state = createRandomString(16);
      const nonce = createRandomString(16);
      const redirectUri = buildRedirectUri();

      sessionStorage.setItem(SESSION_KEYS.verifier, verifier);
      sessionStorage.setItem(SESSION_KEYS.state, state);
      sessionStorage.setItem(SESSION_KEYS.nonce, nonce);

      const params = new URLSearchParams({
        client_id: FAYDA_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: FAYDA_SCOPE,
        acr_values:
          "mosip:idp:acr:generated-code mosip:idp:acr:linked-wallet mosip:idp:acr:biometrics",
        claims:
          '{"userinfo":{"name":{"essential":true},"phone":{"essential":true},"email":{"essential":true},"picture":{"essential":true},"gender":{"essential":true},"birthdate":{"essential":true},"address":{"essential":true}},"id_token":{}}',
        code_challenge: challenge,
        code_challenge_method: "S256",
        display: "page",
        nonce,
        state,
        ui_locales: "en",
      });

      const authUrl = `${FAYDA_AUTH_BASE.replace(/\/$/, "")}/authorize?${params.toString()}`;
      console.info("[FaydaLogin] Redirecting to Fayda", {
        authUrl,
        redirectUri,
        state,
        nonce,
      });

      setStatusMessage("Redirecting to the Fayda sign-in page…");
      window.location.assign(authUrl);
    } catch (error) {
      console.error("[FaydaLogin] Failed to open Fayda", error);
      toast.error("Unable to open the Fayda sign-in page. Please try again.");
      setStatusMessage("We could not open Fayda. Please try again.");
      setIsProcessing(false);
    }
  }, [isProcessing]);

  if (isBootstrapping) {
    return <PageLoader loaderText="Preparing Fayda sign-in..." />;
  }

  return (
    <div className="flex flex-col justify-center items-center px-4 py-6 text-white h-full">
      <Card className="w-full max-w-md bg-[#12142b] border border-white/10 shadow-2xl rounded-[28px]">
        <CardBody className="flex flex-col gap-6 p-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
              Login with Fayda
            </p>
            <h1 className="text-3xl font-extrabold mt-3 leading-snug">
              Ethiopian National ID (e-Signet)
            </h1>
            <p className="text-gray-300 text-sm mt-2 leading-relaxed">
              Redirect to the official Fayda eSignet portal to verify your national ID and share a signed proof back to this wallet.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              color="success"
              className="bg-[#69e6b5] text-black font-semibold rounded-xl py-6 text-base"
              isLoading={isProcessing}
              onClick={handleStartFaydaLogin}
            >
              {isProcessing ? "Opening Fayda…" : "Continue with Fayda"}
            </Button>
            {statusMessage && (
              <p className="text-xs text-neutral-400 text-center">
                {statusMessage}
              </p>
            )}
            <p className="text-xs text-gray-500 text-center">
              We request scopes:{" "}
              <span className="font-mono">{FAYDA_SCOPE}</span>. Fayda signs the response; we only store the resulting assertion.
            </p>
          </div>
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

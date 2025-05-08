"use client";
import Image from "next/image";
import { FingerPrintIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import IdentityCredential from "@/components/IdentityCredential";
import { useCredentialStore } from "../../../../store/credentialStore";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function IdentityCredentialDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { fetchCredentials } = useCredentialStore();
  const [credentials, setCredentials] = useState<any[]>([]);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        setCredentials(await fetchCredentials());
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
      }
    };
    loadCredentials();
  }, [fetchCredentials]);

  const credential = useMemo(() => {
    if (!id || !credentials.length) return null;
    return credentials.find((cred) => cred.id === id);
  }, [id, credentials]);

  const handleBack = () => {
    router.push(`/dashboard`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const renderClaimValue = (value: any) => {
    if (typeof value === "string" && value.startsWith("did:")) {
      // Truncate DID for display
      return `${value.slice(0, 20)}...${value.slice(-10)}`;
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const HR = () => (
    <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-400 w-full" />
  );

  return credential ? (
    <div className="flex flex-col items-center text-white">
      <IdentityCredential credential={credential} className={"w-full"} />
      <div
        className={`rounded-b-2xl p-4 flex flex-col items-center h-auto bg-[rgba(255,255,255,0.15)] backdrop-blur-xl border border-[rgba(255,255,255,0.2)] shadow-lg w-[80%]`}
      >
        <Image
          alt="National ID/Fayda Logo"
          src={"/verified-purple.svg"}
          height={72}
          width={72}
          className={"mt-2"}
        />
        <HR />
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-xs">ID Provider</p>
          <p className="text-[20px] font-bold">
            {credential?.idProvider ?? ""}
          </p>
        </div>
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">ISSUED DATE</p>
            <p className="text-[20px] font-bold">
              {formatDate(credential.issuanceDate)}
            </p>
          </div>
          {credential?.expirationDate && (
            <div className="flex flex-col items-end gap-2 w-full">
              <p className="text-xs">VALID UNTIL</p>
              <p className="text-[20px] font-bold">
                {formatDate(credential.expirationDate)}
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 w-full">
          {Object.entries(credential.claims).length === 0 ? (
            <p className="text-sm text-gray-500">No attributes available</p>
          ) : (
            Object.entries(credential.claims).map(([key, value]) => (
              <>
                <div
                  key={key}
                  className="flex flex-col items-start gap-2 w-full"
                >
                  <p className="text-xs">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-[20px] font-bold">
                    {renderClaimValue(value)}
                  </p>
                </div>
                <HR key={key} />
              </>
            ))
          )}
        </div>

        {credential.status === "pending" && (
          <>
            <HR />
            <p className="text-gray-200">Identity Credential Received</p>
          </>
        )}
        <HR />
        <div className="flex justify-between w-full gap-2">
          <Button
            size="sm"
            className={"flex justify-center text-white bg-fwNewGreen w-full"}
            onPress={() => {
              //   if (!credential.status) {
              //     setIdentityCredential({ ...identityCredential, signed: true });
              //   }
            }}
          >
            {credential.signed ? (
              <>
                <FingerPrintIcon className="h-4 w-4 text-white" />
                Accept
              </>
            ) : (
              <>
                Share
                <ShareIcon className="h-4 w-4 text-white" />
              </>
            )}
          </Button>
          <Button
            size="sm"
            className={
              "flex justify-center text-fwNewRed border border-fwNewRed bg-transparent w-full"
            }
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center text-white gap-2">
      <p className="text-lg font-semibold">Credential not found</p>
      <div className="flex flex-col items-center text-white">
        <Button
          size="sm"
          className={"flex justify-center text-white bg-fwNewGreen w-full"}
          onPress={handleBack}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

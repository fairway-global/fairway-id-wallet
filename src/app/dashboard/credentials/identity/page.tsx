"use client";
import Image from "next/image";
import { FingerPrintIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import dayjs from "dayjs";
import IdentityCredential from "@/components/IdentityCredential";
import { useCredentialStore } from "../../../../store/credentialStore";

export default function IdentityCredentialDetail() {
  const { credentials } = useCredentialStore();

  const identityCredential = credentials.find(
    (credential) => credential.type === "IdentityCredential"
  );

  const HR = () => (
    <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-400 w-full" />
  );

  return identityCredential ? (
    <div className="flex flex-col items-center text-white">
      <IdentityCredential className={"w-full"} />
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
            {identityCredential?.idProvider ?? ""}
          </p>
        </div>
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">GENDER</p>
            <p className="text-[20px] font-bold">
              {identityCredential?.gender ?? ""}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">DATE OF BIRTH</p>
            <p className="text-[20px] font-bold">
              {identityCredential?.birthDate
                ? dayjs(identityCredential.birthDate).format("DD.MM.YYYY")
                : ""}
            </p>
          </div>
        </div>
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">CITY</p>
            <p className="text-[20px] font-bold">{identityCredential.city}</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">COUNTRY</p>
            <p className="text-[20px] font-bold">
              {identityCredential.country}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">ISSUED DATE</p>
            <p className="text-[20px] font-bold">
              {identityCredential.issuedDate}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">VALID</p>
            <p className="text-[20px] font-bold">
              {identityCredential.expiryDate}
            </p>
          </div>
        </div>
        {identityCredential.status === "pending" && (
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
              if (!identityCredential.status) {
                setIdentityCredential({ ...identityCredential, signed: true });
              }
            }}
          >
            {identityCredential.signed ? (
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
    <div>No Credential found.</div>
  );
}

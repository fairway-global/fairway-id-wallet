"use client";
import { IEducationCredential } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CheckIcon,
  ClipboardIcon,
  FingerPrintIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";
import EducationCredential from "@/components/EducationCredential";
import dayjs from "dayjs";
import useStore from "../../../../../store/store";
import { useParams } from "next/navigation";

export default function EducationCredentialDetail() {
  const params = useParams();
  const id = params?.id;
  const { educationCredentials } = useStore();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (educationCredential) {
      try {
        await navigator.clipboard.writeText(educationCredential?.did);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  // Filter the education credential by ID
  const educationCredential = useMemo(() => {
    if (!id || !educationCredentials) return null; // Handle missing ID or credentials

    // Find the credential with the matching ID
    return educationCredentials.find(
      (credential) => credential.id === Number(id)
    );
  }, [id, educationCredentials]);

  // Handle the case where the credential is not found
  if (!educationCredential) {
    return <div>Education Credential not found.</div>;
  }

  const HR = () => (
    <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-400 w-full" />
  );

  return (
    <div className="flex flex-col items-center text-white">
      <EducationCredential
        educationCredential={educationCredential}
        className={"w-full"}
      />
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
          <p className="text-xs">DID</p>
          <p className="text-sm font-bold flex items-center gap-2">
            {educationCredential.did}
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              {copied ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ClipboardIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </p>
        </div>
        <HR />
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-xs">UNIVERSITY</p>
          <p className="text-[20px] font-bold">
            {educationCredential.universityName}
          </p>
        </div>
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">GPA</p>
            <p className="text-[20px] font-bold">{educationCredential.gpa}</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">GRADUATION DATE</p>
            <p className="text-[20px] font-bold">
              {dayjs().format("DD.MM.YYYY")}
            </p>
          </div>
        </div>
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">ISSUED DATE</p>
            <p className="text-[20px] font-bold">{educationCredential.gpa}</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">VALID</p>
            <p className="text-[20px] font-bold">&#8734;</p>
          </div>
        </div>

        {!educationCredential.signed && (
          <>
            <HR />
            <p className="text-gray-200">Education Credential Received</p>
          </>
        )}
        <HR />
        <div className="flex justify-between w-full gap-2">
          <Button
            size="sm"
            className={"flex justify-center text-white bg-fwNewGreen w-full"}
            onPress={() => {
              if (!educationCredential.signed) {
                setEducationCredential((educationCredential) => ({
                  ...educationCredential,
                  signed: true,
                }));
              }
            }}
          >
            {educationCredential.signed ? (
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
  );
}

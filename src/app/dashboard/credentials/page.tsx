"use client";
import { useEffect, useState } from "react";
import { IEducationCredential } from "@/utils/types";
import EducationCredential from "@/components/EducationCredential";
import IdentityCredential from "@/components/IdentityCredential";
import NationalIDBadge from "@/components/ui/NationIDBadge";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCredentialStore } from "../../../store/credentialStore";

export default function Credentials() {
  const router = useRouter();
  const { credentials } = useCredentialStore();
  const [educationCredentials, setEducationCredentials] = useState<
    Credential[]
  >([]);

  useEffect(() => {
    const filteredCredentials = credentials.filter(
      (credential) => credential.type === "EducationCredential"
    );
    setEducationCredentials(filteredCredentials);
  }, [credentials]);

  const onAddCredential = () => {
    router.push("/dashboard/credentials/add");
  };

  return (
    <div className="text-white px-2 flex flex-col gap-3">
      <IdentityCredential />
      {credentials.length && <NationalIDBadge />}

      {credentials.map((credential, key) => (
        <EducationCredential
          key={key}
          educationCredential={credential as IEducationCredential}
        />
      ))}
      {credentials.length && (
        <Button
          size="sm"
          className={
            "flex justify-center text-fwNewGreen border border-fwNewGreen bg-transparent w-full"
          }
          onPress={onAddCredential}
        >
          Add New Credential
        </Button>
      )}
    </div>
  );
}

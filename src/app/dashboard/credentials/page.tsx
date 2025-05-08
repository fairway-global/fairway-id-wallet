"use client";
import { useEffect, useState } from "react";
import IdentityCredential from "@/components/IdentityCredential";
import NationalIDBadge from "@/components/ui/NationIDBadge";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCredentialStore } from "../../../store/credentialStore";
import { useAgentStore } from "../../../store/agentStore";

export default function Credentials() {
  const router = useRouter();
  const { fetchCredentials } = useCredentialStore();
  const [credentials, setCredentials] = useState<any[]>([]);
  const { agent } = useAgentStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const credResult = await fetchCredentials();
        setCredentials(credResult);
        console.log("Fetched credentials:", credResult);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    if (agent) {
      loadData();
    }
  }, [fetchCredentials, agent]);

  const onAddCredential = () => {
    router.push("/dashboard/credentials/add");
  };

  return (
    <div className="text-white px-2 flex flex-col gap-3">
      {credentials.map((credential, key) => (
        <IdentityCredential credential={credential} key={key} />
      ))}
      {credentials.length > 0 && <NationalIDBadge />}
      <Button
        size="sm"
        className={
          "flex justify-center text-fwNewGreen border border-fwNewGreen bg-transparent w-full"
        }
        onPress={onAddCredential}
      >
        Add New Credential
      </Button>
    </div>
  );
}

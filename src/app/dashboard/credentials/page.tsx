"use client";
import { useEffect, useState } from "react";
import IdentityCredential from "@/components/IdentityCredential";
import NationalIDBadge from "@/components/ui/NationIDBadge";
import { Button, Input } from "@heroui/react";
import { useCredentialStore } from "../../../store/credentialStore";
import { useAgentStore } from "../../../store/agentStore";
import { ModalContainer } from "../../../components/ui/Modal";
import { toast } from "sonner";

export default function Credentials() {
  const { fetchCredentials } = useCredentialStore();
  const { acceptInvitationUrl } = useAgentStore();
  const [credentials, setCredentials] = useState<any[]>([]);
  const { agent } = useAgentStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState("");

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
    setShowAddModal(true);
  };

  const onSave = async () => {
    if (!invitationUrl) {
      toast.error("Please enter a valid invitation URL.");
      return;
    }
    try {
      await acceptInvitationUrl(invitationUrl);
      toast.success("Credential added successfully.");
      setShowAddModal(false);
      setInvitationUrl("");
    } catch (error) {
      console.error("Error adding credential:", error);
      toast.error("Failed to add credential. Please try again.");
      setShowAddModal(false);
      setInvitationUrl("");
    }
  };

  const onCancel = () => {
    setShowAddModal(false);
    setInvitationUrl("");
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
      {showAddModal && (
        <ModalContainer
          title="Add New Credential"
          isOpen={showAddModal}
          onSave={onSave}
          onCancel={onCancel}
        >
          <p className="text-center text-white">
            Please enter the invitation URL to add a new credential.
          </p>
          <Input
            className="w-full"
            label="Enter invitation URL"
            type="text"
            variant="flat"
            isRequired={true}
            value={invitationUrl}
          />
          <p className="text-center text-white">
            You can get the invitation URL from your agent.
          </p>
        </ModalContainer>
      )}
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import IdentityCredential from "@/components/IdentityCredential";
import NationalIDBadge from "@/components/ui/NationIDBadge";
import { Button, Input, useDisclosure } from "@heroui/react";
import { useCredentialStore } from "../../../store/credentialStore";
import { useAgentStore } from "../../../store/agentStore";
import { ModalContainer } from "../../../components/ui/Modal";
import { toast } from "sonner";
import { isValidUrl } from "../../../utils";
import NotVerified from "../../../components/NotVerified";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Credentials() {
  const router = useRouter();
  const { fetchCredentials } = useCredentialStore();
  const { acceptInvitationUrl } = useAgentStore();
  const [credentials, setCredentials] = useState<any[]>([]);
  const { agent } = useAgentStore();
  const [invitationUrl, setInvitationUrl] = useState("");
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [inviationLoading, setInviationLoading] = useState(false);

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
    onOpen();
  };

  const onSave = async () => {
    if (!invitationUrl || !isValidUrl(invitationUrl)) {
      console.log("Invalid URL:", !isValidUrl(invitationUrl));
      toast.error("Please enter a valid invitation URL.");
      return;
    }
    try {
      setInviationLoading(true);
      await acceptInvitationUrl(invitationUrl);
      toast.success("Credential added successfully.");
      onClose();
      setInvitationUrl("");
    } catch (error) {
      console.error("Error adding credential:", error);
      toast.error("Failed to add credential. Please try again.");
      onClose();
      setInvitationUrl("");
    } finally {
      setInviationLoading(false);
    }
  };

  const onCancel = () => {
    console.log("Cancelled");
    onClose();
    setInvitationUrl("");
  };

  const isIdentityVerified = useMemo(() => {
    const locallyVerified = localStorage?.getItem(
      "fw_wallet_identity_verified"
    );
    return locallyVerified ? true : false;
  }, [localStorage]);

  const demoInvitationUrl = useMemo(() => {}, []);

  const onVerify = () => {
    router.push("/dashboard/credentials/verifyId");
  };

  return (
    <div className="text-white px-2 flex flex-col gap-3">
      {!isIdentityVerified ? (
        <NotVerified onVerify={onVerify} />
      ) : (
        <>
          {credentials.map((credential, key) => (
            <IdentityCredential credential={credential} key={key} />
          ))}
          <NationalIDBadge />
          <Button
            size="sm"
            className={
              "flex justify-center text-fwNewGreen border border-fwNewGreen bg-transparent w-full"
            }
            onPress={onAddCredential}
          >
            Add a Sample Credential
          </Button>
        </>
      )}
      <ModalContainer
        title="Add New Credential"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSave={onSave}
        onCancel={onCancel}
        isSubmitting={inviationLoading}
      >
        <p className="text-center text-yellow-500 mb-4 text-sm italic">
          For Demo purposes only: Please follow the link to get your own
          credential invitation &nbsp;
          <Link
            className="underline"
            target="_blank"
            href="http://dashboard.fairway.global/"
          >
            Go to Issuance page
          </Link>
        </p>

        <p className="text-center text-white text-sm">
          Please enter the invitation URL to add a new credential.
        </p>
        <Input
          className="w-full"
          label="Enter invitation URL"
          type="text"
          variant="flat"
          isRequired={true}
          onChange={(e) => setInvitationUrl(e.target.value)}
          onFocusChange={(isFocused?: boolean) =>
            !isFocused ? setInvitationUrl("") : {}
          }
          placeholder="https://example.com/?oob=sdad123"
          value={invitationUrl}
        />
        {/* <p className="text-center text-white text-sm">
          You can get the invitation URL from your issuer.
        </p> */}
      </ModalContainer>
    </div>
  );
}

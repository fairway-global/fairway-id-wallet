"use client";
import { useEffect, useMemo, useState } from "react";
import IdentityCredential from "@/components/IdentityCredential";
import NationalIDBadge from "@/components/ui/NationIDBadge";
import { Button, Input, useDisclosure, Tabs, Tab } from "@heroui/react";
import { useCredentialStore } from "../../../store/credentialStore";
import { useAgentStore } from "../../../store/agentStore";
import { useMessageStore } from "../../../store/messageStore"; // Added import for message store
import { ModalContainer } from "../../../components/ui/Modal";
import { toast } from "sonner";
import { isValidUrl } from "../../../utils";
import NotVerified from "../../../components/NotVerified";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import BlurredCard from "@/components/ui/BlurredCard"; // Assuming this is used for offer cards

export default function Credentials() {
  const router = useRouter();
  const { fetchCredentials } = useCredentialStore();
  const { acceptInvitationUrl } = useAgentStore();
  const { messages, fetchMessages } = useMessageStore(); // Added message store
  const [credentials, setCredentials] = useState<any[]>([]);
  const { agent } = useAgentStore();
  const [invitationUrl, setInvitationUrl] = useState("");
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [inviationLoading, setInviationLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"credentials" | "offers">(
    "credentials"
  ); // Added state for sub-tabs

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

  useEffect(() => {
    if (activeSubTab === "offers" && agent) {
      fetchMessages(); // Fetch messages when Offers tab is selected
    }
  }, [activeSubTab, fetchMessages, agent]);

  const credentialOffers = useMemo(() => {
    console.log("Messages:", messages);
    return messages.filter(
      (msg) => msg.type === SDK.ProtocolType.DidcommOfferCredential
    );
  }, [messages]);

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

  const onVerify = () => {
    router.push("/dashboard/credentials/verifyId");
  };

  const handleOfferClick = (offerId: string) => {
    router.push(`/dashboard/credentials/offers/${offerId}`);
  };

  return (
    <div className="text-white px-2 flex flex-col gap-3">
      <Tabs
        selectedKey={activeSubTab}
        onSelectionChange={(key) =>
          setActiveSubTab(key as "credentials" | "offers")
        }
        aria-label="Credential Tabs"
        className="w-full"
      >
        <Tab key="credentials" title="Credentials">
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
        </Tab>
        <Tab key="offers" title="Offers">
          {credentialOffers.length === 0 ? (
            <p className="text-center text-gray-500">
              No credential offers available.
            </p>
          ) : (
            credentialOffers.map((offer) => (
              <BlurredCard
                key={offer.id}
                bgColor="#FDB82C" // Example color for offers
                className="p-4 cursor-pointer"
                onClick={() => handleOfferClick(offer.id)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">
                    Credential Offer from {offer.from || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(offer.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-gray-300">Tap to view details</p>
              </BlurredCard>
            ))
          )}
        </Tab>
      </Tabs>
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
          credential invitation  
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

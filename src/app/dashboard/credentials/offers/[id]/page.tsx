"use client";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import { useAgentStore } from "../../../../../store/agentStore";
import { useMessageStore } from "../../../../../store/messageStore";
import SDK from "@hyperledger/identus-edge-agent-sdk";

type CredentialPreviewContent = {
  credential_preview?: {
    attributes?: Record<string, unknown>;
  };
  goalCode?: string;
};

export default function CredentialOfferDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { messages } = useMessageStore();
  const { acceptCredentialOffer } = useAgentStore(); // Assuming this is available in agentStore

  const offer = useMemo(() => {
    console.log("Messages:", messages);
    return messages.find((msg) => msg.id === id);
  }, [id, messages]);

  if (!offer) {
    return <div className="text-white p-4">Offer not found.</div>;
  }

  const handleAccept = async () => {
    try {
      await acceptCredentialOffer(offer as SDK.Domain.Message); // Call to accept the offer
      toast.success("Credential offer accepted.");
      router.push("/dashboard/credentials"); // Redirect back
    } catch (error) {
      toast.error("Failed to accept offer.");
    }
  };

  const handleReject = () => {
    // For reject, perhaps mark as processed or just navigate back
    // You can add logic to update status in store if needed
    toast.info("Credential offer rejected.");
    router.push("/dashboard/credentials");
  };

  // Extract claims from the offer (assuming from body or attachments)
  const previewContent = offer.content as CredentialPreviewContent | undefined;
  const claims =
    (previewContent?.credential_preview?.attributes as
      | Record<string, unknown>
      | undefined) || {};
  const goalCode = (previewContent?.goalCode as string | undefined) ?? "N/A";

  return (
    <div className="text-white p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Credential Offer Details</h1>
      <p>
        <strong>From:</strong> {offer.from || "Unknown"}
      </p>
      <p>
        <strong>Timestamp:</strong> {offer.timestamp}
      </p>
      <p>
        <strong>Goal:</strong> {goalCode}
      </p>

      <h2 className="text-lg font-semibold">Claims Preview:</h2>
      {Object.entries(claims).length === 0 ? (
        <p>No claims available.</p>
      ) : (
        <ul className="list-disc pl-4">
          {Object.entries(claims).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {String(value)}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-4 mt-4">
        <Button color="success" onPress={handleAccept}>
          Accept
        </Button>
        <Button color="danger" onPress={handleReject}>
          Reject
        </Button>
      </div>
    </div>
  );
}

"use client";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import Image from "next/image";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import { useMessageStore } from "../../../../../store/messageStore";
import { useAgentStore } from "../../../../../store/agentStore";
import { formatDate } from "../../../../../utils";

export default function CredentialOfferDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { messages, rawMessages } = useMessageStore();
  const { acceptCredentialOffer } = useAgentStore(); // Assuming this is available in agentStore

  const offer = useMemo(() => {
    return messages.find((msg) => msg.id === id);
  }, [id, messages]);

  if (!offer) {
    return <div className="text-white p-4">Offer not found.</div>;
  }

  const handleAccept = async () => {
    try {
      const rawMessage = rawMessages.find((msg) => msg.id === id);
      if (!rawMessage) {
        toast.error("Raw message not found for this offer.");
        return;
      }
      await acceptCredentialOffer(rawMessage); // Call to accept the offer
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

  // Extract attributes from the offer's credential_preview (array of { name, value })
  const attributes = offer.content?.credential_preview?.body?.attributes || [];

  // Extract issuance date or use timestamp as fallback
  const issuanceDate = offer.timestamp;

  const HR = () => (
    <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-400 w-full" />
  );

  return (
    <div className="flex flex-col items-center text-white">
      <div
        className={`rounded-2xl p-4 flex flex-col items-center h-auto bg-[rgba(255,255,255,0.15)] backdrop-blur-xl border border-[rgba(255,255,255,0.2)] shadow-lg w-[80%]`}
      >
        <Image
          alt="Verified Icon"
          src={"/verified-purple.svg"}
          height={72}
          width={72}
          className={"mt-2"}
        />
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">OFFERED DATE</p>
            <p className="text-[20px] font-bold">{formatDate(issuanceDate)}</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">VALID UNTIL</p>
            <p className="text-[20px] font-bold">N/A</p>{" "}
            {/* No expiry in offer; use N/A */}
          </div>
        </div>
        <div className="grid grid-cols-1 w-full">
          {attributes.length === 0 ? (
            <p className="text-sm text-gray-500">No attributes available</p>
          ) : (
            attributes.map(
              (attr: { name: string; value: string }, index: number) => (
                <div key={index} className="flex flex-col items-start w-full">
                  <p className="text-xs">
                    {attr.name
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .toUpperCase()}
                  </p>
                  <p className="text-[20px] font-bold">{attr.value}</p>
                  <HR />
                </div>
              )
            )
          )}
        </div>
        <HR />
        <div className="flex justify-between w-full gap-2">
          <Button
            size="sm"
            className={"flex justify-center text-white bg-fwNewGreen w-full"}
            onPress={handleAccept}
          >
            Accept
          </Button>
          <Button
            size="sm"
            className={
              "flex justify-center text-fwNewRed border border-fwNewRed bg-transparent w-full"
            }
            onPress={handleReject}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

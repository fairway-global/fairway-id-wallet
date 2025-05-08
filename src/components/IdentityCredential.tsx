"use client";
import BlurredCard from "./ui/BlurredCard";
import { FC } from "react";
import { EyeSlashIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import { useCredentialStore } from "../store/credentialStore";
import { formatDate } from "../utils";

interface IdentityCredentialProps {
  credential: any;
  className?: string;
}

const IdentityCredential: FC<IdentityCredentialProps> = ({
  credential,
  className = "",
}) => {
  const router = useRouter();

  const handleCredentialClick = () => {
    if (credential.id) {
      router.push(`/dashboard/credentials/${credential.id}`);
    }
  };

  return (
    <BlurredCard
      onClick={handleCredentialClick}
      bgColor="#00F4C8"
      className={`p-4 ${className}`}
    >
      <div className="z-1 grid grid-cols-[60px_1fr] grid-rows-1 gap-2 place-content-center">
        <section className="row-span-2 text-white flex items-center justify-center">
          <Avatar size="md" src="/nib-logo-only.png" />
        </section>
        <section className="flex flex-col gap-1 justify-between">
          <p className="font-semibold text-lg flex justify-between items-center w-full">
            <span>Identity Verified</span>
            <span className="text-xs text-gray-500">
              {formatDate(credential.issuanceDate)}
            </span>
          </p>
          <p className="font-light text-gray-300 flex gap-2 items-center">
            <span>
              Issuer by: Fayda via <small>IE Networks</small>
            </span>
          </p>
        </section>
      </div>
    </BlurredCard>
  );
};

export default IdentityCredential;

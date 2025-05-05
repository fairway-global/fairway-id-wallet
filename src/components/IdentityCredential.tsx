"use client";
import BlurredCard from "./ui/BlurredCard";
import { FC } from "react";
import { EyeSlashIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import { useCredentialStore } from "../store/credentialStore";

interface IdentityCredentialProps {
  className?: string;
}

const IdentityCredential: FC<IdentityCredentialProps> = ({ className }) => {
  const router = useRouter();
  const { credentials } = useCredentialStore();

  const onVerify = () => {
    router.push("/dashboard/credentials/verifyId");
  };

  const gotoDetailPage = () => {
    router.push("/dashboard/credentails/identity");
  };

  return credentials === null ? (
    <BlurredCard
      bgColor="#D91F05"
      className={`p-4 ${className}`}
      onClick={gotoDetailPage}
    >
      <div className="z-1 grid grid-cols-[60px_1fr] grid-rows-2 gap-2 place-content-center">
        <section className="row-span-2 text-white flex items-center justify-center">
          <div className="rounded-full w-[60px] h-[60px] bg-fwNewRed flex items-center justify-center">
            <EyeSlashIcon className="h-6 w-6 text-white" />
          </div>
        </section>
        <p className="font-semibold text-lg">Identity Unverified</p>
        <p className="font-light text-gray-300 text-xs">
          Verify your indentity to receive credentials
        </p>
      </div>
      <div className="flex justify-between items-center w-full mt-2 px-4">
        <p className="font-semibold text-xs">National ID/FAYDAA Supported</p>
        <Button
          onPress={onVerify}
          color="warning"
          size="sm"
          className={"flex justify-between w-max"}
        >
          <QrCodeIcon className="h-6 w-6 text-white" />
          <span>VERIFY</span>
        </Button>
      </div>
    </BlurredCard>
  ) : (
    <BlurredCard bgColor="#00F4C8" className={"p-4"}>
      <div className="z-1 grid grid-cols-[60px_1fr] grid-rows-1 gap-2 place-content-center">
        <section className="row-span-2 text-white flex items-center justify-center">
          <Avatar size="md" src="/nib-logo-only.png" />
        </section>
        <section className="flex flex-col justify-center">
          <p className="font-semibold text-lg">Identity Verified</p>
          <p className="font-light text-gray-300">
            {credentials?.fullName ?? ""}
          </p>
        </section>
      </div>
    </BlurredCard>
  );
};

export default IdentityCredential;

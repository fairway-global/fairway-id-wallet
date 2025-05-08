import { EyeSlashIcon, QrCodeIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import React from "react";
import BlurredCard from "./ui/BlurredCard";

interface NotVerifiedProps {
  onVerify: () => void;
  className?: string;
}

const NotVerified: React.FC<NotVerifiedProps> = ({
  onVerify,
  className = "",
}) => {
  return (
    <BlurredCard bgColor="#D91F05" className={`p-4 ${className}`}>
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
  );
};

export default NotVerified;

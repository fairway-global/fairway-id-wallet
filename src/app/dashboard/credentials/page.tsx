"use client";

import BlurredCard from "../../../components/ui/BlurredCard";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";
import { QrCodeIcon } from "@heroicons/react/24/outline";

export default function Credentials() {
  const onVerify = () => {
    console.log("verify clicked...");
  };
  return (
    <div className="text-white p-2 flex flex-col gap-2">
      <p>Credentials</p>
      <BlurredCard bgColor="#D91F05" className={"p-4"}>
        <div className="z-1 grid grid-cols-[60px_1fr] grid-rows-2 gap-2 place-content-center">
          <section className="row-span-2 text-white flex items-center justify-center">
            <div className="rounded-full w-[60px] h-[60px] bg-fwNewRed flex items-center justify-center">
              <EyeSlashIcon className="h-6 w-6 text-white" />
            </div>
          </section>
          <p className="font-semibold text-lg">Identity verified</p>
          <p className="font-light text-gray-300">
            Verify your indentity to receive credentials
          </p>
        </div>
        <div className="flex justify-between items-center w-full mt-3 px-4">
          <p className="font-semibold text-md">National ID/FAYDAA Supported</p>
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
    </div>
  );
}

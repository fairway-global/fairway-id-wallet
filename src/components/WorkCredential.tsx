"use client";
import Image from "next/image";
import BlurredCard from "./ui/BlurredCard";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { IWorkCredential } from "@/utils/types";
import { useRouter } from "next/navigation";

interface IWorkCredentialProps {
  workCredential: IWorkCredential;
  inDetailView?: boolean;
}

const WorkCredential: FC<IWorkCredentialProps> = ({
  workCredential,
  inDetailView = false,
}) => {
  const router = useRouter();

  return (
    <BlurredCard
      bgColor="#fdb82c"
      className={"p-4 w-full"}
      onClick={() =>
        router.push(`/dashboard/credentials/work/${workCredential.id}`)
      }
    >
      <div className="z-1 grid grid-cols-[36px_1fr] grid-rows-2 gap-x-2 gap-y-0 place-content-center">
        <section className="row-span-2 text-white flex items-center justify-center">
          <div className="rounded-full w-[36px] h-[36px] bg-fwOrange flex items-center justify-center">
            <BriefcaseIcon className="h-6 w-6 text-white" />
          </div>
        </section>
        <p className="font-semibold text-lg text-white">Work Credential</p>
        <p className="font-light text-gray-300 text-sm">
          {workCredential.companyName}
        </p>
        {!workCredential.signed ? (
          <>
            <Image
              className="absolute top-0 right-3 h-12 w-12 text-fwOrange"
              alt="National ID/Fayda Logo"
              src={"/bookmark.svg"}
              height={60}
              width={60}
            />
            <p className="z-10 text-white absolute top-1 right-5 text-sm">
              NEW
            </p>
          </>
        ) : (
          <div className="w-7 h-7 bg-fwOrange p-1 rounded-full absolute top-3 right-3">
            <Image
              alt="National ID/Fayda Logo"
              src={"/verified-white.svg"}
              height={20}
              width={20}
            />
          </div>
        )}
      </div>
      {!inDetailView && (
        <div className="flex justify-between items-center w-full mt-3 px-2">
          <p className="font-medium text-md text-white">
            {workCredential.title}
          </p>
          <p className="text-fwNewGreen font-medium">
            {workCredential.issuedDate}
          </p>
        </div>
      )}
    </BlurredCard>
  );
};

export default WorkCredential;

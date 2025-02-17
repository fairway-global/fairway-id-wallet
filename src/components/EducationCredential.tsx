"use client";
import BlurredCard from "./ui/BlurredCard";
import { FC } from "react";
import { IEducationCredential } from "@/utils/types";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface IEducationCredentialProps {
  educationCredential: IEducationCredential;
  className?: string;
}

const EducationCredential: FC<IEducationCredentialProps> = ({
  educationCredential,
  className,
}) => {
  const router = useRouter();
  return (
    <BlurredCard
      bgColor="#AB00E7"
      className={`${className} p-4`}
      onClick={() =>
        router.push(
          `/dashboard/credentials/education/${educationCredential.id}`
        )
      }
    >
      <div
        className={`${
          !educationCredential.signed ? "opacity-50" : ""
        } z-1 grid grid-cols-[36px_1fr] grid-rows-2 gap-x-2 gap-y-0 place-content-center`}
      >
        <section className="row-span-2 text-white flex items-center justify-center">
          <div className="rounded-full w-[36px] h-[36px] bg-fwNewPurple flex items-center justify-center">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
        </section>
        <p className="font-semibold text-lg">Education Credential</p>
        <p className="font-light text-gray-300 text-sm">
          {educationCredential.universityName}
        </p>
        {!educationCredential.signed ? (
          <>
            {/* <Image
              className="absolute top-0 right-3 h-12 w-12 text-fwOrange"
              alt="National ID/Fayda Logo"
              src={"/bookmark.svg"}
              height={40}
              width={120}
            /> */}
            <p className="z-10 text-white absolute top-1 right-5 text-sm">
              Pending
            </p>
          </>
        ) : (
          <div className="w-7 h-7 bg-fwNewPurple p-1 rounded-full absolute top-3 right-3">
            <Image
              alt="National ID/Fayda Logo"
              src={"/verified-white.svg"}
              height={20}
              width={20}
            />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center w-full mt-3 px-2">
        <p className="font-medium text-md text-white">
          {educationCredential.title}
        </p>
        <p className="text-fwNewGreen font-medium">
          {educationCredential.signed ? educationCredential.issuedDate : ""}
        </p>
      </div>
    </BlurredCard>
  );
};

export default EducationCredential;

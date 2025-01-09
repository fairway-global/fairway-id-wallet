"use client";
import BlurredCard from "./ui/BlurredCard";
import { FC } from "react";
import { IEducationCredential } from "@/utils/types";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

interface IEducationCredentialProps {
  educationCredential: IEducationCredential;
}

const EducationCredential: FC<IEducationCredentialProps> = ({
  educationCredential,
}) => {
  return (
    <BlurredCard bgColor="#AB00E7" className={"p-4"}>
      <div className="z-1 grid grid-cols-[36px_1fr] grid-rows-2 gap-x-2 gap-y-0 place-content-center">
        <section className="row-span-2 text-white flex items-center justify-center">
          <div className="rounded-full w-[36px] h-[36px] bg-fwNewPurple flex items-center justify-center">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
        </section>
        <p className="font-semibold text-lg">Education Credential</p>
        <p className="font-light text-gray-300 text-sm">
          {educationCredential.universityName}
        </p>
      </div>
      <div className="flex justify-between items-center w-full mt-3 px-2">
        <p className="font-medium text-md text-white">
          {educationCredential.title}
        </p>
        <p className="text-fwNewGreen font-medium">
          {educationCredential.issuedDate}
        </p>
      </div>
    </BlurredCard>
  );
};

export default EducationCredential;

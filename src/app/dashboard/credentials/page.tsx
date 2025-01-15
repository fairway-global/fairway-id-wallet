"use client";

import BlurredCard from "../../../components/ui/BlurredCard";
import { EyeSlashIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
import Image from "next/image";
import { IEducationCredential, IWorkCredential } from "@/utils/types";
import WorkCredential from "@/components/WorkCredential";
import EducationCredential from "@/components/EducationCredential";

export default function Credentials() {
  const [isIdentityVerified, setIsIDentityVerified] = useState(true);
  const [educationVerified, setEducationVerified] = useState(true);
  const [fullName, setFullName] = useState("Biniam Beyene Bayisa");
  const [educationCredentials, setEducationCredentials] = useState<
    IEducationCredential[]
  >([]);
  const [workCredentials, setWorkCredentials] = useState<IWorkCredential[]>([]);
  const onVerify = () => {
    console.log("verify clicked...");
  };

  useEffect(() => {
    const uni: IEducationCredential = {
      id: 223,
      universityId: 1,
      universityName: "Addis Ababa University",
      title: "Bsc in Accounting",
      gpa: 3.5,
      graduationDate: "02/2023",
      issuedDate: "02/02/2023",
      status: true,
      isNew: false,
    };
    setEducationCredentials([uni]);
    const work: IWorkCredential = {
      id: 234,
      title: "Junior Accountant",
      companyName: "ABZ Technologies",
      issuedDate: "21/02/2024",
      isNew: true,
      active: true,
      signed: false,
    };
    setWorkCredentials([work]);
  }, []);

  return (
    <div className="text-white p-2 flex flex-col gap-3">
      {!isIdentityVerified ? (
        <BlurredCard bgColor="#D91F05" className={"p-4"}>
          <div className="z-1 grid grid-cols-[60px_1fr] grid-rows-2 gap-2 place-content-center">
            <section className="row-span-2 text-white flex items-center justify-center">
              <div className="rounded-full w-[60px] h-[60px] bg-fwNewRed flex items-center justify-center">
                <EyeSlashIcon className="h-6 w-6 text-white" />
              </div>
            </section>
            <p className="font-semibold text-lg">Identity Unverified</p>
            <p className="font-light text-gray-300">
              Verify your indentity to receive credentials
            </p>
          </div>
          <div className="flex justify-between items-center w-full mt-3 px-4">
            <p className="font-semibold text-md">
              National ID/FAYDAA Supported
            </p>
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
              <p className="font-light text-gray-300">{fullName}</p>
            </section>
          </div>
        </BlurredCard>
      )}
      {isIdentityVerified && (
        <div className="h-[114px] rounded-xl p-6 bg-fwNewGreen grid grid-cols-[1fr_75px] grid-rows-1 w-full">
          <div className="flex flex-col gap-1 text-gray-700 font-semibold">
            <p className="text-sm">FAYDAA</p>
            <p className="text-lg">Ethiopian National ID</p>
          </div>
          <div className="flex justify-center items-center bg-[#00A385] w-[75px] h-[75px] rounded-full">
            <Image
              alt="National ID/Fayda Logo"
              src={"/verified-white.svg"}
              height={50}
              width={50}
            />
          </div>
        </div>
      )}

      {educationVerified &&
        educationCredentials.map(
          (educationCredential: IEducationCredential, key) => (
            <EducationCredential
              key={key}
              educationCredential={educationCredential}
            />
          )
        )}
      {workCredentials?.length &&
        workCredentials.map((workCredential: IWorkCredential, key) => (
          <WorkCredential key={key} workCredential={workCredential} />
        ))}
    </div>
  );
}

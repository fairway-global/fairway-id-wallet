"use client";
import { IEducationCredential } from "@/utils/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FingerPrintIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";
import EducationCredential from "@/components/EducationCredential";
import dayjs from "dayjs";

export default function WorkCredentialDetail() {
  const [educationCredential, setEducationCredential] =
    useState<IEducationCredential>({} as IEducationCredential);

  useEffect(() => {
    // Get WorkCrednetial from ID:
    const uni: IEducationCredential = {
      id: 23,
      universityId: 1,
      universityName: "Addis Ababa University",
      title: "Bsc in Accounting",
      gpa: 3.5,
      graduationDate: "02/2023",
      issuedDate: "02/02/2023",
      status: true,
      isNew: false,
      signed: false,
    };
    setEducationCredential(uni);
  }, []);

  const HR = () => (
    <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-400 w-full" />
  );

  return (
    <div className="flex flex-col items-center text-white">
      <EducationCredential
        educationCredential={educationCredential}
        className={"w-full"}
      />
      <div
        className={`rounded-b-2xl p-4 flex flex-col items-center h-auto bg-[rgba(255,255,255,0.15)] backdrop-blur-xl border border-[rgba(255,255,255,0.2)] shadow-lg w-[80%]`}
      >
        <Image
          alt="National ID/Fayda Logo"
          src={"/verified-purple.svg"}
          height={72}
          width={72}
          className={"mt-2"}
        />
        <HR />
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-xs">UNIVERSITY</p>
          <p className="text-[20px] font-bold">
            {educationCredential.universityName}
          </p>
        </div>
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">GPA</p>
            <p className="text-[20px] font-bold">{educationCredential.gpa}</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">GRADUATION DATE</p>
            <p className="text-[20px] font-bold">
              {dayjs().format("DD.MM.YYYY")}
            </p>
          </div>
        </div>
        <HR />
        <div className="grid grid-cols-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-xs">ISSUED DATE</p>
            <p className="text-[20px] font-bold">{educationCredential.gpa}</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full">
            <p className="text-xs">VALID</p>
            <p className="text-[20px] font-bold">&#8734;</p>
          </div>
        </div>

        {!educationCredential.signed && (
          <>
            <HR />
            <p className="text-gray-200">Education Credential Received</p>
          </>
        )}
        <HR />
        <div className="flex justify-between w-full gap-2">
          <Button
            size="sm"
            className={"flex justify-center text-white bg-fwNewGreen w-full"}
            onPress={() => {
              if (!educationCredential.signed) {
                setEducationCredential((educationCredential) => ({
                  ...educationCredential,
                  signed: true,
                }));
              }
            }}
          >
            {educationCredential.signed ? (
              <>
                <FingerPrintIcon className="h-4 w-4 text-white" />
                Accept
              </>
            ) : (
              <>
                Share
                <ShareIcon className="h-4 w-4 text-white" />
              </>
            )}
          </Button>
          <Button
            size="sm"
            className={
              "flex justify-center text-fwNewRed border border-fwNewRed bg-transparent w-full"
            }
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

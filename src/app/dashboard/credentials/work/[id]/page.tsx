"use client";

import WorkCredential from "@/components/WorkCredential";
import { IWorkCredential } from "@/utils/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FingerPrintIcon,
  LinkIcon,
  BuildingOffice2Icon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";

export default function WorkCredentialDetail() {
  const [workCredential, setWorkCredential] = useState<IWorkCredential>(
    {} as IWorkCredential
  );

  useEffect(() => {
    const work: IWorkCredential = {
      id: 24,
      title: "Junior Accountant",
      companyName: "ABZ Technologies",
      issuedDate: "21/02/2024",
      isNew: true,
      active: true,
      signed: false,
      did: "",
    };
    setWorkCredential(work);
  }, []);

  const HR = () => (
    <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-400 w-full" />
  );

  return (
    <div className="flex flex-col items-center text-white">
      <WorkCredential workCredential={workCredential} inDetailView={true} />
      <div
        className={`rounded-b-2xl p-4 flex flex-col items-center h-auto bg-[rgba(255,255,255,0.15)] backdrop-blur-xl border border-[rgba(255,255,255,0.2)] shadow-lg w-[75%]`}
      >
        <Image
          alt="National ID/Fayda Logo"
          src={"/verified-orange.svg"}
          height={72}
          width={72}
          className={"mt-2"}
        />
        <HR />
        {!workCredential.signed && (
          <>
            <p>Work Contract Credential Received</p>
            <div className="flex gap-6 items-center text-gray-100 mt-2">
              <FingerPrintIcon className="h-10 w-10" />
              <LinkIcon className="h-10 w-10 transform rotate-45" />
              <BuildingOffice2Icon className="h-10 w-10" />
            </div>
          </>
        )}
        <HR />
        <Button
          size="sm"
          className={
            "flex justify-center text-fwOrange border font-medium border-fwOrange bg-transparent w-full"
          }
        >
          <DocumentArrowDownIcon className="h-4 w-4 text-fwOrange" />
          Download Contract
        </Button>
        <HR />
        <div className="flex justify-between w-full gap-2">
          <Button
            size="sm"
            className={"flex justify-center text-white bg-fwNewGreen w-full"}
          >
            <FingerPrintIcon className="h-4 w-4 text-white" />
            Sign Digitally
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

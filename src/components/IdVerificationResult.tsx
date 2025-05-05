"use client";
import Image from "next/image";
import {
  ExclamationCircleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

const IDVerificationResult = () => {
  const router = useRouter();
  const [isSuccessful] = useState(true);
  // FIXME: This should be replaced with the actual state management solution
  const identityCredential = {
    fullName: "John Doe",
    birthDate: "01/01/1990",
    providerIdentifier: "123456789",
  };

  const onEditDetails = () => {
    console.log("on Edit clicked");
    router.back();
  };

  const onReload = () => {
    console.log("on Reload");
  };

  return (
    <div className={"flex flex-col"}>
      <div className="w-[180px] h-[160px] border-2 border-dashed grid place-items-center mb-2">
        <Image
          alt="National ID/Fayda Logo"
          src={isSuccessful ? "/nid-result.png" : "/not-found.svg"}
          height={180}
          width={120}
        />
      </div>
      {isSuccessful ? (
        <>
          <p className="text-fwNewGreen flex">
            <span>{identityCredential?.fullName}</span>
            <CheckBadgeIcon className="h-6 w-6 pl-2 fill:fwNewGreen" />
          </p>
          <p className="flex items-center text-fwNewGreen">
            <span>{identityCredential?.birthDate}</span>
            <CheckBadgeIcon className="h-6 w-6 pl-2 fill:fwNewGreen" />
          </p>
          <p className="flex items-center text-fwNewGreen">
            <span>FCN :{identityCredential?.providerIdentifier}</span>
            <CheckBadgeIcon className="h-6 w-6 pl-2 fill:fwNewGreen" />
          </p>
        </>
      ) : (
        <>
          <p className="text-fwNewRed flex">
            <span>{identityCredential?.fullName}</span>
            <ExclamationCircleIcon className="h-6 w-6 text-fwNewRed" />
          </p>
          <p className="flex items-center text-fwNewRed">
            <span>{identityCredential?.birthDate}</span>
            <ExclamationCircleIcon className="h-6 w-6 text-fwNewRed" />
          </p>
          <p className="flex items-center text-fwNewRed">
            <span>FCN :{identityCredential?.providerIdentifier}</span>
            <ExclamationCircleIcon className="h-6 w-6 text-fwNewRed" />
          </p>
        </>
      )}
      {isSuccessful ? (
        <>
          <Image
            alt="Id verfied success"
            src="/id-verified.svg"
            className={"mx-auto my-1"}
            height={90}
            width={60}
          />
          <Button
            className={
              "bg-fwNewGreen text-black rounded-full max-w-64 mt-4 text-md"
            }
          >
            Verification Successful
          </Button>
        </>
      ) : (
        <>
          <Button
            className={
              "bg-fwNewRed text-white rounded-full max-w-96 mt-4 text-lg"
            }
          >
            Verification Failed
          </Button>
          <p
            onClick={onEditDetails}
            className="flex items-center gap-1 text-sm text-white mt-3 mb-1 pl-2"
          >
            Edit Details
            <PencilSquareIcon className="h-4 w-4" />
          </p>
          <p
            onClick={onReload}
            className="flex items-center gap-1 text-sm text-white my-1 pl-2"
          >
            Retry
            <ArrowPathIcon className="h-4 w-4" />
          </p>
        </>
      )}
    </div>
  );
};

export default IDVerificationResult;

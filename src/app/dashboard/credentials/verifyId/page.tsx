"use client";

import Image from "next/image";
import { Input } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { Button } from "@nextui-org/button";
import { useDateFormatter } from "@react-aria/i18n";
import { getLocalTimeZone } from "@internationalized/date";
import { PencilIcon } from "@heroicons/react/24/outline";
import IDVerificationResult from "@/app/dashboard/credentials/verificationResult/page";

export default function VerifyId() {
  const [editingMode, setEditingMode] = useState(true);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  let formatter = useDateFormatter();

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    setEditingMode(false);
  };

  const EditIcon = () => (
    <PencilIcon
      onClick={() => setEditingMode(true)}
      className="h-3 w-3 text-white"
    />
  );

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={onSave}
        className="flex-col gap-4 flex items-center max-w-80 bg-black"
      >
        <Image
          alt="National ID/Fayda Logo"
          src="/nid-logo.png"
          height={300}
          width={300}
        />
        {editingMode ? (
          <>
            <Input
              className="w-full"
              label="Full name"
              placeholder="Enter your full name here"
              type="text"
              variant="flat"
              name={"fullName"}
              isRequired
              onChange={(e: any) => setFullName(e.target.value)}
            />
            <DatePicker
              isRequired
              name={"birthDate"}
              className="w-full"
              label="Birth date"
              onChange={(value: any) => setBirthDate(value)}
            />
          </>
        ) : (
          <div className="text-white text-left text-md font-semibold flex flex-col gap-2 w-full">
            <p className="flex gap-2 items-center">
              Full Name{" "}
              <span>
                <EditIcon />
              </span>
            </p>
            <p className="text-fwNewGreen">{fullName}</p>
            <p className="flex gap-2 items-center">
              Birth Date{" "}
              <span>
                <EditIcon />
              </span>
            </p>
            <p className="text-fwNewGreen">
              {formatter.format(birthDate.toDate(getLocalTimeZone()))}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {editingMode ? (
            <Button
              type="submit"
              color="warning"
              size="sm"
              className={"flex justify-between w-max"}
            >
              Save
            </Button>
          ) : (
            <>
              <Button
                color="default"
                onPress={() => setEditingMode(false)}
                size="sm"
                className={"flex justify-between w-max"}
              >
                Edit
              </Button>
              <Button
                onPress={() => console.log("turn on Scanning")}
                color="success"
                size="sm"
                className={"flex justify-between w-max"}
              >
                Scan
              </Button>
            </>
          )}
        </div>
        <IDVerificationResult />
      </form>
    </div>
  );
}

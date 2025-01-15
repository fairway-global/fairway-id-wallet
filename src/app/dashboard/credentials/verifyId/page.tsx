"use client";

import Image from "next/image";
import { DatePicker, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { Button } from "@nextui-org/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import IDVerificationResult from "@/components/IdVerificationResult";
import dayjs from "dayjs";
import { parseDate, CalendarDate } from "@internationalized/date";

export default function VerifyId() {
  const [editingMode, setEditingMode] = useState(false);

  const [fullName, setFullName] = useState("Biniam Beyene Bayisa");
  const [birthDate, setBirthDate] = useState(dayjs("2019-01-25"));

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    setEditingMode(false);
  };

  const EditIcon = () => (
    <PencilIcon
      onClick={() => {
        console.log("clicked edit...");
        setEditingMode(true);
      }}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
            />
            <DatePicker
              isRequired
              name="birthDate"
              className="w-full"
              label="Birth date"
              value={parseDate(dayjs().format("YYYY-MM-DD"))} // Convert Dayjs to CalendarDate-compatible format
              onChange={(value: CalendarDate | null) => {
                if (value) {
                  setBirthDate(dayjs(value.toString())); // Convert CalendarDate back to Dayjs if needed
                }
              }}
            />
            ;
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
              {dayjs(birthDate).format("YYYY-MM-DD")}
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

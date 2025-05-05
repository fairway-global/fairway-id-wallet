"use client";

import Image from "next/image";
import { DatePicker, Input } from "@heroui/react";
import { FormEvent, useState } from "react";
import { Button } from "@heroui/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { parseDate, CalendarDate } from "@internationalized/date";
import { useRouter } from "next/navigation";
import useLoading from "@/hooks/useLoading";

export default function VerifyId() {
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [editingMode, setEditingMode] = useState(true);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState(dayjs());
  const [faydaNumber, setFaydaNumber] = useState("XXXX-XXXX-XXXX-XXXX");

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (editingMode) {
      setEditingMode(false);
      return;
    }
    setEditingMode(false);
    startLoading();
    setTimeout(() => {
      stopLoading();
      router.push(
        `/dashboard/credentials/verifyId/otp?fullName=${fullName}&birthDate=${birthDate}&faydaNumber=${faydaNumber}`
      );
    }, 3000);
  };

  const formatFaydaNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const limitedValue = numericValue.slice(0, 16);
    return limitedValue.replace(/(\d{4})(?=\d)/g, "$1-");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatFaydaNumber(inputValue);
    const numericValue = formattedValue.replace(/-/g, "");
    setFaydaNumber(numericValue);
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
              isRequired={true}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
            />
            <DatePicker
              showMonthAndYearPickers={true}
              isRequired={true}
              name="birthDate"
              className="w-full text-white"
              label="Birth date"
              value={parseDate(dayjs(birthDate).format("YYYY-MM-DD"))} // Convert Dayjs to CalendarDate-compatible format
              onChange={(value: CalendarDate | null) => {
                if (value) {
                  setBirthDate(dayjs(value.toString())); // Convert CalendarDate back to Dayjs if needed
                }
              }}
            />
            <Input
              className="w-full"
              label="Fayda FIN/FAN "
              placeholder="XXXX-XXXX-XXXX-XXXX"
              type="text"
              variant="flat"
              name="faydaNumber"
              isRequired={true}
              minLength={19}
              maxLength={19} // 16 digits + 3 dashes
              value={formatFaydaNumber(faydaNumber)} // Display the formatted value
              onChange={handleInputChange}
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
              {dayjs(birthDate).format("YYYY-MM-DD")}
            </p>
            <p className="flex gap-2 items-center">
              FAN/FIN Number{" "}
              <span>
                <EditIcon />
              </span>
            </p>
            <p className="text-fwNewGreen">{faydaNumber}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-white text-xs">
            By proceeding, you are giving consentfor Fairway Plc to store your
            personal info, and agree to the terms and conditions.
          </p>
          {editingMode ? (
            <Button
              type="submit"
              color="warning"
              size="sm"
              className={"flex justify-between"}
            >
              Save
            </Button>
          ) : (
            <>
              <Button
                color="default"
                onPress={() => {
                  setEditingMode(true);
                }}
                size="sm"
                className={"flex justify-between"}
              >
                Edit
              </Button>
              <Button
                type="submit"
                color="success"
                size="sm"
                className={"flex justify-between"}
                isLoading={isLoading}
              >
                Verify
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

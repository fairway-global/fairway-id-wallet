"use client";

import Image from "next/image";
import { DatePicker, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { Button } from "@nextui-org/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { parseDate, CalendarDate } from "@internationalized/date";
import { useRouter } from "next/router";

export default function VerifyId() {
  const router = useRouter();
  const [editingMode, setEditingMode] = useState(false);

  const [fullName, setFullName] = useState("Biniam Beyene Bayisa");
  const [birthDate, setBirthDate] = useState(dayjs("2019-01-25"));
  const [faydaNumber, setFaydaNumber] = useState("XXXX-XXXX-XXXX-XXXX");

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    setEditingMode(false);
    router.push("/");
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
              isRequired
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
            />
            <DatePicker
              isRequired
              name="birthDate"
              className="w-full text-white"
              label="Birth date"
              value={parseDate(dayjs().format("YYYY-MM-DD"))} // Convert Dayjs to CalendarDate-compatible format
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
              isRequired
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

        <div className="flex gap-2">
          {editingMode ? (
            <Button
              onPress={() => setEditingMode(false)}
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
                onPress={() => {
                  setEditingMode(true);
                  setResultGiven(false);
                }}
                size="sm"
                className={"flex justify-between w-max"}
              >
                Edit
              </Button>
              <Button
                type="submit"
                color="success"
                size="sm"
                className={"flex justify-between w-max"}
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

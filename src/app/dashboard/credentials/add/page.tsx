"use client";

import { DatePicker, Input, Select, SelectItem } from "@heroui/react";
import { FormEvent, useState } from "react";
import { Button } from "@heroui/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { parseDate, CalendarDate } from "@internationalized/date";
import { useRouter } from "next/navigation";
import useLoading from "@/hooks/useLoading";
import { IEducationCredential } from "../../../../utils/types";
import useStore from "../../../../store/store";
import { toast } from "sonner";

const BIN_ID = "67ac8637ad19ca34f8007afc"; // Replace with your JSONBin.io Bin ID
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const MASTER_KEY =
  "$2a$10$oZihc1sipw8kPQGERtHtpO8UtsmZAvkJkFmE1c3/MnsIoA8/Ykdoi";
const XACCESS_KEY =
  "$2a$10$u10HoxyJOt6bMT4cyqKMa.5Re62ZQQ804lLGhFqolgJfT7agSVQtG";

export default function VerifyId() {
  const { addEducationCredential } = useStore();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();

  //   const onSave = (e: FormEvent) => {
  //     e.preventDefault();
  //     cosnt;
  //     startLoading();
  //     setTimeout(() => {
  //       stopLoading();
  //       router.push(
  //         `/dashboard/credentials/verifyId/otp?fullName=${fullName}&birthDate=${birthDate}&faydaNumber=${faydaNumber}`
  //       );
  //     }, 3000);
  //   };

  const degrees = [
    { key: "Diploma", label: "Diploma" },
    { key: "Bachelors", label: "Bachelors" },
    { key: "Masters", label: "Masters" },
    { key: "PHD", label: "PHD" },
    { key: "Other", label: "Other" },
  ];

  const universities = [{ key: "AASTU", label: "AASTU" }];

  const programs = [
    { key: "Architecture", label: "Architecture" },
    { key: "Computer Science", label: "Computer Science" },
  ];

  // Mock function to generate a unique ID (for demonstration purposes)
  const generateId = () => Math.floor(Math.random() * 10000);

  // Mock function to get the current date in YYYY-MM-DD format
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    startLoading();
    // Extract form data
    const formData = new FormData(event.currentTarget);

    // Map form data to the IEducationCredential interface
    const educationCredential: IEducationCredential = {
      fullName: formData.get("fullName")?.toString() || "Unknown Name",
      id: generateId(), // Generate a unique ID
      did: "did:example:123456789", // Default DID (Decentralized Identifier)
      title:
        `${formData.get("credentialLevel")} in ${formData
          .get("program")
          ?.toString()}` || "Unknown Program", // Program name from the form
      universityId: 1, // Default university ID (can be fetched from a database)
      universityName:
        formData.get("universityName")?.toString() || "Unknown University", // University name from the form
      gpa: 3.5, // Default GPA (can be updated if GPA field is added to the form)
      graduationDate:
        formData.get("yearOfEntry")?.toString() || getCurrentDate(), // Year of entry from the form (or current date as fallback)
      issuedDate: getCurrentDate(), // Default issued date (current date)
      expiryDate: undefined, // No expiry date by default
      status: true, // Default status (active)
      isNew: true, // Default isNew (true for newly created credentials)
      signed: false, // Default signed status (false by default)
    };

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Only include the API key header if needed (for private bins)
          ...(MASTER_KEY && { "X-Master-Key": MASTER_KEY }),
          // Optional: if you want the bin to be public, you can explicitly set this
          "X-Access-Key": XACCESS_KEY,
        },
        body: JSON.stringify(educationCredential),
      });

      // Log the response (for debugging, check your browser's dev tools console)
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);
      toast("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      toast("Error...Failed");
    } finally {
      stopLoading();
      addEducationCredential(educationCredential);
      router.replace("/dashboard/credentials");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={onSave}
        className="flex-col gap-4 flex items-center max-w-80  text-white"
      >
        <p>Add Your Education Details</p>
        <Input
          className="w-full"
          label="Full Name"
          placeholder="Biniam Beyene Bayisa"
          type="text"
          variant="flat"
          name={"fullName"}
          isRequired={true}
        />
        <Select
          className="max-w-xs text-white"
          label="University Name"
          placeholder="AASTU"
          name={"universityName"}
        >
          {universities.map((uni) => (
            <SelectItem key={uni.key}>{uni.label}</SelectItem>
          ))}
        </Select>
        <Select
          className="max-w-xs text-white"
          label="Program"
          placeholder="Architecture"
          name={"program"}
        >
          {programs.map((prog) => (
            <SelectItem key={prog.key}>{prog.label}</SelectItem>
          ))}
        </Select>
        <DatePicker
          showMonthAndYearPickers={true}
          visibleMonths={0}
          isRequired={true}
          name="yearOfEntry"
          className="w-full text-white"
          label="Year of Entry"
          //   value={parseDate(dayjs(birthDate).format("YYYY-MM-DD"))} // Convert Dayjs to CalendarDate-compatible format
          //   onChange={(value: CalendarDate | null) => {
          //     if (value) {
          //       setBirthDate(dayjs(value.toString())); // Convert CalendarDate back to Dayjs if needed
          //     }
          //   }}
        />
        <Input
          className="w-full"
          label="Student ID No"
          type="text"
          variant="flat"
          name="studentId"
          isRequired={true}
        />
        <Select
          className="max-w-xs text-white"
          label="Credential Type"
          placeholder="Select your Level of Credential"
          name="credentialLevel"
        >
          {degrees.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>

        <div className="flex flex-col gap-2">
          <p className="text-white text-xs">
            By proceeding, you are giving consentfor Fairway Plc to store your
            personal info, and agree to the terms and conditions.
          </p>
          <Button
            type="submit"
            color="warning"
            size="sm"
            className={"flex justify-between"}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
}

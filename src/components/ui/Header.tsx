"use client";

import { usePathname, useRouter } from "next/navigation";
import { BellIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import usePageTitles from "@/hooks/usePageTitles";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { useAgentStore } from "@/store/agentStore";
import {
  FAYDA_FAN_NUMBER_KEY,
  FAYDA_LOGIN_ROUTE,
  FAYDA_SESSION_KEY,
  FAYDA_PROFILE_IMAGE_KEY,
  FAYDA_PROFILE_NAME_KEY,
} from "@/constants/auth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { title, showBackBtn } = usePageTitles(pathname);
  const [name, setName] = useState("");
  const [fanNumber, setFanNumber] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const { stopAgent } = useAgentStore();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncProfile = () => {
      const storedName =
        window.localStorage?.getItem(FAYDA_PROFILE_NAME_KEY) ?? "";
      const storedFan =
        window.localStorage?.getItem(FAYDA_FAN_NUMBER_KEY) ?? "";
      const storedAvatar =
        window.localStorage?.getItem(FAYDA_PROFILE_IMAGE_KEY) ?? undefined;
      setName(storedName);
      setFanNumber(storedFan);
      setAvatar(storedAvatar);
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const handleBack = () => {
    router.back(); // Navigate back
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
      window.localStorage.removeItem(FAYDA_SESSION_KEY);
      window.localStorage.removeItem(FAYDA_FAN_NUMBER_KEY);
      window.localStorage.removeItem(FAYDA_PROFILE_NAME_KEY);
      window.localStorage.removeItem(FAYDA_PROFILE_IMAGE_KEY);
    }
    await stopAgent();
    } catch (error) {
      console.error("Failed to stop agent on logout", error);
    } finally {
      router.replace(FAYDA_LOGIN_ROUTE);
    }
  };

  return (
    <div className="p-4 flex flex-row justify-between items-center h-16 bg-transparent text-white">
      <div className="flex gap-1">
        <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <button className="flex gap-2 items-center rounded-full focus:outline-none">
            <Avatar
              size="sm"
              src={avatar}
              name={name || "Fairway Pro"}
              className="cursor-pointer"
            />
              <p className="text-sm text-gray-200 font-medium text-left">
                Hi, <b>{name || "Fairway Pro"}</b>
              </p>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile actions" variant="faded">
            <DropdownItem key="fan" className="text-xs text-gray-500" isReadOnly>
              {fanNumber ? `FAN: ${fanNumber}` : "FAN: -"}
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-red-500"
              onPress={handleLogout}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {showBackBtn && (
          <Button
            onPress={handleBack}
            size="sm"
            className={
              "flex items-center text-gray-400 hover:text-white transition bg-transparent px-0 w-min"
            }
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
        )}
      </div>
      <p className="text-md font-semibold">{title}</p>

      <div className="">
        <BellIcon className="w-5 h-5 inline-block text-gray-400" />
      </div>
    </div>
  );
}

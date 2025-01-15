"use client";

import { usePathname, useRouter, useHi } from "next/navigation";
import { BellIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/react";
import usePageTitles from "@/utils/usePageTitles";
import { Button } from "@nextui-org/button";

export default function Header() {
  const router = useRouter();

  const pathname = usePathname();
  const title = usePageTitles(pathname);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); // Navigate back
    }
  };

  return (
    <div className="p-4 flex flex-row justify-between items-center h-16 bg-transparent text-white">
      <div className="flex gap-1">
        <Avatar
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
        {window.history.length > 1 && (
          <Button
            onPress={handleBack}
            size="sm"
            className={
              "flex items-center text-gray-400 hover:text-white transition bg-transparent"
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

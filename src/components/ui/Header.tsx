"use client";

import { usePathname, useRouter } from "next/navigation";
import { BellIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/react";
import usePageTitles from "@/hooks/usePageTitles";
import { Button } from "@nextui-org/button";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { title, showBackBtn } = usePageTitles(pathname);

  const handleBack = () => {
    router.back(); // Navigate back
  };

  return (
    <div className="p-4 flex flex-row justify-between items-center h-16 bg-transparent text-white">
      <div className="flex gap-1">
        <Avatar
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
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

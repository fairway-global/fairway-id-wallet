"use client";

import { usePathname } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/react";
import usePageTitles from "@/utils/usePageTitles";

export default function Header() {
  const pathname = usePathname();
  const title = usePageTitles(pathname);

  return (
    <div className="p-4 flex flex-row justify-between items-center h-16 bg-transparent text-white">
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <p className="text-md font-semibold">{title}</p>

      <div className="">
        <BellIcon className="w-5 h-5 inline-block text-gray-400" />
      </div>
    </div>
  );
}

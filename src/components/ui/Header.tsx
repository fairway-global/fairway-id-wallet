"use client";

import { usePathname } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/react";

export default function Header() {
  const pathname = usePathname();

  // Map routes to dynamic titles
  const titles: { [key: string]: string } = {
    "/dashboard": "Credentials",
    "/dashboard/scan": "Scan",
    "/dashboard/settings": "Settings",
  };

  const title = titles[pathname] || "Dashboard";

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

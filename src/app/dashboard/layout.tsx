"use client";

import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { CameraIcon, ChartPieIcon, CogIcon } from "@heroicons/react/24/outline";
import Header from "@/components/ui/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathname.split("/").pop() || "credentials";

  const handleTabChange = (key: string) => {
    router.push(`/dashboard/${key === "credentials" ? "" : key}`);
  };

  return (
    <div className="bg-black h-screen grid grid-rows-[64px_1fr_56px]">
      <Header />

      {/* Dynamic Content */}
      <main className="p-4 overflow-y-auto">{children}</main>
      {/* Tabs at the Bottom */}
      <Tabs
        aria-label="Dashboard Navigation"
        selectedKey={activeTab}
        onSelectionChange={(key: string) => handleTabChange(key)}
        className="rounded-full backdrop-blur-lg bg-white/10 p-2 shadow-lg w-full fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-xl"
        variant="solid"
        fullWidth={true}
      >
        <Tab
          key="credentials"
          title={
            <ChartPieIcon
              className={`w-6 h-6 ${
                activeTab === "credentials"
                  ? "text-fwOrange"
                  : "text-white hover:text-fwOrange"
              }`}
            />
          }
        />
        <Tab
          key="scan"
          title={
            <CameraIcon
              className={`w-6 h-6 ${
                activeTab === "scan"
                  ? "text-fwOrange"
                  : "text-white hover:text-fwOrange"
              }`}
            />
          }
        />
        <Tab
          key="settings"
          title={
            <CogIcon
              className={`w-6 h-6 ${
                activeTab === "settings"
                  ? "text-fwOrange"
                  : "text-white hover:text-fwOrange"
              }`}
            />
          }
        />
      </Tabs>
    </div>
  );
}

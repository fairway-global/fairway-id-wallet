"use client";

import React, { Key, useLayoutEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { CameraIcon, ChartPieIcon, CogIcon } from "@heroicons/react/24/outline";
import Header from "@/components/ui/Header";
import { useAgentStore } from "../../store/agentStore";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { agent, agentLoading } = useAgentStore();
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathname.split("/").pop() || "credentials";

  const handleTabChange = (key: string) => {
    router.push(`/dashboard/${key === "credentials" ? "" : key}`);
  };

  // check if there is an agent if there is an agent then send to home
  useLayoutEffect(() => {
    setTimeout(() => {
      if (!agent && agentLoading) {
        router.push("/");
        toast.warning("Wallet is not found, please create or recover it.");
      }
    }, 1500);
  }, []);

  return (
    <div
      className="bg-black grid grid-rows-[64px_1fr_56px]"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <Header />

      {/* Dynamic Content */}
      <main className="p-4 overflow-y-auto">{children}</main>
      {/* Tabs at the Bottom */}
      <Tabs
        aria-label="Dashboard Navigation"
        selectedKey={activeTab}
        onSelectionChange={(key: Key) => handleTabChange(key as string)}
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

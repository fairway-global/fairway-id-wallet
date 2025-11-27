"use client";

import React, { Key, useEffect, useLayoutEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { CameraIcon, ChartPieIcon, CogIcon } from "@heroicons/react/24/outline";
import Header from "@/components/ui/Header";
import { useAgentStore } from "../../store/agentStore";
import { toast } from "sonner";
import { config } from "@/config";
import { FAYDA_LOGIN_ROUTE, FAYDA_SESSION_KEY } from "@/constants/auth";

const BYPASS_FAYDA = process.env.NEXT_PUBLIC_BYPASS_FAYDA === "true";
import PageLoader from "@/components/PageLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { agent, agentLoading } = useAgentStore();
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathname.split("/").pop() || "credentials";
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const walletExists = Boolean(
      window.localStorage.getItem(config.LOCAL_STORAGE_NAME)
    );
    if (!walletExists) {
      router.replace("/");
      return;
    }

    const isLoggedIn =
      window.localStorage.getItem(FAYDA_SESSION_KEY) === "true";
    if (!isLoggedIn && !BYPASS_FAYDA) {
      router.replace(FAYDA_LOGIN_ROUTE);
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  const handleTabChange = (key: string) => {
    router.push(`/dashboard/${key === "credentials" ? "" : key}`);
  };

  // check if there is an agent if there is an agent then send to home
  useLayoutEffect(() => {
    if (!isAuthorized) {
      return;
    }
    const timeout = setTimeout(() => {
      if (!agent && agentLoading) {
        router.push("/");
        toast.warning("Wallet is not found, please create or recover it.");
      }
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [agent, agentLoading, isAuthorized, router]);

  if (!isAuthorized) {
    return <PageLoader loaderText="Preparing dashboard..." />;
  }

  return (
    <div className="relative bg-black grid grid-rows-[64px_1fr_56px] h-full">
      <Header />

      {/* Dynamic Content */}
      <main className="p-4 pb-28 overflow-y-auto">{children}</main>
      {/* Tabs at the Bottom */}
      <Tabs
        aria-label="Dashboard Navigation"
        selectedKey={activeTab}
        onSelectionChange={(key: Key) => handleTabChange(key as string)}
        className="rounded-full backdrop-blur-lg bg-white/10 p-2 shadow-lg absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-sm"
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

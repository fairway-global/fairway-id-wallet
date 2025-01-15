"use client";
import React, { Key } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { CameraIcon, ChartPieIcon, CogIcon } from "@heroicons/react/24/outline";
import { useTabs } from "@/context/TabsContext";
import Credentials from "@/app/dashboard/page";
import Scan from "@/app/dashboard/scan/page";
import Settings from "@/app/dashboard/settings/page";

const AppTabs: React.FC = () => {
  const { activeTab } = useTabs();

  return (
    <div className="flex w-full flex-col-reverse">
      <Tabs
        aria-label="App Navigation"
        selectedKey={activeTab}
        onSelectionChange={(key: Key) => console.log("key", key as string)}
        className="rounded-full backdrop-blur-lg bg-white/10 p-2 shadow-lg w-full mt-auto mb-0"
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
        >
          <Credentials />
        </Tab>
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
        >
          <Scan />
        </Tab>
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
        >
          <Settings />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AppTabs;

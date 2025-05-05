"use client";
import React, { Key, useCallback, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { CameraIcon, ChartPieIcon, CogIcon } from "@heroicons/react/24/outline";
import { useTabs } from "@/context/TabsContext";
import Credentials from "@/app/dashboard/page";
import Scan from "@/app/dashboard/scan/page";
import Settings from "@/app/dashboard/settings/page";

const AppTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useTabs();

  useEffect(() => {
    console.log("ative tab", activeTab);
  }, [activeTab]);

  const getIconClassName = useCallback(
    (key: string) => {
      return `w-6 h-6 ${
        activeTab === key ? "text-fwOrange" : "text-white hover:text-fwOrange"
      }`;
    },
    [activeTab]
  );

  return (
    <div className="flex w-full flex-col-reverse">
      <Tabs
        aria-label="App Navigation"
        selectedKey={activeTab}
        onSelectionChange={(key: Key) => setActiveTab(String(key))}
        className="rounded-full backdrop-blur-lg bg-white/10 p-2 shadow-lg w-full mt-auto mb-0"
        variant="solid"
        fullWidth={true}
      >
        <Tab
          key="credentials"
          title={<ChartPieIcon className={getIconClassName("credentials")} />}
        >
          <Credentials />
        </Tab>
        <Tab
          key="scan"
          title={<CameraIcon className={getIconClassName("scan")} />}
        >
          <Scan />
        </Tab>
        <Tab
          key="settings"
          title={<CogIcon className={getIconClassName("settings")} />}
        >
          <Settings />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AppTabs;

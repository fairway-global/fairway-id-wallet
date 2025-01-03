import React from "react";
import Header from "./ui/Header";
import AppTabs from "./ui/AppTabs";
import { TabsProvider } from "../context/TabsContext"; // Adjust path as needed

const PageWrapper: React.FC = () => {
  return (
    <TabsProvider>
      <div className="bg-black min-h-screen grid grid-rows-[64px_1fr]">
        <Header />
        <AppTabs />
      </div>
    </TabsProvider>
  );
};

export default PageWrapper;

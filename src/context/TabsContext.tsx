"use client"
import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the Context type
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Create Context
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Provide Context
interface TabsProviderProps {
  children: ReactNode;
}

export const TabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("credentials");

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

// Hook to Use Context
export const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

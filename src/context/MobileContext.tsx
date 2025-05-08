"use client";
import { createContext, useContext } from "react";
import { useMobileCheck } from "../hooks/useMobileCheck";

interface MobileContextType {
  isMobile: boolean;
  isLoding: boolean;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  const { isMobile, isLoding } = useMobileCheck();
  return (
    <MobileContext.Provider value={{ isMobile, isLoding }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error("useMobile must be used within a MobileProvider");
  }
  return context;
};

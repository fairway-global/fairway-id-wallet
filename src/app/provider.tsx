"use client";

import ErrorBoundary from "../components/ErrorBoundary";
import { HeroUIProvider } from "@heroui/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <HeroUIProvider>
        <div className="min-h-screen bg-gradient-to-b from-[#e6e8ef] to-[#dfe3ea] text-white flex justify-center px-3 py-6 md:px-6">
          <div className="relative w-full h-[calc(100vh-3rem)] max-h-[900px] max-w-[480px] xl:max-w-[520px] bg-black rounded-[34px] shadow-[0_24px_48px_rgba(0,0,0,0.18)] border border-white/10 overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
      </HeroUIProvider>
    </ErrorBoundary>
  );
}

"use client";

import ErrorBoundary from "../components/ErrorBoundary";
import { HeroUIProvider } from "@heroui/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <HeroUIProvider>
        <div className="min-h-screen bg-[#050914] text-white flex justify-center px-0 md:px-4 lg:px-6">
          <div className="relative w-full min-h-screen bg-black lg:rounded-3xl lg:my-6 lg:border lg:border-white/10 lg:shadow-2xl max-w-[480px] xl:max-w-[520px] overflow-hidden">
            {children}
          </div>
        </div>
      </HeroUIProvider>
    </ErrorBoundary>
  );
}

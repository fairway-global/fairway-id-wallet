"use client";

import { NextUIProvider } from "@nextui-org/react";
import ErrorBoundary from "../components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <NextUIProvider>{children}</NextUIProvider>
    </ErrorBoundary>
  );
}

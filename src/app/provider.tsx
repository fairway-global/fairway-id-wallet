"use client";
import PageLoader from "../components/PageLoader";
import { useMobileCheck } from "../hooks/useMobileCheck";
import DeviceError from "../components/DeviceError";
import ErrorBoundary from "../components/ErrorBoundary";
import { HeroUIProvider } from "@heroui/react";

export function Provider({ children }: { children: React.ReactNode }) {
  const { isMobile, isLoding } = useMobileCheck();

  // show error if there is an error
  if (isLoding) {
    return <PageLoader loaderText="app loading..." />;
  }

  if (!isMobile) {
    return <DeviceError />;
  }

  return (
    <ErrorBoundary>
      <HeroUIProvider>{children}</HeroUIProvider>
    </ErrorBoundary>
  );
}

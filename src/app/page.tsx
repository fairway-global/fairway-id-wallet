"use client";
import Welcome from "@/components/Welcome";
import PageLoader from "../components/PageLoader";
import { useInitialization } from "../hooks/useIntialisation";

export default function Root() {
  const { isInitializing } = useInitialization();

  // Show loader during initialization, then render Welcome or handle errors
  return isInitializing ? (
    <PageLoader loaderText="wallet booting up..." />
  ) : (
    <Welcome />
  );
}

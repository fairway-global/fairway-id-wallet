"use client";
import Welcome from "@/components/Welcome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Root() {
  const router = useRouter();
  const [userAgent, setUserAgent] = useState("");

  useEffect(() => {
    setUserAgent(navigator.userAgent);

    // Simple check for mobile devices
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (!isMobile) {
      router.replace("/error");
    }
  }, [router]); // Dependencies to avoid unnecessary re-renders

  // Avoid rendering content until the userAgent check is complete
  if (!userAgent) {
    return null;
  }

  return <Welcome />;
}

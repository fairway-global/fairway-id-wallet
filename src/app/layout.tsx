"use client";
import "./globals.css";
import { Toaster } from "sonner";
import { MobileProvider } from "../context/MobileContext";
import { Provider } from "./provider";
import { useEffect } from "react";
import AgentInitializer from "../components/AgentIntializer";
// NEW: Import new component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();

    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <html lang="en" className="dark">
      <body>
        <Toaster />
        <MobileProvider>
          <Provider>
            <AgentInitializer /> {/* MODIFIED: Added for global agent init */}
            {children}
          </Provider>
        </MobileProvider>
      </body>
    </html>
  );
}

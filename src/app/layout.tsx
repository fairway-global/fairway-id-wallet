"use client";
import "./globals.css";
import { Toaster } from "sonner";
import { Provider } from "./provider";
import { useEffect } from "react";

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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

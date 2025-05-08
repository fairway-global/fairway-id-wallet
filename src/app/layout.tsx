import "./globals.css";
import { Toaster } from "sonner";
import { MobileProvider } from "../context/MobileContext";
import { Provider } from "./provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Toaster />
        <MobileProvider>
          <Provider>{children}</Provider>
        </MobileProvider>
      </body>
    </html>
  );
}

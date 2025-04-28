import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

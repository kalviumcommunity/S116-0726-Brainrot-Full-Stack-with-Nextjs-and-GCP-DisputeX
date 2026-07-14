import type { Metadata } from "next";
import "./globals.css";

import AppShell from "@/components/common/AppShell";

export const metadata: Metadata = {
  title: "Dispute Portal",
  description: "Merchant Dispute Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
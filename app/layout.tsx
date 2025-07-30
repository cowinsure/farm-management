import type { Metadata } from "next";
import "./globals.css";
import ClientDashboardLayout from "@/components/layouts/ClientDashboardLayout";

import React from "react";
import ClientRootLayout from "@/components/layouts/ClientRootLayout";
import { CowRegistrationProvider } from "@/context/CowRegistrationContext";

export const metadata: Metadata = {
  title: "LivestockPro",
  description: "Created with v0",
  generator: "v0.dev",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <CowRegistrationProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
        </CowRegistrationProvider>
      </body>
    </html>
  );
}

// Client-side wrapper to conditionally show dashboard layout

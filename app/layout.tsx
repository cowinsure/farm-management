import type { Metadata } from "next";
import "./globals.css";
import ClientDashboardLayout from "@/components/layouts/ClientDashboardLayout";

import React from "react";
import ClientRootLayout from "@/components/layouts/ClientRootLayout";
import { CowRegistrationProvider } from "@/context/CowRegistrationContext";
import "animate.css";
import { Urbanist } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LivestockPro",
  description: "Your Trusted Partner in Livestock Insurance",
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
      <body className={`${urbanist.className}`}>
        <CowRegistrationProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
        </CowRegistrationProvider>
        <Toaster  />
      </body>
    </html>
  );
}

// Client-side wrapper to conditionally show dashboard layout

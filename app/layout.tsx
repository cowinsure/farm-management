
import type { Metadata } from 'next'
import './globals.css'
import ClientDashboardLayout from "@/components/layouts/ClientDashboardLayout"

import React from "react"
import ClientRootLayout from '@/components/layouts/ClientRootLayout'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  )
}

// Client-side wrapper to conditionally show dashboard layout


'use client'
import { useAuth } from "@/hooks/useAuth";
import ClientDashboardLayout from "./ClientDashboardLayout";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  

  if (isLoading) return null;

  if (!isAuthenticated) {
    // Not logged in: show children directly (e.g. login page)
    return <>{children}</>;
  }
  // Logged in: show dashboard layout
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>;
}
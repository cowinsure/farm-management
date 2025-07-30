"use client";

import {
  Bell,
  Calendar,
  DollarSign,
  Heart,
  Home,
  Plus,
  Settings,
  TrendingUp,
  Users,
  Zap,
  Menu,
  LogOut,
  TrendingDown,
  PawPrint,
  Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileOverlay } from "@/components/mobile-overlay";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth-guard";

import { useRouter } from "next/navigation";
import { RecordVaccinationScheduleDialog } from "@/components/health/record-vaccination-schedule-dialog";
import { RecordHealthIssueDialog } from "@/components/health/record-health-issue-dialog";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [dashboardSummary, setDashboardSummary] = useState<any>({});
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [vaccinationDialogOpen, setVaccinationDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gls/fms-dashboard-service`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data.summary);

        if (data?.data?.summary) {
          setDashboardSummary(data.data.summary);
        }
      })
      .catch(() => setDashboardSummary({}));
  }, []);

  const handleLogout = () => {
    logout();
  };
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-[#edf7f4] to-[#f0f7ff]">
        <div className="flex">
          {/* Mobile menu button */}

          {/* Main Content */}
          <main className="flex-1 lg:ml-4">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#17a34a] to-blue-600 rounded-lg p-6 mb-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.role || "User"}!
              </h2>
              <p className="text-green-100">
                {"Here's what's happening on your farm today"}
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Cattle
                  </CardTitle>
                  <div className="p-2 bg-green-100 rounded-lg">
                    {/* <Users className="w-6 h-6 text-green-600" /> */}
                    <PawPrint className="w-6 h-6 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardSummary?.Total_Animals || 0}
                  </div>
                  {/* <p className="text-xs text-gray-600 mt-1">{stat.change}</p> */}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Health Status
                  </CardTitle>
                  <div className="p-2 bg-green-100 rounded-lg">
                    {/* <Users className="w-6 h-6 text-green-600" /> */}
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardSummary?.Health_Status || 0}%
                  </div>
                  {/* <p className="text-xs text-gray-600 mt-1">{stat.change}</p> */}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </CardTitle>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    {/* <Users className="w-6 h-6 text-green-600" /> */}
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    ৳ {dashboardSummary.Monthly_Revenue || 0}
                  </div>
                  {/* <p className="text-xs text-gray-600 mt-1">{stat.change}</p> */}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 bg-white p-7 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid lg:grid-cols-3 gap-3">
                <Button
                  onClick={() => {
                    router.push("/livestock/add_cow");
                  }}
                  className="bg-green-600 hover:bg-green-700 h-20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Animal
                </Button>
                <Button
                  onClick={() => {
                    setVaccinationDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 h-20"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Vaccination
                </Button>
                {/* <Button className="bg-purple-600 hover:bg-purple-700 h-12">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Record Production
                </Button> */}
                <Button
                  onClick={() => {
                    setRecordDialogOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 h-20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record Health Issue
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              {/* Recent Activity */}
              {/* <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Vaccination completed</p>
                        <p className="text-sm text-gray-600">Cow #247 received FMD vaccination</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Milk production recorded</p>
                        <p className="text-sm text-gray-600">45L collected from morning session</p>
                        <p className="text-xs text-gray-400">4 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New animal registered</p>
                        <p className="text-sm text-gray-600">Holstein cow #248 added to inventory</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Health check completed</p>
                        <p className="text-sm text-gray-600">All animals in Pen 4 checked - healthy</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}

              {/* Alerts & Reminders */}
              {/* <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Alerts & Reminders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-red-800">Sick Animal Alert</p>
                          <p className="text-sm text-red-600">Cow #245 showing signs of illness</p>
                          <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                            Contact Vet
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-orange-800">Vaccination Due</p>
                          <p className="text-sm text-orange-600">15 animals due for vaccination this week</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 border-orange-300 text-orange-700 bg-transparent"
                          >
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-purple-800">Breeding Reminder</p>
                          <p className="text-sm text-purple-600">Cow #242 ready for artificial insemination</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}
            </div>
          </main>
        </div>
      </div>

      <RecordVaccinationScheduleDialog
        open={vaccinationDialogOpen}
        onOpenChange={setVaccinationDialogOpen}
        onSuccess={() => {
          // setCurrentPage(1); // Optionally refresh or reset page
        }}
      />
      <RecordHealthIssueDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        onSuccess={() => {
          // setCurrentPage(1); // Optionally reset to first page
        }}
      />
    </AuthGuard>
  );
}

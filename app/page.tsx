"use client"

import { Bell, Calendar, DollarSign, Heart, Home, Plus, Settings, TrendingUp, Users, Zap, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { MobileOverlay } from "@/components/mobile-overlay"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm lg:text-lg">14</span>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">LivestockPro ERP</h1>
              <p className="text-xs lg:text-sm text-gray-600">Farm Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-xs">
                3
              </span>
            </div>
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs lg:text-sm">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <nav className="p-4 space-y-2">
            <div className="flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </div>
            <Link
              href="/livestock"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Users className="w-5 h-5" />
              <span>Livestock Inventory</span>
            </Link>
            <Link
              href="/health"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              <span>Health & Vaccination</span>
            </Link>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <TrendingUp className="w-5 h-5" />
              <span>Breeding & Reproduction</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Zap className="w-5 h-5" />
              <span>Production Tracking</span>
            </div>
            <Link
              href="/financial"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <DollarSign className="w-5 h-5" />
              <span>Financial Management</span>
            </Link>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <TrendingUp className="w-5 h-5" />
              <span>Reports & Analytics</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Settings className="w-5 h-5" />
              <span>Farm Settings</span>
            </div>
          </nav>
        </aside>

        <MobileOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-4 lg:p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
            <p className="text-green-100">{"Here's what's happening on your farm today"}</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Animals</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-green-600">+12 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Health Status</CardTitle>
                <Heart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-gray-600">Healthy animals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Milk Production</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,450L</div>
                <p className="text-xs text-green-600">+5% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-green-600">+8% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Button className="bg-green-600 hover:bg-green-700 h-12">
                <Plus className="w-4 h-4 mr-2" />
                Add Animal
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 h-12">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Vaccination
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 h-12">
                <TrendingUp className="w-4 h-4 mr-2" />
                Record Production
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 h-12">
                <Plus className="w-4 h-4 mr-2" />
                Record Health Issue
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Recent Activity */}
            <div className="xl:col-span-2">
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
            </div>

            {/* Alerts & Reminders */}
            <div>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

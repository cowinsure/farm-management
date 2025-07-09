"use client"
import React, { useState } from "react"
import {
  Bell,
  DollarSign,
  Heart,
  Home,
  LogOut,
  Menu,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MobileOverlay } from "@/components/mobile-overlay"
import { useAuth } from "@/hooks/useAuth"
import Navigation from "./Navigation"
import { set } from "date-fns"

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModule, setActiveModule] = useState('/');
  const { user, logout } = useAuth()
  const handleLogout = () => logout()
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐄</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LivestockPro ERP</h1>
                <p className="text-sm text-gray-600">Farm Management System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-green-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline ml-1">Logout</span>
              </Button>
            </div>

            {/* <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button> */}
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
        {/* <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <nav className="p-4 space-y-2">
            <Link
              onClick={() => setActiveModule('/')}
              href="/"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/livestock"
              onClick={() => setActiveModule('livestock')}
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Users className="w-5 h-5" />
              <span>Livestock Inventory</span>
            </Link>
            <Link
              href="/health"
              onClick={() => setActiveModule('health')}
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
              onClick={() => setActiveModule('financial')}
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
        </aside> */}
          <div className=" sm:px-6  py-6">
          <div className="flex flex-col lg:flex-row">
        <div className="lg:w-64 flex-shrink-0">

          <Navigation activeModule={activeModule} setActiveModule={setActiveModule} />
        </div>
        </div>
        </div>

        <MobileOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
} 
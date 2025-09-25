"use client";
import React, { useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "./Navigation";
import MobileNav from "./MobileNav";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeModule, setActiveModule] = useState("/");
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => logout();

  // Close menu with delay for smooth exit animation
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  // Cancel closing if mouse re-enters quickly
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  console.log(user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf7f4] to-[#f0f7ff]">
      {/* Header */}
      <header className="bg-green-50 border-b-4 border-green-400 shadow-[5px_1px_20px_rgba(34,197,94,0.7)] hidden lg:block">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐄</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                  LivestockPro ERP
                </h1>
                <p className="text-sm text-gray-600">Farm Management System</p>
              </div>
            </div>

            {/* <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-green-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div> */}
            <div
              className="hidden md:flex items-center space-x-4 relative z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer">
                <FaUserCircle className="w-9 h-9 text-green-800" />
              </div>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full text-left text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center px-4 py-2"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* <button
              className="md:hidden p-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button> */}
          </div>
        </div>
      </header>
      <div className="flex w-full">
        {/* Mobile menu button */}
        {/* <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white">
            <Menu className="h-4 w-4" />
          </Button>
        </div> */}
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

        <div className="w-full mx-auto p-4">
          <div className="lg:flex relative">
            {/* Desktop Nav */}
            <div className="hidden lg:block">
              <Navigation
                activeModule={activeModule}
                setActiveModule={setActiveModule}
              />
            </div>

            {/* Main Content */}
            <main className="flex-1 pb-20">
              {" "}
              {/* Added bottom padding */}
              {children}
            </main>
          </div>

          {/* Mobile Nav rendered outside flow */}
          <MobileNav />
        </div>

        {/* <MobileOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      </div>
    </div>
  );
}

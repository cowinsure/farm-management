"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  Heart,
  DollarSign,
  Home,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { FaArrowTrendUp } from "react-icons/fa6";

const MobileNav = () => {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      id: "/",
      label: "Dashboard",
      smallLabel: "Dashboard",
      icon: Home,
      color: "text-blue-600",
    },
    {
      id: "/livestock",
      label: "Livestock Inventory",
      smallLabel: "Livestock",
      icon: Users,
      color: "text-green-600",
    },
    {
      id: "/breeding",
      label: "Breeding & Reproduction",
      smallLabel: "Breeding",
      icon: FaArrowTrendUp,
      color: "text-purple-600",
    },
    {
      id: "/health",
      label: "Health & Vaccination",
      smallLabel: "Health",
      icon: Heart,
      color: "text-red-600",
    },
    {
      id: "/production",
      label: "Production",
      smallLabel: "Production",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      id: "/financial",
      label: "Financial Management",
      smallLabel: "Finances",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    // Future items can be added safely here
  ];

  const visibleItems = menuItems.slice(0, 4);
  const hiddenItems = menuItems.slice(4);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-0 inset-x-0 z-50 bg-green-100 shadow-2xl lg:hidden transition-all duration-300"
    >
      {/* Hidden Menu Panel */}
      {showMore && hiddenItems.length > 0 && (
        <div className="absolute bottom-full w-full bg-white shadow-lg rounded-t-xl p-4 animate-slideUp border-t border-green-200">
          <div className="grid grid-cols-4 gap-4">
            {hiddenItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.id}
                  onClick={() => setShowMore(false)}
                  className="flex flex-col items-center justify-center transition-all"
                >
                  <Icon
                    fill={isActive ? "#4ade80" : "#dcfce7"}
                    className={`mb-1 ${
                      isActive
                        ? "text-green-400 bg-green-950 rounded-lg p-1 w-8 h-8"
                        : "text-green-700"
                    }`}
                  />
                  <span
                    className={`text-center ${
                      isActive
                        ? "text-green-950 text-xs font-bold"
                        : "text-green-700 text-xs font-medium"
                    }`}
                  >
                    {item.smallLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="grid grid-cols-5 items-center py-2 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;
          return (
            <Link
              key={item.id}
              href={item.id}
              className="flex flex-col items-center justify-center transition-all"
            >
              <Icon
                fill={isActive ? "#4ade80" : "#dcfce7"}
                className={`mb-1 ${
                  isActive
                    ? "text-green-400 bg-green-950 rounded-lg p-1 w-8 h-8"
                    : "text-green-700 scale-90"
                }`}
              />
              <span
                className={`text-center ${
                  isActive
                    ? "text-green-950 text-xs font-bold"
                    : "text-green-700 text-xs font-medium"
                }`}
              >
                {item.smallLabel}
              </span>
            </Link>
          );
        })}

        {/* Expand Button */}
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className="flex flex-col items-center justify-center h-full text-green-700 hover:text-green-900 transition-all"
        >
          {showMore ? (
            <ChevronDown className="w-6 h-6 text-green-800" />
          ) : (
            <ChevronUp className="w-6 h-6 text-green-800" />
          )}
          <span className="text-xs font-semibold">
            {showMore ? "Close" : "More"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;

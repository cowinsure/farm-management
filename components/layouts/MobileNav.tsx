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
  TrendingUp,
  Syringe,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      id: "/",
      label: `${"dashboard"}`,
      smallLabel: `${"dashboard"}`,
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
      icon: TrendingUp,
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
      id: "/vaccination",
      label: "Vaccination Schedule",
      icon: Syringe,
      color: "text-rose-600",
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
  ];

  const visibleItems = menuItems.slice(0, 4);
  const hiddenItems = menuItems.slice(4);

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
      className="fixed bottom-0 inset-x-0 z-[99] bg-gradient-to-r from-emerald-950 via-green-950 to-emerald-900 backdrop-blur-xl shadow-[0_-2px_20px_rgba(0,0,0,0.5)] lg:hidden transition-all duration-300 rounded-t-2xl"
    >
      {/* Hidden Menu Panel */}
      {showMore && hiddenItems.length > 0 && (
        <div className="absolute bottom-full w-full bg-gradient-to-b from-emerald-100 via-green-50 to-white/90 backdrop-blur-md rounded-t-2xl p-4 shadow-2xl border-t border-green-200 animate-slideUp">
          <div className="grid grid-cols-4 gap-4">
            {hiddenItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.id}
                  onClick={() => setShowMore(false)}
                  className="flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <Icon
                    fill={isActive ? "#34d399" : "#e0fbea"}
                    className={`mb-1 transition-all duration-200 ${
                      isActive
                        ? "text-emerald-700 bg-emerald-200 rounded-lg p-1 w-8 h-8"
                        : "text-emerald-700 opacity-80"
                    }`}
                  />
                  <span
                    className={`text-center ${
                      isActive
                        ? "text-emerald-800 text-xs font-bold"
                        : "text-emerald-700 text-xs font-medium"
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
              className="flex flex-col items-center justify-center transition-all hover:scale-105"
            >
              <Icon
                fill={isActive ? "#34d399" : "#c7f9cc"}
                className={`mb-1 transition-all duration-300 ${
                  isActive
                    ? "text-emerald-400 bg-emerald-900/80 rounded-lg p-1 w-8 h-8 shadow-md shadow-emerald-800/40"
                    : "text-emerald-200 opacity-80"
                }`}
              />
              <span
                className={`text-center ${
                  isActive
                    ? "text-emerald-300 text-xs font-bold tracking-wide"
                    : "text-emerald-100/80 text-xs font-medium"
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
          className="flex flex-col items-center justify-center h-full text-emerald-300 hover:text-lime-300 transition-all"
        >
          {showMore ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronUp className="w-6 h-6" />
          )}
          <span className="text-xs font-semibold tracking-wide">
            {showMore ? "Close" : "More"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;

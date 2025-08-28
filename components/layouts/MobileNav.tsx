"use client";

import React from "react";
import { Users, Heart, DollarSign, Home } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

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
      id: "/health",
      label: "Health & Vaccination",
      smallLabel: "Health",
      icon: Heart,
      color: "text-red-600",
    },
    {
      id: "/financial",
      label: "Financial Management",
      smallLabel: "Finances",
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="fixed -bottom-0.5 inset-x-0 z-50 bg-green-100 shadow-2xl lg:hidden px-2 py-2 transition-colors duration-300">
      <div className="grid grid-cols-4 md:gap-6 items-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;

          return (
            <Link
              key={item.id}
              href={item.id}
              className={`flex flex-col items-center justify-center h-full transition-all duration-300 ease-in-out`}
            >
              <Icon
                fill={isActive ? "#4ade80" : "#dcfce7"}
                className={`mb-1 transition-colors duration-300 ${
                  isActive
                    ? "text-green-400 bg-green-950 rounded-lg p-1 w-8 h-8"
                    : "text-green-700 scale-90"
                }`}
              />

              <span
                className={`text-center transition-opacity duration-300 ease-in-out  ${
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
  );
};

export default MobileNav;

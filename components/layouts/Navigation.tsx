"use client";
import React, { useState } from "react";
import { Users, Heart, DollarSign, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

interface NavigationProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const Navigation = ({ activeModule, setActiveModule }: NavigationProps) => {
  const { logout } = useAuth();
  const pathname = usePathname();

  const [pinned, setPinned] = useState(false); // 👈 New toggle state

  const menuItems = [
    { id: "/", label: "Dashboard", icon: Home, color: "text-blue-600" },
    {
      id: "/livestock",
      label: "Livestock Inventory",
      icon: Users,
      color: "text-green-600",
    },
    {
      id: "/health",
      label: "Health & Vaccination",
      icon: Heart,
      color: "text-red-600",
    },
    {
      id: "/financial",
      label: "Financial Management",
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      className={`group relative ${
        pinned ? "w-64" : "w-[70px] hover:w-64"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="bg-white rounded-lg p-4 sticky top-5 h-[80vh] overflow-hidden transition-all duration-300">
        {/* 🔘 Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setPinned((prev) => !prev)}
            className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
          >
            {pinned ? "Unlock" : "Pin"}
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;

            return (
              <Link key={item.id} href={item.id}>
                <Button
                  onMouseMove={() => handleMouseMove}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-left h-auto p-3 outline-none ripple-effect relative z-10 flex items-center gap-3 transition-all duration-300 ${
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "scale-100 hover:scale-105 text-gray-700"
                  }`}
                  onClick={() => setActiveModule(item.id)}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : item.color
                    }`}
                  />
                  <span
                    className={`font-medium truncate transition-all duration-200 ${
                      pinned
                        ? "opacity-100 ml-2"
                        : "opacity-0 group-hover:opacity-100 group-hover:ml-2"
                    }`}
                  >
                    {item.label}
                  </span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;

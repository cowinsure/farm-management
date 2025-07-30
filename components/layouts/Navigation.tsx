import React from "react";
import {
  Users,
  Heart,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Settings,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

interface NavigationProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const Navigation = ({ activeModule, setActiveModule }: NavigationProps) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

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
    // { id: '/breeding', label: 'Breeding & Reproduction', icon: TrendingUp, color: 'text-purple-600' },
    // { id: '/production', label: 'Production Tracking', icon: Calendar, color: 'text-orange-600' },
    {
      id: "/financial",
      label: "Financial Management",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    // { id: 'reports', label: 'Reports & Analytics', icon: FileText, color: 'text-indigo-600' },
    // { id: '/farmsettings', label: 'Farm Settings', icon: Settings, color: 'text-gray-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sticky top-5">
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;

          return (
            <Link key={item.id} href={item.id}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 outline-none ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "scale-100 hover:scale-105 hover:bg-green-200 text-gray-700 transition-all duration-300 ease-in-out"
                }`}
                onClick={() => setActiveModule(item.id)}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? "text-white" : item.color
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;

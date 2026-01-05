"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";
import logoLandscape from "@/public/images/logo-landscape.svg";

// Use react-icons or simple text if icons not available yet
// Assuming react-icons is installed per package.json
import {
  FiHome,
  FiPackage,
  FiSettings,
  FiLogOut,
  FiPlusCircle,
  FiSearch,
} from "react-icons/fi";

const navItems = [
  { name: "Dashboard", href: "/app/dashboard", icon: FiHome },
  { name: "New Shipment", href: "/app/shipments/new", icon: FiPlusCircle },
  { name: "Track Shipment", href: "/track", icon: FiSearch }, // Track is likely public, keeps /track
  { name: "My Shipments", href: "/app/shipments", icon: FiPackage },
  { name: "Account", href: "/app/account", icon: FiSettings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-100 flex items-center justify-center">
        <Link href="/app/dashboard">
          <div className="relative w-32 h-8">
            <Image
              src={logoLandscape}
              alt="Momentum Logistics Service Logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Check if pathname starts with the item href to support nested routes
          // But exact match for dashboard to avoid it being active for everything if href was just /app
          // Logic to differentiate "New Shipment" (/app/shipments/new) from "My Shipments" (/app/shipments)
          let isActive = false;
          if (item.href === "/app/dashboard") {
            isActive = pathname === item.href;
          } else if (item.href === "/app/shipments") {
            // Active if starts with /app/shipments BUT NOT /app/shipments/new
            isActive =
              pathname.startsWith(item.href) &&
              !pathname.startsWith("/app/shipments/new");
          } else {
            // Standard prefix matching for other routes
            isActive = pathname.startsWith(item.href);
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-brand-blue text-white"
                  : "text-gray-700 hover:bg-gray-50 hover:text-brand-blue"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => logout()} // Add redirect if needed, handled in store or component
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

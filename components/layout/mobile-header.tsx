"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import logoLandscape from "@/public/images/logo-landscape.svg";

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * MobileHeader provides the top navigation bar for mobile users,
 * including the logo and a hamburger menu to toggle the sidebar.
 */
export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      <Link href="/app/dashboard">
        <div className="relative w-28 h-8">
          <Image
            src={logoLandscape}
            alt="Momentum Logistics"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      <button
        onClick={onToggle}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>
    </header>
  );
}

"use client";

import Link from "next/link";
import {
  FaTruck,
  FaBoxOpen,
  FaMagnifyingGlass,
  FaHouse,
} from "react-icons/fa6";
import Button from "@/components/ui/button";
import Container from "@/components/shared/container";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Visual Animation Area */}
          <div className="relative h-64 mb-8 flex items-center justify-center">
            {/* Background Circle */}
            <div className="absolute w-64 h-64 bg-brand-blue/5 rounded-full animate-pulse"></div>

            {/* Lost Box */}
            <div className="relative z-10 animate-bounce duration-2000">
              <FaBoxOpen className="w-32 h-32 text-brand-blue opacity-80" />
              <div className="absolute -top-4 -right-4 bg-brand-yellow text-brand-blue font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg rotate-12">
                ?
              </div>
            </div>

            {/* Truck passing by */}
            <div className="absolute bottom-10 -left-20 animate-[drive_8s_linear_infinite] opacity-50">
              <FaTruck className="w-16 h-16 text-gray-300" />
            </div>
          </div>

          {/* Text Content */}
          <h1 className="font-work-sans font-black text-8xl text-brand-blue mb-4">
            404
          </h1>
          <h2 className="font-work-sans font-bold text-2xl md:text-3xl text-gray-900 mb-4">
            Shipment Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Looks like this package got lost in transit. The page you're looking
            for doesn't exist or has been moved to a new warehouse.
          </p>

          {/* Interactive Search Simulation */}
          <div className="max-w-md mx-auto mb-10 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMagnifyingGlass className="text-gray-400 group-hover:text-brand-blue transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Try searching for a tracking ID..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-white shadow-sm"
              disabled
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-xs font-medium text-red-400 bg-red-50 px-2 py-1 rounded">
                Invalid ID
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto">
                <FaHouse className="mr-2" /> Return to Base
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full sm:w-auto">
                Report Missing Page
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiTruck, FiMapPin, FiPackage } from "react-icons/fi";
import { Address, Package } from "@/store/shipment-store";
import { Rate } from "@/types/shipping";
import Button from "@/components/ui/button";
import { formatCurrencyCompact } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";

interface SummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sender: Address | null;
  recipient: Address | null;
  pkg: Package | null;
  rate: Rate | null;
  onFinalize: () => void;
  isLoading?: boolean;
}

/**
 * SummaryDrawer provides a high-fidelity final review of the shipment details.
 * It uses a side-drawer pattern on desktop and bottom-sheet on mobile.
 */
export default function SummaryDrawer({
  isOpen,
  onClose,
  sender,
  recipient,
  pkg,
  rate,
  onFinalize,
  isLoading,
}: SummaryDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-60 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Review Shipment
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  Final Confirmation
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all bg-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Route Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-brand-blue" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">
                    Route Details
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="relative pl-6 border-l-2 border-dashed border-gray-200">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-blue" />
                    <p className="text-[10px] font-black uppercase tracking-tight text-gray-400 mb-1">
                      Pick-up From
                    </p>
                    <p className="font-bold text-gray-900">{sender?.name}</p>
                    <p className="text-xs text-gray-500">
                      {sender?.street}, {sender?.city}
                    </p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-dashed border-transparent">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-yellow" />
                    <p className="text-[10px] font-black uppercase tracking-tight text-gray-400 mb-1">
                      Drop-off To
                    </p>
                    <p className="font-bold text-gray-900">{recipient?.name}</p>
                    <p className="text-xs text-gray-500">
                      {recipient?.street}, {recipient?.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FiPackage className="text-brand-blue" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">
                    Package Spec
                  </h4>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">
                      Description
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {pkg?.description}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-black uppercase tracking-tight text-gray-400 mb-1">
                        Weight
                      </p>
                      <p className="text-base font-black text-gray-900">
                        {pkg?.weight} <span className="text-[10px]">KG</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-black uppercase tracking-tight text-gray-400 mb-1">
                        Dims
                      </p>
                      <p className="text-xs font-black text-gray-900">
                        {pkg?.length}x{pkg?.width}x{pkg?.height}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-black uppercase tracking-tight text-gray-400 mb-1">
                        Value
                      </p>
                      <p className="text-base font-black text-gray-900">
                        {pkg?.value}{" "}
                        <span className="text-[10px]">{pkg?.currency}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Service */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FiTruck className="text-brand-blue" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">
                    Selected Service
                  </h4>
                </div>
                <div className="bg-brand-blue text-white rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <FiTruck className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <h5 className="text-xl font-black tracking-tight">
                      {rate?.serviceName}
                    </h5>
                    <p className="text-brand-yellow text-xs font-bold uppercase tracking-widest mt-1">
                      {rate?.deliveryDescription || "Standard Express"}
                    </p>
                    <div className="mt-6 flex items-baseline gap-2 border-t border-white/10 pt-4">
                      <span className="text-3xl font-black text-white">
                        {formatCurrencyCompact(
                          rate?.actualPrice as number,
                          rate?.currency as SupportedCurrency,
                        )}
                      </span>
                      <span className="text-sm font-bold opacity-60 uppercase">
                        {rate?.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <Button
                variant="primary"
                size="lg"
                className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-brand-blue/20"
                onClick={onFinalize}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create Shipment <FiCheck className="ml-2" />
              </Button>
              <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4">
                By clicking create, you agree to our terms of service.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

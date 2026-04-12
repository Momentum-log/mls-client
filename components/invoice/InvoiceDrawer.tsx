/**
 * Invoice Drawer Component
 *
 * Slides in from the right to show a condensed invoice receipt view.
 * Used on the shipment details page for quick invoice access.
 * Follows the same pattern as SummaryDrawer.
 *
 * @module components/invoice/InvoiceDrawer
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Invoice } from "@/types/invoice";
import { InvoiceReceiptView } from "@/components/invoice/InvoiceReceiptView";

/**
 * Props for InvoiceDrawer component
 */
interface InvoiceDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Full invoice data */
  invoice: Invoice;
  /** Related shipment ID */
  shipmentId?: string;
  /** Callback when "Update Shipment" is clicked */
  onUpdateShipment?: () => void;
}

/**
 * InvoiceDrawer Component
 *
 * Side drawer that slides in from the right. Shows a condensed version
 * of the InvoiceReceiptView with all CTAs and a "View Full Invoice" link.
 *
 * @example
 * ```tsx
 * <InvoiceDrawer
 *   isOpen={showDrawer}
 *   onClose={() => setShowDrawer(false)}
 *   invoice={invoiceData}
 *   shipmentId="abc-123"
 *   onUpdateShipment={() => setShowUpdateModal(true)}
 * />
 * ```
 */
export const InvoiceDrawer: React.FC<InvoiceDrawerProps> = ({
  isOpen,
  onClose,
  invoice,
  shipmentId,
  onUpdateShipment,
}) => {
  const router = useRouter();

  /**
   * Navigates to the dedicated invoice page
   */
  const handleViewFullInvoice = () => {
    onClose();
    router.push(`/app/invoices/${invoice.invoiceId}`);
  };

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
                  Invoice
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  {invoice.invoiceNumber}
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
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <InvoiceReceiptView
                invoice={invoice}
                shipmentId={shipmentId}
                condensed
                onUpdateShipment={onUpdateShipment}
              />
            </div>

            {/* Footer: View Full Invoice */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={handleViewFullInvoice}
                className="w-full text-center text-sm font-bold text-brand-blue hover:text-brand-blue/80 transition-colors flex items-center justify-center gap-2 py-2"
              >
                <FiExternalLink className="w-4 h-4" />
                View Full Invoice
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

InvoiceDrawer.displayName = "InvoiceDrawer";

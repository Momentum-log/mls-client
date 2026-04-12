/**
 * Invoices Sidebar Component
 *
 * Displays a list of all user invoices with filtering, search, and click-to-view functionality.
 * Allows users to navigate between invoices quickly.
 *
 * @module components/invoice/InvoicesSidebar
 */

"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiFileText, FiCheck, FiClock, FiX } from "react-icons/fi";
import { useGetInvoices } from "@/hooks/invoices/use-invoices-api";
import { formatCurrency } from "@/utils/currency-formatter";
import { formatInvoiceDate } from "@/utils/invoice-helpers";
import { Invoice, InvoiceStatus } from "@/types/invoice";

interface InvoicesSidebarProps {
  /** Currently selected invoice ID for highlighting */
  selectedInvoiceId?: string;
  /** Optional callback when invoice is selected */
  onInvoiceSelect?: (invoiceId: string) => void;
}

/**
 * InvoicesSidebar Component
 * Lists all invoices with status indicators and filtering capabilities
 */
export const InvoicesSidebar: React.FC<InvoicesSidebarProps> = ({
  selectedInvoiceId,
  onInvoiceSelect,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | "ALL">("ALL");

  // Fetch invoices
  const { data: invoicesResponse, isLoading } = useGetInvoices({
    limit: 50,
    offset: 0,
    status: filterStatus === "ALL" ? "all" : filterStatus,
  });

  const invoices = invoicesResponse?.invoices || [];

  // Filter and search invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice: Invoice) => {
      // Status filter fallback (keeps filtering working even if backend returns unfiltered list)
      if (filterStatus !== "ALL" && invoice.status !== filterStatus) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          invoice.invoiceId?.toLowerCase().includes(query) ||
          invoice.invoiceNumber?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [invoices, searchQuery, filterStatus]);

  const handleInvoiceClick = (invoiceId: string) => {
    onInvoiceSelect?.(invoiceId);
    router.push(`/app/invoices/${invoiceId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return <FiCheck className="w-4 h-4 text-brand-blue" />;
      case InvoiceStatus.EXPIRED:
        return <FiX className="w-4 h-4 text-accent-dark" />;
      case InvoiceStatus.PENDING:
      default:
        return <FiClock className="w-4 h-4 text-brand-yellow" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return "bg-brand-blue/10 text-brand-blue border-brand-blue/25";
      case InvoiceStatus.EXPIRED:
        return "bg-accent-light/20 text-accent-dark border-accent-light";
      case InvoiceStatus.PENDING:
      default:
        return "bg-brand-yellow/15 text-foreground border-brand-yellow/35";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FiFileText className="w-5 h-5 text-brand-blue" />
        <h3 className="font-black text-gray-900 text-lg">Invoices</h3>
        <span className="ml-auto bg-brand-blue/10 text-brand-blue text-xs font-bold px-2.5 py-1 rounded-full">
          {filteredInvoices.length}
        </span>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <FiSearch className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
        />
      </div>

      {/* Status Filter */}
      <div className="mb-6 space-y-2">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Status
        </p>
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { label: "All", value: "ALL" },
              { label: "Pending", value: InvoiceStatus.PENDING },
              { label: "Paid", value: InvoiceStatus.PAID },
              { label: "Expired", value: InvoiceStatus.EXPIRED },
            ] as const
          ).map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === value
                  ? "bg-brand-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredInvoices.length === 0 && (
        <div className="py-8 text-center">
          <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">
            {searchQuery ? "No invoices match your search" : "No invoices yet"}
          </p>
        </div>
      )}

      {/* Invoice List */}
      {!isLoading && filteredInvoices.length > 0 && (
        <div className="space-y-2">
          {filteredInvoices.map((invoice: Invoice) => (
            <button
              key={invoice.invoiceId}
              onClick={() =>
                handleInvoiceClick(invoice.invoiceId || "")
              }
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                selectedInvoiceId === invoice.invoiceId
                  ? "bg-brand-blue/10 border-brand-blue shadow-sm"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {/* Invoice Number & Amount */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Invoice
                  </p>
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {invoice.invoiceNumber || invoice.invoiceId?.substring(0, 8)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {getStatusIcon(invoice.status || InvoiceStatus.PENDING)}
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(invoice.status || InvoiceStatus.PENDING)}`}
                  >
                    {getStatusLabel(invoice.status || InvoiceStatus.PENDING)}
                  </span>
                </div>
              </div>

              {/* Amount & Date */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">Amount</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatCurrency(
                      invoice.totalGrossAmount || 0,
                      invoice.currency,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">Created</span>
                  <span className="text-xs text-gray-600 font-medium">
                    {formatInvoiceDate(
                      invoice.createdAt,
                      false,
                    )}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoicesSidebar;

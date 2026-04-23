/**
 * Invoice List Page Component
 *
 * Full-page view displaying list of invoices with pagination, filtering by status,
 * sorting by various fields, and quick actions. Responsive grid/table layout.
 *
 * @module components/invoice/InvoiceListPage
 */

import React, { useState } from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import {
  formatInvoiceNumber,
  formatInvoiceAmount,
  formatDate,
  getInvoiceStatusLabel,
  getInvoiceStatusColor,
} from "@/utils/invoice-helper";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { useInvoiceStore } from "@/store/invoice-store";
import { cn } from "@/utils/cn";

/**
 * Props for InvoiceListPage component
 */
interface InvoiceListPageProps {
  /** Array of invoices to display */
  invoices: Invoice[];
  /** Total count of invoices matching current filters */
  total: number;
  /** Callback when invoice is clicked */
  onInvoiceClick?: (invoice: Invoice) => void;
  /** Callback when download button clicked */
  onDownload?: (invoice: Invoice) => void;
  /** Callback when email button clicked */
  onEmail?: (invoice: Invoice) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Full-page invoice list with filtering, sorting, and pagination
 *
 * Features:
 * - Status filtering: All, Pending, Paid, Expired
 * - Sorting: By date, amount, status, invoice number
 * - Pagination: 10/25/50 items per page
 * - Responsive layout (card on mobile, table on desktop)
 * - Quick actions: View, Download, Email
 * - Empty state with helpful message
 *
 * @example
 * ```tsx
 * <InvoiceListPage
 *   invoices={invoicesList}
 *   total={totalCount}
 *   onInvoiceClick={(invoice) => openDetailModal(invoice)}
 *   onDownload={(invoice) => downloadPDF(invoice.invoiceId)}
 * />
 * ```
 */
export const InvoiceListPage: React.FC<InvoiceListPageProps> = ({
  invoices,
  total,
  onInvoiceClick,
  onDownload,
  onEmail,
  isLoading = false,
  error = null,
  className,
}) => {
  const { filters, updateFilters, setCurrentInvoice } = useInvoiceStore();
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status" | "number">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  /**
   * Handle status filter change
   */
  const handleStatusChange = (status: InvoiceStatus | "ALL") => {
    updateFilters({
      status: status === "ALL" ? undefined : status,
    });
  };

  /**
   * Handle sort change
   */
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  /**
   * Handle pagination
   */
  const handlePageSizeChange = (size: number) => {
    updateFilters({ limit: size, offset: 0 });
  };

  const handleNextPage = () => {
    if ((filters.offset ?? 0) + (filters.limit ?? 25) < total) {
      updateFilters({ offset: (filters.offset ?? 0) + (filters.limit ?? 25) });
    }
  };

  const handlePreviousPage = () => {
    if ((filters.offset ?? 0) - (filters.limit ?? 25) >= 0) {
      updateFilters({ offset: (filters.offset ?? 0) - (filters.limit ?? 25) });
    }
  };

  /**
   * Handle invoice row click
   */
  const handleInvoiceClick = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    onInvoiceClick?.(invoice);
  };

  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 25;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="mt-1 text-gray-600">Manage and download your invoices</p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Filters</h2>
        <div className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "PAID", "EXPIRED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status as any)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                (status === "ALL" && !filters.status) ||
                  (status !== "ALL" && filters.status === status)
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {status === "ALL"
                ? "All Invoices"
                : getInvoiceStatusLabel(status as InvoiceStatus)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-3 text-gray-600">Loading invoices...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && invoices.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            No invoices found
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {filters.status
              ? "Try adjusting your filters to find what you're looking for."
              : "You don't have any invoices yet."}
          </p>
        </div>
      )}

      {/* Desktop Table View */}
      {!isLoading && invoices.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("number")}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Invoice
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                      >
                        <path d="M6 1L1 6h10L6 1z" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Date
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                      >
                        <path d="M6 1L1 6h10L6 1z" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("amount")}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Amount
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                      >
                        <path d="M6 1L1 6h10L6 1z" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleInvoiceClick(invoice)}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {formatInvoiceNumber(invoice.invoiceNumber)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatInvoiceAmount(invoice.totalGrossAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <InvoiceStatusBadge status={invoice.status} small />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {onDownload && (
                          <button
                            onClick={() => onDownload(invoice)}
                            className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                            title="Download PDF"
                          >
                            Download
                          </button>
                        )}
                        {onEmail && (
                          <button
                            onClick={() => onEmail(invoice)}
                            className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                            title="Send email"
                          >
                            Email
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-3 md:hidden">
            {invoices.map((invoice) => (
              <div
                key={invoice.invoiceId}
                onClick={() => handleInvoiceClick(invoice)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {formatInvoiceNumber(invoice.invoiceNumber)}
                  </h3>
                  <InvoiceStatusBadge status={invoice.status} small />
                </div>
                <div className="mb-3 space-y-1 text-sm text-gray-600">
                  <p>Date: {formatDate(invoice.createdAt)}</p>
                  <p className="font-medium text-gray-900">
                    Amount: {formatInvoiceAmount(invoice.totalGrossAmount)}
                  </p>
                </div>
                {(onDownload || onEmail) && (
                  <div className="flex gap-2 pt-2">
                    {onDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(invoice);
                        }}
                        className="flex-1 rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Download
                      </button>
                    )}
                    {onEmail && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEmail(invoice);
                        }}
                        className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        Email
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-sm text-gray-600">
                Items per page:
              </label>
              <select
                id="page-size"
                value={limit}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({total} total)
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

InvoiceListPage.displayName = "InvoiceListPage";

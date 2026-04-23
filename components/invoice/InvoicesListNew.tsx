/**
 * Invoice List Component
 *
 * Displays paginated list of invoices with status filtering and sorting capabilities.
 * Used in the dashboard or invoices overview page.
 *
 * @module components/invoice/InvoicesList
 */

"use client";

import React, { useCallback, useState } from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import {
  formatInvoiceNumber,
  formatInvoiceDate,
  formatAmount,
  isInvoicePaid,
} from "@/utils/invoice-helpers";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Activity status for a list item (used for animations)
 */
type ActivityStatus = "idle" | "loading" | "success" | "error";

/**
 * Props for InvoicesList component
 */
interface InvoicesListProps {
  /** Array of invoice objects */
  invoices: Invoice[];
  /** Total count of invoices (for pagination) */
  totalCount: number;
  /** Is data currently loading */
  isLoading?: boolean;
  /** Error message, if any */
  error?: string | null;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Items per page */
  itemsPerPage?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when status filter changes */
  onStatusFilterChange?: (status: InvoiceStatus | "all") => void;
  /** Callback when sort changes */
  onSortChange?: (
    field: "createdAt" | "invoiceNumber" | "totalGross",
    order: "asc" | "desc",
  ) => void;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Callback when view is clicked */
  onView?: (invoice: Invoice) => void;
  /** Callback when update is clicked */
  onUpdate?: (invoice: Invoice) => void;
  /** Optional CSS classNamess */
  className?: string;
}

/**
 * InvoicesList Component
 *
 * Renders paginated invoice table with:
 * - Status filtering (All, Pending, Paid, Expired)
 * - Sorting options (Date, Invoice #, Amount)
 * - Pagination with configurable items per page
 * - Quick action buttons for each invoice
 * - Loading and error states
 */
export const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  totalCount,
  isLoading = false,
  error = null,
  currentPage = 1,
  itemsPerPage = 20,
  onPageChange,
  onStatusFilterChange,
  onSortChange,
  onSearchChange,
  onView,
  onUpdate,
  className = "",
}) => {
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "all">(
    "all",
  );
  const [sortField, setSortField] = useState<
    "createdAt" | "invoiceNumber" | "totalGross"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowActivity, setRowActivity] = useState<
    Record<string, ActivityStatus>
  >({});

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  /**
   * Handle status filter change
   */
  const handleStatusChange = useCallback(
    (status: InvoiceStatus | "all") => {
      setSelectedStatus(status);
      onPageChange?.(1); // Reset to first page
      onStatusFilterChange?.(status);
    },
    [onStatusFilterChange, onPageChange],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onPageChange?.(1);
      onSearchChange?.(query.trim());
    },
    [onPageChange, onSearchChange],
  );

  /**
   * Handle sort change
   */
  const handleSort = useCallback(
    (field: "createdAt" | "invoiceNumber" | "totalGross") => {
      let newOrder: "asc" | "desc" = "asc";
      if (sortField === field && sortOrder === "asc") {
        newOrder = "desc";
      }
      setSortField(field);
      setSortOrder(newOrder);
      onSortChange?.(field, newOrder);
      onPageChange?.(1); // Reset to first page
    },
    [sortField, sortOrder, onSortChange, onPageChange],
  );

  /**
   * Handle row action
   */
  const handleRowAction = useCallback(
    (invoiceId: string, action: () => void) => {
      setRowActivity((prev) => ({ ...prev, [invoiceId]: "loading" }));
      try {
        action();
        setRowActivity((prev) => ({ ...prev, [invoiceId]: "success" }));
        setTimeout(() => {
          setRowActivity((prev) => ({ ...prev, [invoiceId]: "idle" }));
        }, 1000);
      } catch {
        setRowActivity((prev) => ({ ...prev, [invoiceId]: "error" }));
        setTimeout(() => {
          setRowActivity((prev) => ({ ...prev, [invoiceId]: "idle" }));
        }, 2000);
      }
    },
    [],
  );

  /**
   * Get sort icon/indicator
   */
  const SortIndicator = ({
    field,
  }: {
    field: "createdAt" | "invoiceNumber" | "totalGross";
  }) => {
    if (sortField !== field)
      return <span className="text-muted-foreground ml-1">⇅</span>;
    return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Filters */}
      <Card className="p-5 border-brand-blue/15 bg-white rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto">
            <p className="text-xs font-black uppercase tracking-widest text-foreground/60">
              Filter By Status
            </p>
            <Select
              value={selectedStatus}
              onChange={(val) =>
                handleStatusChange(val as InvoiceStatus | "all")
              }
              className="w-full sm:w-52 mt-2"
              options={[
                { label: "All Invoices", value: "all" },
                { label: "Pending Payment", value: InvoiceStatus.PENDING },
                { label: "Paid", value: InvoiceStatus.PAID },
                { label: "Expired", value: InvoiceStatus.EXPIRED },
              ]}
            />
          </div>

          <div className="w-full sm:w-80">
            <p className="text-xs font-black uppercase tracking-widest text-foreground/60">
              Search Invoice
            </p>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by invoice number"
              className="mt-2 h-10 w-full rounded-md border border-brand-blue/20 bg-white px-3 text-sm text-foreground outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div className="text-sm text-foreground/70 font-medium">
            Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of{" "}
            {totalCount} invoices
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-brand-blue/15 bg-white rounded-2xl">
        {/* Loading State */}
        {isLoading && invoices.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">Loading invoices...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-brand-yellow/10 border border-brand-yellow/30 text-foreground rounded-md m-4">
            <p className="font-semibold">Error loading invoices</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && invoices.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No invoices found</p>
          </div>
        )}

        {/* Data Table */}
        {invoices.length > 0 && (
          <div className="overflow-x-auto">
            <Table className="bg-white text-gray-900">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    className="cursor-pointer text-xs font-semibold hover:bg-brand-blue/5 transition"
                    onClick={() => handleSort("invoiceNumber")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleSort("invoiceNumber");
                    }}
                  >
                    Invoice #<SortIndicator field="invoiceNumber" />
                  </TableHead>

                  <TableHead
                    className="cursor-pointer text-xs font-semibold hover:bg-brand-blue/5 transition"
                    onClick={() => handleSort("createdAt")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleSort("createdAt");
                    }}
                  >
                    Issue Date
                    <SortIndicator field="createdAt" />
                  </TableHead>

                  <TableHead className="text-xs font-semibold">Buyer</TableHead>

                  <TableHead
                    className="text-right cursor-pointer text-xs font-semibold hover:bg-brand-blue/5 transition"
                    onClick={() => handleSort("totalGross")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleSort("totalGross");
                    }}
                  >
                    Amount
                    <SortIndicator field="totalGross" />
                  </TableHead>

                  <TableHead className="text-center text-xs font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="text-right text-xs font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoices.map((invoice) => {
                  const activity = rowActivity[invoice.invoiceId] || "idle";

                  return (
                    <TableRow
                      key={invoice.invoiceId}
                      className={`bg-white hover:bg-brand-blue/5 transition ${
                        activity === "loading" ? "opacity-60" : ""
                      }`}
                    >
                      {/* Invoice Number */}
                      <TableCell className="font-mono text-sm font-semibold">
                        {formatInvoiceNumber(invoice.invoiceNumber)}
                      </TableCell>

                      {/* Issue Date */}
                      <TableCell className="text-sm">
                        {formatInvoiceDate(invoice.createdAt, false)}
                      </TableCell>

                      {/* Buyer Name */}
                      <TableCell className="text-sm">
                        <span className="truncate max-w-xs">
                          {invoice.buyerName}
                        </span>
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell className="text-right text-sm font-semibold font-mono">
                        {formatAmount(invoice.totalGrossAmount)}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="text-center">
                        <InvoiceStatusBadge status={invoice.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRowAction(invoice.invoiceId, () =>
                                  onView(invoice),
                                )
                              }
                              disabled={activity === "loading"}
                              title="View invoice details"
                              className="text-xs"
                            >
                              View
                            </Button>
                          )}

                          {onUpdate && !isInvoicePaid(invoice.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRowAction(invoice.invoiceId, () =>
                                  onUpdate(invoice),
                                )
                              }
                              disabled={activity === "loading"}
                              title="Update invoice"
                              className="text-xs text-brand-blue"
                            >
                              Update
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4 border-brand-blue/15 bg-white rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                ← Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const isActive = page === currentPage;
                  return (
                    <Button
                      key={page}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange?.(page)}
                      disabled={isLoading}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next →
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InvoicesList;

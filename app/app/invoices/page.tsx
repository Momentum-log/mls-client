"use client";

import React from "react";
import { InvoicesSidebar } from "@/components/invoice";

/**
 * Invoices List Page
 *
 * Displays paginated list of all customer invoices with filtering and sorting.
 * Allows users to view, download, email, or update invoices.
 */
export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-10 max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">
          Invoices
        </h1>
        <p className="text-foreground/70 font-medium text-lg">
          View, pay, and update invoice status in one place.
        </p>
      </div>

      <InvoicesSidebar />
    </div>
  );
}

import React from "react";

/**
 * Invoices Layout
 *
 * Wraps invoice pages with common styling and structure.
 */
export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-white">{children}</div>;
}

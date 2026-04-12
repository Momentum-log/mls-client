/**
 * Invoice Receipt View Component
 *
 * Premium, receipt-style invoice display layout that shows:
 * - Invoice header (number, status, date)
 * - Seller/buyer information
 * - Line items table
 * - Tax breakdown and totals
 * - Action buttons (Pay, Download, Email)
 *
 * Shared across the dedicated invoice page and the side drawer.
 *
 * @module components/invoice/InvoiceReceiptView
 */

"use client";

import React from "react";
import {
  Invoice,
  InvoiceLineItem,
  InvoicePaymentLink,
  InvoiceDetailsApiResponse,
} from "@/types/invoice";
import { InvoiceStatusBadge } from "@/components/invoice/InvoiceStatusBadge";
import { ExpirationCountdown } from "@/components/invoice/ExpirationCountdown";
import {
  formatAmount,
  formatInvoiceDate,
  formatTaxRate,
  buildAddressString,
  canUpdateInvoice,
  canPayInvoice,
  isInvoicePaid,
} from "@/utils/invoice-helpers";
import { toDisplayCarrierName } from "@/utils/carrier-branding";
import { useToast } from "@/hooks/use-toast";
import Button from "@/components/ui/button";
import { FiCreditCard, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

/**
 * Props for InvoiceReceiptView component
 */
interface InvoiceReceiptViewProps {
  /** Full invoice data - can be either Invoice or InvoiceDetailsApiResponse */
  invoice: Invoice | InvoiceDetailsApiResponse | null | undefined;
  /** Related shipment ID */
  shipmentId?: string;
  /** Whether to render in a condensed layout (for drawer) */
  condensed?: boolean;
  /** Callback when "Update Shipment" is clicked */
  onUpdateShipment?: () => void;
  /** Callback when "Pay Now" is clicked (overrides default behavior) */
  onPayNow?: () => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * InvoiceReceiptView Component
 *
 * Receipt-style invoice layout for displaying full invoice details.
 * Used by both the dedicated invoice page and the invoice drawer.
 *
 * @example
 * ```tsx
 * <InvoiceReceiptView
 *   invoice={invoiceData}
 *   pdfGenerationStatus="PENDING"
 *   shipmentId="abc-123"
 *   onUpdateShipment={() => setShowUpdateModal(true)}
 * />
 * ```
 */
export const InvoiceReceiptView: React.FC<InvoiceReceiptViewProps> = ({
  invoice,
  shipmentId,
  condensed = false,
  onUpdateShipment,
  onPayNow,
  className = "",
}) => {
  const { addToast } = useToast();

  // Guard against missing invoice data
  if (!invoice) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <p className="text-gray-500">Invoice data is not available.</p>
      </div>
    );
  }

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

  const rawInvoice: Record<string, unknown> = isRecord(invoice) ? invoice : {};

  const getString = (key: string, fallback = ""): string => {
    const value = rawInvoice[key];
    return typeof value === "string" ? value : fallback;
  };

  const getNumberish = (value: unknown, fallback = 0): number => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }

    return fallback;
  };

  const rawBreakdown = isRecord(rawInvoice.breakdown)
    ? rawInvoice.breakdown
    : null;

  const invoiceId = getString("invoiceId") || getString("id");
  const invoiceNumber = getString("invoiceNumber");
  const status = getString("status");
  const createdAt = getString("createdAt") || getString("date");
  const updatedAt = getString("updatedAt");
  const paidAt = getString("paidAt") || null;

  const sellerCompanyName = getString("sellerCompanyName", "MLS Logistics");
  const sellerStreet = getString("sellerStreet");
  const sellerBuildingNumber = getString("sellerBuildingNumber");
  const sellerApartmentNumber = getString("sellerApartmentNumber");
  const sellerCity = getString("sellerCity");
  const sellerPostalCode = getString("sellerPostalCode");
  const sellerNIP = getString("sellerNIP");

  const buyerName = getString("buyerName");
  const buyerStreet = getString("buyerStreet");
  const buyerBuildingNumber = getString("buyerBuildingNumber");
  const buyerCity = getString("buyerCity");
  const buyerPostalCode = getString("buyerPostalCode");
  const buyerApartmentNumber = getString("buyerApartmentNumber");

  const totalNetAmount =
    getNumberish(rawInvoice.totalNetAmount) ||
    getNumberish(rawInvoice.basePrice) ||
    getNumberish(rawBreakdown?.basePrice) ||
    getNumberish(rawBreakdown?.base);

  const totalVATAmount =
    getNumberish(rawInvoice.totalVATAmount) ||
    getNumberish(rawInvoice.taxAmount) ||
    getNumberish(rawBreakdown?.taxAmount) ||
    getNumberish(rawBreakdown?.tax);

  const totalGrossAmount =
    getNumberish(rawInvoice.totalGrossAmount) ||
    getNumberish(rawInvoice.totalAmount) ||
    getNumberish(rawBreakdown?.totalAmount) ||
    getNumberish(rawBreakdown?.total) ||
    totalNetAmount + totalVATAmount;

  const currency = getString("currency", "PLN");
  const lineItems = Array.isArray(rawInvoice.lineItems)
    ? (rawInvoice.lineItems as InvoiceLineItem[])
    : [];

  const paymentLinks = Array.isArray(rawInvoice.paymentLinks)
    ? (rawInvoice.paymentLinks as InvoicePaymentLink[])
    : [];

  const activePaymentLink =
    paymentLinks.find((link) => link.status === "active") || null;
  const paymentLinkUrl =
    getString("paymentLink") || activePaymentLink?.paymentLinkUrl || null;
  const paymentLinkExpiresAt =
    activePaymentLink?.expiresAt || getString("expiresAt") || null;

  const paid = status ? isInvoicePaid(status) : false;
  const showUpdateBtn = status ? canUpdateInvoice(status) : false;
  const showPayBtn = status ? canPayInvoice(status) : false;

  /**
   * Handles the Pay Now action
   */
  const handlePayNow = () => {
    if (onPayNow) {
      onPayNow();
      return;
    }

    if (paymentLinkUrl) {
      window.location.href = paymentLinkUrl;
    } else {
      addToast({
        title: "Payment Unavailable",
        message: "No active payment link found. Try updating your shipment.",
        type: "error",
      });
    }
  };

  /** Whether the payment link is expired */
  const isLinkExpired =
    paymentLinkExpiresAt &&
    new Date(paymentLinkExpiresAt).getTime() < Date.now();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ── Expiration Countdown Banner ── */}
      {!paid && paymentLinkExpiresAt && (
        <ExpirationCountdown
          expiresAt={paymentLinkExpiresAt}
          variant="banner"
          onUpdateShipment={showUpdateBtn ? onUpdateShipment : undefined}
        />
      )}

      {/* ── Paid Confirmation Banner ── */}
      {paid && (
        <div className="w-full p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-900">Payment Received</p>
            <p className="text-xs text-green-700 font-medium">
              Paid on{" "}
              {paidAt
                ? formatInvoiceDate(paidAt, false)
                : formatInvoiceDate(updatedAt, false)}
            </p>
          </div>
        </div>
      )}

      {/* ── Receipt Card ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              Invoice
            </p>
            <h2 className="text-lg font-mono font-black text-gray-900 tracking-tight">
              {invoiceNumber}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Issued {formatInvoiceDate(createdAt, false)}
            </p>
          </div>
          <InvoiceStatusBadge status={status} />
        </div>

        {/* Seller & Buyer */}
        {!condensed && (
          <div className="px-8 py-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seller */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                From
              </p>
              <p className="font-bold text-gray-900 text-sm">
                {sellerCompanyName}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {buildAddressString(
                  sellerStreet,
                  sellerBuildingNumber,
                  sellerCity,
                  sellerPostalCode,
                  sellerApartmentNumber,
                )}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1">
                NIP: {sellerNIP}
              </p>
            </div>

            {/* Buyer */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                To
              </p>
              <p className="font-bold text-gray-900 text-sm">{buyerName}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {buildAddressString(
                  buyerStreet,
                  buyerBuildingNumber,
                  buyerCity,
                  buyerPostalCode,
                  buyerApartmentNumber,
                )}
              </p>
            </div>
          </div>
        )}

        {/* Line Items */}
        <div className="px-8 py-6 border-b border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
            Services
          </p>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-50">
            <div className="col-span-5">Description</div>
            <div className="col-span-1 text-right">Qty</div>
            <div className="col-span-2 text-right">Net Price</div>
            <div className="col-span-1 text-center">VAT</div>
            <div className="col-span-3 text-right">Gross</div>
          </div>

          {/* Line Items */}
          {(lineItems ?? []).map((item, index: number) => (
            <div
              key={item.lineItemId || index}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 py-4 border-b border-gray-50 last:border-0"
            >
              {/* Mobile: stacked */}
              <div className="col-span-5">
                <p className="font-bold text-gray-900 text-sm">
                  {toDisplayCarrierName(item.serviceName)}
                </p>
                <p className="text-[10px] text-gray-400 font-medium md:hidden">
                  {item.quantity} × {formatAmount(item.unitNetPrice, false)} •
                  VAT {formatTaxRate(item.taxRate)}
                </p>
              </div>
              <div className="hidden md:block col-span-1 text-right text-sm text-gray-700">
                {item.quantity}
              </div>
              <div className="hidden md:block col-span-2 text-right text-sm text-gray-700 font-mono">
                {formatAmount(item.unitNetPrice, false)}
              </div>
              <div className="hidden md:block col-span-1 text-center text-xs text-gray-500">
                {formatTaxRate(item.taxRate || 0)}
              </div>
              <div className="col-span-3 text-right font-bold text-gray-900 text-sm font-mono">
                {formatAmount(item.grossValue, false)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-8 py-6 w-full">
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Net Amount</span>
              <span className="text-gray-700 font-mono">
                {formatAmount(totalNetAmount ?? 0, false)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">
                VAT ({(totalVATAmount ?? 0) > 0 ? "23%" : "0%"})
              </span>
              <span className="text-gray-700 font-mono">
                {formatAmount(totalVATAmount ?? 0, false)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-black text-gray-900 font-mono">
                {formatAmount(totalGrossAmount ?? 0)}{" "}
                <span className="text-xs font-bold text-gray-500 uppercase">
                  {currency ?? "PLN"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Pay Now */}
          {showPayBtn && !isLinkExpired && (
            <Button
              variant="primary"
              size="lg"
              className="flex-1 h-14 rounded-2xl text-base font-black shadow-lg shadow-brand-blue/20"
              onClick={handlePayNow}
            >
              <FiCreditCard className="mr-2 w-5 h-5" />
              Pay Now
            </Button>
          )}

          {showPayBtn && isLinkExpired && (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-2xl text-base font-bold"
              disabled
            >
              Payment Link Expired
            </Button>
          )}
        </div>

        {/* Inline expiration countdown near Pay */}
        {!paid && paymentLinkExpiresAt && (
          <div className="text-center">
            <ExpirationCountdown
              expiresAt={paymentLinkExpiresAt}
              variant="inline"
            />
          </div>
        )}
      </div>

      {/* ── Update Shipment CTA ── */}
      {showUpdateBtn && onUpdateShipment && (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-brand-blue/10 rounded-xl shrink-0">
              <FiRefreshCw className="w-5 h-5 text-brand-blue" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                Update Shipment
              </h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                Select a new rate or renew an expired invoice. Your existing
                shipment and invoice will be updated.
              </p>
              <Button
                variant="outline"
                onClick={onUpdateShipment}
                className="rounded-xl"
              >
                <FiRefreshCw className="mr-2 w-4 h-4" />
                Update Shipment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

InvoiceReceiptView.displayName = "InvoiceReceiptView";

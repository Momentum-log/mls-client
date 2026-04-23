"use client";

import React, { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { InvoiceReceipt } from "@/components/invoice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  usePaymentInvoice,
  useRequestShipmentInvoice,
} from "@/hooks/payments/use-payments";

/**
 * Payment Success Page
 *
 * Displays after a successful payment is completed.
 * Shows invoice receipt and provides options to request invoice processing or view full invoice.
 */
export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const shipmentId = searchParams.get("shipmentId");
  const invoiceId = searchParams.get("invoiceId");
  const transactionId = searchParams.get("transactionId");
  const paymentMethod = searchParams.get("paymentMethod") || "PayU";

  // Fetch invoice using payment hook
  const {
    data: invoice,
    isLoading,
    error: invoiceError,
  } = usePaymentInvoice(invoiceId || "", Boolean(invoiceId));

  // Request shipment invoice mutation
  const { mutateAsync: requestInvoice, isPending: isRequestingInvoice } =
    useRequestShipmentInvoice();

  /**
   * Handle shipment invoice request
   */
  const handleRequestShipmentInvoice = useCallback(async () => {
    if (!shipmentId) {
      toast({
        title: "Request Error",
        message: "Shipment ID is missing. Unable to request invoice.",
        type: "error",
      });
      return;
    }

    try {
      await requestInvoice({ shipmentId });

      toast({
        title: "Request Submitted",
        message:
          "Your shipment invoice request has been submitted successfully.",
        type: "success",
      });
    } catch (err) {
      toast({
        title: "Request Error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to submit shipment invoice request",
        type: "error",
      });
    }
  }, [shipmentId, requestInvoice, toast]);

  /**
   * Handle view full invoice
   */
  const handleViewInvoice = useCallback(() => {
    if (invoice) {
      router.push(`/app/invoices/${invoice.invoiceId}`);
    }
  }, [invoice, router]);

  /**
   * Handle back to dashboard
   */
  const handleReturnToDashboard = useCallback(() => {
    router.push("/app/dashboard");
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 max-w-4xl px-4">
        <div className="space-y-6 animate-pulse">
          <div className="h-32 w-full bg-muted rounded-lg" />
          <div className="h-96 w-full bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (invoiceError || !invoice) {
    return (
      <div className="container mx-auto py-20 max-w-lg px-4 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Something Went Wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              {invoiceError?.message ||
                "We could not retrieve your payment confirmation."}
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleReturnToDashboard}
              variant="default"
              className="w-full"
            >
              Return to Dashboard
            </Button>
            {shipmentId && (
              <Button
                onClick={() => router.push(`/app/shipments/${shipmentId}`)}
                variant="outline"
                className="w-full"
              >
                View Shipment
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl px-4">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-foreground mb-2">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground text-lg">
          Your shipment has been confirmed and is now being processed.
        </p>
      </div>

      {/* Invoice Receipt */}
      <InvoiceReceipt
        invoice={invoice}
        transactionId={transactionId || undefined}
        paymentMethod={paymentMethod}
        onRequestShipmentInvoice={handleRequestShipmentInvoice}
        onViewDetails={handleViewInvoice}
        isRequestingShipmentInvoice={isRequestingInvoice}
      />

      {/* Next Steps */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4">
          What&apos;s Next?
        </h3>
        <ul className="space-y-3 text-blue-800 dark:text-blue-200 text-sm">
          <li className="flex gap-3">
            <span className="text-base">✓</span>
            <span>
              Your shipment will be picked up according to the schedule you
              selected.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-base">✓</span>
            <span>
              You&apos;ll receive email updates about your package&apos;s
              progress.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-base">✓</span>
            <span>
              Track your shipment in real-time from the Shipments Dashboard.
            </span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push(`/app/shipments/${shipmentId}`)}
          variant="default"
          className="flex-1"
        >
          View Shipment Details
        </Button>
        <Button
          onClick={handleReturnToDashboard}
          variant="outline"
          className="flex-1"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

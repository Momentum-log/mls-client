/**
 * Hook for Invoice Generation during Shipment Payment Flow
 *
 * Integrates invoice generation into the shipment creation process.
 * Generates invoice after shipment is created, stores invoiceId in store,
 * and provides methods to confirm invoice with selected payment method.
 *
 * @module hooks/invoices/useInvoicePaymentFlow
 */

import { useCallback, useState } from "react";
import { useInvoices } from "./useInvoices";
import { useShipmentStore } from "@/store/shipment-store";
import {
  GenerateInvoiceRequest,
  GenerateInvoiceResponse,
  ConfirmInvoiceResponse,
  PaymentMethod,
} from "@/types/invoice";
import { handleApiError, UserFriendlyError } from "@/utils/error-handler";

/**
 * State for invoice payment flow
 */
export interface InvoicePaymentFlowState {
  loading: boolean;
  confirming: boolean;
  invoiceError: UserFriendlyError | null;
  confirmError: UserFriendlyError | null;
}

/**
 * Hook for managing invoice generation during shipment payment
 *
 * @returns Object with invoice flow methods and state
 *
 * @example
 * ```tsx
 * const { generateInvoiceFromShipment, confirmInvoicePayment, state } =
 *   useInvoicePaymentFlow();
 *
 * const handleShipmentCreated = async (shipmentId: string) => {
 *   const invoice = await generateInvoiceFromShipment(shipmentId);
 *   if (invoice) {
 *     // Show invoice preview to user
 *     setShowInvoicePreview(true);
 *   }
 * };
 * ```
 */
export const useInvoicePaymentFlow = () => {
  const { generateInvoice, confirmInvoice } = useInvoices();
  const { setInvoiceId: setShipmentInvoiceId } = useShipmentStore();

  const [state, setState] = useState<InvoicePaymentFlowState>({
    loading: false,
    confirming: false,
    invoiceError: null,
    confirmError: null,
  });

  /**
   * Generate invoice from shipment details
   *
   * Called after shipment is successfully created. Generates an invoice
   * with the shipment ID and stores it in the invoice store.
   *
   * @param shipmentId - ID of the created shipment
   * @returns Generated invoice or null if generation failed
   */
  const generateInvoiceFromShipment = useCallback(
    async (shipmentId: string): Promise<GenerateInvoiceResponse | null> => {
      try {
        setState((prev) => ({ ...prev, loading: true, invoiceError: null }));

        // Generate invoice with shipment ID
        const request: GenerateInvoiceRequest = {
          shipmentId,
          deliveryMethod: "download",
        };

        const generatedInvoice = await generateInvoice(request);

        setState((prev) => ({
          ...prev,
          loading: false,
        }));

        // Store invoice ID in shipment store for reference
        if (generatedInvoice) {
          setShipmentInvoiceId(generatedInvoice.invoiceId);
        }

        return generatedInvoice;
      } catch (error) {
        const handled = handleApiError(error);

        setState((prev) => ({
          ...prev,
          loading: false,
          invoiceError: handled,
        }));

        // Log error in development
        if (process.env.NODE_ENV === "development") {
          console.error("[Invoice Generation Error]", {
            shipmentId,
            error: handled,
          });
        }

        return null;
      }
    },
    [generateInvoice, setShipmentInvoiceId],
  );

  /**
   * Confirm invoice with payment method
   *
   * Called after user confirms they want to proceed to payment.
   * Confirms the invoice with the selected payment method (PayU or Stripe).
   *
   * @param invoiceId - ID of the invoice to confirm
   * @param paymentMethod - Payment method selected (payu or stripe)
   * @returns Confirmed invoice or null if confirmation failed
   */
  const confirmInvoicePayment = useCallback(
    async (
      invoiceId: string,
      paymentMethod: "payu" | "stripe",
    ): Promise<ConfirmInvoiceResponse | null> => {
      try {
        setState((prev) => ({ ...prev, confirming: true, confirmError: null }));

        // Map frontend payment method to backend PaymentMethod type
        const backendPaymentMethod: PaymentMethod =
          paymentMethod === "payu" ? PaymentMethod.PAYU : PaymentMethod.STRIPE;

        const confirmedInvoice = await confirmInvoice({
          invoiceId,
          paymentMethod: backendPaymentMethod,
        });

        setState((prev) => ({
          ...prev,
          confirming: false,
        }));

        return confirmedInvoice;
      } catch (error) {
        const handled = handleApiError(error);

        setState((prev) => ({
          ...prev,
          confirming: false,
          confirmError: handled,
        }));

        // Log error in development
        if (process.env.NODE_ENV === "development") {
          console.error("[Invoice Confirmation Error]", {
            invoiceId,
            paymentMethod,
            error: handled,
          });
        }

        return null;
      }
    },
    [confirmInvoice],
  );

  /**
   * Reset invoice state
   */
  const resetInvoiceState = useCallback(() => {
    setState({
      loading: false,
      confirming: false,
      invoiceError: null,
      confirmError: null,
    });
  }, []);

  /**
   * Check if invoice is ready for confirmation
   */
  const isInvoiceReady = useCallback(() => {
    return !state.loading && state.invoiceError === null;
  }, [state]);

  return {
    // State
    state,
    isLoading: state.loading,
    isConfirming: state.confirming,
    invoiceError: state.invoiceError,
    confirmError: state.confirmError,

    // Methods
    generateInvoiceFromShipment,
    confirmInvoicePayment,
    resetInvoiceState,
    isInvoiceReady,
  };
};

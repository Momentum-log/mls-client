"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPayment } from "@/api/payments";
import { VerifyPaymentResponse } from "@/types/payments";
import Button from "@/components/ui/button";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";
import CopyButton from "@/components/ui/copy-button";
import { extractApiError } from "@/utils/error-handler";
import Link from "next/link";

/** PayU can sit in PENDING for a while; stop polling after about two minutes. */
const MAX_PENDING_POLLS = 24;

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const shipmentId = searchParams.get("shipment_id");
  const orderId = searchParams.get("order_id");

  const hasSession = !!sessionId || !!shipmentId || !!orderId;

  const [loading, setLoading] = useState(hasSession);
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null);
  const [pollsExhausted, setPollsExhausted] = useState(false);

  // Prevent double invocation in strict mode
  const hasCalled = useRef(false);
  const pendingPolls = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    },
    [],
  );

  // Verifies, polling while PayU answers PENDING. PENDING means PayU is still
  // processing and the customer may already have paid, so it is asked again
  // after the delay the server gives and never shown as a failure.
  const runVerification = useCallback(async (): Promise<void> => {
    for (;;) {
      let data: VerifyPaymentResponse;
      try {
        const queryString = searchParams.toString();
        data = await verifyPayment(queryString ? `?${queryString}` : "");
      } catch (err: unknown) {
        console.error("Verification failed:", err);
        const { message } = extractApiError(err);
        data = {
          status: "FAILED",
          paymentStatus: "unknown",
          shipmentStatus: "FAILED",
          message: message || "Verification request failed.",
        };
      }
      setResult(data);

      if (data.status !== "PENDING") break;
      if (pendingPolls.current >= MAX_PENDING_POLLS) {
        setPollsExhausted(true);
        break;
      }
      pendingPolls.current += 1;
      // A cleared timer (unmount, or a manual re-check) never resolves, which
      // ends this loop.
      await new Promise((resolve) => {
        pollTimer.current = setTimeout(
          resolve,
          (data.retryAfterSeconds ?? 5) * 1000,
        );
      });
    }
    setLoading(false);
  }, [searchParams]);

  // "Try Again" / "Check Again": start a fresh round of polling.
  const handleVerify = useCallback(() => {
    if (pollTimer.current) clearTimeout(pollTimer.current);
    pendingPolls.current = 0;
    setPollsExhausted(false);
    setLoading(true);
    runVerification();
  }, [runVerification]);

  useEffect(() => {
    if (!hasSession || hasCalled.current) return;
    hasCalled.current = true;

    runVerification();
  }, [hasSession, runVerification]);

  // Defensive Check: Valid success means STATUS is SUCCESS AND Tracking Number exists
  const isSuccess = result?.status === "SUCCESS" && !!result?.trackingNumber;
  const isPending = result?.status === "PENDING";
  // Stripe returns only `session_id`; the tracking number opens the same
  // shipment, since get-shipment accepts either.
  const shipmentRef = shipmentId || result?.trackingNumber;

  // Give the user a moment to see the confirmation, then take them straight
  // into the shipment they just paid for.
  useEffect(() => {
    if (!isSuccess) return;

    const timer = setTimeout(() => {
      router.push(shipmentRef ? `/app/shipments/${shipmentRef}` : "/app/shipments");
    }, 1800);

    return () => clearTimeout(timer);
  }, [isSuccess, shipmentRef, router]);

  if (!hasSession) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 font-work-sans">
            Invalid Session
          </h2>
          <p className="text-gray-600 mb-8 font-medium">
            We couldn&apos;t identify your payment session. Please return to the
            dashboard.
          </p>
          <Link href="/app/dashboard">
            <Button variant="primary" size="lg" className="w-full rounded-xl">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          {pollsExhausted ? (
            <FiClock className="w-12 h-12 text-brand-blue mx-auto mb-4" />
          ) : (
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          )}
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {pollsExhausted
              ? "Payment Still Processing"
              : "Confirming Your Payment..."}
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            {pollsExhausted
              ? "PayU hasn't confirmed it yet. Don't pay again: we'll email you as soon as it's through, and your shipment will update on its own."
              : "PayU is still processing your payment. This page updates by itself."}
          </p>
          {pollsExhausted && (
            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                className="w-full rounded-xl"
                onClick={handleVerify}
              >
                Check Again
              </Button>
              <Link href={shipmentRef ? `/app/shipments/${shipmentRef}` : "/app/shipments"}>
                <Button variant="ghost" className="w-full rounded-xl">
                  Go to My Shipment
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Finalizing Shipment...
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Securing your label and tracking number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-2">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {isSuccess ? (
          // SUCCESS STATE
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
              <FiCheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight font-work-sans">
              Shipment Confirmed!
            </h1>
            <p className="text-gray-500 mb-8 font-medium">
              Taking you to your shipment now.
            </p>

            {/* Tracking Info Card */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Tracking Number
                </span>
                <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                  MLS Express
                </span>
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-xl md:text-2xl font-black text-gray-900 font-mono tracking-tight">
                  {result?.trackingNumber}
                </span>
                <CopyButton text={result?.trackingNumber || ""} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="h-6 w-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">
                Redirecting you to your shipment&hellip;
              </p>
            </div>
          </div>
        ) : (
          // FAILURE STATE
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FiXCircle className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight font-work-sans">
              Payment Failed
            </h1>
            <p className="text-gray-500 mb-8 font-medium px-4">
              {result?.message ||
                "We couldn't process your payment. No charges were made."}
            </p>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Need Help?</h4>
                  <p className="text-xs text-red-700 mt-1">
                    Identifier:{" "}
                    <span className="font-mono bg-white/50 px-1 rounded">
                      {(sessionId || shipmentId || orderId || "N/A").slice(0, 12)}...
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleVerify}
                className="w-full h-14 rounded-xl text-lg shadow-lg shadow-brand-blue/20"
              >
                Try Again <FiArrowRight className="ml-2" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push("/app/dashboard")}
                className="w-full h-12 rounded-xl text-gray-500 hover:text-gray-900"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

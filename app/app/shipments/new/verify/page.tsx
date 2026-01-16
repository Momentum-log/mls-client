"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPayment } from "@/api/payments";
import { VerifyPaymentResponse } from "@/types/shipping";
import Button from "@/components/ui/button";
import {
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiDownload,
  FiAlertCircle,
  FiArrowRight,
  FiHome,
} from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/ui/copy-button";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { addToast: toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null);

  // Prevent double invocation in strict mode
  const hasCalled = useRef(false);

  // Re-usable verification handler
  const handleVerify = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const data = await verifyPayment(sessionId);
      setResult(data);
    } catch (err: any) {
      console.error("Verification failed:", err);
      setResult({
        status: "FAILED",
        paymentStatus: "unknown",
        shipmentStatus: "FAILED",
        message: err.response?.data?.message || "Verification request failed.",
        trackingNumber: undefined,
        labelUrl: "",
      } as VerifyPaymentResponse);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    if (hasCalled.current) return;
    hasCalled.current = true;

    handleVerify();
  }, [sessionId]);

  // Defensive Check: Valid success means STATUS is SUCCESS AND Tracking Number exists
  const isSuccess = result?.status === "SUCCESS" && !!result?.trackingNumber;

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {isSuccess ? (
          // SUCCESS STATE
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
              <FiCheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight font-work-sans">
              Shipment Confirmed!
            </h1>
            <p className="text-gray-500 mb-8 font-medium">
              Your package is ready to move. Download your label below.
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

            <div className="space-y-3">
              {result?.labelUrl ? (
                <a
                  href={result.labelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-14 rounded-xl text-lg shadow-lg shadow-brand-blue/20"
                  >
                    <FiDownload className="mr-2" /> Download Label
                  </Button>
                </a>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-medium">
                  Label generation pending. Please check "My Shipments" shortly.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/app/shipments")}
                  className="h-12 rounded-xl border-gray-200 hover:border-brand-blue text-gray-600 hover:text-brand-blue"
                >
                  <FiTruck className="mr-2" /> Track
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/app/dashboard")}
                  className="h-12 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                >
                  <FiHome className="mr-2" /> Dashboard
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // FAILURE STATE
          <div className="p-8 md:p-12 text-center">
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
                    Session ID:{" "}
                    <span className="font-mono bg-white/50 px-1 rounded">
                      {sessionId?.slice(0, 12)}...
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

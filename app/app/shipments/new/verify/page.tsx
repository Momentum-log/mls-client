"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/api";
import { VerifyPaymentResponse } from "@/types/shipping";
import Button from "@/components/ui/button";
import { FiCheckCircle, FiXCircle, FiTruck, FiDownload } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { addToast: toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null);

  // Prevent double invocation in strict mode
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    if (hasCalled.current) return;
    hasCalled.current = true;

    const verify = async () => {
      try {
        const response = await apiClient.get<VerifyPaymentResponse>(
          `/payments/verify?session_id=${sessionId}`
        );
        setResult(response.data);
      } catch (err: any) {
        console.error("Verification failed:", err);
        setResult({
          status: "FAILED",
          paymentStatus: "unknown",
          shipmentStatus: "FAILED",
          message:
            err.response?.data?.message || "Verification request failed.",
        });
        toast({
          title: "Verification Error",
          message: "Could not verify payment status.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId, toast]);

  if (!sessionId) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl border border-gray-200 text-center">
        <FiXCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Invalid Session
        </h2>
        <p className="text-gray-600 mb-6">
          No session ID was found in the URL.
        </p>
        <Button onClick={() => router.push("/app/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl border border-gray-200 text-center">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900">
          Verifying Payment...
        </h2>
        <p className="text-gray-600 mt-2">
          Please wait while we confirm your shipment.
        </p>
      </div>
    );
  }

  const isSuccess = result?.status === "SUCCESS";

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
      {isSuccess ? (
        <>
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your shipment has been created successfully.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg text-left space-y-3 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">
                Tracking Number:
              </span>
              <span className="text-gray-900 font-bold">
                {result?.trackingNumber || "Generating..."}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Payment Status:</span>
              <span className="text-brand-blue font-semibold uppercase">
                {result?.paymentStatus}
              </span>
            </div>

            {result?.labelUrl && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <a
                  href={result.labelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors"
                >
                  <FiDownload /> Download Shipping Label
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/app/dashboard")}
            >
              Go to Dashboard
            </Button>
            <Button onClick={() => router.push("/app/shipments")}>
              <FiTruck className="mr-2" /> View Shipments
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiXCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-red-500 mb-6 font-medium">
            {result?.message || "There was an issue verifying your payment."}
          </p>
          <p className="text-gray-600 mb-8 text-sm">
            If you have been charged, please contact support with Session ID:{" "}
            <br />
            <code className="bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
              {sessionId}
            </code>
          </p>

          <Button onClick={() => router.push("/app/shipments/new/summary")}>
            Try Again
          </Button>
        </>
      )}
    </div>
  );
}

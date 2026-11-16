"use client";

import React from "react";
import { AccountCard } from "@/components/account/AccountStack";
import BillingForm from "@/components/billing/billing-form";
import { useBillingProfile } from "@/hooks/billing/use-billing";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

/**
 * Billing details on the account page: the same form the shipment flow uses,
 * so there is one place to change them.
 */
export default function BillingAccountCard() {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const { data, isLoading, isError, refetch } = useBillingProfile();

  return (
    <AccountCard
      title="Billing details"
      description="Who your invoices are issued to. Saved once, used for every shipment."
    >
      {isLoading && (
        <div role="status" aria-live="polite" className="text-sm text-gray-500">
          Loading your billing details…
        </div>
      )}
      {isError && (
        <p role="alert" className="m-0 text-sm text-gray-600">
          We could not load your billing details.{" "}
          <button
            type="button"
            onClick={() => void refetch()}
            className="font-bold text-brand-blue underline"
          >
            Try again
          </button>
        </p>
      )}
      {data && (
        <BillingForm
          profile={data.profile}
          prefill={data.prefill}
          defaultPhone={user?.phone}
          submitLabel="Save billing details"
          onSaved={() =>
            addToast({
              title: "Saved",
              message: "Billing details saved.",
              type: "success",
            })
          }
        />
      )}
    </AccountCard>
  );
}

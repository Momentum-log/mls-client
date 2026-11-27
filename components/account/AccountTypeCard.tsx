"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountCard } from "@/components/account/AccountStack";
import {
  useAccountChangeStatus,
  useCancelAccountChange,
  useRequestBusinessAccount,
  useRequestIndividualAccount,
} from "@/hooks/auth/use-account-change";
import { extractApiError } from "@/utils/error-handler";

/**
 * Business / individual account changes. An individual can always ask to become
 * a business; a business can ask to go back only when an admin allows it (the
 * server says so with `canRequestDowngrade`). An admin approves both, and
 * nothing changes until then.
 */
export default function AccountTypeCard() {
  const { data, isLoading, isError } = useAccountChangeStatus();
  const upgrade = useRequestBusinessAccount();
  const downgrade = useRequestIndividualAccount();
  const cancel = useCancelAccountChange();

  const [companyName, setCompanyName] = useState("");
  const [nip, setNip] = useState("");
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (isLoading || isError || !data) return null;

  const pending = data.latestRequest?.status === "PENDING" ? data.latestRequest : null;
  const rejected =
    data.latestRequest?.status === "REJECTED" && !pending ? data.latestRequest : null;
  const isBusiness = data.accountType === "BUSINESS";

  const fail = (error: unknown): void => setMessage(extractApiError(error).message);

  const submitUpgrade = (event: React.FormEvent): void => {
    event.preventDefault();
    setMessage(null);
    upgrade.mutate(
      { companyName: companyName.trim(), nip: nip.trim() },
      { onSuccess: () => setOpen(false), onError: fail },
    );
  };

  const submitDowngrade = (event: React.FormEvent): void => {
    event.preventDefault();
    setMessage(null);
    downgrade.mutate({ reason: reason.trim() }, { onSuccess: () => setOpen(false), onError: fail });
  };

  return (
    <AccountCard
      title="Business account"
      description={
        isBusiness
          ? "Your account is a business account. Invoices can be issued to your company."
          : "Ordering for a company? Request a business account and we will review it."
      }
    >
      <div className="space-y-4">
        {pending && (
          <div role="status" className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
            <p className="m-0 font-semibold">
              {pending.direction === "DOWNGRADE"
                ? "Your request to switch to an individual account is waiting for review."
                : `Your business account request for ${pending.companyName ?? "your company"} is waiting for review.`}
            </p>
            <Button
              type="button"
              variant="ghost"
              disabled={cancel.isPending}
              onClick={() => cancel.mutate(pending.id, { onError: fail })}
            >
              Withdraw request
            </Button>
          </div>
        )}

        {rejected && (
          <p role="alert" className="m-0 rounded-xl bg-warning-bg px-4 py-3 text-sm text-warning-fg">
            Your last request was not approved{rejected.adminFeedback ? `: ${rejected.adminFeedback}` : "."}
          </p>
        )}

        {message && (
          <p role="alert" className="m-0 rounded-xl bg-warning-bg px-4 py-3 text-sm text-warning-fg">
            {message}
          </p>
        )}

        {!pending && data.canRequestUpgrade && !open && (
          <Button type="button" onClick={() => setOpen(true)}>
            Request a business account
          </Button>
        )}

        {!pending && !isBusiness && open && (
          <form onSubmit={submitUpgrade} className="space-y-4">
            <Input
              id="upgrade-company"
              label="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <Input
              id="upgrade-nip"
              label="NIP (Polish tax ID)"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={upgrade.isPending}>
                {upgrade.isPending ? "Sending…" : "Send for review"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {!pending && data.canRequestDowngrade && !open && (
          <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
            Switch back to an individual account
          </Button>
        )}

        {!pending && isBusiness && data.canRequestDowngrade && open && (
          <form onSubmit={submitDowngrade} className="space-y-4">
            <Input
              id="downgrade-reason"
              label="Why are you switching?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={5}
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={downgrade.isPending}>
                {downgrade.isPending ? "Sending…" : "Send for review"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </AccountCard>
  );
}

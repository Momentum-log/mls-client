"use client";

import React, { useState } from "react";
import { Laptop } from "lucide-react";
import Button from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useLogoutAll } from "@/hooks/auth/use-auth";

const formatExpiry = (expiresAt: string) => {
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

/**
 * Shows the current session and offers a global sign-out.
 *
 * @remarks Not a device list — the API exposes no session-listing endpoint, only
 * `logout-user` (this device) and `logout-all` (every device). This shows the
 * one session the client actually knows about: its own.
 */
const SessionSecurityCard = () => {
  const session = useAuthStore((state) => state.session);
  const { mutate: logoutEverywhere, isPending } = useLogoutAll();
  const [isConfirming, setIsConfirming] = useState(false);

  // Anyone signed in before the server started returning session metadata has
  // nothing to show here; they get it on their next sign-in.
  if (!session) return null;

  const expiry = formatExpiry(session.expiresAt);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <Laptop className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {session.deviceLabel || "This device"}
            <span className="ml-2 text-xs font-medium text-green-600">
              Current session
            </span>
          </p>
          {expiry && (
            <p className="text-xs text-gray-500 mt-0.5">
              Signed in until {expiry}
            </p>
          )}
        </div>
      </div>

      <div className="pt-1 border-t border-gray-100">
        {isConfirming ? (
          <div className="pt-4 space-y-3">
            <p className="text-sm text-gray-700">
              This signs you out on every device, including this one. Continue?
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => logoutEverywhere()}
                isLoading={isPending}
              >
                Yes, sign out everywhere
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsConfirming(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-500 mb-3">
              Signed in somewhere you don&apos;t recognise? End every session at
              once.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirming(true)}
            >
              Sign out on every device
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSecurityCard;

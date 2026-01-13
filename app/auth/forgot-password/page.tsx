"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword, resetPassword } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import Link from "next/link";

/**
 * Unified Forgot Password page.
 * Phase 1: Request code via email.
 * Phase 2: Enter code and new password.
 */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await forgotPassword(email);
      addToast({
        title: "Success",
        message: "Check your email for the reset code.",
        type: "success",
      });
      setStep("reset");
    } catch (error: any) {
      addToast({
        title: "Error",
        message: error.response?.data?.error || "Failed to send reset code",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword) return;

    if (newPassword !== confirmPassword) {
      addToast({
        title: "Error",
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ code, newPassword });
      addToast({
        title: "Success",
        message: "Password reset successfully! You can now login.",
        type: "success",
      });
      router.push("/login");
    } catch (error: any) {
      addToast({
        title: "Error",
        message: error.response?.data?.error || "Failed to reset password",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">
            {step === "request" ? "Forgot Password?" : "Reset Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === "request"
              ? "No worries, we'll send you reset instructions."
              : "Enter the code we sent to your email and your new password."}
          </p>
        </div>

        {step === "request" ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequest}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading || !email}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Button>
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-bold text-brand-blue hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  name="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="6-DIGIT CODE"
                  className="text-center text-xl font-bold tracking-widest uppercase"
                  disabled={isLoading}
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading || !code || !newPassword}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("request")}
                className="w-full text-sm font-bold text-brand-blue hover:underline"
              >
                Back to email entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

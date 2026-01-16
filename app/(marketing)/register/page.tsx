"use client";

import React from "react";
import RegisterForm from "@/components/auth/register-form";
import AuthShowcase from "@/components/auth/auth-showcase";
import Link from "next/link";
import Image from "next/image";
import logoLandscape from "@/public/images/logo-landscape.svg";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Form Section */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white py-12 lg:py-0">
        <div className="w-full max-w-sm mx-auto lg:w-96 space-y-8">
          {/* Logo only visible on mobile here, typically header handles it but for auth pages we might want clean layout */}

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black font-work-sans tracking-tight text-gray-900">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join Momentum to ship smarter and faster.
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-brand-blue">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-brand-blue">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right: Showcase Section (Hidden on mobile) */}
      <div className="hidden lg:block relative bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <AuthShowcase />
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import LoginForm from "@/components/auth/login-form";
import AuthShowcase from "@/components/auth/auth-showcase";
import Link from "next/link";
import Image from "next/image";
import logoLandscape from "@/public/images/logo-landscape.svg";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Form Section */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white py-12 lg:py-0">
        <div className="w-full max-w-sm mx-auto lg:w-96 space-y-8">
          <div className="lg:hidden mb-8">
            <Link href="/">
              <div className="relative w-32 h-10">
                <Image
                  src={logoLandscape}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black font-work-sans tracking-tight text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in.
            </p>
          </div>

          <LoginForm />
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

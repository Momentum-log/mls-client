"use client"; // Should be client component or wrap client component

import React from "react";
import ProfileForm from "@/components/auth/profile-form";
import { useAuthStore } from "@/store/auth-store";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-brand-blue/5 rounded-xl p-6">
            <h3 className="font-semibold text-brand-blue mb-2">
              Welcome, {user?.name?.split(" ")[0]}!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage your profile and settings here.
            </p>
            <div className="bg-brand-yellow/20 inline-block px-3 py-1 rounded-full text-xs font-medium text-brand-blue">
              {user?.is_verified ? "Verified Account" : "Unverified"}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}

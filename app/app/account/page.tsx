"use client";

import ProfileForm from "@/components/account/ProfileForm";
import ProfileCard from "@/components/account/ProfileCard";
import AccountStack, { AccountCard } from "@/components/account/AccountStack";
import VerificationBanner from "@/components/account/VerificationBanner";
import AddressVerificationBanner from "@/components/account/AddressVerificationBanner";
import LogoutAction from "@/components/account/LogoutAction";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import AddressVerificationSection from "@/components/account/AddressVerificationSection";
import { useAuthStore } from "@/store/auth-store";

/**
 * Main Account Management page.
 * Implements a "stack" based UI for grouped account actions.
 */
export default function AccountPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Account
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your profile and security settings.
        </p>
      </div>

      <AccountStack>
        {!user.is_verified && <VerificationBanner />}

        <AddressVerificationBanner />

        <ProfileCard user={user} />

        <AccountCard
          title="Personal Information"
          description="Update your name, phone, and other profile details."
        >
          <ProfileForm />
        </AccountCard>

        <AccountCard
          title="Address Verification"
          description="Submit a proof document to activate or update your shipment address."
        >
          <AddressVerificationSection />
        </AccountCard>

        <AccountCard
          title="Security"
          description="Manage your password and security settings."
        >
          <ChangePasswordForm />
        </AccountCard>

        <LogoutAction />
      </AccountStack>
    </div>
  );
}

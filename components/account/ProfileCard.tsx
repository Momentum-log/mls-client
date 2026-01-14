"use client";

import React from "react";
import { User } from "@/types/auth";
import CopyButton from "@/components/ui/copy-button";

interface ProfileCardProps {
  user: User;
}

/**
 * A social-media style profile overview card.
 * Displays user name, avatar (initial), email, and verification status.
 */
const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-brand-blue" />

      <div className="relative pt-12 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-brand-yellow flex items-center justify-center text-brand-blue text-3xl font-bold mb-4 shadow-md">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
        <div className="flex items-center gap-2 mb-6">
          <p className="text-sm text-gray-500">{user.email}</p>
          <CopyButton text={user.email} tooltipText="Copy email" />
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <span className="block text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1">
              Status
            </span>
            <span
              className={`text-sm font-bold ${
                user.is_verified ? "text-green-600" : "text-brand-yellow"
              }`}
            >
              {user.is_verified ? "Verified" : "Unverified"}
            </span>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <span className="block text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1">
              User ID
            </span>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">
                {user.userCode}
              </span>
              <CopyButton text={user.userCode} tooltipText="Copy User ID" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

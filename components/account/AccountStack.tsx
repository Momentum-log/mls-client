"use client";

import React from "react";

interface AccountStackProps {
  children: React.ReactNode;
}

/**
 * Container component for vertical grouping of account sections.
 */
const AccountStack: React.FC<AccountStackProps> = ({ children }) => {
  return <div className="flex flex-col gap-6">{children}</div>;
};

export default AccountStack;

interface AccountCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Card component for individual settings sections.
 */
export const AccountCard: React.FC<AccountCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="p-6 bg-white">{children}</div>
    </div>
  );
};

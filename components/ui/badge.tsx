import React from 'react';

/**
 * Badge Component
 *
 * Small label component for displaying status, tags, or metadata.
 */

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

const variantClasses = {
  default: 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        variantClasses[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';

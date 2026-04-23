import React from 'react';

/**
 * Card Component
 *
 * A simple card container with border, shadow, and rounded corners.
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm ${className}`}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export default Card;

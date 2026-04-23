import React from 'react';

/**
 * Table Component
 *
 * Semantic HTML table component with styled subcomponents.
 */

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className = '', ...props }, ref) => (
  <table
    ref={ref}
    className={`w-full text-sm text-left text-gray-700 dark:text-gray-300 ${className}`}
    {...props}
  />
));

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = '', ...props }, ref) => (
  <thead
    ref={ref}
    className={`bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 ${className}`}
    {...props}
  />
));

TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = '', ...props }, ref) => (
  <tbody
    ref={ref}
    className={`divide-y divide-gray-200 dark:divide-slate-700 ${className}`}
    {...props}
  />
));

TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className = '', ...props }, ref) => (
  <tr
    ref={ref}
    className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${className}`}
    {...props}
  />
));

TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className = '', ...props }, ref) => (
  <th
    ref={ref}
    className={`px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 text-left ${className}`}
    {...props}
  />
));

TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className = '', ...props }, ref) => (
  <td
    ref={ref}
    className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${className}`}
    {...props}
  />
));

TableCell.displayName = 'TableCell';

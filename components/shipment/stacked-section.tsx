"use client";

import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface StackedSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  summary?: React.ReactNode;
  isExpanded: boolean;
  isCompleted: boolean;
  onEdit?: () => void;
}

/**
 * StackedSection component to wrap form sections in the single-page flow.
 * Handles summary vs full edit views with smooth transitions.
 *
 * @param id - Unique identifier for the section
 * @param title - Display title of the section
 * @param icon - Icon to display next to the title
 * @param children - The form content (Edit view)
 * @param summary - The summarized content (Summary view)
 * @param isExpanded - Whether the section is currently open for editing
 * @param isCompleted - Whether the section has been successfully filled
 * @param onEdit - Callback when the user clicks the Edit button
 */
export const StackedSection: React.FC<StackedSectionProps> = ({
  id,
  title,
  icon,
  children,
  summary,
  isExpanded,
  isCompleted,
  onEdit,
}) => {
  return (
    <div
      id={id}
      className={`relative bg-white rounded-3xl border transition-all duration-300 ${
        isExpanded
          ? "border-brand-blue shadow-lg shadow-brand-blue/5 z-20"
          : isCompleted
          ? "border-gray-100 hover:border-brand-blue/30 z-10"
          : "border-gray-50 opacity-50 z-0"
      } mb-6 overflow-hidden`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-6 md:p-8 ${
          isExpanded ? "bg-brand-blue/5" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isExpanded
                ? "bg-brand-blue text-white"
                : isCompleted
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {icon}
          </div>
          <div>
            <h3
              className={`font-bold text-lg transition-colors duration-300 ${
                isExpanded ? "text-brand-blue" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            {!isExpanded && isCompleted && (
              <p className="text-xs text-green-600 font-medium">Completed</p>
            )}
          </div>
        </div>

        {!isExpanded && isCompleted && onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors py-2 px-4 rounded-xl border border-brand-blue/20 hover:bg-brand-blue/5 cursor-pointer"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="p-6 md:p-8 pt-0"
          >
            {children}
          </motion.div>
        ) : (
          isCompleted &&
          summary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 pt-0 bg-white"
            >
              <div className="text-sm text-gray-600">{summary}</div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

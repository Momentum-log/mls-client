"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface ActionMenuItem {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  className?: string;
}

interface ActionMenuProps {
  actions: ActionMenuItem[];
  triggerClassName?: string;
}

export default function ActionMenu({
  actions,
  triggerClassName = "",
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ${triggerClassName}`}
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 min-w-max bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 focus:outline-none overflow-hidden"
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => handleAction(e, action.onClick)}
                  className={`group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue transition-colors text-left whitespace-nowrap ${
                    action.className || ""
                  }`}
                >
                  {action.icon && (
                    <action.icon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-brand-blue" />
                  )}
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

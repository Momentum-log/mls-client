import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@/utils/secure-storage";

/**
 * Address interface representing a physical location and contact metadata.
 */
export interface Address {
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  stateOrProvinceCode?: string;
}

/**
 * Package interface representing physical dimensions and shipment content info.
 */
export interface Package {
  id: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  description: string;
  value: number;
  currency: string;
}

/**
 * State management for the new single-page stacked shipment form.
 * Tracks user input, section completion status, and active visibility.
 */
interface ShipmentState {
  // Navigation & UI State
  currentStep: number;
  completedSteps: string[]; // Stores IDs of completed sections
  expandedSection: string | null;

  // Form Data
  sender: Address | null;
  recipient: Address | null;
  packages: Package[];
  selectedRate: any | null; // Improved type in future iteration

  // Actions
  /**
   * Updates the Pick-up (Sender) details.
   */
  setSender: (sender: Address) => void;

  /**
   * Updates the Drop-off (Recipient) details.
   */
  setRecipient: (recipient: Address) => void;

  /**
   * Replaces the entire packages array.
   */
  setPackages: (packages: Package[]) => void;

  /**
   * Adds a single package to the shipment.
   */
  addPackage: (pkg: Package) => void;

  /**
   * Removes a package from the shipment by its ID.
   */
  removePackage: (id: string) => void;

  /**
   * Updates a package by ID without triggering completion logic in observers.
   */
  updatePackage: (pkg: Package) => void;

  /**
   * Sets the selected shipping rate/service.
   */
  setSelectedRate: (rate: any) => void;

  /**
   * Updates the current step index (legacy compatibility).
   */
  setStep: (step: number) => void;

  /**
   * Sets the currently expanded section ID for the stacked layout.
   */
  setExpandedSection: (sectionId: string | null) => void;

  /**
   * Marks a section as completed in the timeline.
   */
  markSectionCompleted: (sectionId: string) => void;

  /**
   * Removes a section from the completed list (e.g., when editing).
   */
  markSectionIncomplete: (sectionId: string) => void;

  /**
   * Completely resets the shipment store to initial state.
   */
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  completedSteps: [],
  expandedSection: "pickup",
  sender: null,
  recipient: null,
  packages: [],
  selectedRate: null,
};

export const useShipmentStore = create<ShipmentState>()((set) => ({
  ...initialState,

  setSender: (sender) => set({ sender }),
  setRecipient: (recipient) => set({ recipient }),
  setPackages: (packages) => set({ packages }),
  addPackage: (pkg) =>
    set((state) => {
      const index = state.packages.findIndex((p) => p.id === pkg.id);
      if (index !== -1) {
        const newPackages = [...state.packages];
        newPackages[index] = pkg;
        return { packages: newPackages };
      }
      return { packages: [...state.packages, pkg] };
    }),
  removePackage: (id) =>
    set((state) => ({
      packages: state.packages.filter((p) => p.id !== id),
    })),
  updatePackage: (pkg) =>
    set((state) => {
      const index = state.packages.findIndex((p) => p.id === pkg.id);
      if (index !== -1) {
        const newPackages = [...state.packages];
        newPackages[index] = pkg;
        return { packages: newPackages };
      }
      return { packages: [...state.packages, pkg] };
    }),
  setSelectedRate: (rate) => set({ selectedRate: rate }),
  setStep: (step) => set({ currentStep: step }),
  setExpandedSection: (sectionId) => set({ expandedSection: sectionId }),
  markSectionCompleted: (sectionId) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(sectionId)
        ? state.completedSteps
        : [...state.completedSteps, sectionId],
    })),
  markSectionIncomplete: (sectionId) =>
    set((state) => ({
      completedSteps: state.completedSteps.filter((id) => id !== sectionId),
    })),
  reset: () => set(initialState),
}));

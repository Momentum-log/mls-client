import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@/utils/secure-storage";

export interface Address {
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  stateOrProvinceCode?: string;
}

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

interface ShipmentState {
  currentStep: number;
  sender: Address | null;
  recipient: Address | null;
  packages: Package[];
  selectedRate: any | null; // improved type later

  // Actions
  setSender: (sender: Address) => void;
  setRecipient: (recipient: Address) => void;
  setPackages: (packages: Package[]) => void;
  addPackage: (pkg: Package) => void;
  removePackage: (id: string) => void;
  setSelectedRate: (rate: any) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useShipmentStore = create<ShipmentState>()(
  persist(
    (set) => ({
      currentStep: 1,
      sender: null,
      recipient: null,
      packages: [],
      selectedRate: null,

      setSender: (sender) => set({ sender }),
      setRecipient: (recipient) => set({ recipient }),
      setPackages: (packages) => set({ packages }),
      addPackage: (pkg) =>
        set((state) => ({ packages: [...state.packages, pkg] })),
      removePackage: (id) =>
        set((state) => ({
          packages: state.packages.filter((p) => p.id !== id),
        })),
      setSelectedRate: (rate) => set({ selectedRate: rate }),
      setStep: (step) => set({ currentStep: step }),
      reset: () =>
        set({
          currentStep: 1,
          sender: null,
          recipient: null,
          packages: [],
          selectedRate: null,
        }),
    }),
    {
      name: "shipment-form-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

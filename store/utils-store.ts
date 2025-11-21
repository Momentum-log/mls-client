import { create } from "zustand";

interface UtilsState {
  isContactFormDisabled: boolean;
  toggleContactForm: () => void;
}

export const useUtilsStore = create<UtilsState>((set) => ({
  isContactFormDisabled: true,
  toggleContactForm: () =>
    set((state) => ({ isContactFormDisabled: !state.isContactFormDisabled })),
}));

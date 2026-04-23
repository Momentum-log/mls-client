/**
 * Invoice State Store
 *
 * Zustand store for managing invoice-related global state including current invoice,
 * invoice list cache, filters, and preferences.
 *
 * @module store/invoice-store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Invoice, InvoiceStatus, SortField } from "@/types/invoice";

/**
 * Invoice filters and preferences
 */
export interface InvoiceFilters {
  status?: InvoiceStatus | string;
  sortBy?: SortField | string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * Invoice cache entry with TTL
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Invoice store state
 */
interface InvoiceStoreState {
  // Current invoice
  currentInvoice: Invoice | null;
  currentInvoiceLoading: boolean;

  // Invoice list cache
  invoiceList: Invoice[];
  invoiceListTotal: number;
  invoiceListLoading: boolean;

  // Filters and preferences
  filters: InvoiceFilters;
  defaultFilters: InvoiceFilters;

  // Cache control
  invoiceCache: Map<string, CacheEntry<Invoice>>;
  listCacheTimestamp: number;

  // Actions
  setCurrentInvoice: (invoice: Invoice | null) => void;
  setCurrentInvoiceLoading: (loading: boolean) => void;

  setInvoiceList: (invoices: Invoice[], total: number) => void;
  setInvoiceListLoading: (loading: boolean) => void;

  updateFilters: (filters: Partial<InvoiceFilters>) => void;
  resetFilters: () => void;

  cacheInvoice: (invoice: Invoice, ttl?: number) => void;
  getCachedInvoice: (invoiceId: string) => Invoice | null;
  clearInvoiceCache: (invoiceId?: string) => void;

  updateListCacheTimestamp: () => void;
  isListCacheValid: (ttlSeconds?: number) => boolean;

  clearAll: () => void;
}

/**
 * Creates invoice store with Zustand and persist middleware
 */
export const useInvoiceStore = create<InvoiceStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentInvoice: null,
      currentInvoiceLoading: false,

      invoiceList: [],
      invoiceListTotal: 0,
      invoiceListLoading: false,

      filters: {
        status: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: 20,
        offset: 0,
      },

      defaultFilters: {
        status: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: 20,
        offset: 0,
      },

      invoiceCache: new Map(),
      listCacheTimestamp: 0,

      // Actions

      /**
       * Sets the currently viewed invoice
       */
      setCurrentInvoice: (invoice: Invoice | null) => {
        set({ currentInvoice: invoice });
        if (invoice) {
          get().cacheInvoice(invoice, 5 * 60 * 1000); // Cache for 5 minutes
        }
      },

      /**
       * Sets loading state for current invoice
       */
      setCurrentInvoiceLoading: (loading: boolean) => {
        set({ currentInvoiceLoading: loading });
      },

      /**
       * Sets the invoice list and total count
       */
      setInvoiceList: (invoices: Invoice[], total: number) => {
        set({
          invoiceList: invoices,
          invoiceListTotal: total,
        });

        // Cache all invoices in the list
        invoices.forEach((invoice) => {
          get().cacheInvoice(invoice, 5 * 60 * 1000); // 5 minute TTL
        });

        // Update cache timestamp
        get().updateListCacheTimestamp();
      },

      /**
       * Sets loading state for invoice list
       */
      setInvoiceListLoading: (loading: boolean) => {
        set({ invoiceListLoading: loading });
      },

      /**
       * Updates query filters
       */
      updateFilters: (filters: Partial<InvoiceFilters>) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
            offset:
              filters.status !== state.filters.status
                ? 0
                : (filters.offset ?? state.filters.offset),
          },
        }));
      },

      /**
       * Resets filters to defaults
       */
      resetFilters: () => {
        set((state) => ({
          filters: { ...state.defaultFilters },
        }));
      },

      /**
       * Caches an invoice for faster retrieval
       */
      cacheInvoice: (invoice: Invoice, ttl: number = 5 * 60 * 1000) => {
        const cache = new Map(get().invoiceCache);
        cache.set(invoice.invoiceId, {
          data: invoice,
          timestamp: Date.now(),
          ttl,
        });
        set({ invoiceCache: cache });
      },

      /**
       * Retrieves a cached invoice if not expired
       */
      getCachedInvoice: (invoiceId: string): Invoice | null => {
        const cached = get().invoiceCache.get(invoiceId);

        if (!cached) return null;

        // Check if cache entry has expired
        const age = Date.now() - cached.timestamp;
        if (age > cached.ttl) {
          // Remove expired entry
          const newCache = new Map(get().invoiceCache);
          newCache.delete(invoiceId);
          set({ invoiceCache: newCache });
          return null;
        }

        return cached.data;
      },

      /**
       * Clears invoice cache (specific invoice or all)
       */
      clearInvoiceCache: (invoiceId?: string) => {
        if (invoiceId) {
          const cache = new Map(get().invoiceCache);
          cache.delete(invoiceId);
          set({ invoiceCache: cache });
        } else {
          set({ invoiceCache: new Map() });
        }
      },

      /**
       * Updates the list cache timestamp
       */
      updateListCacheTimestamp: () => {
        set({ listCacheTimestamp: Date.now() });
      },

      /**
       * Checks if list cache is still valid
       */
      isListCacheValid: (ttlSeconds: number = 5 * 60): boolean => {
        const age = (Date.now() - get().listCacheTimestamp) / 1000;
        return age < ttlSeconds && get().invoiceList.length > 0;
      },

      /**
       * Clears all store state
       */
      clearAll: () => {
        set((state) => ({
          currentInvoice: null,
          currentInvoiceLoading: false,
          invoiceList: [],
          invoiceListTotal: 0,
          invoiceListLoading: false,
          filters: { ...state.defaultFilters },
          invoiceCache: new Map(),
          listCacheTimestamp: 0,
        }));
      },
    }),
    {
      name: "invoice-store",
      partialize: (state) => ({
        filters: state.filters,
        defaultFilters: state.defaultFilters,
      }),
      // Don't persist large data structures
      version: 1,
    },
  ),
);

/**
 * Hook to get only the filters from the store
 */
export const useInvoiceFilters = () => {
  return useInvoiceStore((state) => ({
    filters: state.filters,
    updateFilters: state.updateFilters,
    resetFilters: state.resetFilters,
  }));
};

/**
 * Hook to get invoice list state
 */
export const useInvoiceList = () => {
  return useInvoiceStore((state) => ({
    invoiceList: state.invoiceList,
    invoiceListTotal: state.invoiceListTotal,
    invoiceListLoading: state.invoiceListLoading,
    setInvoiceList: state.setInvoiceList,
    setInvoiceListLoading: state.setInvoiceListLoading,
    isListCacheValid: state.isListCacheValid,
    filters: state.filters,
  }));
};

/**
 * Hook to get current invoice state
 */
export const useCurrentInvoice = () => {
  return useInvoiceStore((state) => ({
    currentInvoice: state.currentInvoice,
    currentInvoiceLoading: state.currentInvoiceLoading,
    setCurrentInvoice: state.setCurrentInvoice,
    setCurrentInvoiceLoading: state.setCurrentInvoiceLoading,
  }));
};

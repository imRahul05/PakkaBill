"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import {
  BillingMode,
  CategoryId,
  GeneralItem,
  GoldItem,
  GroceryItem,
  InvoiceType,
  LineItem,
  SilverItem,
} from "@/types/category.types";
import {
  BuyerDetails,
  CalculationSummary,
  InvoiceData,
  InvoiceMetadata,
  InvoiceOtherDetails,
  SellerProfile,
} from "@/types/invoice.types";
import {
  createInitialInvoice,
  getSampleItemsByCategory,
  getSampleSellerProfileByCategory,
  getSampleTermsByCategory,
} from "@/constants/defaults";
import { CATEGORIES } from "@/constants/categories";
import {
  calculateGoldItem,
  calculateSilverItem,
  calculateGroceryItem,
  calculateGeneralItem,
  calculateInvoiceSummary,
} from "@/lib/calculations";
import { loadDraft, saveDraft, loadSavedProfile } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { FormTabId } from "@/components/tabs/TabNavigation";

function recomputeSummaryForInvoice(inv: InvoiceData): CalculationSummary {
  return calculateInvoiceSummary({
    items: inv.items,
    other: inv.other,
    billingMode: inv.billingMode,
    sellerStateCode: inv.seller.address.stateCode,
    placeOfSupplyCode: inv.buyer.placeOfSupplyCode,
  });
}

function createInitialInvoiceWithSummary(category: CategoryId = "gold"): InvoiceData {
  const initial = createInitialInvoice(category);
  initial.summary = recomputeSummaryForInvoice(initial);
  return initial;
}

function createDefaultItemForCategory(category: CategoryId): LineItem {
  switch (category) {
    case "gold":
      return calculateGoldItem({
        name: "Gold Ornament",
        grossWeight: 10,
        netWeight: 10,
        ratePer10g: 75000,
        purity: "22K (916)",
        makingChargeType: "percentage",
        makingChargeValue: 10,
      });
    case "silver":
      return calculateSilverItem({
        name: "Silver Article",
        grossWeight: 100,
        netWeight: 100,
        ratePer10g: 890,
        purity: "925 (Sterling)",
        makingChargeType: "percentage",
        makingChargeValue: 10,
      });
    case "grocery":
      return calculateGroceryItem({
        name: "New Grocery Item",
        quantity: 1,
        unit: "kg",
        ratePerUnit: 100,
        isPackaged: true,
        gstRate: 5,
      });
    case "general":
      return calculateGeneralItem({
        name: "New Item / Service",
        quantity: 1,
        unit: "pcs",
        ratePerUnit: 1000,
        gstRate: 18,
      });
  }
}

function recalculateLineItem(item: LineItem, update: Partial<LineItem>): LineItem {
  switch (item.category) {
    case "gold":
      return calculateGoldItem({ ...item, ...update } as Partial<GoldItem>);
    case "silver":
      return calculateSilverItem({ ...item, ...update } as Partial<SilverItem>);
    case "grocery":
      return calculateGroceryItem({ ...item, ...update } as Partial<GroceryItem>);
    case "general":
      return calculateGeneralItem({ ...item, ...update } as Partial<GeneralItem>);
  }
}

const DEFAULT_SERVER_INVOICE: InvoiceData = createInitialInvoiceWithSummary("gold");

let currentInvoiceSnapshot: InvoiceData | null = null;
const invoiceListeners = new Set<() => void>();

function getInvoiceSnapshot(): InvoiceData {
  if (!currentInvoiceSnapshot) {
    const saved = loadDraft();
    if (saved) {
      currentInvoiceSnapshot = saved;
    } else {
      const savedProfile = loadSavedProfile();
      if (savedProfile) {
        const initial = createInitialInvoiceWithSummary("gold");
        initial.seller = savedProfile;
        initial.summary = recomputeSummaryForInvoice(initial);
        currentInvoiceSnapshot = initial;
      } else {
        currentInvoiceSnapshot = DEFAULT_SERVER_INVOICE;
      }
    }
  }
  return currentInvoiceSnapshot;
}

function getServerInvoiceSnapshot(): InvoiceData {
  return DEFAULT_SERVER_INVOICE;
}

function subscribeInvoice(callback: () => void): () => void {
  invoiceListeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.CURRENT_DRAFT) {
      currentInvoiceSnapshot = loadDraft() || DEFAULT_SERVER_INVOICE;
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    invoiceListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function setStoreInvoice(updater: InvoiceData | ((prev: InvoiceData) => InvoiceData)): void {
  const prev = getInvoiceSnapshot();
  const next = typeof updater === "function" ? updater(prev) : updater;
  currentInvoiceSnapshot = next;
  saveDraft(next);
  invoiceListeners.forEach((listener) => listener());
}

function updateInvoiceStore(
  mutator: Partial<InvoiceData> | ((prev: InvoiceData) => Partial<InvoiceData>)
): void {
  setStoreInvoice((prev) => {
    const patch = typeof mutator === "function" ? mutator(prev) : mutator;
    const next: InvoiceData = {
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    next.summary = recomputeSummaryForInvoice(next);
    return next;
  });
}

export function useInvoiceState(initialCategory: CategoryId = "gold") {
  const [activeTab, setActiveTab] = useState<FormTabId>("seller");
  const invoice = useSyncExternalStore(subscribeInvoice, getInvoiceSnapshot, getServerInvoiceSnapshot);

  // Set Category with smart item mapping and demo seller profile switch
  const setCategory = useCallback((newCategory: CategoryId) => {
    updateInvoiceStore((prev) => {
      if (prev.category === newCategory) return prev;

      const defaultTpl = CATEGORIES[newCategory].defaultTemplateId;
      const newItems = getSampleItemsByCategory(newCategory);

      const savedProfile = loadSavedProfile();
      const demoShopNames = [
        "Shree Krishna Jewellers",
        "Shree Silver Art Emporium",
        "Shree Ganesh Supermarket & Kirana",
        "Apex Solutions & Trading",
      ];
      const isUsingDemoSeller = !savedProfile || demoShopNames.includes(prev.seller.tradeName);

      const updatedSeller = isUsingDemoSeller
        ? getSampleSellerProfileByCategory(newCategory)
        : prev.seller;

      const updatedTerms = getSampleTermsByCategory(newCategory);
      const updatedInvoiceMeta: InvoiceMetadata = {
        ...prev.invoice,
        termsAndConditions: updatedTerms,
      };

      return {
        category: newCategory,
        templateId: defaultTpl,
        seller: updatedSeller,
        invoice: updatedInvoiceMeta,
        items: newItems,
      };
    });
  }, []);

  // Set Billing Mode (GST vs Non-GST)
  const setBillingMode = useCallback((newMode: BillingMode) => {
    updateInvoiceStore((prev) => {
      if (prev.billingMode === newMode) return prev;

      const updatedInvoiceMeta: InvoiceMetadata = {
        ...prev.invoice,
        invoiceType:
          newMode === "non_gst"
            ? ("bill_of_supply" as InvoiceType)
            : ("tax_invoice" as InvoiceType),
      };

      return {
        billingMode: newMode,
        invoice: updatedInvoiceMeta,
      };
    });
  }, []);

  // Set Active Template
  const setTemplateId = useCallback((templateId: string) => {
    setStoreInvoice((prev) => ({
      ...prev,
      templateId,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Update Seller Details
  const updateSeller = useCallback((sellerUpdate: Partial<SellerProfile>) => {
    updateInvoiceStore((prev) => ({
      seller: { ...prev.seller, ...sellerUpdate },
    }));
  }, []);

  // Update Buyer Details
  const updateBuyer = useCallback((buyerUpdate: Partial<BuyerDetails>) => {
    updateInvoiceStore((prev) => ({
      buyer: { ...prev.buyer, ...buyerUpdate },
    }));
  }, []);

  // Update Invoice Metadata
  const updateInvoiceMeta = useCallback((metaUpdate: Partial<InvoiceMetadata>) => {
    setStoreInvoice((prev) => ({
      ...prev,
      invoice: { ...prev.invoice, ...metaUpdate },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Update Other Details (Discounts, Shipping, Rounding, etc.)
  const updateOther = useCallback((otherUpdate: Partial<InvoiceOtherDetails>) => {
    updateInvoiceStore((prev) => ({
      other: { ...prev.other, ...otherUpdate },
    }));
  }, []);

  // Line Items Operations
  const addItem = useCallback(() => {
    updateInvoiceStore((prev) => ({
      items: [...prev.items, createDefaultItemForCategory(prev.category)],
    }));
  }, []);

  const updateItem = useCallback((index: number, itemUpdate: Partial<LineItem>) => {
    updateInvoiceStore((prev) => {
      if (index < 0 || index >= prev.items.length) return prev;
      const newItems = [...prev.items];
      newItems[index] = recalculateLineItem(prev.items[index], itemUpdate);
      return { items: newItems };
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    updateInvoiceStore((prev) => {
      if (index < 0 || index >= prev.items.length) return prev;
      return { items: prev.items.filter((_, i) => i !== index) };
    });
  }, []);

  const clearItems = useCallback(() => {
    updateInvoiceStore({ items: [] });
  }, []);

  // Load entire invoice (from history, preset, or import)
  const loadInvoice = useCallback((newInvoice: InvoiceData) => {
    updateInvoiceStore(newInvoice);
  }, []);

  // Reset to initial category state
  const resetToCategoryDefaults = useCallback(
    (category?: CategoryId) => {
      const current = getInvoiceSnapshot();
      const targetCat = category || current.category || initialCategory;
      const fresh = createInitialInvoice(targetCat);
      updateInvoiceStore(fresh);
    },
    [initialCategory]
  );

  return {
    invoice,
    activeTab,
    setActiveTab,
    setCategory,
    setBillingMode,
    setTemplateId,
    updateSeller,
    updateBuyer,
    updateInvoiceMeta,
    updateOther,
    addItem,
    updateItem,
    removeItem,
    clearItems,
    loadInvoice,
    resetToCategoryDefaults,
  };
}

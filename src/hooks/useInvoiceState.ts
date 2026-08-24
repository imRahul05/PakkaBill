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

function createInitialInvoiceWithSummary(category: CategoryId = "gold"): InvoiceData {
  const initial = createInitialInvoice(category);
  initial.summary = calculateInvoiceSummary({
    items: initial.items,
    other: initial.other,
    billingMode: initial.billingMode,
    sellerStateCode: initial.seller.address.stateCode,
    placeOfSupplyCode: initial.buyer.placeOfSupplyCode,
  });
  return initial;
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
        initial.summary = calculateInvoiceSummary({
          items: initial.items,
          other: initial.other,
          billingMode: initial.billingMode,
          sellerStateCode: savedProfile.address.stateCode,
          placeOfSupplyCode: initial.buyer.placeOfSupplyCode,
        });
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

export function useInvoiceState(initialCategory: CategoryId = "gold") {
  const [activeTab, setActiveTab] = useState<FormTabId>("seller");
  const invoice = useSyncExternalStore(subscribeInvoice, getInvoiceSnapshot, getServerInvoiceSnapshot);

  // Recompute summary helper
  const recomputeSummary = useCallback(
    (
      items: LineItem[],
      other: InvoiceOtherDetails,
      billingMode: BillingMode,
      sellerStateCode: string,
      placeOfSupplyCode: string
    ) => {
      return calculateInvoiceSummary({
        items,
        other,
        billingMode,
        sellerStateCode,
        placeOfSupplyCode,
      });
    },
    []
  );

  // Set Category with smart item mapping and category-appropriate shop profile
  const setCategory = useCallback(
    (newCategory: CategoryId) => {
      setStoreInvoice((prev) => {
        if (prev.category === newCategory) return prev;

        const defaultTpl = CATEGORIES[newCategory].defaultTemplateId;
        const newItems = getSampleItemsByCategory(newCategory);

        // If user has not saved a custom profile in localStorage, switch demo shop to category-specific shop
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

        const newSummary = recomputeSummary(
          newItems,
          prev.other,
          prev.billingMode,
          updatedSeller.address.stateCode,
          prev.buyer.placeOfSupplyCode
        );

        return {
          ...prev,
          category: newCategory,
          templateId: defaultTpl,
          seller: updatedSeller,
          invoice: updatedInvoiceMeta,
          items: newItems,
          summary: newSummary,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recomputeSummary]
  );

  // Set Billing Mode (GST vs Non-GST)
  const setBillingMode = useCallback(
    (newMode: BillingMode) => {
      setStoreInvoice((prev) => {
        if (prev.billingMode === newMode) return prev;

        const newSummary = recomputeSummary(
          prev.items,
          prev.other,
          newMode,
          prev.seller.address.stateCode,
          prev.buyer.placeOfSupplyCode
        );

        const updatedInvoiceMeta: InvoiceMetadata = {
          ...prev.invoice,
          invoiceType:
            newMode === "non_gst"
              ? ("bill_of_supply" as InvoiceType)
              : ("tax_invoice" as InvoiceType),
        };

        return {
          ...prev,
          billingMode: newMode,
          invoice: updatedInvoiceMeta,
          summary: newSummary,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recomputeSummary]
  );

  // Set Active Template
  const setTemplateId = useCallback((templateId: string) => {
    setStoreInvoice((prev) => ({
      ...prev,
      templateId,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Update Seller Details
  const updateSeller = useCallback(
    (sellerUpdate: Partial<SellerProfile>) => {
      setStoreInvoice((prev) => {
        const updatedSeller = { ...prev.seller, ...sellerUpdate };
        const newSummary = recomputeSummary(
          prev.items,
          prev.other,
          prev.billingMode,
          updatedSeller.address.stateCode,
          prev.buyer.placeOfSupplyCode
        );
        return {
          ...prev,
          seller: updatedSeller,
          summary: newSummary,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recomputeSummary]
  );

  // Update Buyer Details
  const updateBuyer = useCallback(
    (buyerUpdate: Partial<BuyerDetails>) => {
      setStoreInvoice((prev) => {
        const updatedBuyer = { ...prev.buyer, ...buyerUpdate };
        const newSummary = recomputeSummary(
          prev.items,
          prev.other,
          prev.billingMode,
          prev.seller.address.stateCode,
          updatedBuyer.placeOfSupplyCode
        );
        return {
          ...prev,
          buyer: updatedBuyer,
          summary: newSummary,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recomputeSummary]
  );

  // Update Invoice Metadata
  const updateInvoiceMeta = useCallback(
    (metaUpdate: Partial<InvoiceMetadata>) => {
      setStoreInvoice((prev) => ({
        ...prev,
        invoice: { ...prev.invoice, ...metaUpdate },
        updatedAt: new Date().toISOString(),
      }));
    },
    []
  );

  // Update Other Details (Discounts, Shipping, Rounding, etc.)
  const updateOther = useCallback(
    (otherUpdate: Partial<InvoiceOtherDetails>) => {
      setStoreInvoice((prev) => {
        const updatedOther = { ...prev.other, ...otherUpdate };
        const newSummary = recomputeSummary(
          prev.items,
          updatedOther,
          prev.billingMode,
          prev.seller.address.stateCode,
          prev.buyer.placeOfSupplyCode
        );
        return {
          ...prev,
          other: updatedOther,
          summary: newSummary,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recomputeSummary]
  );

  // Line Items Operations
  const addItem = useCallback(() => {
    setStoreInvoice((prev) => {
      let newItem: LineItem;

      if (prev.category === "gold") {
        newItem = calculateGoldItem({
          name: "Gold Ornament",
          grossWeight: 10,
          netWeight: 10,
          ratePer10g: 75000,
          purity: "22K (916)",
          makingChargeType: "percentage",
          makingChargeValue: 10,
        });
      } else if (prev.category === "silver") {
        newItem = calculateSilverItem({
          name: "Silver Article",
          grossWeight: 100,
          netWeight: 100,
          ratePer10g: 890,
          purity: "925 (Sterling)",
          makingChargeType: "percentage",
          makingChargeValue: 10,
        });
      } else if (prev.category === "grocery") {
        newItem = calculateGroceryItem({
          name: "New Grocery Item",
          quantity: 1,
          unit: "kg",
          ratePerUnit: 100,
          isPackaged: true,
          gstRate: 5,
        });
      } else {
        newItem = calculateGeneralItem({
          name: "New Item / Service",
          quantity: 1,
          unit: "pcs",
          ratePerUnit: 1000,
          gstRate: 18,
        });
      }

      const newItems = [...prev.items, newItem];
      const newSummary = recomputeSummary(
        newItems,
        prev.other,
        prev.billingMode,
        prev.seller.address.stateCode,
        prev.buyer.placeOfSupplyCode
      );

      return {
        ...prev,
        items: newItems,
        summary: newSummary,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [recomputeSummary]);

  const updateItem = useCallback(
    (index: number, itemUpdate: Partial<LineItem>) => {
      setStoreInvoice((prev) => {
        if (index < 0 || index >= prev.items.length) return prev;

        const currentItem = prev.items[index];
        let recalculatedItem: LineItem;

        if (currentItem.category === "gold") {
          recalculatedItem = calculateGoldItem({
            ...currentItem,
            ...itemUpdate,
          } as Partial<GoldItem>);
        } else if (currentItem.category === "silver") {
          recalculatedItem = calculateSilverItem({
            ...currentItem,
            ...itemUpdate,
          } as Partial<SilverItem>);
        } else if (currentItem.category === "grocery") {
          recalculatedItem = calculateGroceryItem({
            ...currentItem,
            ...itemUpdate,
          } as Partial<GroceryItem>);
        } else {
          recalculatedItem = calculateGeneralItem({
            ...currentItem,
            ...itemUpdate,
          } as Partial<GeneralItem>);
        }

        const newItems = [...prev.items];
        newItems[index] = recalculatedItem;

        const newSummary = recomputeSummary(
          newItems,
          prev.other,
          prev.billingMode,
          prev.seller.address.stateCode,
          prev.buyer.placeOfSupplyCode
        );

        return {
          ...prev,
          items: newItems,
          summary: newSummary,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recomputeSummary]
  );

  const removeItem = useCallback(
    (index: number) => {
      setStoreInvoice((prev) => {
        if (index < 0 || index >= prev.items.length) return prev;

        const newItems = prev.items.filter((_, i) => i !== index);
        const newSummary = recomputeSummary(
          newItems,
          prev.other,
          prev.billingMode,
          prev.seller.address.stateCode,
          prev.buyer.placeOfSupplyCode
        );

        return {
          ...prev,
          items: newItems,
          summary: newSummary,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recomputeSummary]
  );

  const clearItems = useCallback(() => {
    setStoreInvoice((prev) => {
      const newSummary = recomputeSummary(
        [],
        prev.other,
        prev.billingMode,
        prev.seller.address.stateCode,
        prev.buyer.placeOfSupplyCode
      );

      return {
        ...prev,
        items: [],
        summary: newSummary,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [recomputeSummary]);

  // Load entire invoice (from history, preset, or import)
  const loadInvoice = useCallback(
    (newInvoice: InvoiceData) => {
      const newSummary = recomputeSummary(
        newInvoice.items,
        newInvoice.other,
        newInvoice.billingMode,
        newInvoice.seller.address.stateCode,
        newInvoice.buyer.placeOfSupplyCode
      );

      setStoreInvoice({
        ...newInvoice,
        summary: newSummary,
        updatedAt: new Date().toISOString(),
      });
    },
    [recomputeSummary]
  );

  // Reset to initial category state
  const resetToCategoryDefaults = useCallback(
    (category?: CategoryId) => {
      const current = getInvoiceSnapshot();
      const targetCat = category || current.category || initialCategory;
      const fresh = createInitialInvoice(targetCat);
      fresh.summary = recomputeSummary(
        fresh.items,
        fresh.other,
        fresh.billingMode,
        fresh.seller.address.stateCode,
        fresh.buyer.placeOfSupplyCode
      );
      setStoreInvoice(fresh);
    },
    [initialCategory, recomputeSummary]
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

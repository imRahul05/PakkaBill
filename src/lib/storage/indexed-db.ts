import { INDEXED_DB_CONFIG } from "@/constants/storage-keys";
import { InvoiceData } from "@/types/invoice.types";
import { PresetTemplate, StoredBill } from "@/types/storage.types";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(
      INDEXED_DB_CONFIG.DB_NAME,
      INDEXED_DB_CONFIG.DB_VERSION
    );

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(INDEXED_DB_CONFIG.STORES.BILLS_HISTORY)) {
        const historyStore = db.createObjectStore(
          INDEXED_DB_CONFIG.STORES.BILLS_HISTORY,
          { keyPath: "id" }
        );
        historyStore.createIndex("createdAt", "createdAt", { unique: false });
        historyStore.createIndex("invoiceNumber", "invoiceNumber", { unique: false });
      }

      if (!db.objectStoreNames.contains(INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES)) {
        const presetStore = db.createObjectStore(
          INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES,
          { keyPath: "id" }
        );
        presetStore.createIndex("createdAt", "createdAt", { unique: false });
        presetStore.createIndex("category", "category", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ----------------------------------------------------
// Bills History (Last 10 FIFO)
// ----------------------------------------------------

export async function getAllBillsHistory(): Promise<StoredBill[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        INDEXED_DB_CONFIG.STORES.BILLS_HISTORY,
        "readonly"
      );
      const store = transaction.objectStore(INDEXED_DB_CONFIG.STORES.BILLS_HISTORY);
      const request = store.getAll();

      request.onsuccess = () => {
        const bills = (request.result as StoredBill[]) || [];
        // Sort descending by createdAt
        bills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(bills);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Error fetching bill history from IndexedDB", err);
    return [];
  }
}

export interface SaveBillResult {
  saved: boolean;
  evictedBill?: StoredBill;
  newBill: StoredBill;
}

export async function saveBillToHistory(invoice: InvoiceData): Promise<SaveBillResult> {
  const newBill: StoredBill = {
    id: `bill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    invoiceNumber: invoice.invoice.invoiceNumber,
    invoiceDate: invoice.invoice.invoiceDate,
    buyerName: invoice.buyer.name || "Unnamed Buyer",
    buyerGstin: invoice.buyer.gstin,
    category: invoice.category,
    billingMode: invoice.billingMode,
    templateId: invoice.templateId,
    grandTotal: invoice.summary.grandTotal,
    totalTax: invoice.summary.totalTax,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fullData: invoice,
  };

  const existingBills = await getAllBillsHistory();

  // If already at or above cap (10 items), identify oldest bill for FIFO eviction
  let evictedBill: StoredBill | undefined;
  const billsToKeep = [...existingBills];

  while (billsToKeep.length >= INDEXED_DB_CONFIG.MAX_HISTORY_ITEMS) {
    evictedBill = billsToKeep.pop(); // Remove oldest
  }

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      INDEXED_DB_CONFIG.STORES.BILLS_HISTORY,
      "readwrite"
    );
    const store = transaction.objectStore(INDEXED_DB_CONFIG.STORES.BILLS_HISTORY);

    if (evictedBill) {
      store.delete(evictedBill.id);
    }
    store.put(newBill);

    transaction.oncomplete = () => {
      resolve({
        saved: true,
        evictedBill,
        newBill,
      });
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function deleteBillFromHistory(id: string): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        INDEXED_DB_CONFIG.STORES.BILLS_HISTORY,
        "readwrite"
      );
      const store = transaction.objectStore(INDEXED_DB_CONFIG.STORES.BILLS_HISTORY);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Error deleting bill from IndexedDB", err);
    return false;
  }
}

export async function clearAllBillsHistory(): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        INDEXED_DB_CONFIG.STORES.BILLS_HISTORY,
        "readwrite"
      );
      const store = transaction.objectStore(INDEXED_DB_CONFIG.STORES.BILLS_HISTORY);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Error clearing bill history", err);
    return false;
  }
}

// ----------------------------------------------------
// Preset Templates (FR-24 Reusable Bill Presets)
// ----------------------------------------------------

export async function getAllPresets(): Promise<PresetTemplate[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES,
        "readonly"
      );
      const store = transaction.objectStore(INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES);
      const request = store.getAll();

      request.onsuccess = () => {
        const presets = (request.result as PresetTemplate[]) || [];
        presets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(presets);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Error loading presets from IndexedDB", err);
    return [];
  }
}

export async function savePreset(preset: Omit<PresetTemplate, "id" | "createdAt">): Promise<PresetTemplate> {
  const newPreset: PresetTemplate = {
    id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    ...preset,
  };

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES,
      "readwrite"
    );
    const store = transaction.objectStore(INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES);
    store.put(newPreset);

    transaction.oncomplete = () => resolve(newPreset);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function deletePreset(id: string): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES,
        "readwrite"
      );
      const store = transaction.objectStore(INDEXED_DB_CONFIG.STORES.PRESET_TEMPLATES);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Error deleting preset from IndexedDB", err);
    return false;
  }
}

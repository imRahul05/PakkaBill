import { InvoiceData, SellerProfile } from "@/types/invoice.types";
import { StorageBackup } from "@/types/storage.types";
import { loadSavedProfile, saveProfile } from "./local-storage";
import { getAllBillsHistory, getAllPresets, saveBillToHistory, savePreset } from "./indexed-db";

export function downloadJsonFile(data: unknown, filename: string): void {
  if (typeof window === "undefined") return;
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportSingleInvoiceJson(invoice: InvoiceData): void {
  const filename = `${invoice.invoice.invoiceNumber || "invoice"}_${invoice.invoice.invoiceDate || "date"}.json`;
  downloadJsonFile(invoice, filename);
}

export async function exportFullBackup(): Promise<void> {
  const profile = loadSavedProfile();
  const history = await getAllBillsHistory();
  const presets = await getAllPresets();

  const backup: StorageBackup = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    profile,
    history,
    presets,
  };

  const filename = `zoro_gst_backup_${new Date().toISOString().split("T")[0]}.json`;
  downloadJsonFile(backup, filename);
}

export function parseImportedJson<T = unknown>(fileContent: string): { success: boolean; data?: T; error?: string } {
  try {
    const parsed = JSON.parse(fileContent);
    return { success: true, data: parsed as T };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid JSON format",
    };
  }
}

export interface ImportBackupResult {
  success: boolean;
  billsImported?: number;
  presetsImported?: number;
  error?: string;
}

export async function importBackupJson(jsonString: string): Promise<ImportBackupResult> {
  try {
    const parsed = JSON.parse(jsonString) as Partial<StorageBackup>;
    if (!parsed || typeof parsed !== "object") {
      return { success: false, error: "Invalid backup format." };
    }

    if (parsed.profile) {
      saveProfile(parsed.profile as SellerProfile);
    }

    let billsCount = 0;
    if (Array.isArray(parsed.history)) {
      for (const bill of parsed.history) {
        if (bill && bill.fullData) {
          await saveBillToHistory(bill.fullData);
          billsCount++;
        }
      }
    }

    let presetsCount = 0;
    if (Array.isArray(parsed.presets)) {
      for (const preset of parsed.presets) {
        if (preset && preset.id && preset.templateData) {
          await savePreset({
            name: preset.name,
            category: preset.category,
            description: preset.description,
            templateData: preset.templateData,
          });
          presetsCount++;
        }
      }
    }

    return {
      success: true,
      billsImported: billsCount,
      presetsImported: presetsCount,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to import backup.",
    };
  }
}

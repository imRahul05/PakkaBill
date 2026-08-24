"use client";

import { useEffect, useState, useCallback } from "react";
import { InvoiceData } from "@/types/invoice.types";
import { PresetTemplate, StoredBill } from "@/types/storage.types";
import {
  getAllBillsHistory,
  saveBillToHistory,
  deleteBillFromHistory,
  clearAllBillsHistory,
  getAllPresets,
  savePreset,
  deletePreset,
  SaveBillResult,
} from "@/lib/storage/indexed-db";

export function useBillHistory() {
  const [bills, setBills] = useState<StoredBill[]>([]);
  const [presets, setPresets] = useState<PresetTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastEvictedBill, setLastEvictedBill] = useState<StoredBill | null>(null);

  const refreshHistory = useCallback(async () => {
    try {
      const historyList = await getAllBillsHistory();
      setBills(historyList);
      const presetList = await getAllPresets();
      setPresets(presetList);
    } catch (err) {
      console.error("Error loading bills history:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const historyList = await getAllBillsHistory();
        const presetList = await getAllPresets();
        if (isMounted) {
          setBills(historyList);
          setPresets(presetList);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading history:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveBill = useCallback(
    async (invoice: InvoiceData): Promise<SaveBillResult> => {
      const res = await saveBillToHistory(invoice);
      if (res.evictedBill) {
        setLastEvictedBill(res.evictedBill);
      }
      await refreshHistory();
      return res;
    },
    [refreshHistory]
  );

  const handleDeleteBill = useCallback(
    async (id: string): Promise<boolean> => {
      const success = await deleteBillFromHistory(id);
      if (success) {
        await refreshHistory();
      }
      return success;
    },
    [refreshHistory]
  );

  const handleClearHistory = useCallback(async (): Promise<boolean> => {
    const success = await clearAllBillsHistory();
    if (success) {
      setBills([]);
    }
    return success;
  }, []);

  const handleSavePreset = useCallback(
    async (preset: Omit<PresetTemplate, "id" | "createdAt">): Promise<PresetTemplate> => {
      const res = await savePreset(preset);
      await refreshHistory();
      return res;
    },
    [refreshHistory]
  );

  const handleDeletePreset = useCallback(
    async (id: string): Promise<boolean> => {
      const success = await deletePreset(id);
      if (success) {
        await refreshHistory();
      }
      return success;
    },
    [refreshHistory]
  );

  return {
    bills,
    presets,
    isLoading,
    lastEvictedBill,
    clearEvictedNotice: () => setLastEvictedBill(null),
    clearEvictedNotification: () => setLastEvictedBill(null),
    saveBill: handleSaveBill,
    saveBillToHistory: handleSaveBill,
    deleteBill: handleDeleteBill,
    deleteBillFromHistory: handleDeleteBill,
    clearHistory: handleClearHistory,
    savePreset: handleSavePreset,
    deletePreset: handleDeletePreset,
    refreshHistory,
  };
}

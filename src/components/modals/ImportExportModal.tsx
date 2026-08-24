"use client";

import React, { useState, useRef } from "react";
import { InvoiceData } from "@/types/invoice.types";
import { exportFullBackup, exportSingleInvoiceJson, importBackupJson } from "@/lib/storage/json-export";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileJson, CheckCircle2, AlertCircle } from "lucide-react";

interface ImportExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentInvoice: InvoiceData;
  onRefreshAllData: () => void;
}

export function ImportExportModal({
  open,
  onOpenChange,
  currentInvoice,
  onRefreshAllData,
}: ImportExportModalProps) {
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string }>({});
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      const result = await importBackupJson(text);

      if (result.success) {
        setImportStatus({
          success: true,
          message: `Successfully imported backup! (${result.billsImported} bills, ${result.presetsImported} presets)`,
        });
        onRefreshAllData();
        setTimeout(() => {
          setImportStatus({});
          onOpenChange(false);
        }, 1500);
      } else {
        setImportStatus({
          success: false,
          message: result.error || "Failed to parse backup JSON file.",
        });
      }
    } catch {
      setImportStatus({
        success: false,
        message: "Failed to read file. Please ensure it is a valid JSON file.",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="lg" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-amber-400" />
            <DialogTitle>Backup & Restore (JSON)</DialogTitle>
          </div>
          <DialogDescription>
            Export or restore your invoices, business profile, history, and presets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {importStatus.message && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2 text-xs font-bold ${
                importStatus.success
                  ? "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                  : "bg-rose-950/80 border-rose-700 text-rose-300"
              }`}
            >
              {importStatus.success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Download className="h-4 w-4 text-amber-400" /> Export Data
            </h3>
            <p className="text-xs text-neutral-400">
              Download your data as a clean JSON file. Keep it safe on your drive or transfer between devices.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={exportFullBackup}
                className="text-xs font-bold"
              >
                Export Full Backup (All Data)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => exportSingleInvoiceJson(currentInvoice)}
                className="text-xs"
              >
                Export Current Invoice Only
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-blue-400" /> Restore Backup
            </h3>
            <p className="text-xs text-neutral-400">
              Upload a previously exported `.json` backup file to restore your history and templates.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json"
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="text-xs"
            >
              <Upload className="h-3.5 w-3.5 mr-1" />
              {isImporting ? "Restoring data..." : "Select Backup JSON File"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

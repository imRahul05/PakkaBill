"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download, Printer, BookmarkPlus, Check, FileJson, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onPreview: () => void;
  onDownloadPdf: () => Promise<void>;
  onPrint: () => void;
  onSaveToHistory: () => Promise<void>;
  onSaveAsPreset: () => void;
  onExportJson: () => void;
  isSavingBill?: boolean;
}

export function ActionButtons({
  onPreview,
  onDownloadPdf,
  onPrint,
  onSaveToHistory,
  onSaveAsPreset,
  onExportJson,
  isSavingBill = false,
}: ActionButtonsProps) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleDownload = async () => {
    setIsPdfLoading(true);
    try {
      await onDownloadPdf();
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleSave = async () => {
    await onSaveToHistory();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-4 space-y-2.5 backdrop-blur-sm shadow-xs">
      <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider pb-1 border-b border-neutral-200 dark:border-neutral-800">
        Invoice Actions
      </h3>

      {/* Main Primary Action: Preview & Download */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="default"
          onClick={onPreview}
          className="w-full text-xs shadow-md"
        >
          <Eye className="h-4 w-4 mr-1.5" /> Preview
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleDownload}
          disabled={isPdfLoading}
          className="w-full text-xs"
        >
          {isPdfLoading ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-1.5" />
          )}
          Download PDF
        </Button>
      </div>

      {/* Secondary Actions: Print & Save */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onPrint}
          className="w-full text-xs"
        >
          <Printer className="h-4 w-4 mr-1.5" /> Print Bill
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleSave}
          disabled={isSavingBill}
          className="w-full text-xs"
        >
          {justSaved ? (
            <>
              <Check className="h-4 w-4 mr-1.5 text-emerald-500 dark:text-emerald-400" /> Saved!
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4 mr-1.5" /> Save Bill
            </>
          )}
        </Button>
      </div>

      {/* Presets and Backup */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200 dark:border-neutral-800">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveAsPreset}
          className="w-full text-[11px] h-8"
        >
          Save as Preset
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onExportJson}
          className="w-full text-[11px] h-8"
        >
          <FileJson className="h-3 w-3 mr-1" /> Export JSON
        </Button>
      </div>
    </div>
  );
}

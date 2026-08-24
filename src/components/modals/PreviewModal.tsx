"use client";

import React, { useState } from "react";
import { InvoiceData } from "@/types/invoice.types";
import { TemplateRenderer } from "../templates/TemplateRenderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Printer, Download, LayoutTemplate, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { exportToPdf, printInvoice } from "@/lib/pdf/export-pdf";
import { TEMPLATES } from "@/constants/templates";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceData;
  onOpenGallery: () => void;
}

export function PreviewModal({
  open,
  onOpenChange,
  invoice,
  onOpenGallery,
}: PreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);

  const activeTemplateMeta = TEMPLATES.find((t) => t.id === invoice.templateId);

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      await exportToPdf(
        "print-invoice-root",
        `${invoice.invoice.invoiceNumber || "Invoice"}.pdf`,
        activeTemplateMeta?.paperSize || "a4"
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printInvoice();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="5xl" onClose={() => onOpenChange(false)} className="max-h-[92vh] flex flex-col p-4">
        {/* Header Toolbar */}
        <DialogHeader className="pb-3 border-b border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-400" />
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <span>Print & PDF Preview</span>
                  {activeTemplateMeta && (
                    <Badge variant="outline" className="font-normal text-xs">
                      {activeTemplateMeta.name} ({activeTemplateMeta.paperSize.toUpperCase()})
                    </Badge>
                  )}
                </DialogTitle>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden md:flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-400 hover:text-white"
                  onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="font-mono text-neutral-300 w-10 text-center">{zoom}%</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-400 hover:text-white"
                  onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-400 hover:text-white"
                  onClick={() => setZoom(100)}
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenGallery}
                className="text-xs"
              >
                <LayoutTemplate className="h-3.5 w-3.5 mr-1 text-amber-400" /> Switch Layout
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs"
              >
                <Printer className="h-3.5 w-3.5 mr-1" /> Print
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="text-xs font-bold"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                {isExporting ? "Generating PDF..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Viewport with Zoom Canvas */}
        <div className="flex-1 overflow-y-auto bg-neutral-950/70 p-4 sm:p-6 rounded-xl border border-neutral-800/80 my-2 flex justify-center">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className="transition-transform duration-100 max-w-full"
          >
            <TemplateRenderer invoice={invoice} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FirstRunPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenProfileModal: () => void;
  onDismissForever: () => void;
}

export function FirstRunPromptModal({
  open,
  onOpenChange,
  onOpenProfileModal,
  onDismissForever,
}: FirstRunPromptModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="md" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
            <Eye className="h-5 w-5" />
          </div>
          <DialogTitle>Save Business Details for 1-Minute Billing?</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-neutral-300">
          <p>
            Would you like to save your business name, GSTIN, and bank details locally on your browser?
          </p>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1 text-[11px] text-neutral-400">
            <p className="text-amber-300 font-semibold">🔒 100% Client-Side Privacy Guarantee</p>
            <p>Your business information is saved only on this browser (localStorage). No login required, no cloud syncing, zero tracking.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onDismissForever();
              onOpenChange(false);
            }}
            className="text-xs text-neutral-400"
          >
            Don&apos;t Ask Again
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onOpenProfileModal();
            }}
            className="text-xs font-bold"
          >
            Setup Business Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

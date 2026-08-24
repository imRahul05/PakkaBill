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
        <DialogHeader className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
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
              <div className="hidden md:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="font-mono text-neutral-700 dark:text-neutral-300 w-10 text-center">{zoom}%</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
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
                <LayoutTemplate className="h-3.5 w-3.5 mr-1 text-primary" /> Switch Layout
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
        <div className="flex-1 overflow-y-auto bg-neutral-100/70 dark:bg-neutral-950/70 p-4 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800/80 my-2 flex justify-center">
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

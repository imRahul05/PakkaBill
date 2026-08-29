"use client";

import React from "react";
import { StoredBill } from "@/types/storage.types";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDateTime } from "@/lib/formatters/date";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Copy, Trash2, Download, Printer, Eye } from "lucide-react";
import { exportSingleInvoiceJson } from "@/lib/storage/json-export";

interface BillCardProps {
  bill: StoredBill;
  onReopen: (bill: StoredBill) => void;
  onDuplicate: (bill: StoredBill) => void;
  onDelete: (id: string) => void;
  onPrint?: (bill: StoredBill) => void;
  onPreview?: (bill: StoredBill) => void;
}

export function BillCard({ bill, onReopen, onDuplicate, onDelete, onPrint, onPreview }: BillCardProps) {
  const getCategoryBadgeVariant = () => {
    switch (bill.category) {
      case "gold":
        return "gold";
      case "silver":
        return "silver";
      case "grocery":
        return "success";
      case "general":
        return "blue";
    }
  };

  return (
    <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-2.5 shadow-xs">
      {/* Header: Invoice No, Date, Total */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">{bill.invoiceNumber}</span>
            <Badge variant={getCategoryBadgeVariant() as "gold" | "silver" | "success" | "blue"}>
              {bill.category.toUpperCase()}
            </Badge>
            {bill.billingMode === "non_gst" && (
              <Badge variant="outline">Non-GST</Badge>
            )}
          </div>
          <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">{bill.buyerName}</p>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-primary font-mono">
            {formatCurrency(bill.grandTotal)}
          </span>
          <p className="text-[10px] text-neutral-500">{formatDateTime(bill.createdAt)}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onReopen(bill)}
          className="h-7 text-xs px-2.5"
          title="Load and edit in current form"
        >
          <FolderOpen className="h-3.5 w-3.5 mr-1 text-primary" /> Reopen
        </Button>

        {onPreview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPreview(bill)}
            className="h-7 text-xs px-2"
            title="Preview & view invoice template"
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> Preview
          </Button>
        )}

        {onPrint && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPrint(bill)}
            className="h-7 text-xs px-2"
            title="Print bill directly"
          >
            <Printer className="h-3.5 w-3.5 mr-1" /> Print
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onDuplicate(bill)}
          className="h-7 text-xs px-2"
          title="Duplicate as new invoice"
        >
          <Copy className="h-3.5 w-3.5 mr-1" /> Copy
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => exportSingleInvoiceJson(bill.fullData)}
          className="h-7 text-xs px-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
          title="Download JSON"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(bill.id)}
          className="h-7 text-xs px-2 text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title="Delete from history"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

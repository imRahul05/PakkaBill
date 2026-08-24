"use client";

import React, { useState } from "react";
import { StoredBill } from "@/types/storage.types";
import { InvoiceData } from "@/types/invoice.types";
import { BillCard } from "./BillCard";
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Search, Trash2, Download, AlertTriangle, Info } from "lucide-react";
import { exportFullBackup } from "@/lib/storage/json-export";

interface BillHistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bills: StoredBill[];
  lastEvictedBill: StoredBill | null;
  onClearEvictedNotice: () => void;
  onLoadInvoice: (invoice: InvoiceData) => void;
  onDeleteBill: (id: string) => Promise<boolean>;
  onClearHistory: () => Promise<boolean>;
}

export function BillHistoryDrawer({
  open,
  onOpenChange,
  bills,
  lastEvictedBill,
  onClearEvictedNotice,
  onLoadInvoice,
  onDeleteBill,
  onClearHistory,
}: BillHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.invoiceNumber.toLowerCase().includes(q) ||
      b.buyerName.toLowerCase().includes(q) ||
      (b.buyerGstin && b.buyerGstin.toLowerCase().includes(q))
    );
  });

  const handleReopen = (bill: StoredBill) => {
    onLoadInvoice(bill.fullData);
    onOpenChange(false);
  };

  const handleDuplicate = (bill: StoredBill) => {
    const duplicated: InvoiceData = {
      ...bill.fullData,
      id: `inv-${Date.now()}`,
      invoice: {
        ...bill.fullData.invoice,
        invoiceNumber: `${bill.fullData.invoice.invoiceNumber}-COPY`,
        invoiceDate: new Date().toISOString().split("T")[0],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onLoadInvoice(duplicated);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <SheetHeader onClose={() => onOpenChange(false)}>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-400" />
          <div>
            <SheetTitle>Recent Bills History</SheetTitle>
            <SheetDescription>
              Stored locally in IndexedDB (Last {bills.length}/10 bills retained)
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <SheetContent>
        {/* FIFO Eviction Notice */}
        {lastEvictedBill && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs text-amber-300">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-400" /> Oldest Bill Evicted (FIFO Cap)
              </span>
              <button
                type="button"
                onClick={onClearEvictedNotice}
                className="text-[10px] text-amber-400 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <p className="text-[11px] text-amber-200/80">
              Bill #{lastEvictedBill.invoiceNumber} ({lastEvictedBill.buyerName}) was archived to keep history bounded.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by invoice no, customer name, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400">
          <Info className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
          <span>
            100% private: Bills never leave this device. Export full backup to save your records permanently.
          </span>
        </div>

        {/* Bills List */}
        <div className="space-y-3">
          {bills.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No bills generated yet. Generate or save a bill to see it here!
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No bills match &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onReopen={handleReopen}
                onDuplicate={handleDuplicate}
                onDelete={onDeleteBill}
              />
            ))
          )}
        </div>
      </SheetContent>

      <SheetFooter>
        <div className="flex items-center justify-between w-full gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportFullBackup}
            className="text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Backup All (JSON)
          </Button>

          {bills.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear History
            </Button>
          )}
        </div>
      </SheetFooter>
    </Sheet>
  );
}

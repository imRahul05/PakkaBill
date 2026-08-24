"use client";

import React, { useState } from "react";
import { HSN_DIRECTORY, GST_RATES_2026, HsnReference, GstRateInfo } from "@/constants/gst-rates";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Percent, Copy, Check } from "lucide-react";

interface GstRateSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GstRateSearchModal({ open, onOpenChange }: GstRateSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHsn, setCopiedHsn] = useState<string | null>(null);

  const filteredHsn = HSN_DIRECTORY.filter((item: HsnReference) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.hsn.includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleCopy = (hsn: string) => {
    navigator.clipboard.writeText(hsn);
    setCopiedHsn(hsn);
    setTimeout(() => setCopiedHsn(null), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="4xl" onClose={() => onOpenChange(false)} className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            <DialogTitle>Indian GST 2.0 Rate Directory & HSN Lookup</DialogTitle>
          </div>
          <DialogDescription>
            Search statutory rates, HSN/SAC codes, and GST 2.0 slabs.
          </DialogDescription>
        </DialogHeader>

        {/* 2026 GST Slabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          {GST_RATES_2026.map((slab: GstRateInfo) => (
            <div key={slab.rate} className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
              <div className="font-mono font-bold text-primary text-sm">{slab.rate}%</div>
              <div className="text-[10px] text-neutral-600 dark:text-neutral-400 truncate" title={slab.label}>{slab.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative my-2">
          <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by HSN code (e.g. 7113), commodity name (e.g. Gold, Rice), or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredHsn.map((item: HsnReference, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 flex items-center justify-between gap-3 transition-colors shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">{item.hsn}</span>
                  <Badge variant="warning">{item.rate || item.defaultRate}% GST</Badge>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 capitalize">({item.category})</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">{item.description}</p>
                {item.notes && <p className="text-[11px] text-neutral-500 italic">{item.notes}</p>}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(item.hsn)}
                className="text-xs shrink-0"
              >
                {copiedHsn === item.hsn ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy HSN
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

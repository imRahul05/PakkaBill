"use client";

import React from "react";
import { CategoryId, BillingMode } from "@/types/category.types";
import { CATEGORIES } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Gem,
  ShoppingBag,
  Layers,
  LayoutTemplate,
  Clock,
  Building2,
  Bookmark,
  Percent,
  FileJson,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  category: CategoryId;
  billingMode: BillingMode;
  onCategoryChange: (cat: CategoryId) => void;
  onBillingModeChange: (mode: BillingMode) => void;
  historyCount: number;
  onOpenGallery: () => void;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onOpenPresets: () => void;
  onOpenGstSearch: () => void;
  onOpenImportExport: () => void;
}

export function Header({
  category,
  billingMode,
  onCategoryChange,
  onBillingModeChange,
  historyCount,
  onOpenGallery,
  onOpenHistory,
  onOpenProfile,
  onOpenPresets,
  onOpenGstSearch,
  onOpenImportExport,
}: HeaderProps) {
  const getCatIcon = (catId: CategoryId) => {
    switch (catId) {
      case "gold":
        return <Sparkles className="h-4 w-4" />;
      case "silver":
        return <Gem className="h-4 w-4" />;
      case "grocery":
        return <ShoppingBag className="h-4 w-4" />;
      case "general":
        return <Layers className="h-4 w-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="font-mono font-black text-neutral-950 text-xl tracking-tighter">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-neutral-100 tracking-tight">BharatBill GST</span>
                <Badge variant="warning" className="text-[10px] px-1.5 py-0">GST 2.0 Ready</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>100% Client-Side • No Login Required</span>
              </div>
            </div>
          </div>

          {/* Category Switcher Pill Selector (Desktop/Tablet) */}
          <div className="hidden lg:flex items-center bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
            {(["gold", "silver", "grocery", "general"] as CategoryId[]).map((catId) => {
              const cat = CATEGORIES[catId];
              const isActive = category === catId;
              return (
                <button
                  key={catId}
                  type="button"
                  onClick={() => onCategoryChange(catId)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
                  )}
                >
                  {getCatIcon(catId)}
                  <span>{cat.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* GST vs Non-GST Toggle */}
            <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => onBillingModeChange("gst")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer",
                  billingMode === "gst"
                    ? "bg-neutral-800 text-amber-400 shadow-sm"
                    : "text-neutral-400 hover:text-neutral-300"
                )}
              >
                Tax Invoice (GST)
              </button>
              <button
                type="button"
                onClick={() => onBillingModeChange("non_gst")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
                  billingMode === "non_gst"
                    ? "bg-neutral-800 text-neutral-200 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                Bill of Supply
              </button>
            </div>

            {/* Quick Action Icon Buttons */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenGallery}
                className="hidden sm:flex text-xs items-center gap-1.5 border-neutral-800 hover:border-amber-400"
                title="Browse 40 Templates"
              >
                <LayoutTemplate className="h-3.5 w-3.5 text-amber-400" />
                <span>40 Templates</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenHistory}
                className="relative text-xs border-neutral-800 hover:border-neutral-700"
                title="Recent Bills (Last 10)"
              >
                <Clock className="h-3.5 w-3.5 mr-1 text-neutral-400" />
                <span className="hidden md:inline">History</span>
                {historyCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-amber-500 text-neutral-950 rounded-full">
                    {historyCount}
                  </span>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onOpenProfile}
                className="h-8 w-8 text-neutral-400 hover:text-neutral-200"
                title="Business Profile"
              >
                <Building2 className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onOpenPresets}
                className="h-8 w-8 text-neutral-400 hover:text-neutral-200"
                title="Saved Presets"
              >
                <Bookmark className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onOpenGstSearch}
                className="h-8 w-8 text-neutral-400 hover:text-neutral-200"
                title="GST Rates & HSN Directory"
              >
                <Percent className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onOpenImportExport}
                className="h-8 w-8 text-neutral-400 hover:text-neutral-200"
                title="Import / Export Backup"
              >
                <FileJson className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Category Switcher Bar */}
        <div className="flex lg:hidden items-center justify-between gap-1 py-2 border-t border-neutral-900 overflow-x-auto scrollbar-none">
          {(["gold", "silver", "grocery", "general"] as CategoryId[]).map((catId) => {
            const cat = CATEGORIES[catId];
            const isActive = category === catId;
            return (
              <button
                key={catId}
                type="button"
                onClick={() => onCategoryChange(catId)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                  isActive
                    ? "bg-amber-500 text-neutral-950 font-bold shadow"
                    : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                )}
              >
                {getCatIcon(catId)}
                <span>{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export function MobileNavigation({
  activeTab,
  onTabChange,
  onOpenPreview,
  complianceScore,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenPreview: () => void;
  complianceScore: number;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 p-2 sm:hidden flex items-center justify-around">
      <button
        type="button"
        onClick={() => onTabChange("seller")}
        className={cn(
          "flex flex-col items-center gap-0.5 text-[10px] cursor-pointer",
          activeTab === "seller" ? "text-amber-400 font-bold" : "text-neutral-400"
        )}
      >
        <Building2 className="h-4 w-4" />
        <span>Seller</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("items")}
        className={cn(
          "flex flex-col items-center gap-0.5 text-[10px] cursor-pointer",
          activeTab === "items" ? "text-amber-400 font-bold" : "text-neutral-400"
        )}
      >
        <ShoppingBag className="h-4 w-4" />
        <span>Items</span>
      </button>

      <button
        type="button"
        onClick={onOpenPreview}
        className="flex flex-col items-center gap-0.5 text-[10px] px-3 py-1 bg-amber-500 text-neutral-950 font-bold rounded-lg shadow-lg shadow-amber-500/20 cursor-pointer"
      >
        <span>Preview & Print</span>
        <span className="text-[8px] opacity-80 font-mono">Score {complianceScore}%</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("invoice")}
        className={cn(
          "flex flex-col items-center gap-0.5 text-[10px] cursor-pointer",
          activeTab === "invoice" ? "text-amber-400 font-bold" : "text-neutral-400"
        )}
      >
        <Layers className="h-4 w-4" />
        <span>Invoice</span>
      </button>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-800/80 bg-neutral-950 py-6 text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>100% Offline & Client-Side • Compliant with CGST Rule 46 (2026)</span>
        </div>
        <p className="text-center sm:text-right text-[11px] text-neutral-600">
          Zero data collected. No server, no account, 100% private to your browser.
        </p>
      </div>
    </footer>
  );
}

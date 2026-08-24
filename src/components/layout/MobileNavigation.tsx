"use client";

import React from "react";
import { Building2, ShoppingBag, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenPreview: () => void;
  complianceScore: number;
}

export function MobileNavigation({
  activeTab,
  onTabChange,
  onOpenPreview,
  complianceScore,
}: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 p-2 sm:hidden flex items-center justify-around">
      <button
        type="button"
        onClick={() => onTabChange("seller")}
        className={cn(
          "flex flex-col items-center gap-0.5 text-[10px] cursor-pointer",
          activeTab === "seller" ? "text-primary font-bold" : "text-neutral-600 dark:text-neutral-400"
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
          activeTab === "items" ? "text-primary font-bold" : "text-neutral-600 dark:text-neutral-400"
        )}
      >
        <ShoppingBag className="h-4 w-4" />
        <span>Items</span>
      </button>

      <button
        type="button"
        onClick={onOpenPreview}
        className="flex flex-col items-center gap-0.5 text-[10px] px-3 py-1 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg cursor-pointer"
      >
        <span>Preview & Print</span>
        <span className="text-[8px] opacity-80 font-mono">Score {complianceScore}%</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("invoice")}
        className={cn(
          "flex flex-col items-center gap-0.5 text-[10px] cursor-pointer",
          activeTab === "invoice" ? "text-primary font-bold" : "text-neutral-600 dark:text-neutral-400"
        )}
      >
        <Layers className="h-4 w-4" />
        <span>Invoice</span>
      </button>
    </div>
  );
}

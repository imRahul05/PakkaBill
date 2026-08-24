"use client";

import React from "react";
import { Building2, User, FileText, ShoppingBag, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormTabId = "seller" | "buyer" | "invoice" | "items" | "other";

interface TabNavigationProps {
  activeTab: FormTabId;
  onTabChange: (tab: FormTabId) => void;
  itemCount: number;
}

const TABS: { id: FormTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "seller", label: "1. Seller", icon: Building2 },
  { id: "buyer", label: "2. Buyer", icon: User },
  { id: "invoice", label: "3. Invoice Details", icon: FileText },
  { id: "items", label: "4. Line Items", icon: ShoppingBag },
  { id: "other", label: "5. Other & Payment", icon: Sliders },
];

export function TabNavigation({ activeTab, onTabChange, itemCount }: TabNavigationProps) {
  return (
    <div className="w-full border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center space-x-1 overflow-x-auto p-1.5 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none",
                isActive
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/10 font-bold"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-neutral-950" : "text-neutral-400")} />
              <span>{tab.label}</span>
              {tab.id === "items" && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    isActive ? "bg-neutral-950 text-amber-400" : "bg-neutral-800 text-neutral-300"
                  )}
                >
                  {itemCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

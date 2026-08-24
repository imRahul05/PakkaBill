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
    <div className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md sticky top-0 z-20 rounded-t-xl">
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
                  ? "bg-primary text-primary-foreground shadow-md font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-neutral-500")} />
              <span>{tab.label}</span>
              {tab.id === "items" && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
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

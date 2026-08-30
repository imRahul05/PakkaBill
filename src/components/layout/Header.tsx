"use client";

import React from "react";
import { CategoryId, BillingMode } from "@/types/category.types";
import { CATEGORIES } from "@/constants/categories";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Gem,
  ShoppingBag,
  Layers,
  Eye,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface HeaderProps {
  category: CategoryId;
  billingMode: BillingMode;
  invoiceNumber: string;
  sellerTradeName: string;
  complianceScore: number;
  onOpenPreview: () => void;
  onOpenThemeModal?: () => void;
}

export function Header({
  category,
  billingMode,
  invoiceNumber,
  sellerTradeName,
  complianceScore,
  onOpenPreview,
  onOpenThemeModal,
}: HeaderProps) {
  const currentCategoryMeta = CATEGORIES[category];

  const getCatIcon = (catId: CategoryId) => {
    switch (catId) {
      case "gold":
        return <Sparkles className="h-3.5 w-3.5 text-amber-500" />;
      case "silver":
        return <Gem className="h-3.5 w-3.5 text-slate-400" />;
      case "grocery":
        return <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />;
      case "general":
        return <Layers className="h-3.5 w-3.5 text-blue-500" />;
    }
  };

  const isCompliant = complianceScore >= 80;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Left: Active Document Status & Breadcrumb Context */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Category Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shrink-0">
              {getCatIcon(category)}
              <span>{currentCategoryMeta.shortLabel}</span>
            </div>

            {/* Billing Mode Badge */}
            <Badge
              variant={billingMode === "gst" ? "warning" : "secondary"}
              className="text-[10px] uppercase font-bold tracking-wider shrink-0"
            >
              {billingMode === "gst" ? "GST Tax Invoice" : "Bill of Supply"}
            </Badge>

            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>

            {/* Active Document Info */}
            <div className="hidden sm:flex items-center gap-2 truncate text-xs">
              <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                {invoiceNumber || "INV-2026-001"}
              </span>
              {sellerTradeName && (
                <>
                  <span className="text-neutral-400 dark:text-neutral-600">—</span>
                  <span className="text-neutral-600 dark:text-neutral-400 truncate max-w-[200px] md:max-w-[280px]">
                    {sellerTradeName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Live Compliance Pill, Quick Preview & Theme */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Compliance Score Pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isCompliant
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  : "bg-primary-muted text-primary-text border-primary-border"
              }`}
            >
              {isCompliant ? (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              )}
              <span>Rule 46: {complianceScore}%</span>
            </div>

            {/* Quick Preview & Print Button */}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onOpenPreview}
              className="h-8 gap-1.5 text-xs font-bold"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview & Print</span>
            </Button>

            {/* Theme & Palette Toggle */}
            <div className="pl-1 border-l border-neutral-200 dark:border-neutral-800">
              <ThemeToggle onOpenCustomizer={onOpenThemeModal} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

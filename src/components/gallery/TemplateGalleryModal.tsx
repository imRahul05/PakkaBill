"use client";

import React, { useState } from "react";
import { CategoryId } from "@/types/category.types";
import { InvoiceData } from "@/types/invoice.types";
import { getTemplatesByCategory } from "@/constants/templates";
import { CATEGORIES } from "@/constants/categories";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LayoutTemplate, Sparkles, Gem, ShoppingBag, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceData;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateGalleryModal({
  open,
  onOpenChange,
  invoice,
  onSelectTemplate,
}: TemplateGalleryModalProps) {
  const [selectedCatOverride, setSelectedCatOverride] = useState<CategoryId | null>(null);
  const selectedCat = selectedCatOverride || invoice.category;

  const activeCategoryTemplates = getTemplatesByCategory(selectedCat);

  const handleSelect = (templateId: string) => {
    onSelectTemplate(templateId);
    onOpenChange(false);
  };

  const getCatIcon = (catId: CategoryId) => {
    switch (catId) {
      case "gold":
        return <Sparkles className="h-3.5 w-3.5" />;
      case "silver":
        return <Gem className="h-3.5 w-3.5" />;
      case "grocery":
        return <ShoppingBag className="h-3.5 w-3.5" />;
      case "general":
        return <Layers className="h-3.5 w-3.5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="6xl" onClose={() => onOpenChange(false)} className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-amber-400" />
            <DialogTitle>40 Print-Ready Invoice Templates Gallery</DialogTitle>
          </div>
          <DialogDescription>
            Choose from 10 distinct, beautifully styled print layouts for your category. Live data previewed below.
          </DialogDescription>
        </DialogHeader>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
          {(["gold", "silver", "grocery", "general"] as CategoryId[]).map((catId) => {
            const cat = CATEGORIES[catId];
            const isCatActive = selectedCat === catId;
            return (
              <button
                key={catId}
                type="button"
                onClick={() => setSelectedCatOverride(catId)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                  isCatActive
                    ? "bg-amber-500 text-neutral-950 font-bold shadow"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                )}
              >
                {getCatIcon(catId)}
                <span>{cat.shortLabel}</span>
                <span className="text-[10px] opacity-70 font-mono">(10)</span>
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeCategoryTemplates.map((template) => (
              <TemplateThumbnail
                key={template.id}
                template={template}
                invoice={invoice}
                isSelected={invoice.templateId === template.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

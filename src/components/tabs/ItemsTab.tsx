"use client";

import React from "react";
import {
  CategoryId,
  GeneralItem,
  GoldItem,
  GroceryItem,
  LineItem,
  SilverItem,
} from "@/types/category.types";
import { GoldItems } from "./items/GoldItems";
import { SilverItems } from "./items/SilverItems";
import { GroceryItems } from "./items/GroceryItems";
import { GeneralItems } from "./items/GeneralItems";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Search, Sparkles, ShoppingBag, Layers, Gem } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";

interface ItemsTabProps {
  category: CategoryId;
  items: LineItem[];
  isGstMode: boolean;
  onAddItem: () => void;
  onUpdateItem: (index: number, update: Partial<LineItem>) => void;
  onRemoveItem: (index: number) => void;
  onOpenHsnSearch?: () => void;
  onQuickAddGrocery?: (preset: Partial<GroceryItem>) => void;
}

export function ItemsTab({
  category,
  items,
  isGstMode,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onOpenHsnSearch,
  onQuickAddGrocery,
}: ItemsTabProps) {
  const categoryInfo = CATEGORIES[category];

  const getCategoryIcon = () => {
    switch (category) {
      case "gold":
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case "silver":
        return <Gem className="h-4 w-4 text-slate-300" />;
      case "grocery":
        return <ShoppingBag className="h-4 w-4 text-emerald-400" />;
      case "general":
        return <Layers className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon()}
              <div>
                <CardTitle>{categoryInfo.name} — Billed Items</CardTitle>
                <CardDescription>{categoryInfo.tagline}</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isGstMode && onOpenHsnSearch && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenHsnSearch}
                  className="text-xs"
                >
                  <Search className="h-3.5 w-3.5 mr-1" /> HSN Lookup
                </Button>
              )}
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={onAddItem}
                className="text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Line Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <ShoppingBag className="h-10 w-10 text-neutral-400 dark:text-neutral-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-300">No items added yet</h4>
              <p className="text-xs text-neutral-500 mb-4">
                Click Add Line Item below to begin billing
              </p>
              <Button type="button" onClick={onAddItem} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
          ) : (
            <>
              {category === "gold" && (
                <GoldItems
                  items={items as GoldItem[]}
                  isGstMode={isGstMode}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {category === "silver" && (
                <SilverItems
                  items={items as SilverItem[]}
                  isGstMode={isGstMode}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {category === "grocery" && (
                <GroceryItems
                  items={items as GroceryItem[]}
                  isGstMode={isGstMode}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  onQuickAddItem={onQuickAddGrocery}
                />
              )}

              {category === "general" && (
                <GeneralItems
                  items={items as GeneralItem[]}
                  isGstMode={isGstMode}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {/* Bottom Add Item Button */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onAddItem}
                  className="w-full sm:w-auto border-dashed hover:border-primary hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Plus className="h-4 w-4 mr-2 text-primary" /> Add Another Item
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

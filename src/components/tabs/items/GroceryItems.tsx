"use client";

import React from "react";
import { GroceryItem, GroceryUnit } from "@/types/category.types";
import { GROCERY_UNITS } from "@/constants/categories";
import { formatCurrency } from "@/lib/formatters/currency";
import { useCollapsibleList } from "@/hooks/useCollapsibleList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface GroceryItemsProps {
  items: GroceryItem[];
  isGstMode: boolean;
  onUpdateItem: (index: number, update: Partial<GroceryItem>) => void;
  onRemoveItem: (index: number) => void;
  onQuickAddItem?: (preset: Partial<GroceryItem>) => void;
}

const COMMON_GROCERY_PRESETS: {
  name: string;
  hsn: string;
  isPackaged: boolean;
  unit: GroceryUnit;
  defaultRate: number;
  gstRate: number;
}[] = [
  { name: "Atta (Wheat Flour) 5kg", hsn: "1101", isPackaged: true, unit: "bag", defaultRate: 240, gstRate: 5 },
  { name: "Basmati Rice (Loose)", hsn: "1006", isPackaged: false, unit: "kg", defaultRate: 90, gstRate: 0 },
  { name: "Pure Cow Ghee 1L", hsn: "0405", isPackaged: true, unit: "L", defaultRate: 650, gstRate: 5 },
  { name: "Sugar / Cheeni (Loose)", hsn: "1701", isPackaged: false, unit: "kg", defaultRate: 44, gstRate: 0 },
  { name: "Sunflower Cooking Oil 1L", hsn: "1512", isPackaged: true, unit: "packet", defaultRate: 145, gstRate: 5 },
  { name: "Tata Salt 1kg", hsn: "2501", isPackaged: true, unit: "packet", defaultRate: 28, gstRate: 5 },
  { name: "Toor Dal (Loose Unbranded)", hsn: "0713", isPackaged: false, unit: "kg", defaultRate: 160, gstRate: 0 },
  { name: "Bathing Soap Pack of 4", hsn: "3401", isPackaged: true, unit: "packet", defaultRate: 180, gstRate: 5 },
];

export function GroceryItems({
  items,
  isGstMode,
  onUpdateItem,
  onRemoveItem,
  onQuickAddItem,
}: GroceryItemsProps) {
  const { isExpanded, toggleItem, toggleAll, allExpanded } = useCollapsibleList(items.length);

  return (
    <div className="space-y-4">
      {/* Quick Add Presets Bar */}
      {onQuickAddItem && (
        <div className="p-3 bg-neutral-100 dark:bg-neutral-950/70 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-300">
            <PlusCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>Fast Counter Add (Common Staples)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_GROCERY_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  onQuickAddItem({
                    name: preset.name,
                    hsn: preset.hsn,
                    isPackaged: preset.isPackaged,
                    unit: preset.unit,
                    ratePerUnit: preset.defaultRate,
                    gstRate: preset.gstRate,
                    quantity: 1,
                  })
                }
                className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-emerald-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ {preset.name}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">({formatCurrency(preset.defaultRate)})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expand/Collapse Toolbar */}
      {items.length > 1 && (
        <div className="flex items-center justify-between pb-1 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{items.length} Grocery Line Items</span>
          <button
            type="button"
            onClick={() => toggleAll(!allExpanded)}
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:opacity-80 font-semibold cursor-pointer transition-colors"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
            {allExpanded ? "Collapse All Items" : "Expand All Items"}
          </button>
        </div>
      )}

      {items.map((item, index) => {
        const itemExpanded = isExpanded(index);

        return (
          <div
            key={item.id || index}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/70 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 overflow-hidden"
          >
            {/* Header: Clickable to toggle collapse */}
            <div
              onClick={() => toggleItem(index, itemExpanded)}
              className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-neutral-50/80 dark:bg-neutral-950/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 cursor-pointer select-none transition-colors border-b border-neutral-200 dark:border-neutral-800/60"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0 border border-emerald-500/30">
                  #{index + 1}
                </span>
                <Badge variant={item.isPackaged ? "default" : "success"} className="shrink-0">
                  {item.isPackaged ? "Packaged (5%)" : "Loose (0%)"}
                </Badge>
                {item.unit && (
                  <Badge variant="secondary" className="shrink-0 font-mono">
                    {item.quantity} {item.unit}
                  </Badge>
                )}

                {/* Collapsed summary pill */}
                {!itemExpanded && (
                  <div className="flex items-center gap-2 truncate text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{item.name || "Untitled Grocery Item"}</span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">{formatCurrency(item.ratePerUnit)}/{item.unit}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="text-right mr-1">
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block leading-tight">Total</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>

                {/* Collapse / Expand Toggle Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleItem(index, itemExpanded)}
                  className="h-8 w-8 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title={itemExpanded ? "Collapse item" : "Expand item"}
                >
                  {itemExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                    className="h-8 w-8 text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Collapsible Body Form Controls */}
            {itemExpanded && (
              <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Row 1: Item Name, Packaged toggle, HSN */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label required>Item / Commodity Name</Label>
                    <Input
                      placeholder="e.g. Fortune Shudh Desi Cow Ghee 1L"
                      value={item.name}
                      onChange={(e) => onUpdateItem(index, { name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Packaged & Labelled?</Label>
                    <div className="pt-2">
                      <Switch
                        checked={item.isPackaged}
                        onCheckedChange={(checked) =>
                          onUpdateItem(index, {
                            isPackaged: checked,
                            gstRate: checked ? 5 : 0,
                          })
                        }
                        label={item.isPackaged ? "Yes (5% GST)" : "Loose (0% Exempt)"}
                      />
                    </div>
                  </div>

                  {isGstMode && (
                    <div className="space-y-1.5">
                      <Label>HSN Code</Label>
                      <Input
                        placeholder="1006"
                        value={item.hsn}
                        onChange={(e) => onUpdateItem(index, { hsn: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* Row 2: Qty, Unit, Rate, GST%, Discount */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-3 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
                  <div className="space-y-1.5">
                    <Label required>Quantity</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="1"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Unit</Label>
                    <Select
                      value={item.unit}
                      onChange={(e) =>
                        onUpdateItem(index, { unit: e.target.value as GroceryUnit })
                      }
                    >
                      {GROCERY_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Rate / Unit (₹)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="0.00"
                      value={item.ratePerUnit || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          ratePerUnit: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  {isGstMode && (
                    <div className="space-y-1.5">
                      <Label>GST Rate (%)</Label>
                      <Select
                        value={String(item.gstRate)}
                        onChange={(e) =>
                          onUpdateItem(index, { gstRate: parseFloat(e.target.value) || 0 })
                        }
                      >
                        <option value="0">0% (Nil / Loose)</option>
                        <option value="5">5% (Packaged Essentials)</option>
                        <option value="12">12% (Standard Low)</option>
                        <option value="18">18% (Standard High)</option>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label>Discount (₹)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0.00"
                      value={item.discountAmount || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          discountAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Row 3: Tax & Total Breakdown */}
                {isGstMode && (
                  <div className="flex flex-wrap items-center justify-between text-xs px-3 py-2 bg-neutral-950/40 rounded-lg border border-neutral-800/60 text-neutral-400">
                    <div>
                      Taxable Value: <span className="font-semibold text-neutral-200">{formatCurrency(item.taxableValue)}</span>
                    </div>
                    <div>
                      GST ({item.gstRate}%): <span className="font-semibold text-neutral-200">{formatCurrency(item.taxAmount)}</span>
                    </div>
                    <div>
                      Item Total: <span className="font-bold text-emerald-400">{formatCurrency(item.lineTotal)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

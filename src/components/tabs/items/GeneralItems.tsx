"use client";

import React from "react";
import { GeneralItem, GeneralUnit } from "@/types/category.types";
import { GENERAL_UNITS } from "@/constants/categories";
import { formatCurrency } from "@/lib/formatters/currency";
import { useCollapsibleList } from "@/hooks/useCollapsibleList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface GeneralItemsProps {
  items: GeneralItem[];
  isGstMode: boolean;
  onUpdateItem: (index: number, update: Partial<GeneralItem>) => void;
  onRemoveItem: (index: number) => void;
}

export function GeneralItems({
  items,
  isGstMode,
  onUpdateItem,
  onRemoveItem,
}: GeneralItemsProps) {
  const { isExpanded, toggleItem, toggleAll, allExpanded } = useCollapsibleList(items.length);

  return (
    <div className="space-y-4">
      {/* Expand/Collapse Toolbar */}
      {items.length > 1 && (
        <div className="flex items-center justify-between pb-1 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{items.length} Line Items</span>
          <button
            type="button"
            onClick={() => toggleAll(!allExpanded)}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:opacity-80 font-semibold cursor-pointer transition-colors"
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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0 border border-blue-500/30">
                  #{index + 1}
                </span>
                <Badge variant="blue" className="shrink-0">Goods / Services</Badge>
                {item.unit && (
                  <Badge variant="secondary" className="shrink-0 font-mono">
                    {item.quantity} {item.unit}
                  </Badge>
                )}
                {isGstMode && (
                  <Badge variant="outline" className="shrink-0 font-mono">{item.gstRate}% GST</Badge>
                )}

                {/* Collapsed summary pill */}
                {!itemExpanded && (
                  <div className="flex items-center gap-2 truncate text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{item.name || "Untitled Item"}</span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">{formatCurrency(item.ratePerUnit)}/{item.unit}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="text-right mr-1">
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block leading-tight">Total</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>

                {/* Collapse / Expand Toggle Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleItem(index, itemExpanded)}
                  className="h-8 w-8 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
                {/* Row 1: Item Name, Description, HSN/SAC */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label required>Item / Service Description</Label>
                    <Input
                      placeholder="e.g. Dell UltraSharp 27-inch 4K Monitor"
                      value={item.name}
                      onChange={(e) => onUpdateItem(index, { name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Detailed Specifications / Note</Label>
                    <Input
                      placeholder="e.g. Serial No. / Model / Specs"
                      value={item.description || ""}
                      onChange={(e) => onUpdateItem(index, { description: e.target.value })}
                    />
                  </div>

                  {isGstMode && (
                    <div className="space-y-1.5">
                      <Label required>HSN / SAC Code</Label>
                      <Input
                        placeholder="e.g. 8471 or 9983"
                        value={item.hsn}
                        onChange={(e) => onUpdateItem(index, { hsn: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* Row 2: Qty, Unit, Rate, Discount %, GST% */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-3 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
                  <div className="space-y-1.5">
                    <Label required>Quantity</Label>
                    <Input
                      type="number"
                      step="1"
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
                        onUpdateItem(index, { unit: e.target.value as GeneralUnit })
                      }
                    >
                      {GENERAL_UNITS.map((u) => (
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
                      step="1"
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

                  <div className="space-y-1.5">
                    <Label>Discount (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      placeholder="0%"
                      value={item.discountPercent || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          discountPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  {isGstMode && (
                    <div className="space-y-1.5">
                      <Label required>GST Slab (%)</Label>
                      <Select
                        value={String(item.gstRate)}
                        onChange={(e) =>
                          onUpdateItem(index, { gstRate: parseFloat(e.target.value) || 0 })
                        }
                      >
                        <option value="0">0% (Nil / Exempt)</option>
                        <option value="5">5% (Essential Slab)</option>
                        <option value="18">18% (Standard 2026)</option>
                        <option value="40">40% (Sin / Luxury)</option>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Row 3: Taxable base & tax summary */}
                {isGstMode && (
                  <div className="flex flex-wrap items-center justify-between text-xs px-3 py-2 bg-neutral-950/40 rounded-lg border border-neutral-800/60 text-neutral-400">
                    <div>
                      Taxable Value: <span className="font-semibold text-neutral-200">{formatCurrency(item.taxableValue)}</span>
                    </div>
                    <div>
                      GST ({item.gstRate}%): <span className="font-semibold text-neutral-200">{formatCurrency(item.taxAmount)}</span>
                    </div>
                    <div>
                      Item Total: <span className="font-bold text-blue-400">{formatCurrency(item.lineTotal)}</span>
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

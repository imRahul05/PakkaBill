"use client";

import React, { useState } from "react";
import { GoldItem, GoldPurity } from "@/types/category.types";
import { GOLD_PURITIES } from "@/constants/categories";
import { formatCurrency, formatGrams } from "@/lib/formatters/currency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowDownCircle, ShieldCheck, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface GoldItemsProps {
  items: GoldItem[];
  isGstMode: boolean;
  onUpdateItem: (index: number, update: Partial<GoldItem>) => void;
  onRemoveItem: (index: number) => void;
}

export function GoldItems({
  items,
  isGstMode,
  onUpdateItem,
  onRemoveItem,
}: GoldItemsProps) {
  // Explicit toggle overrides. Defaults: latest item expanded, earlier items collapsed
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({});

  const toggleItemExpanded = (index: number, currentExpanded: boolean) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !currentExpanded,
    }));
  };

  const handleToggleAll = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    items.forEach((_, idx) => {
      next[idx] = expand;
    });
    setExpandedIndices(next);
  };

  const getItemIsExpanded = (index: number): boolean => {
    if (expandedIndices[index] !== undefined) {
      return expandedIndices[index];
    }
    return index === items.length - 1;
  };

  const allExpanded = items.every((_, idx) => getItemIsExpanded(idx));

  return (
    <div className="space-y-4">
      {/* Expand/Collapse All Toolbar if multiple items */}
      {items.length > 1 && (
        <div className="flex items-center justify-between pb-1 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{items.length} Gold Line Items</span>
          <button
            type="button"
            onClick={() => handleToggleAll(!allExpanded)}
            className="flex items-center gap-1 text-primary hover:opacity-80 font-semibold cursor-pointer transition-colors"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
            {allExpanded ? "Collapse All Items" : "Expand All Items"}
          </button>
        </div>
      )}

      {items.map((item, index) => {
        const isExpanded = getItemIsExpanded(index);
        const isExchangeEnabled = Boolean(item.oldGoldExchange?.enabled);

        return (
          <div
            key={item.id || index}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/70 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 overflow-hidden"
          >
            {/* Header: Clickable to toggle collapse */}
            <div
              onClick={() => toggleItemExpanded(index, isExpanded)}
              className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-neutral-50/80 dark:bg-neutral-950/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 cursor-pointer select-none transition-colors border-b border-neutral-200 dark:border-neutral-800/60"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-muted text-primary-text text-xs font-bold shrink-0 border border-primary-border">
                  #{index + 1}
                </span>
                <Badge variant="gold" className="shrink-0">Gold</Badge>
                {item.purity && <Badge variant="secondary" className="shrink-0">{item.purity}</Badge>}

                {/* Collapsed summary pill */}
                {!isExpanded && (
                  <div className="flex items-center gap-2 truncate text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{item.name || "Untitled Gold Item"}</span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">{formatGrams(item.netWeight)}</span>
                    {item.huid && (
                      <>
                        <span className="text-neutral-400 dark:text-neutral-600">•</span>
                        <span className="font-mono text-[11px] text-primary">{item.huid}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="text-right mr-1">
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block leading-tight">Total</span>
                  <span className="text-sm font-bold text-primary font-mono">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>

                {/* Collapse / Expand Toggle Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleItemExpanded(index, isExpanded)}
                  className="h-8 w-8 text-neutral-500 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title={isExpanded ? "Collapse item" : "Expand item"}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
            {isExpanded && (
              <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Row 1: Item Name, Description, HSN, Purity */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label required>Item / Ornament Name</Label>
                    <Input
                      placeholder="e.g. 22K Bridal Gold Necklace"
                      value={item.name}
                      onChange={(e) => onUpdateItem(index, { name: e.target.value })}
                    />
                  </div>

                  {isGstMode && (
                    <div className="space-y-1.5">
                      <Label>HSN Code</Label>
                      <Input
                        placeholder="7113"
                        value={item.hsn}
                        onChange={(e) => onUpdateItem(index, { hsn: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label required>Purity / Fineness</Label>
                    <Select
                      value={item.purity}
                      onChange={(e) =>
                        onUpdateItem(index, { purity: e.target.value as GoldPurity })
                      }
                    >
                      {GOLD_PURITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Row 2: Weight & Metal Calculation (Rate per 10g) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
                  <div className="space-y-1.5">
                    <Label required>Gross Weight (Grams)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.000"
                      value={item.grossWeight || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          grossWeight: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Net Weight (Grams)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.000"
                      value={item.netWeight || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          netWeight: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-[10px] text-neutral-400">
                      Formatted: {formatGrams(item.netWeight)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Rate per 10g (₹)</Label>
                    <Input
                      type="number"
                      step="10"
                      min="0"
                      placeholder="e.g. 75000"
                      value={item.ratePer10g || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          ratePer10g: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-[10px] text-amber-400/90 font-medium">
                      {formatCurrency(item.ratePer10g / 10, { decimals: 2 })} / 1g
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Metal Value (Auto)</Label>
                    <div className="h-9 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-sm font-semibold text-neutral-100 flex items-center justify-between">
                      <span>{formatCurrency(item.metalValue)}</span>
                      <span className="text-[10px] text-neutral-400">
                        (Net Wt ÷ 10 × Rate)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Making Charges (Flat ₹ vs % Toggle) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-neutral-950/40 rounded-lg border border-neutral-800/60">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label required>Making Charges Type</Label>
                      <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-800 text-[10px]">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateItem(index, { makingChargeType: "percentage" })
                          }
                          className={`px-2 py-0.5 rounded ${
                            item.makingChargeType === "percentage"
                              ? "bg-amber-500 text-neutral-950 font-bold"
                              : "text-neutral-400"
                          }`}
                        >
                          % of Metal
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateItem(index, { makingChargeType: "flat" })
                          }
                          className={`px-2 py-0.5 rounded ${
                            item.makingChargeType === "flat"
                              ? "bg-amber-500 text-neutral-950 font-bold"
                              : "text-neutral-400"
                          }`}
                        >
                          Flat ₹
                        </button>
                      </div>
                    </div>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder={
                        item.makingChargeType === "percentage"
                          ? "e.g. 12%"
                          : "e.g. 5000"
                      }
                      value={item.makingChargeValue || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          makingChargeValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Resolved Making Charge (₹)</Label>
                    <div className="h-9 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center">
                      {formatCurrency(item.makingChargeAmount)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <Label>BIS HUID / Hallmark No.</Label>
                    </div>
                    <Input
                      placeholder="e.g. HUID-916-MH8842"
                      value={item.huid || ""}
                      onChange={(e) => onUpdateItem(index, { huid: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 4: Tax Split Preview (in GST mode) */}
                {isGstMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-3 py-2 bg-primary-muted/50 rounded-lg border border-primary-border/60 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Metal GST ({item.metalGstRate}%): </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {formatCurrency((item.metalValue * item.metalGstRate) / 100)}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Making GST ({item.makingGstRate}%): </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {formatCurrency((item.makingChargeAmount * item.makingGstRate) / 100)}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Total Tax on Item: </span>
                      <span className="font-bold text-primary">
                        {formatCurrency(item.totalTax)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Row 5: Old Gold Exchange (Return / Credit) */}
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950/80 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
                      <Label className="text-xs">Old Gold Exchange / Return Deduction</Label>
                    </div>
                    <Switch
                      checked={isExchangeEnabled}
                      onCheckedChange={(checked) =>
                        onUpdateItem(index, {
                          oldGoldExchange: {
                            enabled: checked,
                            description: item.oldGoldExchange?.description || "Old Gold Exchange Credit",
                            weight: item.oldGoldExchange?.weight || 0,
                            ratePer10g: item.oldGoldExchange?.ratePer10g || item.ratePer10g || 70000,
                            totalDeduction: item.oldGoldExchange?.totalDeduction || 0,
                          },
                        })
                      }
                      label={isExchangeEnabled ? "Exchange Applied" : "No Exchange"}
                    />
                  </div>

                  {isExchangeEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 animate-in fade-in">
                      <div className="sm:col-span-2 space-y-1">
                        <Label className="text-[11px]">Old Gold Description</Label>
                        <Input
                          placeholder="e.g. Old 22K Bangle (Exchange)"
                          value={item.oldGoldExchange?.description || ""}
                          onChange={(e) =>
                            onUpdateItem(index, {
                              oldGoldExchange: {
                                ...item.oldGoldExchange!,
                                description: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Old Gold Wt (g)</Label>
                        <Input
                          type="number"
                          step="0.001"
                          placeholder="0.000"
                          value={item.oldGoldExchange?.weight || ""}
                          onChange={(e) =>
                            onUpdateItem(index, {
                              oldGoldExchange: {
                                ...item.oldGoldExchange!,
                                weight: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Deduction Credit (₹)</Label>
                        <div className="h-9 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center">
                          -{formatCurrency(item.oldGoldExchange?.totalDeduction || 0)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

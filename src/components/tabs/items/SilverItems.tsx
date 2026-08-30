"use client";

import React from "react";
import { SilverItem, SilverPurity } from "@/types/category.types";
import { SILVER_PURITIES } from "@/constants/categories";
import { formatCurrency, formatGrams } from "@/lib/formatters/currency";
import { useCollapsibleList } from "@/hooks/useCollapsibleList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowDownCircle, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface SilverItemsProps {
  items: SilverItem[];
  isGstMode: boolean;
  onUpdateItem: (index: number, update: Partial<SilverItem>) => void;
  onRemoveItem: (index: number) => void;
}

export function SilverItems({
  items,
  isGstMode,
  onUpdateItem,
  onRemoveItem,
}: SilverItemsProps) {
  const { isExpanded, toggleItem, toggleAll, allExpanded } = useCollapsibleList(items.length);

  return (
    <div className="space-y-4">
      {/* Expand/Collapse Toolbar */}
      {items.length > 1 && (
        <div className="flex items-center justify-between pb-1 text-xs text-neutral-400">
          <span>{items.length} Silver Line Items</span>
          <button
            type="button"
            onClick={() => toggleAll(!allExpanded)}
            className="flex items-center gap-1 text-slate-300 hover:text-white font-medium cursor-pointer transition-colors"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
            {allExpanded ? "Collapse All Items" : "Expand All Items"}
          </button>
        </div>
      )}

      {items.map((item, index) => {
        const itemExpanded = isExpanded(index);
        const isExchangeEnabled = Boolean(item.oldSilverExchange?.enabled);

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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500/20 text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0 border border-slate-400/30">
                  #{index + 1}
                </span>
                <Badge variant="silver" className="shrink-0">Silver</Badge>
                {item.purity && <Badge variant="secondary" className="shrink-0">{item.purity}</Badge>}
                {item.isFiligree && <Badge variant="warning" className="shrink-0">Filigree (1.5%)</Badge>}

                {/* Collapsed summary pill */}
                {!itemExpanded && (
                  <div className="flex items-center gap-2 truncate text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{item.name || "Untitled Silver Article"}</span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">{formatGrams(item.netWeight, 2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="text-right mr-1">
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block leading-tight">Total</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-slate-200 font-mono">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>

                {/* Collapse / Expand Toggle Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleItem(index, itemExpanded)}
                  className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-slate-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
                {/* Row 1: Name, HSN, Purity, Filigree Toggle */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label required>Article / Ornament Name</Label>
                    <Input
                      placeholder="e.g. 925 Pure Silver Antique Pooja Thali"
                      value={item.name}
                      onChange={(e) => onUpdateItem(index, { name: e.target.value })}
                    />
                  </div>

                  {isGstMode && (
                    <div className="space-y-1.5">
                      <Label>HSN Code</Label>
                      <Input
                        placeholder={item.isFiligree ? "71131110" : "7114"}
                        value={item.hsn}
                        onChange={(e) => onUpdateItem(index, { hsn: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label required>Purity / Grade</Label>
                    <Select
                      value={item.purity}
                      onChange={(e) =>
                        onUpdateItem(index, { purity: e.target.value as SilverPurity })
                      }
                    >
                      {SILVER_PURITIES.map((p) => (
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
                      step="0.01"
                      min="0"
                      placeholder="0.00"
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
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={item.netWeight || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          netWeight: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-[10px] text-neutral-400">
                      Formatted: {formatGrams(item.netWeight, 2)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Rate per 10g (₹)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="e.g. 890"
                      value={item.ratePer10g || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          ratePer10g: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-[10px] text-slate-300 font-medium">
                      {formatCurrency((item.ratePer10g / 10) * 1000, { decimals: 0 })} / 1kg
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Metal Value (Auto)</Label>
                    <div className="h-9 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-sm font-semibold text-neutral-100 flex items-center justify-between">
                      <span>{formatCurrency(item.metalValue)}</span>
                      <span className="text-[10px] text-neutral-400">(Net Wt ÷ 10 × Rate)</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Filigree & Making Charges */}
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
                              ? "bg-slate-300 text-neutral-950 font-bold"
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
                              ? "bg-slate-300 text-neutral-950 font-bold"
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
                      placeholder="Value"
                      value={item.makingChargeValue || ""}
                      onChange={(e) =>
                        onUpdateItem(index, {
                          makingChargeValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Making Amount (₹)</Label>
                    <div className="h-9 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-sm font-semibold text-neutral-200 flex items-center">
                      {formatCurrency(item.makingChargeAmount)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Filigree Work (1.5% Special Rate)?</Label>
                    <div className="pt-2">
                      <Switch
                        checked={item.isFiligree}
                        onCheckedChange={(checked) =>
                          onUpdateItem(index, {
                            isFiligree: checked,
                            hsn: checked ? "71131110" : "7114",
                          })
                        }
                        label={item.isFiligree ? "Filigree (1.5% GST)" : "Standard (3% GST)"}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Old Silver Exchange */}
                <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="h-4 w-4 text-emerald-400" />
                      <Label className="text-xs">Old Silver Exchange / Return Credit</Label>
                    </div>
                    <Switch
                      checked={isExchangeEnabled}
                      onCheckedChange={(checked) =>
                        onUpdateItem(index, {
                          oldSilverExchange: {
                            enabled: checked,
                            description: item.oldSilverExchange?.description || "Old Silver Return",
                            weight: item.oldSilverExchange?.weight || 0,
                            ratePer10g: item.oldSilverExchange?.ratePer10g || item.ratePer10g || 800,
                            totalDeduction: item.oldSilverExchange?.totalDeduction || 0,
                          },
                        })
                      }
                      label={isExchangeEnabled ? "Exchange Applied" : "No Exchange"}
                    />
                  </div>

                  {isExchangeEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800 animate-in fade-in">
                      <div className="sm:col-span-2 space-y-1">
                        <Label className="text-[11px]">Old Silver Description</Label>
                        <Input
                          placeholder="e.g. Old Silver Utensils / Coins"
                          value={item.oldSilverExchange?.description || ""}
                          onChange={(e) =>
                            onUpdateItem(index, {
                              oldSilverExchange: {
                                ...item.oldSilverExchange!,
                                description: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Old Silver Wt (g)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          value={item.oldSilverExchange?.weight || ""}
                          onChange={(e) =>
                            onUpdateItem(index, {
                              oldSilverExchange: {
                                ...item.oldSilverExchange!,
                                weight: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Deduction Credit (₹)</Label>
                        <div className="h-9 px-3 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 font-semibold text-xs flex items-center">
                          -{formatCurrency(item.oldSilverExchange?.totalDeduction || 0)}
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

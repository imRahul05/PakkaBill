"use client";

import React from "react";
import { CalculationSummary } from "@/types/invoice.types";
import { formatCurrency } from "@/lib/formatters/currency";
import { IndianRupee } from "lucide-react";

interface QuickSummaryProps {
  summary: CalculationSummary;
  isGstMode: boolean;
  category?: string;
}

export function QuickSummary({ summary, isGstMode }: QuickSummaryProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 space-y-3 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-1.5">
          <IndianRupee className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-bold text-neutral-200 tracking-wider uppercase">
            Quick Summary
          </h3>
        </div>
        {isGstMode && (
          <span className="text-[11px] font-semibold text-neutral-400">
            {summary.isInterState ? "Inter-State (IGST)" : "Intra-State (CGST+SGST)"}
          </span>
        )}
      </div>

      {/* Figures Breakdown */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-neutral-400">
          <span>Subtotal</span>
          <span className="text-neutral-200 font-medium font-mono">{formatCurrency(summary.subtotal)}</span>
        </div>

        {summary.totalDiscounts > 0 && (
          <div className="flex items-center justify-between text-emerald-400">
            <span>Total Discount</span>
            <span className="font-medium font-mono">-{formatCurrency(summary.totalDiscounts)}</span>
          </div>
        )}

        {isGstMode && (
          <>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Taxable Value</span>
              <span className="text-neutral-200 font-medium font-mono">{formatCurrency(summary.taxableAmount)}</span>
            </div>

            {summary.isInterState ? (
              <div className="flex items-center justify-between text-neutral-400 pl-2 border-l border-neutral-800">
                <span>IGST Total</span>
                <span className="text-neutral-200 font-medium font-mono">{formatCurrency(summary.igstTotal)}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-neutral-400 pl-2 border-l border-neutral-800">
                  <span>CGST Total</span>
                  <span className="text-neutral-200 font-medium font-mono">{formatCurrency(summary.cgstTotal)}</span>
                </div>
                {summary.utgstTotal > 0 ? (
                  <div className="flex items-center justify-between text-neutral-400 pl-2 border-l border-neutral-800">
                    <span>UTGST Total</span>
                    <span className="text-neutral-200 font-medium font-mono">{formatCurrency(summary.utgstTotal)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-neutral-400 pl-2 border-l border-neutral-800">
                    <span>SGST Total</span>
                    <span className="text-neutral-200 font-medium font-mono">{formatCurrency(summary.sgstTotal)}</span>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between text-neutral-300 font-medium pt-1 border-t border-neutral-800/60">
              <span>Total Tax (GST)</span>
              <span className="text-amber-400 font-mono font-semibold">{formatCurrency(summary.totalTax)}</span>
            </div>
          </>
        )}

        {summary.totalExchangeDeduction > 0 && (
          <div className="flex items-center justify-between text-emerald-400 font-medium">
            <span>Old Metal Exchange</span>
            <span className="font-mono">-{formatCurrency(summary.totalExchangeDeduction)}</span>
          </div>
        )}

        {summary.shippingCharges > 0 && (
          <div className="flex items-center justify-between text-neutral-400">
            <span>Shipping / Freight</span>
            <span className="text-neutral-200 font-mono">+{formatCurrency(summary.shippingCharges)}</span>
          </div>
        )}

        {summary.otherCharges > 0 && (
          <div className="flex items-center justify-between text-neutral-400">
            <span>Other Charges</span>
            <span className="text-neutral-200 font-mono">+{formatCurrency(summary.otherCharges)}</span>
          </div>
        )}

        {summary.roundOffAmount !== 0 && (
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Round-off</span>
            <span className="font-mono">
              {summary.roundOffAmount > 0
                ? `+${formatCurrency(summary.roundOffAmount)}`
                : formatCurrency(summary.roundOffAmount)}
            </span>
          </div>
        )}
      </div>

      {/* Grand Total Box */}
      <div className="p-3 bg-neutral-950 rounded-lg border border-amber-500/30 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Grand Total
          </span>
          <span className="text-lg font-extrabold text-amber-400 font-mono">
            {formatCurrency(summary.grandTotal)}
          </span>
        </div>
        <div className="text-[11px] text-neutral-400 font-serif leading-tight pt-1 border-t border-neutral-900 line-clamp-2">
          {summary.amountInWords}
        </div>
      </div>
    </div>
  );
}

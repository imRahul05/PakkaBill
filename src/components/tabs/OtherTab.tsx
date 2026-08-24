"use client";

import React from "react";
import { InvoiceOtherDetails } from "@/types/invoice.types";
import { formatCurrency } from "@/lib/formatters/currency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sliders, Truck, IndianRupee, QrCode, ShieldCheck } from "lucide-react";

interface OtherTabProps {
  other: InvoiceOtherDetails;
  amountInWords: string;
  roundOffAmount: number;
  grandTotal?: number;
  onUpdate: (update: Partial<InvoiceOtherDetails>) => void;
}

export function OtherTab({
  other,
  amountInWords,
  roundOffAmount,
  onUpdate,
}: OtherTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Discounts & Extra Charges */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber-400" />
            <CardTitle>Discounts & Additional Charges</CardTitle>
          </div>
          <CardDescription>Overall bill discounts, delivery/freight, and rounding adjustments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Invoice Discount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Overall Invoice Discount</Label>
                <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => onUpdate({ discountType: "percentage" })}
                    className={`px-2 py-0.5 rounded ${
                      other.discountType === "percentage"
                        ? "bg-amber-500 text-neutral-950 font-bold"
                        : "text-neutral-400"
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdate({ discountType: "flat" })}
                    className={`px-2 py-0.5 rounded ${
                      other.discountType === "flat"
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
                step="0.5"
                min="0"
                placeholder={other.discountType === "percentage" ? "e.g. 5%" : "e.g. 500"}
                value={other.discountValue || ""}
                onChange={(e) =>
                  onUpdate({ discountValue: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            {/* Freight / Shipping */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-neutral-400" />
                <Label>Shipping / Delivery Charges (₹)</Label>
              </div>
              <Input
                type="number"
                step="1"
                min="0"
                placeholder="0.00"
                value={other.shippingCharges || ""}
                onChange={(e) =>
                  onUpdate({ shippingCharges: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            {/* Other Charges */}
            <div className="space-y-1.5">
              <Label>Packaging / Other Charges (₹)</Label>
              <Input
                type="number"
                step="1"
                min="0"
                placeholder="0.00"
                value={other.otherCharges || ""}
                onChange={(e) =>
                  onUpdate({ otherCharges: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Round-Off Toggle */}
          <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold text-neutral-200">
                  Round-off to Nearest ₹1.00 (Standard Invoicing Convention)
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Current adjustment:{" "}
                <span className="font-semibold text-neutral-200">
                  {roundOffAmount >= 0 ? `+${formatCurrency(roundOffAmount)}` : formatCurrency(roundOffAmount)}
                </span>
              </p>
            </div>
            <Switch
              checked={other.roundOff}
              onCheckedChange={(checked) => onUpdate({ roundOff: checked })}
              label={other.roundOff ? "Round-off Enabled" : "Exact Decimal"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Amount in Words & Declarations */}
      <Card>
        <CardHeader>
          <CardTitle>Amount in Words & Declarations</CardTitle>
          <CardDescription>Statutory declarations printed at the bottom of the invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Amount in Words (Auto-Generated)</Label>
            <div className="p-3 rounded-md bg-neutral-950 border border-neutral-800 text-xs font-semibold text-amber-300 font-serif">
              {amountInWords}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <Label>Statutory Declaration Text</Label>
            </div>
            <Textarea
              value={other.declaration}
              onChange={(e) => onUpdate({ declaration: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Custom Footer Note / Greeting</Label>
            <Input
              placeholder="e.g. Thank you for your visit! Follow us on Instagram @shreekrishna"
              value={other.customFooterNote || ""}
              onChange={(e) => onUpdate({ customFooterNote: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Print Display Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Print & Layout Display Options</CardTitle>
          <CardDescription>Control which sections appear on the final printed invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-amber-400" />
                <Label className="text-xs">UPI Payment QR</Label>
              </div>
              <Switch
                checked={other.showUpiQr}
                onCheckedChange={(checked) => onUpdate({ showUpiQr: checked })}
              />
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between">
              <Label className="text-xs">Bank Account Box</Label>
              <Switch
                checked={other.showBankDetails}
                onCheckedChange={(checked) => onUpdate({ showBankDetails: checked })}
              />
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 flex items-center justify-between">
              <Label className="text-xs">Authorized Signature Box</Label>
              <Switch
                checked={other.showSignature}
                onCheckedChange={(checked) => onUpdate({ showSignature: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

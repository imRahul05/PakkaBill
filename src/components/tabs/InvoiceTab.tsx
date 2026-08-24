"use client";

import React from "react";
import { InvoiceMetadata } from "@/types/invoice.types";
import { InvoiceType } from "@/types/category.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Plus, Trash2 } from "lucide-react";

interface InvoiceTabProps {
  invoice: InvoiceMetadata;
  isGstMode: boolean;
  onUpdate: (update: Partial<InvoiceMetadata>) => void;
}

const INVOICE_TYPES_GST: { value: InvoiceType; label: string }[] = [
  { value: "tax_invoice", label: "Tax Invoice (Standard GST)" },
  { value: "bill_of_supply", label: "Bill of Supply (Exempt / Composition)" },
  { value: "proforma_invoice", label: "Proforma Invoice" },
  { value: "quotation", label: "Quotation / Price Estimate" },
  { value: "cash_memo", label: "Cash Memo" },
  { value: "delivery_challan", label: "Delivery Challan" },
];

const INVOICE_TYPES_NON_GST: { value: InvoiceType; label: string }[] = [
  { value: "bill_of_supply", label: "Bill of Supply" },
  { value: "cash_memo", label: "Cash Memo / Retail Bill" },
  { value: "estimate", label: "Estimate / Quotation" },
  { value: "proforma_invoice", label: "Proforma Invoice" },
  { value: "delivery_challan", label: "Delivery Challan" },
];

export function InvoiceTab({ invoice, isGstMode, onUpdate }: InvoiceTabProps) {
  const typesList = isGstMode ? INVOICE_TYPES_GST : INVOICE_TYPES_NON_GST;

  const handleAddTerm = () => {
    const existing = invoice.termsAndConditions || [];
    onUpdate({
      termsAndConditions: [
        ...existing,
        `${existing.length + 1}. Goods once sold will not be returned.`,
      ],
    });
  };

  const handleUpdateTerm = (index: number, value: string) => {
    const existing = [...(invoice.termsAndConditions || [])];
    existing[index] = value;
    onUpdate({ termsAndConditions: existing });
  };

  const handleRemoveTerm = (index: number) => {
    const existing = (invoice.termsAndConditions || []).filter((_, i) => i !== index);
    onUpdate({ termsAndConditions: existing });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <CardTitle>Invoice Document Settings</CardTitle>
          </div>
          <CardDescription>Numbering, billing dates, reverse charge, and document classification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label required>Invoice Heading / Document Type</Label>
              <Select
                value={invoice.invoiceType}
                onChange={(e) => onUpdate({ invoiceType: e.target.value as InvoiceType })}
              >
                {typesList.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label required>Invoice Number (Max 16 chars)</Label>
              <Input
                placeholder="e.g. INV-2026-001"
                maxLength={16}
                value={invoice.invoiceNumber}
                onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
              />
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Rule 46: Unique sequential series per financial year</p>
            </div>

            <div className="space-y-1.5">
              <Label required>Invoice Date</Label>
              <Input
                type="date"
                value={invoice.invoiceDate}
                onChange={(e) => onUpdate({ invoiceDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Payment Due Date (Optional)</Label>
              <Input
                type="date"
                value={invoice.dueDate || ""}
                onChange={(e) => onUpdate({ dueDate: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Buyer Purchase Order (PO) Ref</Label>
              <Input
                placeholder="e.g. PO-88421"
                value={invoice.poNumber || ""}
                onChange={(e) => onUpdate({ poNumber: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>PO Date</Label>
              <Input
                type="date"
                value={invoice.poDate || ""}
                onChange={(e) => onUpdate({ poDate: e.target.value })}
              />
            </div>
          </div>

          {/* Reverse Charge & Dispatch info */}
          {isGstMode && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-neutral-100 dark:bg-neutral-950/60 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="space-y-1.5">
                <Label>Tax Payable on Reverse Charge (RCM)?</Label>
                <div className="pt-2">
                  <Switch
                    checked={invoice.reverseCharge}
                    onCheckedChange={(checked) => onUpdate({ reverseCharge: checked })}
                    label={invoice.reverseCharge ? "Yes (RCM Applicable)" : "No (Standard Billing)"}
                    description="Mandatory statutory declaration under Rule 46"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Vehicle / Transport No. (Optional)</Label>
                <Input
                  placeholder="e.g. MH-02-CW-9921"
                  value={invoice.vehicleNumber || ""}
                  onChange={(e) => onUpdate({ vehicleNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>E-Way Bill Number (Optional)</Label>
                <Input
                  placeholder="e.g. 2310 9845 2201"
                  value={invoice.eWayBillNumber || ""}
                  onChange={(e) => onUpdate({ eWayBillNumber: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Notes & Terms of Sale</CardTitle>
          <CardDescription>Custom notes, return policies, certification notices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Notes to Customer</Label>
            <Textarea
              placeholder="e.g. Thank you for your business! All items hallmarked per BIS standards."
              value={invoice.notes || ""}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Terms & Conditions</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddTerm}>
                <Plus className="h-3 w-3 mr-1" /> Add Term
              </Button>
            </div>

            <div className="space-y-2">
              {(invoice.termsAndConditions || []).map((term, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={term}
                    onChange={(e) => handleUpdateTerm(index, e.target.value)}
                    placeholder={`Term ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(index)}
                    className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

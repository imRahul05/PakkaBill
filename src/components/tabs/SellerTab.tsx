"use client";

import React, { useState } from "react";
import { SellerProfile } from "@/types/invoice.types";
import { INDIAN_STATES, getStateByName } from "@/constants/states";
import { validateGstin, extractPanFromGstin } from "@/lib/validators/gstin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Upload, Trash2, Building2, Landmark, QrCode } from "lucide-react";

interface SellerTabProps {
  seller: SellerProfile;
  isGstMode: boolean;
  onUpdate: (update: Partial<SellerProfile>) => void;
}

export function SellerTab({ seller, isGstMode, onUpdate }: SellerTabProps) {
  const [gstinError, setGstinError] = useState<string | null>(null);

  const handleGstinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase();
    const pan = extractPanFromGstin(raw) || seller.pan;

    if (raw.length === 15) {
      const validation = validateGstin(raw);
      if (validation.isValid && validation.state) {
        setGstinError(null);
        onUpdate({
          gstin: raw,
          pan: validation.pan || pan,
          address: {
            ...seller.address,
            state: validation.state.name,
            stateCode: validation.state.code,
          },
        });
        return;
      } else {
        setGstinError(validation.errorMessage || "Invalid GSTIN format");
      }
    } else if (raw.length > 0 && raw.length < 15) {
      setGstinError(`15 characters required (${raw.length}/15)`);
    } else {
      setGstinError(null);
    }

    onUpdate({ gstin: raw, pan });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    const foundState = getStateByName(stateName);
    onUpdate({
      address: {
        ...seller.address,
        state: stateName,
        stateCode: foundState?.code || "00",
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpdate({ logoBase64: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpdate({ signatureBase64: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Basic Identity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-400" />
              <CardTitle>Business & Seller Identity</CardTitle>
            </div>
            {isGstMode && (
              <Badge variant={seller.gstin.length === 15 && !gstinError ? "success" : "warning"}>
                {seller.gstin.length === 15 && !gstinError ? "GST Verified" : "GST Required"}
              </Badge>
            )}
          </div>
          <CardDescription>Your business details printed as the supplier on the invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>Business / Trade Name</Label>
              <Input
                placeholder="e.g. Shree Krishna Jewellers"
                value={seller.tradeName}
                onChange={(e) => onUpdate({ tradeName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Legal Name (As on GST/PAN)</Label>
              <Input
                placeholder="e.g. Shree Krishna Jewellers Pvt Ltd"
                value={seller.legalName}
                onChange={(e) => onUpdate({ legalName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isGstMode && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label required>GSTIN (15 Characters)</Label>
                  {seller.gstin.length === 15 && !gstinError ? (
                    <span className="flex items-center text-[11px] text-emerald-400 gap-1 font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Valid format
                    </span>
                  ) : null}
                </div>
                <Input
                  placeholder="e.g. 27AABCU9603R1ZM"
                  value={seller.gstin}
                  maxLength={15}
                  onChange={handleGstinChange}
                  className={gstinError ? "border-rose-500 focus-visible:ring-rose-500" : ""}
                />
                {gstinError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {gstinError}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Permanent Account Number (PAN)</Label>
              <Input
                placeholder="e.g. AABCU9603R"
                value={seller.pan}
                maxLength={10}
                onChange={(e) => onUpdate({ pan: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label required>Phone / Mobile</Label>
              <Input
                placeholder="e.g. +91 98200 12345"
                value={seller.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Email Address</Label>
              <Input
                type="email"
                placeholder="billing@example.com"
                value={seller.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Website (Optional)</Label>
              <Input
                placeholder="www.example.com"
                value={seller.website || ""}
                onChange={(e) => onUpdate({ website: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Principal Place of Business</CardTitle>
          <CardDescription>Address and state code (determines Intra-State vs Inter-State GST)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label required>Shop / Building / Street Address</Label>
            <Input
              placeholder="e.g. Shop 108, Zaveri Bazaar, MG Road"
              value={seller.address.street}
              onChange={(e) =>
                onUpdate({
                  address: { ...seller.address, street: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label required>City / District</Label>
              <Input
                placeholder="e.g. Mumbai"
                value={seller.address.city}
                onChange={(e) =>
                  onUpdate({
                    address: { ...seller.address, city: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label required>State (36 Indian States & UTs)</Label>
              <Select value={seller.address.state} onChange={handleStateChange}>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label required>Pincode</Label>
              <Input
                placeholder="e.g. 400002"
                maxLength={6}
                value={seller.address.pincode}
                onChange={(e) =>
                  onUpdate({
                    address: { ...seller.address, pincode: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank & Payment Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-amber-400" />
            <CardTitle>Bank & UPI Payment Details</CardTitle>
          </div>
          <CardDescription>Printed in the payment instructions box and UPI QR code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Bank Name</Label>
              <Input
                placeholder="e.g. HDFC Bank Ltd"
                value={seller.bankDetails?.bankName || ""}
                onChange={(e) =>
                  onUpdate({
                    bankDetails: {
                      bankName: e.target.value,
                      accountNumber: seller.bankDetails?.accountNumber || "",
                      ifscCode: seller.bankDetails?.ifscCode || "",
                      branchName: seller.bankDetails?.branchName || "",
                      accountHolderName: seller.bankDetails?.accountHolderName || "",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Account Holder Name</Label>
              <Input
                placeholder="e.g. Shree Krishna Jewellers Pvt Ltd"
                value={seller.bankDetails?.accountHolderName || ""}
                onChange={(e) =>
                  onUpdate({
                    bankDetails: {
                      bankName: seller.bankDetails?.bankName || "",
                      accountNumber: seller.bankDetails?.accountNumber || "",
                      ifscCode: seller.bankDetails?.ifscCode || "",
                      branchName: seller.bankDetails?.branchName || "",
                      accountHolderName: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Account Number</Label>
              <Input
                placeholder="e.g. 50200012345678"
                value={seller.bankDetails?.accountNumber || ""}
                onChange={(e) =>
                  onUpdate({
                    bankDetails: {
                      bankName: seller.bankDetails?.bankName || "",
                      accountNumber: e.target.value,
                      ifscCode: seller.bankDetails?.ifscCode || "",
                      branchName: seller.bankDetails?.branchName || "",
                      accountHolderName: seller.bankDetails?.accountHolderName || "",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>IFSC Code</Label>
              <Input
                placeholder="e.g. HDFC0000123"
                value={seller.bankDetails?.ifscCode || ""}
                onChange={(e) =>
                  onUpdate({
                    bankDetails: {
                      bankName: seller.bankDetails?.bankName || "",
                      accountNumber: seller.bankDetails?.accountNumber || "",
                      ifscCode: e.target.value.toUpperCase(),
                      branchName: seller.bankDetails?.branchName || "",
                      accountHolderName: seller.bankDetails?.accountHolderName || "",
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-amber-400" />
                <Label>UPI ID / VPA (For Instant Scan QR)</Label>
              </div>
              <Input
                placeholder="e.g. yourshop@hdfcbank or 9820012345@upi"
                value={seller.upiId || ""}
                onChange={(e) => onUpdate({ upiId: e.target.value.trim() })}
              />
              <p className="text-[11px] text-neutral-400">
                Generates a live, scannable UPI QR code on your printed bill
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Composition Scheme Seller?</Label>
              <div className="pt-2">
                <Switch
                  checked={seller.compositionScheme}
                  onCheckedChange={(checked) => onUpdate({ compositionScheme: checked })}
                  label="Seller is registered under GST Composition Scheme"
                  description="Changes title to Bill of Supply without tax collection"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Assets: Logo & Signature */}
      <Card>
        <CardHeader>
          <CardTitle>Logo & Signature</CardTitle>
          <CardDescription>Stored locally in your browser — never sent to any server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-2">
              <Label>Business Logo (PNG / JPG / SVG)</Label>
              {seller.logoBase64 ? (
                <div className="flex items-center gap-3 p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={seller.logoBase64}
                    alt="Logo"
                    className="h-12 w-auto max-w-[120px] object-contain rounded bg-white p-1"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdate({ logoBase64: undefined })}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 hover:border-amber-500/50 rounded-lg p-4 cursor-pointer transition-colors bg-neutral-900/50">
                  <Upload className="h-6 w-6 text-neutral-400 mb-1" />
                  <span className="text-xs text-neutral-300 font-medium">Click to upload logo</span>
                  <span className="text-[10px] text-neutral-500">Max 2MB, transparent PNG recommended</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              )}
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <Label>Authorized Signatory Text</Label>
              <Input
                placeholder="e.g. For Shree Krishna Jewellers, Authorized Signatory"
                value={seller.signatureText || ""}
                onChange={(e) => onUpdate({ signatureText: e.target.value })}
              />
              <div className="pt-1">
                <Label className="text-[11px] text-neutral-400 mb-1">Or Upload Digital Signature Image</Label>
                {seller.signatureBase64 ? (
                  <div className="flex items-center gap-3 p-2 bg-neutral-950/60 rounded-lg border border-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={seller.signatureBase64}
                      alt="Signature"
                      className="h-8 w-auto max-w-[100px] object-contain rounded bg-white p-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdate({ signatureBase64: undefined })}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center border border-neutral-800 hover:border-neutral-700 rounded-md p-2 cursor-pointer transition-colors text-xs text-neutral-400 bg-neutral-900/40">
                    <Upload className="h-4 w-4 mr-2" /> Upload signature image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSignatureUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

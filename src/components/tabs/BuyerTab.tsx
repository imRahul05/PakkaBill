"use client";

import React, { useState } from "react";
import { BuyerDetails } from "@/types/invoice.types";
import { INDIAN_STATES, getStateByName } from "@/constants/states";
import { validateGstin, extractPanFromGstin } from "@/lib/validators/gstin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, AlertTriangle, CheckCircle2 } from "lucide-react";

interface BuyerTabProps {
  buyer: BuyerDetails;
  sellerStateCode: string;
  isGstMode: boolean;
  onUpdate: (update: Partial<BuyerDetails>) => void;
}

export function BuyerTab({ buyer, sellerStateCode, isGstMode, onUpdate }: BuyerTabProps) {
  const [gstinError, setGstinError] = useState<string | null>(null);

  const isInterState = sellerStateCode !== buyer.placeOfSupplyCode;

  const handleGstinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase();
    const pan = extractPanFromGstin(raw) || buyer.pan;

    if (raw.length === 15) {
      const validation = validateGstin(raw);
      if (validation.isValid && validation.state) {
        setGstinError(null);
        onUpdate({
          gstin: raw,
          pan: validation.pan || pan,
          address: {
            ...buyer.address,
            state: validation.state.name,
            stateCode: validation.state.code,
          },
          placeOfSupply: validation.state.name,
          placeOfSupplyCode: validation.state.code,
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
    const code = foundState?.code || "00";
    onUpdate({
      address: {
        ...buyer.address,
        state: stateName,
        stateCode: code,
      },
      placeOfSupply: stateName,
      placeOfSupplyCode: code,
    });
  };

  const handlePlaceOfSupplyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    const foundState = getStateByName(stateName);
    onUpdate({
      placeOfSupply: stateName,
      placeOfSupplyCode: foundState?.code || "00",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-amber-400" />
              <CardTitle>Buyer / Customer Details</CardTitle>
            </div>
            {isGstMode && (
              <Badge variant={isInterState ? "blue" : "success"}>
                {isInterState ? "Inter-State (IGST)" : "Intra-State (CGST + SGST)"}
              </Badge>
            )}
          </div>
          <CardDescription>
            Customer name, billing address, and place of supply determining GST type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>Customer / Buyer Name</Label>
              <Input
                placeholder="e.g. Ramesh Sharma"
                value={buyer.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Business / Trade Name (Optional B2B)</Label>
              <Input
                placeholder="e.g. Sharma Enterprises"
                value={buyer.tradeName || ""}
                onChange={(e) => onUpdate({ tradeName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isGstMode && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Buyer GSTIN (Optional for Retail B2C)</Label>
                  {buyer.gstin && buyer.gstin.length === 15 && !gstinError ? (
                    <span className="flex items-center text-[11px] text-emerald-400 gap-1 font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Valid B2B GSTIN
                    </span>
                  ) : null}
                </div>
                <Input
                  placeholder="e.g. 27AAAPL1234C1ZV (Leave blank for retail)"
                  value={buyer.gstin || ""}
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
              <Label>PAN (Optional)</Label>
              <Input
                placeholder="e.g. AAAPL1234C"
                value={buyer.pan || ""}
                maxLength={10}
                onChange={(e) => onUpdate({ pan: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone / Mobile</Label>
              <Input
                placeholder="e.g. +91 98199 87654"
                value={buyer.phone || ""}
                onChange={(e) => onUpdate({ phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="customer@example.com"
                value={buyer.email || ""}
                onChange={(e) => onUpdate({ email: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address & Place of Supply */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-400" />
            <CardTitle>Billing Address & Place of Supply</CardTitle>
          </div>
          <CardDescription>
            Place of Supply drives whether CGST + SGST (intra-state) or IGST (inter-state) applies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Street / Area Address</Label>
            <Input
              placeholder="e.g. Flat 402, Lotus Heights, Linking Road"
              value={buyer.address.street}
              onChange={(e) =>
                onUpdate({
                  address: { ...buyer.address, street: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>City / District</Label>
              <Input
                placeholder="e.g. Mumbai"
                value={buyer.address.city}
                onChange={(e) =>
                  onUpdate({
                    address: { ...buyer.address, city: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>State (Billing)</Label>
              <Select value={buyer.address.state} onChange={handleStateChange}>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Pincode</Label>
              <Input
                placeholder="e.g. 400050"
                maxLength={6}
                value={buyer.address.pincode}
                onChange={(e) =>
                  onUpdate({
                    address: { ...buyer.address, pincode: e.target.value },
                  })
                }
              />
            </div>
          </div>

          {isGstMode && (
            <div className="p-3 bg-neutral-950/70 rounded-lg border border-neutral-800 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <Label required>Place of Supply (Tax Jurisdiction)</Label>
                <span className="text-xs font-semibold text-neutral-300">
                  State Code: <span className="text-amber-400">{buyer.placeOfSupplyCode}</span>
                </span>
              </div>
              <Select value={buyer.placeOfSupply} onChange={handlePlaceOfSupplyChange}>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name} (Code: {s.code})
                  </option>
                ))}
              </Select>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-neutral-400">
                  {isInterState ? (
                    <span className="text-blue-400 font-medium">
                      • Seller ({sellerStateCode}) ≠ Place of Supply ({buyer.placeOfSupplyCode}) → IGST will be applied at full rate.
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">
                      • Seller ({sellerStateCode}) = Place of Supply ({buyer.placeOfSupplyCode}) → Intra-state CGST + SGST (50/50) split.
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

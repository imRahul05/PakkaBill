"use client";

import React, { useState } from "react";
import { SellerProfile } from "@/types/invoice.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { INDIAN_STATES } from "@/constants/states";
import { Building2, Save, CheckCircle2 } from "lucide-react";

interface BusinessProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: SellerProfile;
  onSaveProfile: (profile: SellerProfile) => void;
}

export function BusinessProfileModal({
  open,
  onOpenChange,
  profile,
  onSaveProfile,
}: BusinessProfileModalProps) {
  const [formData, setFormData] = useState<SellerProfile>(profile);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleChange = <K extends keyof SellerProfile>(field: K, val: SellerProfile[K]) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleAddressChange = (field: keyof SellerProfile["address"], val: string) => {
    setFormData((prev) => {
      const newAddress = { ...prev.address, [field]: val };
      if (field === "stateCode") {
        const found = INDIAN_STATES.find((s) => s.code === val);
        if (found) {
          newAddress.state = found.name;
        }
      }
      return { ...prev, address: newAddress };
    });
  };

  const handleBankChange = (field: keyof NonNullable<SellerProfile["bankDetails"]>, val: string) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...(prev.bankDetails || { bankName: "", accountNumber: "", ifscCode: "", branchName: "" }),
        [field]: val,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="3xl" onClose={() => onOpenChange(false)} className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-400" />
            <DialogTitle>Manage Default Business Profile</DialogTitle>
          </div>
          <DialogDescription>
            These details are auto-filled whenever you start a new invoice. Stored 100% locally.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {showSavedToast && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-lg flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Business profile saved successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="prof-tradeName" required>Trade Name / Shop Name</Label>
              <Input
                id="prof-tradeName"
                value={formData.tradeName}
                onChange={(e) => handleChange("tradeName", e.target.value)}
                placeholder="e.g. Royal Jewellers & Sons"
                required
              />
            </div>
            <div>
              <Label htmlFor="prof-legalName">Legal Registered Name</Label>
              <Input
                id="prof-legalName"
                value={formData.legalName}
                onChange={(e) => handleChange("legalName", e.target.value)}
                placeholder="e.g. Royal Jewellers Pvt Ltd"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="prof-gstin">GSTIN (15 Digits)</Label>
              <Input
                id="prof-gstin"
                value={formData.gstin || ""}
                onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
                placeholder="27ABCDE1234F1Z5"
                maxLength={15}
                className="font-mono uppercase"
              />
            </div>
            <div>
              <Label htmlFor="prof-pan">PAN</Label>
              <Input
                id="prof-pan"
                value={formData.pan || ""}
                onChange={(e) => handleChange("pan", e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="font-mono uppercase"
              />
            </div>
            <div>
              <Label htmlFor="prof-upi">UPI ID for Payment QR</Label>
              <Input
                id="prof-upi"
                value={formData.upiId || ""}
                onChange={(e) => handleChange("upiId", e.target.value.toLowerCase())}
                placeholder="merchant@okhdfcbank"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="prof-phone">Phone / Mobile</Label>
              <Input
                id="prof-phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="prof-email">Email Address</Label>
              <Input
                id="prof-email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="sales@royaljewellers.com"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Registered Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label htmlFor="prof-street">Street Address</Label>
                <Input
                  id="prof-street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="Shop No. 12, Zaveri Bazaar"
                />
              </div>
              <div>
                <Label htmlFor="prof-city">City / District</Label>
                <Input
                  id="prof-city"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <Label htmlFor="prof-pincode">Pincode</Label>
                <Input
                  id="prof-pincode"
                  value={formData.address.pincode}
                  onChange={(e) => handleAddressChange("pincode", e.target.value)}
                  placeholder="400002"
                  maxLength={6}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="prof-state">State & GST State Code</Label>
                <Select
                  id="prof-state"
                  value={formData.address.stateCode}
                  onChange={(e) => handleAddressChange("stateCode", e.target.value)}
                  options={INDIAN_STATES.map((s) => ({
                    value: s.code,
                    label: `${s.code} - ${s.name} ${s.isUnionTerritory ? "(UT)" : ""}`,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Bank Account Details (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="prof-bankName">Bank Name</Label>
                <Input
                  id="prof-bankName"
                  value={formData.bankDetails?.bankName || ""}
                  onChange={(e) => handleBankChange("bankName", e.target.value)}
                  placeholder="HDFC Bank"
                />
              </div>
              <div>
                <Label htmlFor="prof-acc">Account Number</Label>
                <Input
                  id="prof-acc"
                  value={formData.bankDetails?.accountNumber || ""}
                  onChange={(e) => handleBankChange("accountNumber", e.target.value)}
                  placeholder="50200012345678"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="prof-ifsc">IFSC Code</Label>
                <Input
                  id="prof-ifsc"
                  value={formData.bankDetails?.ifscCode || ""}
                  onChange={(e) => handleBankChange("ifscCode", e.target.value.toUpperCase())}
                  placeholder="HDFC0000123"
                  className="font-mono uppercase"
                />
              </div>
              <div>
                <Label htmlFor="prof-branch">Branch Name</Label>
                <Input
                  id="prof-branch"
                  value={formData.bankDetails?.branchName || ""}
                  onChange={(e) => handleBankChange("branchName", e.target.value)}
                  placeholder="Fort Branch, Mumbai"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="font-bold"
            >
              <Save className="h-4 w-4 mr-1.5" /> Save Business Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

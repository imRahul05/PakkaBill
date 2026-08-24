"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PresetTemplate } from "@/types/storage.types";
import { InvoiceData } from "@/types/invoice.types";
import { getAllPresets, savePreset, deletePreset } from "@/lib/storage/indexed-db";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Plus, FolderOpen, Trash2, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "@/lib/formatters/date";

interface PresetTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentInvoice: InvoiceData;
  onApplyPreset: (presetData: InvoiceData) => void;
}

export function PresetTemplatesModal({
  open,
  onOpenChange,
  currentInvoice,
  onApplyPreset,
}: PresetTemplatesModalProps) {
  const [presets, setPresets] = useState<PresetTemplate[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDesc, setNewPresetDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const loadPresets = useCallback(async () => {
    const list = await getAllPresets();
    setPresets(list);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (open) {
      getAllPresets().then((list) => {
        if (isMounted) setPresets(list);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [open]);

  const handleSaveCurrentAsPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    setIsSaving(true);
    await savePreset({
      name: newPresetName.trim(),
      description: newPresetDesc.trim(),
      category: currentInvoice.category,
      templateData: {
        ...currentInvoice,
        id: `inv-${Date.now()}`,
      },
    });

    setNewPresetName("");
    setNewPresetDesc("");
    setIsSaving(false);
    setStatusMsg("Preset saved successfully!");
    await loadPresets();
    setTimeout(() => setStatusMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    await deletePreset(id);
    await loadPresets();
  };

  const handleApply = (preset: PresetTemplate) => {
    onApplyPreset(preset.templateData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="3xl" onClose={() => onOpenChange(false)} className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-amber-400" />
            <DialogTitle>Saved Preset Templates</DialogTitle>
          </div>
          <DialogDescription>
            Save frequent line items, seller notes, and category setups as reusable presets.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {statusMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-lg flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {statusMsg}
            </div>
          )}

          {/* Form to save current invoice as preset */}
          <form onSubmit={handleSaveCurrentAsPreset} className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-3">
            <h3 className="text-xs font-bold uppercase text-neutral-300 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-amber-400" /> Save Active Invoice as New Preset
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="preset-name" required>Preset Name</Label>
                <Input
                  id="preset-name"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g. Standard 22K Necklace Set"
                  required
                />
              </div>
              <div>
                <Label htmlFor="preset-desc">Notes / Description (Optional)</Label>
                <Input
                  id="preset-desc"
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  placeholder="e.g. 10% making, intra-state delivery"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="default" size="sm" disabled={isSaving || !newPresetName.trim()}>
                Save Preset
              </Button>
            </div>
          </form>

          {/* Existing Presets List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Available Presets ({presets.length})</h3>
            {presets.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-xl">
                No presets saved yet. Fill out an invoice and save it above!
              </div>
            ) : (
              presets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-100">{preset.name}</span>
                      <Badge variant={preset.category === "gold" ? "gold" : preset.category === "silver" ? "silver" : preset.category === "grocery" ? "success" : "blue"}>
                        {preset.category.toUpperCase()}
                      </Badge>
                    </div>
                    {preset.description && <p className="text-xs text-neutral-400">{preset.description}</p>}
                    <p className="text-[10px] text-neutral-500">{formatDateTime(preset.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleApply(preset)}
                      className="text-xs"
                    >
                      <FolderOpen className="h-3.5 w-3.5 mr-1 text-amber-400" /> Apply
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(preset.id)}
                      className="text-xs text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface FirstRunPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenProfileModal: () => void;
  onDismissForever: () => void;
}

export function FirstRunPromptModal({
  open,
  onOpenChange,
  onOpenProfileModal,
  onDismissForever,
}: FirstRunPromptModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="md" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-primary-muted text-primary border border-primary-border flex items-center justify-center mb-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <DialogTitle>Save Business Details for 1-Minute Billing?</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-neutral-700 dark:text-neutral-300">
          <p>
            Would you like to save your business name, GSTIN, and bank details locally on your browser?
          </p>
          <div className="p-3 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
            <p className="text-primary font-semibold">🔒 100% Client-Side Privacy Guarantee</p>
            <p>Your business information is saved only on this browser (localStorage). No login required, no cloud syncing, zero tracking.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onDismissForever();
              onOpenChange(false);
            }}
            className="text-xs text-neutral-400"
          >
            Don&apos;t Ask Again
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onOpenProfileModal();
            }}
            className="text-xs font-bold"
          >
            Setup Business Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

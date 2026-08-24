"use client";

import React from "react";
import { useThemeCustomization } from "@/context/ThemeCustomizationContext";
import { PALETTE_OPTIONS, FONT_OPTIONS, ColorPalette, FontStyle, ThemeMode } from "@/types/theme.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Laptop, Palette, Type, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeSelectorModal({ open, onOpenChange }: ThemeSelectorModalProps) {
  const { mode, setMode, palette, setPalette, fontStyle, setFontStyle } = useThemeCustomization();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="3xl" onClose={() => onOpenChange(false)} className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <DialogTitle>Theme & Appearance Customizer</DialogTitle>
          </div>
          <DialogDescription>
            Personalize your workspace with light or dark mode, accent palettes, and typography styles.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2 pr-1">
          {/* 1. Light vs Dark Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                1. Appearance Mode
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light" as ThemeMode, label: "Light Mode", desc: "Crisp white & slate surfaces", icon: Sun },
                { id: "dark" as ThemeMode, label: "Dark Mode", desc: "Deep noir & charcoal surfaces", icon: Moon },
                { id: "system" as ThemeMode, label: "System Sync", desc: "Follow OS preference", icon: Laptop },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-2",
                      isSelected
                        ? "border-primary bg-primary-muted shadow-sm ring-1 ring-primary-border"
                        : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn("p-1.5 rounded-lg", isSelected ? "bg-primary text-primary-foreground" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400")}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-neutral-900 dark:text-neutral-100">{item.label}</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color Palette Selector */}
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                2. UI Accent Palette
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PALETTE_OPTIONS.map((pal) => {
                const isSelected = palette === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setPalette(pal.id as ColorPalette)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2",
                      isSelected
                        ? "border-primary bg-primary-muted shadow-sm ring-1 ring-primary-border"
                        : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded-full border border-black/10 dark:border-white/20 shadow-inner shrink-0"
                          style={{ backgroundColor: pal.primaryColor }}
                        />
                        <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{pal.name}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{pal.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Font Style Selector */}
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                3. UI Typography & Font Style
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FONT_OPTIONS.map((font) => {
                const isSelected = fontStyle === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setFontStyle(font.id as FontStyle)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2",
                      isSelected
                        ? "border-primary bg-primary-muted shadow-sm ring-1 ring-primary-border"
                        : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{font.name}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                    <div
                      className="p-2 rounded bg-neutral-100 dark:bg-neutral-950 text-xs font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 text-center"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.previewText}
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{font.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Live Preview Banner */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Live Workspace Theme Preview</span>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">Gold Jewellery</Badge>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Tax Invoice: <span className="font-mono text-primary font-bold">INV-2026-001</span>
                </span>
              </div>
              <span className="text-sm font-extrabold font-mono text-primary">
                ₹ 1,24,500.00
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <Button type="button" variant="default" size="sm" onClick={() => onOpenChange(false)}>
            Done & Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

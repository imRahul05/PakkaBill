"use client";

import React, { useSyncExternalStore } from "react";
import { CategoryId, BillingMode } from "@/types/category.types";
import { useThemeCustomization } from "@/context/ThemeCustomizationContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coins,
  Store,
  Boxes,
  Award,
  LayoutGrid,
  History,
  UserCog,
  BookmarkCheck,
  Search,
  HardDriveDownload,
  Palette,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "pakkabill_sidebar_collapsed";
const sidebarListeners = new Set<() => void>();

function notifySidebarListeners(): void {
  sidebarListeners.forEach((listener) => listener());
}

function subscribeSidebar(callback: () => void): () => void {
  sidebarListeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_STORAGE_KEY) {
      notifySidebarListeners();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    sidebarListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getSidebarCollapsedSnapshot(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  }
  return false;
}

function getServerSidebarCollapsedSnapshot(): boolean {
  return false;
}

interface AppSidebarProps {
  currentCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  billingMode: BillingMode;
  onToggleBillingMode: (mode: BillingMode) => void;
  historyCount?: number;
  onOpenGallery: () => void;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onOpenPresets: () => void;
  onOpenHsnSearch: () => void;
  onOpenImportExport: () => void;
  onOpenThemeModal: () => void;
}

export function AppSidebar({
  currentCategory,
  onSelectCategory,
  billingMode,
  onToggleBillingMode,
  historyCount = 0,
  onOpenGallery,
  onOpenHistory,
  onOpenProfile,
  onOpenPresets,
  onOpenHsnSearch,
  onOpenImportExport,
  onOpenThemeModal,
}: AppSidebarProps) {
  const isCollapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarCollapsedSnapshot,
    getServerSidebarCollapsedSnapshot
  );

  const { mode, setMode } = useThemeCustomization();

  const toggleSidebar = () => {
    const next = !isCollapsed;
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
    }
    notifySidebarListeners();
  };

  const CATEGORY_ITEMS: { id: CategoryId; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: "gold", label: "Gold Jewellery", icon: Coins, color: "text-amber-500" },
    { id: "silver", label: "Silver Articles", icon: Award, color: "text-slate-400" },
    { id: "grocery", label: "Grocery / Kirana", icon: Store, color: "text-emerald-500" },
    { id: "general", label: "General Goods", icon: Boxes, color: "text-blue-500" },
  ];

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all duration-300 select-none z-30 sticky top-0 h-screen",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* 1. Header: Brand & Collapse Toggle */}
      <div className="flex items-center justify-between p-3.5 border-b border-neutral-200 dark:border-neutral-800 min-h-[57px]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary-hover text-primary-foreground font-black text-sm shadow-xs shrink-0">
              PB
            </div>
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                PakkaBill
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                  v1.0
                </Badge>
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                GST Invoice Engine
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary-hover text-primary-foreground font-black text-sm shadow-xs">
            PB
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100", isCollapsed && "hidden")}
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {isCollapsed && (
        <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 2. Scrollable Body: Categories, Billing Mode & Workspace Tools */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
        {/* Category Switcher */}
        <div>
          {!isCollapsed && (
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Commerce Category
            </span>
          )}
          <div className="space-y-1">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              const isSelected = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  title={cat.label}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
                    isSelected
                      ? "bg-primary-muted text-primary-text font-bold border border-primary-border"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : cat.color)} />
                  {!isCollapsed && <span className="truncate">{cat.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* GST vs Non-GST Mode Switcher */}
        {!isCollapsed ? (
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
              Billing Mode
            </span>
            <div className="grid grid-cols-2 gap-1 p-0.5 rounded bg-neutral-200 dark:bg-neutral-950 text-[11px]">
              <button
                type="button"
                onClick={() => onToggleBillingMode("gst")}
                className={cn(
                  "py-1 rounded font-medium transition-colors cursor-pointer",
                  billingMode === "gst"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                GST Invoice
              </button>
              <button
                type="button"
                onClick={() => onToggleBillingMode("non_gst")}
                className={cn(
                  "py-1 rounded font-medium transition-colors cursor-pointer",
                  billingMode === "non_gst"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                Bill of Supply
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onToggleBillingMode(billingMode === "gst" ? "non_gst" : "gst")}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors cursor-pointer",
                billingMode === "gst"
                  ? "bg-primary-muted border-primary-border text-primary font-extrabold"
                  : "bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-400"
              )}
              title={billingMode === "gst" ? "Mode: GST Tax Invoice" : "Mode: Non-GST Bill of Supply"}
            >
              {billingMode === "gst" ? "GST" : "Non"}
            </button>
          </div>
        )}

        {/* Workspace Tools Section */}
        <div>
          {!isCollapsed && (
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Workspace Tools
            </span>
          )}
          <div className="space-y-1">
            <button
              type="button"
              onClick={onOpenGallery}
              title="40 Invoice Templates Gallery"
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer",
                isCollapsed && "justify-center px-2"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <LayoutGrid className="h-4 w-4 text-indigo-500 shrink-0" />
                {!isCollapsed && <span className="truncate">40 Templates</span>}
              </div>
              {!isCollapsed && <Badge variant="outline" className="text-[10px] py-0 px-1">40</Badge>}
            </button>

            <button
              type="button"
              onClick={onOpenHistory}
              title="Recent Bills History (Last 10 FIFO)"
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer",
                isCollapsed && "justify-center px-2"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <History className="h-4 w-4 text-emerald-500 shrink-0" />
                {!isCollapsed && <span className="truncate">Bill History</span>}
              </div>
              {!isCollapsed && historyCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              title="Business Profile Setup"
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer",
                isCollapsed && "justify-center px-2"
              )}
            >
              <UserCog className="h-4 w-4 text-amber-500 shrink-0" />
              {!isCollapsed && <span className="truncate">Business Profile</span>}
            </button>

            <button
              type="button"
              onClick={onOpenPresets}
              title="Saved Presets"
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer",
                isCollapsed && "justify-center px-2"
              )}
            >
              <BookmarkCheck className="h-4 w-4 text-blue-500 shrink-0" />
              {!isCollapsed && <span className="truncate">Saved Presets</span>}
            </button>

            <button
              type="button"
              onClick={onOpenHsnSearch}
              title="GST Slabs & HSN Directory Lookup"
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Search className="h-4 w-4 text-violet-500 shrink-0" />
              {!isCollapsed && <span className="truncate">GST Slabs & HSN</span>}
            </button>

            <button
              type="button"
              onClick={onOpenImportExport}
              title="Backup / Restore JSON"
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer",
                isCollapsed && "justify-center px-2"
              )}
            >
              <HardDriveDownload className="h-4 w-4 text-cyan-500 shrink-0" />
              {!isCollapsed && <span className="truncate">Backup & Restore</span>}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Footer: Theme Toggle & Offline Status */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2 bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className={cn("flex items-center", isCollapsed ? "justify-center flex-col gap-2" : "justify-between")}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenThemeModal}
            className={cn(
              "h-8 gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800",
              isCollapsed && "w-8 p-0"
            )}
            title="Appearance & Theme Customizer"
          >
            <Palette className="h-3.5 w-3.5 text-primary" />
            {!isCollapsed && <span>Theme & Colors</span>}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            className="h-8 w-8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mode === "dark" ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-1.5 pt-1 text-[10px] text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Offline & Client-Side</span>
          </div>
        )}
      </div>
    </aside>
  );
}

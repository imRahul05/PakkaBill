"use client";

import React from "react";
import { useThemeCustomization } from "@/context/ThemeCustomizationContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";

interface ThemeToggleProps {
  onOpenCustomizer?: () => void;
  showPaletteButton?: boolean;
}

export function ThemeToggle({
  onOpenCustomizer,
  showPaletteButton = true,
}: ThemeToggleProps) {
  const { mode, setMode, isMounted } = useThemeCustomization();

  if (!isMounted) {
    return (
      <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    );
  }

  const toggleLightDark = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-1.5">
      {showPaletteButton && onOpenCustomizer && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenCustomizer}
          className="h-9 px-2.5 gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title="Customize Theme & Colors"
        >
          <Palette className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleLightDark}
        className="h-9 w-9 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {mode === "dark" ? (
          <Sun className="h-4 w-4 text-primary transition-transform rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 text-neutral-700 transition-transform rotate-0 scale-100" />
        )}
      </Button>
    </div>
  );
}

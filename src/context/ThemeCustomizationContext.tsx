"use client";

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from "react";
import { ColorPalette, FontStyle, ThemeMode } from "@/types/theme.types";

interface ThemeCustomizationContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
  fontStyle: FontStyle;
  setFontStyle: (fontStyle: FontStyle) => void;
  isMounted: boolean;
}

const ThemeCustomizationContext = createContext<ThemeCustomizationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MODE: "pakkabill_theme_mode",
  PALETTE: "pakkabill_color_palette",
  FONT_STYLE: "pakkabill_font_style",
};

// Safe client-side mounted store
const emptySubscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
};

const themeListeners = new Set<() => void>();

function notifyThemeListeners(): void {
  themeListeners.forEach((listener) => listener());
}

function subscribeTheme(callback: () => void): () => void {
  themeListeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === STORAGE_KEYS.MODE ||
      event.key === STORAGE_KEYS.PALETTE ||
      event.key === STORAGE_KEYS.FONT_STYLE
    ) {
      notifyThemeListeners();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    themeListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getThemeModeSnapshot(): ThemeMode {
  if (typeof window !== "undefined") {
    const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
    if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
      return savedMode;
    }
  }
  return "dark";
}

function getServerThemeModeSnapshot(): ThemeMode {
  return "dark";
}

function getPaletteSnapshot(): ColorPalette {
  if (typeof window !== "undefined") {
    const savedPalette = localStorage.getItem(STORAGE_KEYS.PALETTE);
    if (
      savedPalette === "amber" ||
      savedPalette === "emerald" ||
      savedPalette === "blue" ||
      savedPalette === "violet" ||
      savedPalette === "rose" ||
      savedPalette === "monochrome"
    ) {
      return savedPalette;
    }
  }
  return "amber";
}

function getServerPaletteSnapshot(): ColorPalette {
  return "amber";
}

function getFontStyleSnapshot(): FontStyle {
  if (typeof window !== "undefined") {
    const savedFont = localStorage.getItem(STORAGE_KEYS.FONT_STYLE);
    if (savedFont === "sans" || savedFont === "serif" || savedFont === "mono") {
      return savedFont;
    }
  }
  return "sans";
}

function getServerFontStyleSnapshot(): FontStyle {
  return "sans";
}

export function ThemeCustomizationProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useIsMounted();

  const mode = useSyncExternalStore(subscribeTheme, getThemeModeSnapshot, getServerThemeModeSnapshot);
  const palette = useSyncExternalStore(subscribeTheme, getPaletteSnapshot, getServerPaletteSnapshot);
  const fontStyle = useSyncExternalStore(subscribeTheme, getFontStyleSnapshot, getServerFontStyleSnapshot);

  // Apply classes and data attributes to <html>
  useEffect(() => {
    const root = document.documentElement;

    // Apply color palette & font style
    root.setAttribute("data-palette", palette);
    root.setAttribute("data-font", fontStyle);

    // Apply light / dark mode class
    const applyTheme = () => {
      let isDark = mode === "dark";
      if (mode === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };

    applyTheme();

    // Listen for OS system theme change if mode === "system"
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [mode, palette, fontStyle]);

  const handleSetMode = useCallback((newMode: ThemeMode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.MODE, newMode);
    }
    notifyThemeListeners();
  }, []);

  const handleSetPalette = useCallback((newPalette: ColorPalette) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PALETTE, newPalette);
    }
    notifyThemeListeners();
  }, []);

  const handleSetFontStyle = useCallback((newFont: FontStyle) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.FONT_STYLE, newFont);
    }
    notifyThemeListeners();
  }, []);

  return (
    <ThemeCustomizationContext.Provider
      value={{
        mode,
        setMode: handleSetMode,
        palette,
        setPalette: handleSetPalette,
        fontStyle,
        setFontStyle: handleSetFontStyle,
        isMounted,
      }}
    >
      {children}
    </ThemeCustomizationContext.Provider>
  );
}

export function useThemeCustomization() {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error("useThemeCustomization must be used within a ThemeCustomizationProvider");
  }
  return context;
}

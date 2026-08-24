"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SellerProfile } from "@/types/invoice.types";
import { DEFAULT_SELLER_PROFILE } from "@/constants/defaults";
import {
  loadSavedProfile,
  saveProfile as persistProfile,
  clearSavedProfile as removeProfile,
  isFirstRunDismissed,
  setFirstRunDismissed,
} from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";

let currentProfileSnapshot: SellerProfile | null = null;
const profileListeners = new Set<() => void>();

function getProfileSnapshot(): SellerProfile {
  if (!currentProfileSnapshot) {
    currentProfileSnapshot = loadSavedProfile() || DEFAULT_SELLER_PROFILE;
  }
  return currentProfileSnapshot;
}

function getServerProfileSnapshot(): SellerProfile {
  return DEFAULT_SELLER_PROFILE;
}

function subscribeProfile(callback: () => void): () => void {
  profileListeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.BUSINESS_PROFILE) {
      currentProfileSnapshot = loadSavedProfile() || DEFAULT_SELLER_PROFILE;
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    profileListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

let currentFirstRunSnapshot: boolean | null = null;
const firstRunListeners = new Set<() => void>();

function getFirstRunSnapshot(): boolean {
  if (currentFirstRunSnapshot === null) {
    const saved = loadSavedProfile();
    const dismissed = isFirstRunDismissed();
    currentFirstRunSnapshot = !saved && !dismissed;
  }
  return currentFirstRunSnapshot;
}

function getServerFirstRunSnapshot(): boolean {
  return false;
}

function subscribeFirstRun(callback: () => void): () => void {
  firstRunListeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.FIRST_RUN_DISMISSED || event.key === STORAGE_KEYS.BUSINESS_PROFILE) {
      const saved = loadSavedProfile();
      const dismissed = isFirstRunDismissed();
      currentFirstRunSnapshot = !saved && !dismissed;
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    firstRunListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function useBusinessProfile() {
  const profile = useSyncExternalStore(subscribeProfile, getProfileSnapshot, getServerProfileSnapshot);
  const isFirstRun = useSyncExternalStore(subscribeFirstRun, getFirstRunSnapshot, getServerFirstRunSnapshot);

  const handleSaveProfile = useCallback((newProfile: SellerProfile): boolean => {
    const success = persistProfile(newProfile);
    if (success) {
      currentProfileSnapshot = newProfile;
      setFirstRunDismissed(true);
      currentFirstRunSnapshot = false;
      profileListeners.forEach((listener) => listener());
      firstRunListeners.forEach((listener) => listener());
    }
    return success;
  }, []);

  const handleClearProfile = useCallback((): boolean => {
    const success = removeProfile();
    if (success) {
      currentProfileSnapshot = DEFAULT_SELLER_PROFILE;
      profileListeners.forEach((listener) => listener());
    }
    return success;
  }, []);

  const dismissFirstRun = useCallback((dontAskAgain: boolean = false): void => {
    currentFirstRunSnapshot = false;
    if (dontAskAgain) {
      setFirstRunDismissed(true);
    }
    firstRunListeners.forEach((listener) => listener());
  }, []);

  return {
    profile,
    isFirstRun,
    showFirstRunPrompt: isFirstRun,
    isLoading: false,
    saveProfile: handleSaveProfile,
    clearProfile: handleClearProfile,
    dismissFirstRun,
    dismissFirstRunPrompt: () => dismissFirstRun(true),
  };
}

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { InvoiceData, SellerProfile } from "@/types/invoice.types";

export function loadSavedProfile(): SellerProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw) as SellerProfile;
  } catch (err) {
    console.error("Failed to load saved business profile from localStorage", err);
    return null;
  }
}

export function saveProfile(profile: SellerProfile): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEYS.BUSINESS_PROFILE, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error("Failed to save business profile to localStorage", err);
    return false;
  }
}

export function clearSavedProfile(): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(STORAGE_KEYS.BUSINESS_PROFILE);
    return true;
  } catch (err) {
    console.error("Failed to clear business profile", err);
    return false;
  }
}

export function isFirstRunDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.FIRST_RUN_DISMISSED) === "true";
}

export function setFirstRunDismissed(dismissed: boolean = true): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.FIRST_RUN_DISMISSED, String(dismissed));
}

export function saveDraft(draft: InvoiceData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft));
  } catch {
    // Ignore quota errors silently for draft auto-save
  }
}

export function loadDraft(): InvoiceData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
    if (!raw) return null;
    return JSON.parse(raw) as InvoiceData;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
}

import { getStateByCode, IndianState } from "@/constants/states";

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export interface GstinValidationResult {
  isValid: boolean;
  stateCode?: string;
  state?: IndianState;
  pan?: string;
  errorMessage?: string;
}

export function validateGstin(gstin: string): GstinValidationResult {
  const cleanGstin = gstin.trim().toUpperCase();

  if (!cleanGstin) {
    return { isValid: false, errorMessage: "GSTIN is required for tax invoice" };
  }

  if (cleanGstin.length !== 15) {
    return {
      isValid: false,
      errorMessage: `GSTIN must be 15 characters long (currently ${cleanGstin.length})`,
    };
  }

  if (!GSTIN_REGEX.test(cleanGstin)) {
    return {
      isValid: false,
      errorMessage: "Invalid GSTIN format (e.g. 27AAAAA0000A1Z5)",
    };
  }

  const stateCode = cleanGstin.substring(0, 2);
  const state = getStateByCode(stateCode);
  const pan = cleanGstin.substring(2, 12);

  if (!state) {
    return {
      isValid: false,
      stateCode,
      pan,
      errorMessage: `Unknown state code: ${stateCode}`,
    };
  }

  return {
    isValid: true,
    stateCode,
    state,
    pan,
  };
}

export function extractPanFromGstin(gstin: string): string {
  const clean = gstin.trim().toUpperCase();
  if (clean.length >= 12) {
    const panCandidate = clean.substring(2, 12);
    if (PAN_REGEX.test(panCandidate)) {
      return panCandidate;
    }
  }
  return "";
}

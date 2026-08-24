export interface IndianState {
  code: string; // 2-digit GST state code
  name: string;
  isUnionTerritory: boolean;
}

export const INDIAN_STATES: IndianState[] = [
  { code: "01", name: "Jammu and Kashmir", isUnionTerritory: true },
  { code: "02", name: "Himachal Pradesh", isUnionTerritory: false },
  { code: "03", name: "Punjab", isUnionTerritory: false },
  { code: "04", name: "Chandigarh", isUnionTerritory: true },
  { code: "05", name: "Uttarakhand", isUnionTerritory: false },
  { code: "06", name: "Haryana", isUnionTerritory: false },
  { code: "07", name: "Delhi", isUnionTerritory: true },
  { code: "08", name: "Rajasthan", isUnionTerritory: false },
  { code: "09", name: "Uttar Pradesh", isUnionTerritory: false },
  { code: "10", name: "Bihar", isUnionTerritory: false },
  { code: "11", name: "Sikkim", isUnionTerritory: false },
  { code: "12", name: "Arunachal Pradesh", isUnionTerritory: false },
  { code: "13", name: "Nagaland", isUnionTerritory: false },
  { code: "14", name: "Manipur", isUnionTerritory: false },
  { code: "15", name: "Mizoram", isUnionTerritory: false },
  { code: "16", name: "Tripura", isUnionTerritory: false },
  { code: "17", name: "Meghalaya", isUnionTerritory: false },
  { code: "18", name: "Assam", isUnionTerritory: false },
  { code: "19", name: "West Bengal", isUnionTerritory: false },
  { code: "20", name: "Jharkhand", isUnionTerritory: false },
  { code: "21", name: "Odisha", isUnionTerritory: false },
  { code: "22", name: "Chhattisgarh", isUnionTerritory: false },
  { code: "23", name: "Madhya Pradesh", isUnionTerritory: false },
  { code: "24", name: "Gujarat", isUnionTerritory: false },
  { code: "26", name: "Dadra & Nagar Haveli and Daman & Diu", isUnionTerritory: true },
  { code: "27", name: "Maharashtra", isUnionTerritory: false },
  { code: "29", name: "Karnataka", isUnionTerritory: false },
  { code: "30", name: "Goa", isUnionTerritory: false },
  { code: "31", name: "Lakshadweep", isUnionTerritory: true },
  { code: "32", name: "Kerala", isUnionTerritory: false },
  { code: "33", name: "Tamil Nadu", isUnionTerritory: false },
  { code: "34", name: "Puducherry", isUnionTerritory: true },
  { code: "35", name: "Andaman and Nicobar Islands", isUnionTerritory: true },
  { code: "36", name: "Telangana", isUnionTerritory: false },
  { code: "37", name: "Andhra Pradesh", isUnionTerritory: false },
  { code: "38", name: "Ladakh", isUnionTerritory: true },
  { code: "97", name: "Other Territory", isUnionTerritory: true },
];

export const STATE_CODE_MAP = new Map<string, IndianState>(
  INDIAN_STATES.map((s) => [s.code, s])
);

export const STATE_NAME_MAP = new Map<string, IndianState>(
  INDIAN_STATES.map((s) => [s.name.toLowerCase(), s])
);

export function getStateByCode(code: string): IndianState | undefined {
  return STATE_CODE_MAP.get(code);
}

export function getStateByName(name: string): IndianState | undefined {
  return STATE_NAME_MAP.get(name.toLowerCase());
}

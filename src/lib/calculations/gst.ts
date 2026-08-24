import { getStateByCode } from "@/constants/states";
import { GroceryItem, GeneralItem } from "@/types/category.types";

export function calculateGroceryItem(item: Partial<GroceryItem>): GroceryItem {
  const quantity = Number(item.quantity) || 0;
  const ratePerUnit = Number(item.ratePerUnit) || 0;
  const discountAmount = Number(item.discountAmount) || 0;

  // If isPackaged is true, suggested GST is 5%, else loose is 0%
  const isPackaged = item.isPackaged ?? true;
  const defaultRate = isPackaged ? 5 : 0;
  const gstRate = typeof item.gstRate === "number" ? item.gstRate : defaultRate;

  const rawSubtotal = quantity * ratePerUnit;
  const taxableValue = Math.max(0, Number((rawSubtotal - discountAmount).toFixed(2)));
  const taxAmount = Number(((taxableValue * gstRate) / 100).toFixed(2));
  const lineTotal = Number((taxableValue + taxAmount).toFixed(2));

  return {
    id: item.id || `grocery-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: "grocery",
    name: item.name || "Grocery Item",
    hsn: item.hsn || "1006",
    description: item.description,
    isPackaged,
    quantity,
    unit: item.unit || "kg",
    ratePerUnit,
    gstRate,
    discountAmount,
    taxableValue,
    taxAmount,
    lineTotal,
  };
}

export function calculateGeneralItem(item: Partial<GeneralItem>): GeneralItem {
  const quantity = Number(item.quantity) || 0;
  const ratePerUnit = Number(item.ratePerUnit) || 0;
  const discountPercent = Number(item.discountPercent) || 0;
  const rawSubtotal = quantity * ratePerUnit;

  let discountAmount = Number(item.discountAmount) || 0;
  if (discountPercent > 0) {
    discountAmount = Number(((rawSubtotal * discountPercent) / 100).toFixed(2));
  }

  const taxableValue = Math.max(0, Number((rawSubtotal - discountAmount).toFixed(2)));
  const gstRate = typeof item.gstRate === "number" ? item.gstRate : 18;
  const taxAmount = Number(((taxableValue * gstRate) / 100).toFixed(2));
  const lineTotal = Number((taxableValue + taxAmount).toFixed(2));

  return {
    id: item.id || `general-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: "general",
    name: item.name || "Goods / Service Item",
    hsn: item.hsn || "8471",
    description: item.description,
    quantity,
    unit: item.unit || "pcs",
    ratePerUnit,
    gstRate,
    discountPercent,
    discountAmount,
    taxableValue,
    taxAmount,
    lineTotal,
  };
}

export interface SplitTaxResult {
  isInterState: boolean;
  isUnionTerritory: boolean;
  cgstRate: number;
  sgstRate: number;
  utgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  utgstAmount: number;
  igstAmount: number;
}

export function splitGstTax(
  taxableAmount: number,
  rate: number,
  sellerStateCode: string,
  placeOfSupplyCode: string
): SplitTaxResult {
  const isInterState = sellerStateCode !== placeOfSupplyCode;
  const totalTax = Number(((taxableAmount * rate) / 100).toFixed(2));

  if (isInterState) {
    return {
      isInterState: true,
      isUnionTerritory: false,
      cgstRate: 0,
      sgstRate: 0,
      utgstRate: 0,
      igstRate: rate,
      cgstAmount: 0,
      sgstAmount: 0,
      utgstAmount: 0,
      igstAmount: totalTax,
    };
  }

  const sellerState = getStateByCode(sellerStateCode);
  const isUT = Boolean(sellerState?.isUnionTerritory);
  const halfRate = Number((rate / 2).toFixed(2));
  const halfAmount = Number((totalTax / 2).toFixed(2));

  return {
    isInterState: false,
    isUnionTerritory: isUT,
    cgstRate: halfRate,
    sgstRate: isUT ? 0 : halfRate,
    utgstRate: isUT ? halfRate : 0,
    igstRate: 0,
    cgstAmount: halfAmount,
    sgstAmount: isUT ? 0 : halfAmount,
    utgstAmount: isUT ? halfAmount : 0,
    igstAmount: 0,
  };
}

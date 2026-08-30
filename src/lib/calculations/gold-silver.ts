import { GoldItem, SilverItem } from "@/types/category.types";

interface MetalCoreParams {
  grossWeight?: number;
  netWeight?: number;
  ratePer10g?: number;
  makingChargeType?: "percentage" | "flat";
  makingChargeValue?: number;
  metalGstRate: number;
  makingGstRate?: number;
  exchange?: { enabled: boolean; weight: number; ratePer10g: number };
}

function calculatePreciousMetalCore(params: MetalCoreParams) {
  const grossWeight = Number(params.grossWeight) || 0;
  const netWeight = Number(params.netWeight) || grossWeight || 0;
  const ratePer10g = Number(params.ratePer10g) || 0;

  // Metal Value = (Net Weight / 10) * Rate per 10g
  const metalValue = Number(((netWeight / 10) * ratePer10g).toFixed(2));

  const makingChargeType = params.makingChargeType || "percentage";
  const makingChargeValue = Number(params.makingChargeValue) || 0;

  let makingChargeAmount = 0;
  if (makingChargeType === "percentage") {
    makingChargeAmount = Number(((metalValue * makingChargeValue) / 100).toFixed(2));
  } else {
    makingChargeAmount = Number(makingChargeValue.toFixed(2));
  }

  const makingGstRate = typeof params.makingGstRate === "number" ? params.makingGstRate : 5;
  const metalTax = Number(((metalValue * params.metalGstRate) / 100).toFixed(2));
  const makingTax = Number(((makingChargeAmount * makingGstRate) / 100).toFixed(2));

  const totalTaxable = Number((metalValue + makingChargeAmount).toFixed(2));
  const totalTax = Number((metalTax + makingTax).toFixed(2));

  let totalDeduction = 0;
  if (params.exchange?.enabled) {
    const exWeight = Number(params.exchange.weight) || 0;
    const exRate = Number(params.exchange.ratePer10g) || 0;
    totalDeduction = Number(((exWeight / 10) * exRate).toFixed(2));
  }

  const lineTotal = Number((totalTaxable + totalTax - totalDeduction).toFixed(2));

  return {
    grossWeight,
    netWeight,
    ratePer10g,
    metalValue,
    makingChargeType,
    makingChargeValue,
    makingChargeAmount,
    makingGstRate,
    totalTaxable,
    totalTax,
    totalDeduction,
    lineTotal,
  };
}

export function calculateGoldItem(item: Partial<GoldItem>): GoldItem {
  const metalGstRate = typeof item.metalGstRate === "number" ? item.metalGstRate : 3;
  const core = calculatePreciousMetalCore({
    grossWeight: item.grossWeight,
    netWeight: item.netWeight,
    ratePer10g: item.ratePer10g,
    makingChargeType: item.makingChargeType,
    makingChargeValue: item.makingChargeValue,
    metalGstRate,
    makingGstRate: item.makingGstRate,
    exchange: item.oldGoldExchange,
  });

  return {
    id: item.id || `gold-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: "gold",
    name: item.name || "Gold Jewellery Item",
    hsn: item.hsn || "7113",
    description: item.description,
    grossWeight: core.grossWeight,
    netWeight: core.netWeight,
    purity: item.purity || "22K (916)",
    ratePer10g: core.ratePer10g,
    metalValue: core.metalValue,
    makingChargeType: core.makingChargeType,
    makingChargeValue: core.makingChargeValue,
    makingChargeAmount: core.makingChargeAmount,
    metalGstRate,
    makingGstRate: core.makingGstRate,
    huid: item.huid,
    oldGoldExchange: item.oldGoldExchange
      ? {
          ...item.oldGoldExchange,
          totalDeduction: core.totalDeduction,
        }
      : undefined,
    totalTaxable: core.totalTaxable,
    totalTax: core.totalTax,
    lineTotal: core.lineTotal,
  };
}

export function calculateSilverItem(item: Partial<SilverItem>): SilverItem {
  const isFiligree = Boolean(item.isFiligree);
  const metalGstRate = isFiligree ? 1.5 : typeof item.metalGstRate === "number" ? item.metalGstRate : 3;

  const core = calculatePreciousMetalCore({
    grossWeight: item.grossWeight,
    netWeight: item.netWeight,
    ratePer10g: item.ratePer10g,
    makingChargeType: item.makingChargeType,
    makingChargeValue: item.makingChargeValue,
    metalGstRate,
    makingGstRate: item.makingGstRate,
    exchange: item.oldSilverExchange,
  });

  return {
    id: item.id || `silver-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: "silver",
    name: item.name || "Silver Article / Jewellery",
    hsn: item.hsn || (isFiligree ? "71131110" : "7114"),
    description: item.description,
    grossWeight: core.grossWeight,
    netWeight: core.netWeight,
    purity: item.purity || "925 (Sterling)",
    ratePer10g: core.ratePer10g,
    metalValue: core.metalValue,
    makingChargeType: core.makingChargeType,
    makingChargeValue: core.makingChargeValue,
    makingChargeAmount: core.makingChargeAmount,
    isFiligree,
    metalGstRate,
    makingGstRate: core.makingGstRate,
    hallmarkNo: item.hallmarkNo,
    oldSilverExchange: item.oldSilverExchange
      ? {
          ...item.oldSilverExchange,
          totalDeduction: core.totalDeduction,
        }
      : undefined,
    totalTaxable: core.totalTaxable,
    totalTax: core.totalTax,
    lineTotal: core.lineTotal,
  };
}

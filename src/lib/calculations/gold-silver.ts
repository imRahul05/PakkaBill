import { GoldItem, SilverItem } from "@/types/category.types";

export function calculateGoldItem(item: Partial<GoldItem>): GoldItem {
  const grossWeight = Number(item.grossWeight) || 0;
  const netWeight = Number(item.netWeight) || grossWeight || 0;
  const ratePer10g = Number(item.ratePer10g) || 0;

  // Metal Value = (Net Weight / 10) * Rate per 10g
  const metalValue = Number(((netWeight / 10) * ratePer10g).toFixed(2));

  // Making Charge calculation
  const makingChargeType = item.makingChargeType || "percentage";
  const makingChargeValue = Number(item.makingChargeValue) || 0;

  let makingChargeAmount = 0;
  if (makingChargeType === "percentage") {
    makingChargeAmount = Number(((metalValue * makingChargeValue) / 100).toFixed(2));
  } else {
    makingChargeAmount = Number(makingChargeValue.toFixed(2));
  }

  const metalGstRate = typeof item.metalGstRate === "number" ? item.metalGstRate : 3;
  const makingGstRate = typeof item.makingGstRate === "number" ? item.makingGstRate : 5;

  const metalTax = Number(((metalValue * metalGstRate) / 100).toFixed(2));
  const makingTax = Number(((makingChargeAmount * makingGstRate) / 100).toFixed(2));

  const totalTaxable = Number((metalValue + makingChargeAmount).toFixed(2));
  const totalTax = Number((metalTax + makingTax).toFixed(2));

  // Old Gold Exchange Deduction
  let totalDeduction = 0;
  if (item.oldGoldExchange?.enabled) {
    const exWeight = Number(item.oldGoldExchange.weight) || 0;
    const exRate = Number(item.oldGoldExchange.ratePer10g) || 0;
    totalDeduction = Number(((exWeight / 10) * exRate).toFixed(2));
  }

  const lineTotal = Number((totalTaxable + totalTax - totalDeduction).toFixed(2));

  return {
    id: item.id || `gold-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: "gold",
    name: item.name || "Gold Jewellery Item",
    hsn: item.hsn || "7113",
    description: item.description,
    grossWeight,
    netWeight,
    purity: item.purity || "22K (916)",
    ratePer10g,
    metalValue,
    makingChargeType,
    makingChargeValue,
    makingChargeAmount,
    metalGstRate,
    makingGstRate,
    huid: item.huid,
    oldGoldExchange: item.oldGoldExchange
      ? {
          ...item.oldGoldExchange,
          totalDeduction,
        }
      : undefined,
    totalTaxable,
    totalTax,
    lineTotal,
  };
}

export function calculateSilverItem(item: Partial<SilverItem>): SilverItem {
  const grossWeight = Number(item.grossWeight) || 0;
  const netWeight = Number(item.netWeight) || grossWeight || 0;
  const ratePer10g = Number(item.ratePer10g) || 0;

  // Metal Value = (Net Weight / 10) * Rate per 10g
  const metalValue = Number(((netWeight / 10) * ratePer10g).toFixed(2));

  const makingChargeType = item.makingChargeType || "percentage";
  const makingChargeValue = Number(item.makingChargeValue) || 0;

  let makingChargeAmount = 0;
  if (makingChargeType === "percentage") {
    makingChargeAmount = Number(((metalValue * makingChargeValue) / 100).toFixed(2));
  } else {
    makingChargeAmount = Number(makingChargeValue.toFixed(2));
  }

  const isFiligree = Boolean(item.isFiligree);
  const metalGstRate = isFiligree ? 1.5 : typeof item.metalGstRate === "number" ? item.metalGstRate : 3;
  const makingGstRate = typeof item.makingGstRate === "number" ? item.makingGstRate : 5;

  const metalTax = Number(((metalValue * metalGstRate) / 100).toFixed(2));
  const makingTax = Number(((makingChargeAmount * makingGstRate) / 100).toFixed(2));

  const totalTaxable = Number((metalValue + makingChargeAmount).toFixed(2));
  const totalTax = Number((metalTax + makingTax).toFixed(2));

  // Old Silver Exchange Deduction
  let totalDeduction = 0;
  if (item.oldSilverExchange?.enabled) {
    const exWeight = Number(item.oldSilverExchange.weight) || 0;
    const exRate = Number(item.oldSilverExchange.ratePer10g) || 0;
    totalDeduction = Number(((exWeight / 10) * exRate).toFixed(2));
  }

  const lineTotal = Number((totalTaxable + totalTax - totalDeduction).toFixed(2));

  return {
    id: item.id || `silver-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: "silver",
    name: item.name || "Silver Article / Jewellery",
    hsn: item.hsn || (isFiligree ? "71131110" : "7114"),
    description: item.description,
    grossWeight,
    netWeight,
    purity: item.purity || "925 (Sterling)",
    ratePer10g,
    metalValue,
    makingChargeType,
    makingChargeValue,
    makingChargeAmount,
    isFiligree,
    metalGstRate,
    makingGstRate,
    hallmarkNo: item.hallmarkNo,
    oldSilverExchange: item.oldSilverExchange
      ? {
          ...item.oldSilverExchange,
          totalDeduction,
        }
      : undefined,
    totalTaxable,
    totalTax,
    lineTotal,
  };
}

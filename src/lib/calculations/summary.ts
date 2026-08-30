import { BillingMode, LineItem } from "@/types/category.types";
import {
  CalculationSummary,
  InvoiceOtherDetails,
  TaxItemBreakdown,
} from "@/types/invoice.types";
import { numberToIndianWords } from "../formatters/number-to-words";
import { splitGstTax } from "./gst";

export interface CalculateSummaryParams {
  items: LineItem[];
  other: InvoiceOtherDetails;
  billingMode: BillingMode;
  sellerStateCode: string;
  placeOfSupplyCode: string;
}

export function calculateInvoiceSummary({
  items,
  other,
  billingMode,
  sellerStateCode,
  placeOfSupplyCode,
}: CalculateSummaryParams): CalculationSummary {
  const isInterState = sellerStateCode !== placeOfSupplyCode;

  let rawSubtotal = 0;
  let totalItemDiscounts = 0;
  let totalExchangeDeduction = 0;

  // Track taxes by HSN and tax rate
  const hsnMap = new Map<
    string,
    {
      hsn: string;
      rate: number;
      taxableAmount: number;
    }
  >();

  for (const item of items) {
    if (item.category === "gold" || item.category === "silver") {
      const metalVal = item.metalValue || 0;
      const makingVal = item.makingChargeAmount || 0;
      rawSubtotal += metalVal + makingVal;

      if (item.category === "gold" && item.oldGoldExchange?.enabled) {
        totalExchangeDeduction += item.oldGoldExchange.totalDeduction || 0;
      }
      if (item.category === "silver" && item.oldSilverExchange?.enabled) {
        totalExchangeDeduction += item.oldSilverExchange.totalDeduction || 0;
      }

      if (billingMode === "gst") {
        // Metal tax bucket
        const metalKey = `${item.hsn}_${item.metalGstRate}`;
        const existingMetal = hsnMap.get(metalKey) || {
          hsn: item.hsn,
          rate: item.metalGstRate,
          taxableAmount: 0,
        };
        existingMetal.taxableAmount += metalVal;
        hsnMap.set(metalKey, existingMetal);

        // Making charges tax bucket
        if (makingVal > 0) {
          const makingHsn = "998892";
          const makingKey = `${makingHsn}_${item.makingGstRate}`;
          const existingMaking = hsnMap.get(makingKey) || {
            hsn: makingHsn,
            rate: item.makingGstRate,
            taxableAmount: 0,
          };
          existingMaking.taxableAmount += makingVal;
          hsnMap.set(makingKey, existingMaking);
        }
      }
    } else {
      // Grocery & General items follow standard Quantity × Rate structure
      const itemRaw = item.quantity * item.ratePerUnit;
      rawSubtotal += itemRaw;
      totalItemDiscounts += item.discountAmount || 0;

      if (billingMode === "gst") {
        const key = `${item.hsn}_${item.gstRate}`;
        const existing = hsnMap.get(key) || {
          hsn: item.hsn,
          rate: item.gstRate,
          taxableAmount: 0,
        };
        existing.taxableAmount += item.taxableValue;
        hsnMap.set(key, existing);
      }
    }
  }

  // Invoice-level discount
  let overallDiscount = 0;
  const taxableBaseBeforeOverallDiscount = Math.max(
    0,
    rawSubtotal - totalItemDiscounts
  );

  if (other.discountValue > 0) {
    if (other.discountType === "percentage") {
      overallDiscount = Number(
        (
          (taxableBaseBeforeOverallDiscount * other.discountValue) /
          100
        ).toFixed(2)
      );
    } else {
      overallDiscount = Number(other.discountValue.toFixed(2));
    }
  }

  const totalDiscounts = Number(
    (totalItemDiscounts + overallDiscount).toFixed(2)
  );
  const taxableAmount = Math.max(
    0,
    Number((rawSubtotal - totalDiscounts).toFixed(2))
  );

  // Compute Taxes
  let cgstTotal = 0;
  let sgstTotal = 0;
  let utgstTotal = 0;
  let igstTotal = 0;
  let totalTax = 0;

  const taxBreakdownByHsn: TaxItemBreakdown[] = [];

  if (billingMode === "gst") {
    // If there's an overall discount, proportion it across tax buckets
    const discountRatio =
      taxableBaseBeforeOverallDiscount > 0
        ? Math.max(0, taxableBaseBeforeOverallDiscount - overallDiscount) /
          taxableBaseBeforeOverallDiscount
        : 1;

    for (const [, bucket] of hsnMap.entries()) {
      const adjustedTaxable = Number(
        (bucket.taxableAmount * discountRatio).toFixed(2)
      );
      const split = splitGstTax(
        adjustedTaxable,
        bucket.rate,
        sellerStateCode,
        placeOfSupplyCode
      );

      const bucketTax = Number(
        (split.cgstAmount + split.sgstAmount + split.utgstAmount + split.igstAmount).toFixed(2)
      );

      cgstTotal += split.cgstAmount;
      sgstTotal += split.sgstAmount;
      utgstTotal += split.utgstAmount;
      igstTotal += split.igstAmount;
      totalTax += bucketTax;

      taxBreakdownByHsn.push({
        hsn: bucket.hsn,
        rate: bucket.rate,
        taxableAmount: adjustedTaxable,
        cgstAmount: split.cgstAmount,
        sgstAmount: split.sgstAmount,
        igstAmount: split.igstAmount,
        totalTax: bucketTax,
      });
    }
  }

  cgstTotal = Number(cgstTotal.toFixed(2));
  sgstTotal = Number(sgstTotal.toFixed(2));
  utgstTotal = Number(utgstTotal.toFixed(2));
  igstTotal = Number(igstTotal.toFixed(2));
  totalTax = Number(totalTax.toFixed(2));

  const shippingCharges = Number((other.shippingCharges || 0).toFixed(2));
  const otherCharges = Number((other.otherCharges || 0).toFixed(2));

  // Net before round-off
  const netBeforeRoundOff =
    taxableAmount +
    totalTax +
    shippingCharges +
    otherCharges -
    totalExchangeDeduction;

  let grandTotal = netBeforeRoundOff;
  let roundOffAmount = 0;

  if (other.roundOff) {
    grandTotal = Math.round(netBeforeRoundOff);
    roundOffAmount = Number((grandTotal - netBeforeRoundOff).toFixed(2));
  } else {
    grandTotal = Number(netBeforeRoundOff.toFixed(2));
  }

  // Amount in words
  const amountInWords = numberToIndianWords(grandTotal);

  return {
    subtotal: Number(rawSubtotal.toFixed(2)),
    totalDiscounts,
    taxableAmount,
    isInterState,
    cgstTotal,
    sgstTotal,
    utgstTotal,
    igstTotal,
    totalTax,
    totalExchangeDeduction: Number(totalExchangeDeduction.toFixed(2)),
    shippingCharges,
    otherCharges,
    roundOffAmount,
    grandTotal: Math.max(0, grandTotal),
    amountInWords,
    taxBreakdownByHsn,
  };
}

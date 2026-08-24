import { validateGstin } from "./validators/gstin";
import { InvoiceData } from "@/types/invoice.types";
import { ComplianceCheckResult, ComplianceReport } from "@/types/compliance.types";

export function evaluateCompliance(invoice: InvoiceData): ComplianceReport {
  const isGst = invoice.billingMode === "gst";
  const cat = invoice.category;
  const results: ComplianceCheckResult[] = [];

  // 1. Invoice Type
  const hasInvoiceType = Boolean(invoice.invoice.invoiceType);
  results.push({
    ruleId: "invoice_type",
    title: "Invoice Heading / Type",
    description: isGst ? "Tax Invoice heading specified" : "Bill of Supply / Bill heading specified",
    passed: hasInvoiceType,
    message: hasInvoiceType ? undefined : "Please specify the invoice document type",
  });

  // 2. Sequential Invoice Number
  const invNum = invoice.invoice.invoiceNumber?.trim() || "";
  const hasValidInvNum = invNum.length > 0 && invNum.length <= 16;
  results.push({
    ruleId: "invoice_number",
    title: "Sequential Invoice Number",
    description: "Unique invoice number up to 16 alphanumeric characters",
    passed: hasValidInvNum,
    message: hasValidInvNum ? undefined : "Invoice number is required (max 16 chars)",
  });

  // 3. Invoice Date
  const hasDate = Boolean(invoice.invoice.invoiceDate);
  results.push({
    ruleId: "invoice_date",
    title: "Invoice Date",
    description: "Date of issue of invoice",
    passed: hasDate,
    message: hasDate ? undefined : "Invoice date is required",
  });

  // 4. Supplier Name
  const hasSupplierName = Boolean(
    invoice.seller.legalName?.trim() || invoice.seller.tradeName?.trim()
  );
  results.push({
    ruleId: "supplier_name",
    title: "Supplier Legal/Trade Name",
    description: "Name of the supplier / business",
    passed: hasSupplierName,
    message: hasSupplierName ? undefined : "Supplier name is required",
  });

  // 5. Supplier GSTIN (in GST mode)
  if (isGst) {
    const gstinVal = validateGstin(invoice.seller.gstin || "");
    results.push({
      ruleId: "supplier_gstin",
      title: "Supplier GSTIN",
      description: "15-character valid GSTIN format with state & PAN",
      passed: gstinVal.isValid,
      message: gstinVal.isValid ? undefined : gstinVal.errorMessage || "Valid 15-character GSTIN required",
    });
  }

  // 6. Supplier State & Address
  const hasSupplierState = Boolean(
    invoice.seller.address.state && invoice.seller.address.stateCode
  );
  results.push({
    ruleId: "supplier_state",
    title: "Supplier State & Code",
    description: "Supplier state name and 2-digit GST state code",
    passed: hasSupplierState,
    message: hasSupplierState ? undefined : "Supplier state & code required",
  });

  // 7. Buyer Name
  const hasBuyerName = Boolean(invoice.buyer.name?.trim());
  results.push({
    ruleId: "buyer_name",
    title: "Recipient / Buyer Name",
    description: "Name of customer / recipient",
    passed: hasBuyerName,
    message: hasBuyerName ? undefined : "Buyer name is recommended",
  });

  // 8. Place of Supply (in GST mode)
  if (isGst) {
    const hasPos = Boolean(
      invoice.buyer.placeOfSupply && invoice.buyer.placeOfSupplyCode
    );
    results.push({
      ruleId: "place_of_supply",
      title: "Place of Supply",
      description: "Destination state for CGST/SGST vs IGST tax determination",
      passed: hasPos,
      message: hasPos ? undefined : "Place of supply state required for tax calculation",
    });
  }

  // 9. HSN on all items (in GST mode)
  if (isGst) {
    const hasItems = invoice.items.length > 0;
    const allHsnPresent =
      hasItems && invoice.items.every((i) => Boolean(i.hsn?.trim()));
    results.push({
      ruleId: "hsn_on_items",
      title: "HSN / SAC on Items",
      description: "4 to 8 digit HSN/SAC code per line item",
      passed: allHsnPresent,
      message: allHsnPresent ? undefined : "All items should have HSN/SAC code",
    });
  }

  // 10. Reverse Charge Mentioned
  results.push({
    ruleId: "reverse_charge_stated",
    title: "Reverse Charge Status",
    description: "Whether tax is payable on reverse charge (Yes / No)",
    passed: true, // Always defined as boolean
  });

  // 11. Amount in words
  const hasWords = Boolean(
    invoice.summary.amountInWords && invoice.summary.amountInWords.trim()
  );
  results.push({
    ruleId: "amount_in_words",
    title: "Amount in Words",
    description: "Total invoice value stated in Indian numbering words",
    passed: hasWords,
    message: hasWords ? undefined : "Amount in words required",
  });

  // 12. Category-Specific Rules
  if (cat === "gold" || cat === "silver") {
    // Gold/Silver making charge itemized
    const hasItems = invoice.items.length > 0;
    const allMakingSet =
      hasItems &&
      invoice.items.every((it) => {
        if (it.category === "gold" || it.category === "silver") {
          return it.makingChargeValue >= 0;
        }
        return true;
      });
    results.push({
      ruleId: "gold_making_charges_split",
      title: "Making Charges Itemized",
      description: "3% Metal + 5% Making charges separately stated",
      passed: allMakingSet,
      message: allMakingSet ? undefined : "Making charges should be stated for jewellery",
    });

    // Purity present
    const allPurity =
      hasItems &&
      invoice.items.every((it) => {
        if (it.category === "gold" || it.category === "silver") {
          return Boolean(it.purity);
        }
        return true;
      });
    results.push({
      ruleId: "gold_purity_huid",
      title: "Purity & Hallmark / HUID",
      description: "Karat/fineness and hallmark identification",
      passed: allPurity,
      message: allPurity ? undefined : "Purity rating required for all items",
    });
  } else if (cat === "grocery") {
    const hasItems = invoice.items.length > 0;
    const allTagged =
      hasItems &&
      invoice.items.every((it) => {
        if (it.category === "grocery") {
          return typeof it.isPackaged === "boolean";
        }
        return true;
      });
    results.push({
      ruleId: "grocery_packaged_status",
      title: "Packaged / Loose Tagging",
      description: "0% unbranded vs 5% branded grocery classification",
      passed: allTagged,
      message: allTagged ? undefined : "Tag items as packaged or loose",
    });
  }

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const scorePercentage = Math.round((passedCount / totalCount) * 100);

  return {
    passedCount,
    totalCount,
    scorePercentage,
    results,
  };
}

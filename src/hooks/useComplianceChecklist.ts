"use client";

import { useMemo } from "react";
import { InvoiceData } from "@/types/invoice.types";
import { ComplianceReport } from "@/types/compliance.types";
import { evaluateCompliance } from "@/lib/compliance";

export function useComplianceChecklist(invoice: InvoiceData): ComplianceReport {
  return useMemo(() => {
    return evaluateCompliance(invoice);
  }, [invoice]);
}

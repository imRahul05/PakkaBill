"use client";

import React from "react";
import { ComplianceReport } from "@/types/compliance.types";
import { CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceSidebarProps {
  report: ComplianceReport;
  isGstMode: boolean;
}

export function ComplianceSidebar({ report, isGstMode }: ComplianceSidebarProps) {
  const isPerfect = report.passedCount === report.totalCount;

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-4 space-y-3 backdrop-blur-sm shadow-xs">
      {/* Header with live badge & score */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className={cn("h-4 w-4", isPerfect ? "text-emerald-500" : "text-primary")} />
          <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 tracking-wider uppercase">
            {isGstMode ? "GST Compliance" : "Bill Essentials"}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-bold font-mono",
              isPerfect
                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                : "bg-primary-muted text-primary-text border border-primary-border"
            )}
          >
            {report.passedCount}/{report.totalCount}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            isPerfect ? "bg-emerald-500" : report.scorePercentage > 60 ? "bg-primary" : "bg-rose-500"
          )}
          style={{ width: `${report.scorePercentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
        {report.results.map((result) => (
          <div
            key={result.ruleId}
            className={cn(
              "flex items-start gap-2 p-1.5 rounded-md text-xs transition-colors",
              result.passed
                ? "text-neutral-700 dark:text-neutral-300"
                : "bg-primary-muted text-primary-text border border-primary-border"
            )}
          >
            {result.passed ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <span className="font-medium block leading-tight">{result.title}</span>
              {result.message && !result.passed && (
                <span className="text-[10px] opacity-90 block mt-0.5">{result.message}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-neutral-500 italic pt-1 border-t border-neutral-200 dark:border-neutral-800">
        Advisory checklist per Rule 46. Missing optional fields will not prevent invoice generation.
      </p>
    </div>
  );
}

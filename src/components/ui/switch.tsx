import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  label?: string;
  description?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  className,
  label,
  description,
}: SwitchProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 cursor-pointer select-none", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        id={id}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-amber-500" : "bg-neutral-800"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col" onClick={() => !disabled && onCheckedChange(!checked)}>
          {label && <span className="text-xs font-medium text-neutral-200">{label}</span>}
          {description && <span className="text-[11px] text-neutral-400">{description}</span>}
        </div>
      )}
    </div>
  );
}

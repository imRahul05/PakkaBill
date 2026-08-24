import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors select-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-amber-500/20 text-amber-300 border-amber-500/30",
        secondary: "border-transparent bg-neutral-800 text-neutral-300",
        success: "border-transparent bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        warning: "border-transparent bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        destructive: "border-transparent bg-rose-500/20 text-rose-300 border-rose-500/30",
        outline: "text-neutral-300 border-neutral-700",
        gold: "border-amber-500/40 bg-amber-500/10 text-amber-400 font-serif",
        silver: "border-slate-500/40 bg-slate-500/10 text-slate-300",
        blue: "border-blue-500/40 bg-blue-500/10 text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

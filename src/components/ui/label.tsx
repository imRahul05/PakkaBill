import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-xs font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide uppercase flex items-center gap-1 select-none",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-primary font-bold">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";

import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`flex h-12 w-full appearance-none rounded-md border bg-transparent pl-3 pr-10 py-2 text-small transition-colors file:border-0 file:bg-transparent file:text-small file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? "border-error focus-visible:ring-error"
              : "border-border hover:border-border-strong"
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Select.displayName = "Select";

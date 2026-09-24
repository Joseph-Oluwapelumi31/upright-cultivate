import { ReactNode, useId } from "react";
import { Label } from "./Label";

interface FormFieldProps {
  label: string;
  error?: string;
  description?: string;
  className?: string;
  children: (props: { id: string; "aria-describedby"?: string; error: boolean }) => ReactNode;
}

export function FormField({
  label,
  error,
  description,
  className = "",
  children,
}: FormFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const ariaDescribedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        "aria-describedby": ariaDescribedBy || undefined,
        error: !!error,
      })}
      {description && !error && (
        <p id={descriptionId} className="text-caption text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-caption font-medium text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const alertConfig = {
  error: {
    icon: AlertCircle,
    styles: "bg-error/10 text-error border-error/20",
  },
  success: {
    icon: CheckCircle2,
    styles: "bg-success/10 text-success border-success/20",
  },
  warning: {
    icon: AlertTriangle,
    styles: "bg-warning/10 text-warning border-warning/20",
  },
  info: {
    icon: Info,
    styles: "bg-info/10 text-info border-info/20",
  },
};

export function Alert({ children, variant = "error", className = "" }: AlertProps) {
  const { icon: Icon, styles } = alertConfig[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-md border p-4 text-small ${styles} ${className}`}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="flex-1 leading-relaxed font-medium">{children}</div>
    </div>
  );
}

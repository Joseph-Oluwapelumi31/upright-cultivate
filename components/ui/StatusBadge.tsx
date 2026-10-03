import type { ReactNode } from "react";
import type {
  InvoiceStatus,
  OrderStatus,
  QuoteStatus,
  RequestStatus,
} from "@/lib/generated/prisma/browser";

export type StatusTone = "neutral" | "warning" | "info" | "success" | "error";

type KnownStatus =
  | RequestStatus
  | QuoteStatus
  | OrderStatus
  | InvoiceStatus
  // Non-enum display states
  | "INACTIVE";

/**
 * Single source of truth for status → semantic tone.
 *
 * Statuses shared between enums (DRAFT, ACCEPTED, CANCELLED, …) carry the
 * same meaning everywhere, so one flat map covers requests, quotes, orders
 * and invoices. `satisfies` makes this exhaustive: adding a value to any of
 * the Prisma status enums fails typecheck until it is mapped here.
 */
export const STATUS_TONES = {
  // Not started / closed without a commercial outcome
  DRAFT: "neutral",
  CANCELLED: "neutral",
  EXPIRED: "neutral",
  INACTIVE: "neutral",

  // Waiting on someone to act
  PENDING: "warning",
  SUBMITTED: "warning",
  ISSUED: "warning",

  // In progress
  UNDER_REVIEW: "info",
  QUOTED: "info",
  SENT: "info",
  CONFIRMED: "info",
  PREPARING: "info",
  READY: "info",
  OUT_FOR_DELIVERY: "info",

  // Positive outcome
  ACCEPTED: "success",
  CONVERTED: "success",
  DELIVERED: "success",
  COMPLETED: "success",
  PAID: "success",

  // Negative outcome
  REJECTED: "error",
  OVERDUE: "error",
} as const satisfies Record<KnownStatus, StatusTone>;

/*
 * Subtle tinted surfaces built from the existing semantic tokens.
 * Text is the token mixed toward --foreground so 12px labels stay above
 * WCAG AA (4.5:1) — the raw tokens alone are ~3–4.3:1 on a 10% tint.
 */
const TONE_CLASSES: Record<StatusTone, string> = {
  neutral:
    "border-border bg-muted/60 text-[color:color-mix(in_oklab,var(--color-muted-foreground)_70%,var(--color-foreground))]",
  warning:
    "border-warning/25 bg-warning/10 text-[color:color-mix(in_oklab,var(--color-warning)_60%,var(--color-foreground))]",
  info: "border-info/25 bg-info/10 text-[color:color-mix(in_oklab,var(--color-info)_60%,var(--color-foreground))]",
  success:
    "border-success/25 bg-success/10 text-[color:color-mix(in_oklab,var(--color-success)_60%,var(--color-foreground))]",
  error:
    "border-error/25 bg-error/10 text-[color:color-mix(in_oklab,var(--color-error)_60%,var(--color-foreground))]",
};

/** Size presets mirror the badge dimensions already used across the app. */
const SIZE_CLASSES = {
  /** Inline, uppercase micro badge (e.g. linked-record status) */
  xs: "px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
  /** Compact card/list badge */
  sm: "px-2 py-0.5 text-xs font-medium",
  /** Default table/list badge */
  md: "px-2 py-1 text-xs font-medium",
  /** Detail-page header badge */
  lg: "px-2.5 py-1 text-xs font-semibold",
  /** Large header badge */
  xl: "px-3 py-1 text-sm font-medium",
} as const;

export type StatusBadgeSize = keyof typeof SIZE_CLASSES;

const BASE_CLASSES = "inline-flex items-center rounded-full border";

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

/** Resolves any status string to a tone; unknown values are neutral. */
export function getStatusTone(status: string | null | undefined): StatusTone {
  if (!status) return "neutral";
  const key = normalizeStatus(status);
  return Object.prototype.hasOwnProperty.call(STATUS_TONES, key)
    ? STATUS_TONES[key as KnownStatus]
    : "neutral";
}

export function getStatusBadgeClassName(
  status: string | null | undefined,
  size: StatusBadgeSize = "md",
  className?: string
): string {
  return [
    BASE_CLASSES,
    SIZE_CLASSES[size],
    TONE_CLASSES[getStatusTone(status)],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface StatusBadgeProps {
  /** Raw status value used to pick the tone (e.g. "UNDER_REVIEW"). */
  status: string;
  /** Optional display label; defaults to the raw status. */
  children?: ReactNode;
  size?: StatusBadgeSize;
  /** Layout-only additions (margins, letter-case). Do not pass colors. */
  className?: string;
}

export function StatusBadge({
  status,
  children,
  size = "md",
  className,
}: StatusBadgeProps) {
  return (
    <span
      data-status-tone={getStatusTone(status)}
      className={getStatusBadgeClassName(status, size, className)}
    >
      {children ?? status}
    </span>
  );
}

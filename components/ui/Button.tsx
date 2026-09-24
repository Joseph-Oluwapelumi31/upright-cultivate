import Link from "next/link";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const baseStyles =
  "inline-flex h-12 items-center justify-center gap-2 rounded-button px-6 text-small font-semibold transition-[transform,background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  /**
   * Primary CTA
   */
  primary:
    "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-primary",

  /**
   * Accent CTA
   */
  accent:
    "bg-accent text-accent-foreground hover:-translate-y-0.5 hover:bg-accent/90 focus-visible:ring-accent",

  /**
   * Secondary action
   */
  secondary:
    "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:ring-secondary",

  /**
   * Low-emphasis action
   */
  ghost:
    "h-auto bg-transparent px-0 py-2 text-primary hover:text-primary/70 focus-visible:ring-primary",
};

export default function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  disabled = false,
  isLoading = false,
  className = "",
  onClick,
}: ButtonProps) {
  const styles = `${baseStyles} ${variants[variant]} ${className}`;
  const isDisabled = disabled || isLoading;

  if (href) {
    if (isDisabled) {
      return (
        <span className={styles} aria-disabled="true">
          {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {children}
        </span>
      );
    }

    return (
      <Link href={href} className={styles} onClick={onClick as any}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={styles}
      onClick={onClick as any}
      aria-disabled={isDisabled}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
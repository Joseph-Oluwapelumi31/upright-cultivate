import Link from "next/link";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const baseStyles =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-[transform,background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  /**
   * Primary CTA
   * Main action used throughout light sections.
   */
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",

  /**
   * Accent CTA
   * Used when the primary color does not provide enough
   * contrast against the surrounding background, especially the hero.
   */
  accent:
    "bg-accent text-accent-foreground shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",

  /**
   * Secondary action
   */
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background",

  /**
   * Low-emphasis action
   */
  ghost:
    "h-auto bg-transparent px-0 py-2 text-primary shadow-none hover:text-primary/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
};

export default function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  disabled = false,
  className = "",
  onClick,
}: ButtonProps) {
  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    if (disabled) {
      return (
        <span className={styles} aria-disabled="true">
          {children}
        </span>
      );
    }

    return (
      <Link href={href} className={styles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={styles}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-(--citron) text-(--deep-moss) hover:bg-(--white)"
      : "border border-(--deep-moss) text-(--deep-moss) hover:bg-(--deep-moss) hover:text-(--white)";

  const classes = `
    inline-flex items-center justify-center gap-2
    rounded-full px-6 py-3
    text-sm font-semibold
    transition-colors duration-200
    ${styles}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
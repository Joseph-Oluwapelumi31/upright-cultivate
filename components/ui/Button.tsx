import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-[var(--citron)] text-[var(--deep-moss)] hover:bg-[var(--white)]"
      : "border border-[var(--deep-moss)] text-[var(--deep-moss)] hover:bg-[var(--deep-moss)] hover:text-[var(--white)]";

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
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {children}
    </button>
  );
}
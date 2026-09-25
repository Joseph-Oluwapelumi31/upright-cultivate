import { ReactNode, HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

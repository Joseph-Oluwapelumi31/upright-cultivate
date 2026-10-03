import Link from "next/link";
import type {
  MouseEventHandler,
  ReactNode,
} from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";

interface CommonButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  title?: string;
}

interface NativeButtonProps extends CommonButtonProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface LinkButtonProps extends CommonButtonProps {
  href: string;
  type?: never;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

type ButtonProps = NativeButtonProps | LinkButtonProps;

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
    "border border-primary bg-transparent text-primary hover:bg-primary/5 focus-visible:ring-primary",

  /**
   * Low-emphasis action
   */
  ghost:
    "h-auto bg-transparent px-0 py-2 text-primary hover:text-primary/70 focus-visible:ring-primary",
};

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    disabled = false,
    isLoading = false,
    className = "",
    title,
  } = props;

  const styles = `${baseStyles} ${variants[variant]} ${className}`;
  const isDisabled = disabled || isLoading;

  const content = (
    <>
      {isLoading && (
        <Loader2
          className="size-4 animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </>
  );

  /*
   * Link variant
   */
  if (props.href !== undefined) {
    if (isDisabled) {
      return (
        <span
          className={styles}
          aria-disabled="true"
          title={title}
        >
          {content}
        </span>
      );
    }

    return (
      <Link
        href={props.href}
        className={styles}
        onClick={props.onClick}
        title={title}
      >
        {content}
      </Link>
    );
  }

  /*
   * Native button variant
   */
  return (
    <button
      type={props.type ?? "button"}
      disabled={isDisabled}
      className={styles}
      onClick={props.onClick}
      aria-busy={isLoading || undefined}
      title={title}
    >
      {content}
    </button>
  );
}


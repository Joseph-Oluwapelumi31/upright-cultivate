interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <p
          className={`mb-5 text-[11px] font-medium uppercase tracking-[0.16em] ${
            isDark ? "text-(--accent)" : "text-(--secondary)"
          }`}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={`text-4xl font-medium leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl ${
          isDark ? "text-(--primary-foreground)" : "text-(--primary)"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg ${
            isDark
              ? "text-(--primary-foreground)/70"
              : "text-(--foreground)/65"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-(--secondary)">
          {eyebrow}
        </p>
      )}

      <h2 className=" text-4xl font-medium leading-[0.95] tracking-tighter text-(--primary) sm:text-5xl lg:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl text-base leading-7 text-(--foreground)/65 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
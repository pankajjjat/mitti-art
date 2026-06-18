import clsx from "clsx";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-text md:text-[3rem] md:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 font-sans text-base leading-[1.7] text-text-muted md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

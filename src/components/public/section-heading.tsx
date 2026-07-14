import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  className,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="tuodonto-eyebrow">{eyebrow}</p>
      <h2 className="tuodonto-display mt-3 text-[clamp(2.8rem,5vw,5.8rem)] leading-[.92] text-[var(--tuodonto-brown)]">
        {title}
      </h2>
      {copy && (
        <p className="mt-5 text-base leading-8 text-[var(--tuodonto-taupe)] md:text-lg">
          {copy}
        </p>
      )}
    </div>
  );
}

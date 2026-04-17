import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-compass-600">
          <span className="h-px w-6 bg-compass-600/40" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl font-medium leading-[1.1] text-ink sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

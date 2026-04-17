import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

// --- Card ---

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-paper border border-ink/8 shadow-soft",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

// --- Badge ---

type BadgeTone = "neutral" | "compass" | "coral" | "amber" | "emergency";
const TONES: Record<BadgeTone, string> = {
  neutral: "bg-ink/5 text-ink-soft",
  compass: "bg-compass-50 text-compass-700 border border-compass-100",
  coral: "bg-coral-500/10 text-coral-600 border border-coral-500/20",
  amber: "bg-amber-400/15 text-[#8A6A0F] border border-amber-400/30",
  emergency: "bg-coral-500 text-white",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// --- RatingStars ---

export function RatingStars({
  value,
  size = 14,
  showNumeric = true,
  className,
}: {
  value: number;
  size?: number;
  showNumeric?: boolean;
  className?: string;
}) {
  // Render 5 star slots; partial fills are rounded to halves for simplicity.
  const filled = Math.round(value * 2) / 2;
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const isFull = i <= Math.floor(filled);
          const isHalf = !isFull && i - 0.5 === filled;
          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-ink/15" />
              {(isFull || isHalf) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? size / 2 : size }}
                >
                  <Star
                    size={size}
                    className="text-amber-400"
                    fill="currentColor"
                    strokeWidth={1}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showNumeric && (
        <span className="text-xs font-medium text-ink-soft tabular-nums">
          {value.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
}

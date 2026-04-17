import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  secondary: "bg-paper border border-ink/15 text-ink hover:bg-paper-warm",
  ghost: "text-ink-soft hover:bg-ink/5",
  danger: "bg-coral-500 text-white hover:bg-coral-600",
};
const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    />
  )
);
Button.displayName = "Button";

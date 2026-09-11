import React from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-primary/40",
  secondary:
    "bg-surface text-text-primary border border-border hover:border-border-strong hover:bg-surface-muted disabled:opacity-50",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-50",
  danger:
    "bg-danger text-white hover:bg-danger-dark disabled:bg-danger/40",
};

const SIZES = {
  md: "text-[15px] px-5 py-3 min-h-[44px]",
  lg: "text-[17px] px-7 py-4 min-h-[56px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition-all duration-200 ease-out",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" aria-hidden="true" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="h-[1.1em] w-[1.1em]" aria-hidden="true" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="h-[1.1em] w-[1.1em]" aria-hidden="true" />
      )}
    </button>
  );
}

import React from "react";
import { Loader2 } from "lucide-react";
import useRipple from "../../hooks/useRipple";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-primary/40 shadow-md hover:shadow-lg",
  secondary:
    "bg-surface text-text-primary border border-border hover:border-primary/40 hover:bg-primary-soft disabled:opacity-50",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-50",
  danger:
    "bg-danger text-white hover:bg-danger-dark disabled:bg-danger/40 shadow-md hover:shadow-lg",
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
  onClick,
  ...props
}) {
  const ripple = useRipple();

  function handleClick(e) {
    if (!disabled && !loading) ripple(e);
    onClick?.(e);
  }

  return (
    <button
      onClick={handleClick}
      className={[
        "touch-ripple inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition-all duration-200 ease-out",
        "active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100",
        "hover-lift",
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
        <Icon className="h-[1.1em] w-[1.1em] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      )}
    </button>
  );
}
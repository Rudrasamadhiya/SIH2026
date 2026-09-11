import React from "react";
import useRipple from "../../hooks/useRipple";

export default function IconButton({
  icon: Icon,
  label,
  variant = "ghost",
  active = false,
  className = "",
  onClick,
  ...props
}) {
  const ripple = useRipple();
  const base =
    variant === "solid"
      ? "bg-primary text-white hover:bg-primary-dark"
      : active
      ? "bg-primary-soft text-primary"
      : "bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary";

  return (
    <button
      aria-label={label}
      title={label}
      onClick={(e) => {
        ripple(e);
        onClick?.(e);
      }}
      className={[
        "touch-ripple hover-lift inline-flex items-center justify-center rounded-full",
        "h-11 w-11 min-h-[44px] min-w-[44px]",
        "transition-colors duration-150 ease-out active:scale-90",
        base,
        className,
      ].join(" ")}
      {...props}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
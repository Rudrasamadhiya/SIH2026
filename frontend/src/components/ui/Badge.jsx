import React from "react";

const TONES = {
  neutral: "bg-surface-muted text-text-secondary",
  primary: "bg-primary-soft text-primary-dark",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export default function Badge({ children, tone = "neutral", icon: Icon, className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        TONES[tone],
        className,
      ].join(" ")}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}

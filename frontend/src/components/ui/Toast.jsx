import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info };
const TONES = {
  success: "border-success/30 bg-success-soft text-success",
  error: "border-danger/30 bg-danger-soft text-danger",
  info: "border-primary/30 bg-primary-soft text-primary-dark",
};

export default function Toast({ message, tone = "info", onDismiss, duration = 4000 }) {
  const Icon = ICONS[tone];

  useEffect(() => {
    if (!onDismiss) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5",
        "rounded-xl border px-4 py-3 text-sm font-medium shadow-xl animate-bounce-in",
        TONES[tone],
      ].join(" ")}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
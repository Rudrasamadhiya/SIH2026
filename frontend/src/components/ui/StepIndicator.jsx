import React from "react";

/** Elegant kiosk-flow progress indicator (not a generic dashboard progress bar). */
export default function StepIndicator({ current, total, label }) {
  return (
    <div className="flex items-center gap-3" aria-label={`Step ${current} of ${total}`}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={[
              "h-1.5 rounded-full transition-all duration-300",
              i < current ? "w-6 bg-primary" : "w-1.5 bg-border-strong",
            ].join(" ")}
          />
        ))}
      </div>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label} · {current} of {total}
        </span>
      )}
    </div>
  );
}

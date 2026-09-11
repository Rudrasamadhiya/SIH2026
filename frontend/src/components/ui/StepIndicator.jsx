import React from "react";
import { STEP_ESTIMATE } from "../../lib/constants";

/**
 * The backend AI decides when the interview is done (status: "complete") —
 * there is no fixed number of questions in prompt_template.py or app.py.
 * So this no longer renders "Step X of 6" (a false promise). Instead it
 * shows a growing trail of filled dots for the questions already answered,
 * plus a softly pulsing "in progress" dot representing the open-ended next
 * question — the count grows as far as the conversation actually goes.
 */
export default function StepIndicator({ current, label }) {
  const filled = Math.max(0, current - 1);
  const visibleDots = Math.max(STEP_ESTIMATE, filled + 1);

  return (
    <div className="flex items-center gap-3" aria-label={`${label ?? "Progress"}: question ${current}`}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: visibleDots }).map((_, i) => {
          const isFilled = i < filled;
          const isCurrent = i === filled;
          return (
            <span
              key={i}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                isFilled ? "w-6 bg-primary" : isCurrent ? "w-6 bg-primary animate-pulse" : "w-1.5 bg-border-strong",
              ].join(" ")}
            />
          );
        })}
      </div>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label} · {current}
        </span>
      )}
    </div>
  );
}
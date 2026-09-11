import React, { useMemo } from "react";

/**
 * Lightweight CSS-only waveform. No canvas, no audio-analysis dependency —
 * bars animate with staggered delays/durations to suggest live audio
 * without being a gimmicky visualizer.
 */
export default function Waveform({ active = false, bars = 24, tone = "primary", size = "md" }) {
  const heights = useMemo(
    () => Array.from({ length: bars }, () => 0.3 + Math.random() * 0.7),
    [bars]
  );

  const barColor = tone === "danger" ? "bg-danger" : "bg-primary";
  const barHeight = size === "lg" ? "h-10" : "h-6";

  return (
    <div className={["flex items-center justify-center gap-[3px]", barHeight].join(" ")} aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={[
            "w-[3px] rounded-full origin-center transition-opacity",
            barColor,
            active ? "animate-wave" : "opacity-30",
          ].join(" ")}
          style={{
            height: `${Math.round(h * 100)}%`,
            animationDelay: active ? `${(i % 8) * 70}ms` : undefined,
            animationDuration: active ? `${700 + (i % 5) * 90}ms` : undefined,
            transform: active ? undefined : "scaleY(0.4)",
          }}
        />
      ))}
    </div>
  );
}

import React from "react";

/**
 * MediKiosk wordmark + minimal geometric mark (pulse line inside a rounded
 * square). Pure SVG/CSS, no external image assets, so it scales cleanly
 * across the header, welcome screen, and report.
 */
export default function Logo({ size = "md", withWordmark = true, className = "" }) {
  const dims = size === "lg" ? 44 : size === "sm" ? 28 : 34;
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className={["flex items-center gap-2.5", className].join(" ")}>
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="11" fill="var(--color-primary)" />
        <path
          d="M6 21H13.2L16 14L20.5 27L24 17.5L26.2 21H34"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withWordmark && (
        <span className={["font-extrabold tracking-tight text-text-primary", text].join(" ")}>
          Medi<span className="text-primary">Kiosk</span>
        </span>
      )}
    </div>
  );
}

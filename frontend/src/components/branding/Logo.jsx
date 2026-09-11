import React from "react";

/**
 * MediKiosk wordmark + minimal geometric mark (pulse line inside a rounded
 * square, filled with the brand gradient). Pure SVG/CSS, no external image
 * assets, so it scales cleanly across the header, welcome screen, and
 * report — and stays crisp on a tablet kiosk display.
 */
export default function Logo({ size = "md", withWordmark = true, className = "", animated = false }) {
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
        className={animated ? "animate-bounce-in" : ""}
      >
        <defs>
          <linearGradient id="mk-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#mk-logo-grad)" />
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
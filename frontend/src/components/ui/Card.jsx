import React from "react";

export default function Card({ children, className = "", elevated = false, ...props }) {
  return (
    <div
      className={[
        "rounded-2xl border border-border bg-surface",
        elevated ? "shadow-panel" : "shadow-soft",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

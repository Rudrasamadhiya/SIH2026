import React from "react";

export default function Card({ children, className = "", elevated = false, interactive = false, ...props }) {
  return (
    <div
      className={[
        "rounded-2xl border border-border bg-surface p-6 transition-all duration-200",
        elevated ? "shadow-xl" : "shadow-md",
        interactive ? "card-interactive" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

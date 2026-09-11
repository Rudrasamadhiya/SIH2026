import React from "react";

export default function MedicalTimeline({ items }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-text-muted">Today</p>
      <ol className="relative ml-1.5 space-y-6 border-l border-border pl-5">
        {items.map((item, i) => (
          <li key={i} className="relative">
            <span
              className={[
                "absolute -left-[25px] top-0.5 h-3 w-3 rounded-full border-2 border-surface",
                item.done ? "bg-primary" : "bg-border-strong",
              ].join(" ")}
            />
            <p className={["text-sm font-medium", item.done ? "text-text-primary" : "text-text-muted"].join(" ")}>
              {item.label}
            </p>
            {item.time && <p className="mt-0.5 text-xs text-text-muted">{item.time}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

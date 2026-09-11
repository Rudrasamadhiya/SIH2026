import React from "react";
import { AlertTriangle } from "lucide-react";

export default function EmergencyButton({ onActivate, compact = false }) {
  if (compact) {
    return (
      <button
        onClick={onActivate}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-danger/30 bg-danger-soft px-3.5 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-white"
        aria-label="Get emergency help"
      >
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Emergency Help</span>
        <span className="sm:hidden">SOS</span>
      </button>
    );
  }

  return (
    <button
      onClick={onActivate}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-danger/30 bg-danger-soft px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-white"
      aria-label="Get emergency help"
    >
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      Emergency Help
    </button>
  );
}

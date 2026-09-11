import React from "react";
import { UserRound } from "lucide-react";

export default function PatientBadge({ abhaId }) {
  if (!abhaId) return null;
  const masked = abhaId.length > 4 ? `•••• ${abhaId.slice(-4)}` : abhaId;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary">
      <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
      ABHA {masked}
    </span>
  );
}

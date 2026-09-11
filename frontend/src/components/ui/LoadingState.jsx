import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState({ message = "One moment…", size = "md" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center" role="status" aria-live="polite">
      <Loader2
        className={["animate-spin text-primary", size === "lg" ? "h-10 w-10" : "h-6 w-6"].join(" ")}
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-text-secondary">{message}</p>
    </div>
  );
}

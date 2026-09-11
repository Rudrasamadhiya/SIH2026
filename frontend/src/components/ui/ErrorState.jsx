import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "We couldn't process that response.",
  message = "Your previous response has not been lost.",
  onRetry,
  retryLabel = "Try Again",
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-6 py-8 text-center"
    >
      <AlertTriangle className="h-8 w-8 text-danger" aria-hidden="true" />
      <div>
        <p className="font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-sm text-text-secondary">{message}</p>
      </div>
      {onRetry && (
        <Button variant="danger" onClick={onRetry} className="mt-1">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

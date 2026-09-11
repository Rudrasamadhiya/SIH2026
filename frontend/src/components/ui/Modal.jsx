import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, tone = "default", dismissible = true }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function handleKey(e) {
      if (e.key === "Escape" && dismissible) onClose?.();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose, dismissible]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={[
          "absolute inset-0",
          tone === "danger" ? "bg-danger-dark/40" : "bg-secondary/40",
          "backdrop-blur-sm",
        ].join(" ")}
        onClick={dismissible ? onClose : undefined}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-surface p-6 shadow-panel animate-bounce-in">
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && <h2 className="text-lg font-bold text-text-primary">{title}</h2>}
          {dismissible && (
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="ml-auto rounded-full p-1.5 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
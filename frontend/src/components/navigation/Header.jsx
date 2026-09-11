import React from "react";
import { Languages } from "lucide-react";
import Logo from "../branding/Logo";
import EmergencyButton from "../emergency/EmergencyButton";

export default function Header({
  status,
  language,
  onToggleLanguage,
  onEmergency,
  showEmergency = true,
  showLanguage = false,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo size="sm" />

        <div className="flex items-center gap-2 sm:gap-3">
          {status && (
            <span className="hidden text-sm font-medium text-text-secondary sm:inline">
              {status}
            </span>
          )}

          {showLanguage && (
            <button
              onClick={onToggleLanguage}
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted"
              aria-label="Change language"
            >
              <Languages className="h-4 w-4" aria-hidden="true" />
              {language === "hi" ? "हिन्दी" : "English"}
            </button>
          )}

          {showEmergency && <EmergencyButton onActivate={onEmergency} compact />}
        </div>
      </div>
    </header>
  );
}

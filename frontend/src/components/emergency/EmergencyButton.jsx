import React from "react";
import { AlertTriangle } from "lucide-react";
import { playUiTone } from "../../lib/sound";
import { useLanguage } from "../../context/LanguageContext";
import useRipple from "../../hooks/useRipple";

export default function EmergencyButton({ onActivate, compact = false }) {
  const { t } = useLanguage();
  const ripple = useRipple();

  function handleClick(e) {
    ripple(e);
    playUiTone("tap");
    onActivate?.();
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="touch-ripple hover-lift inline-flex h-11 items-center gap-1.5 rounded-full border border-danger/30 bg-danger-soft px-3.5 text-sm font-semibold text-danger transition-all duration-150 hover:bg-danger hover:text-white active:scale-95"
        aria-label={t("emergency.button")}
      >
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t("emergency.button")}</span>
        <span className="sm:hidden">{t("emergency.sos")}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="touch-ripple hover-lift inline-flex min-h-[44px] items-center gap-2 rounded-full border border-danger/30 bg-danger-soft px-4 py-2.5 text-sm font-semibold text-danger transition-all duration-150 hover:bg-danger hover:text-white active:scale-95"
      aria-label={t("emergency.button")}
    >
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      {t("emergency.button")}
    </button>
  );
}
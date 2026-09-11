import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";
import { useLanguage } from "../../context/LanguageContext";

export default function ErrorState({ title, message, onRetry, retryLabel }) {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-6 py-8 text-center animate-fade-slide-up"
    >
      <AlertTriangle className="h-8 w-8 text-danger" aria-hidden="true" />
      <div>
        <p className="font-semibold text-text-primary">{title ?? t("error.title")}</p>
        <p className="mt-1 text-sm text-text-secondary">{message ?? t("error.message")}</p>
      </div>
      {onRetry && (
        <Button variant="danger" onClick={onRetry} className="mt-1">
          {retryLabel ?? t("common.retry")}
        </Button>
      )}
    </div>
  );
}
import React from "react";
import { Loader2, Activity } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LoadingState({ message, size = "md" }) {
  const { t } = useLanguage();
  const sizeClasses = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const iconSize = size === "lg" ? "h-6 w-6" : "h-5 w-5";
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center" role="status" aria-live="polite">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses} rounded-full border-4 border-primary/20 animate-pulse`} />
        {/* Spinning ring */}
        <div className={`absolute inset-0 ${sizeClasses} rounded-full border-4 border-transparent border-t-primary animate-spin`} />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className={`${iconSize} text-primary animate-pulse`} />
        </div>
      </div>
      <p className="text-sm font-medium text-text-secondary animate-pulse">
        {message ?? t("common.loading")}
      </p>
    </div>
  );
}
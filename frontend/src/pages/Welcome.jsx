import React from "react";
import { ShieldCheck, ArrowRight, Languages } from "lucide-react";
import Logo from "../components/branding/Logo";
import Button from "../components/ui/Button";
import EmergencyButton from "../components/emergency/EmergencyButton";

export default function Welcome({ language, onToggleLanguage, onStart, onEmergency }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      <div className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLanguage}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted"
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            {language === "hi" ? "हिन्दी" : "English"}
          </button>
          <EmergencyButton onActivate={onEmergency} compact />
        </div>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="animate-fade-slide-up">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path
                d="M6 21H13.2L16 14L20.5 27L24 17.5L26.2 21H34"
                stroke="var(--color-primary)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Medi<span className="text-primary">Kiosk</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-text-secondary">
            Your intelligent health consultation assistant.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-text-muted">
            Let's understand how you're feeling before your consultation.
          </p>
        </div>

        <div className="mt-10 w-full max-w-xs animate-fade-slide-up">
          <Button size="lg" fullWidth icon={ArrowRight} iconPosition="right" onClick={onStart}>
            Start Consultation
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-text-muted animate-fade-in">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Your information is handled securely.
        </div>
      </main>

      <footer className="px-6 pb-6 text-center text-xs text-text-muted">
        For life-threatening emergencies, use the Emergency Help button above.
      </footer>
    </div>
  );
}

import React from "react";
import { Clock, ShieldCheck, Languages, ArrowRight } from "lucide-react";
import Logo from "../components/branding/Logo";
import Button from "../components/ui/Button";

export default function PatientIntro({ language, onToggleLanguage, onContinue }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-10 text-center">
      <div className="w-full max-w-md animate-fade-slide-up">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          Hello. I'm MediKiosk.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[17px] leading-relaxed text-text-secondary">
          I'll ask you a few questions about how you're feeling. Answer at your own pace —
          there's no rush.
        </p>

        <div className="mx-auto mt-8 max-w-xs space-y-3 rounded-2xl border border-border bg-surface p-5 text-left shadow-soft">
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <Clock className="h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
            About 5–7 minutes
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
            Your responses are used to prepare your consultation
          </div>
          <button
            onClick={onToggleLanguage}
            className="flex w-full items-center gap-3 text-sm text-text-secondary"
          >
            <Languages className="h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
            Speaking in {language === "hi" ? "हिन्दी" : "English"}
            <span className="ml-auto text-xs font-semibold text-primary">Change</span>
          </button>
        </div>

        <div className="mt-8">
          <Button size="lg" fullWidth icon={ArrowRight} iconPosition="right" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

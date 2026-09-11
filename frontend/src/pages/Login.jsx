import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Logo from "../components/branding/Logo";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const ABHA_PATTERN = /^\d{2}-\d{4}-\d{4}-\d{4}$|^\d{14}$/;

function formatAbha(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 14);
  const parts = [digits.slice(0, 2), digits.slice(2, 6), digits.slice(6, 10), digits.slice(10, 14)];
  return parts.filter(Boolean).join("-");
}

export default function Login({ abhaId, setAbhaId, onBack, onContinue }) {
  const [touched, setTouched] = useState(false);
  const isValid = ABHA_PATTERN.test(abhaId) || abhaId.replace(/\D/g, "").length === 14;
  const error = touched && !isValid ? "Enter a valid 14-digit ABHA ID." : undefined;

  function handleContinue() {
    setTouched(true);
    if (isValid) onContinue();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-10">
      <div className="w-full max-w-sm animate-fade-slide-up">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-7 shadow-panel">
          <h2 className="text-xl font-bold text-text-primary">Welcome</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Please enter your ABHA ID to begin your consultation.
          </p>

          <div className="mt-6">
            <Input
              label="ABHA ID"
              placeholder="00-0000-0000-0000"
              value={abhaId}
              onChange={(e) => setAbhaId(formatAbha(e.target.value))}
              onBlur={() => setTouched(true)}
              error={error}
              inputMode="numeric"
              autoFocus
            />
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Your ABHA ID is only used to link this consultation to your health record.
          </div>

          <div className="mt-7 flex items-center gap-3">
            <Button variant="secondary" icon={ArrowLeft} onClick={onBack} aria-label="Back">
              Back
            </Button>
            <Button fullWidth icon={ArrowRight} iconPosition="right" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

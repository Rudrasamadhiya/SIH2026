import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import Logo from "../components/branding/Logo";
import OTPInput from "../components/ui/OTPInput";
import Button from "../components/ui/Button";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OTP({ abhaId, otp, setOtp, onBack, onVerified }) {
  const [status, setStatus] = useState("idle"); // idle | verifying | success | error
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(onVerified, 500);
    return () => clearTimeout(t);
  }, [status, onVerified]);

  function handleVerify() {
    if (otp.length !== OTP_LENGTH) {
      setStatus("error");
      return;
    }
    // NOTE: authentication is currently mocked on the backend (no real OTP
    // verification exists), so this preserves that mock behavior with a
    // brief, honest "verifying" state rather than pretending to call an
    // endpoint that doesn't exist.
    setStatus("verifying");
    setTimeout(() => setStatus("success"), 600);
  }

  const maskedId = abhaId.length > 4 ? `•••• ${abhaId.slice(-4)}` : abhaId;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-10">
      <div className="w-full max-w-sm animate-fade-slide-up">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-7 shadow-panel text-center">
          <h2 className="text-xl font-bold text-text-primary">Verify it's you</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Enter the 6-digit code sent for ABHA ID {maskedId}
          </p>

          <div className="mt-7">
            <OTPInput
              length={OTP_LENGTH}
              value={otp}
              onChange={(v) => {
                setOtp(v);
                if (status === "error") setStatus("idle");
              }}
              error={status === "error"}
              disabled={status === "verifying" || status === "success"}
            />
            {status === "error" && (
              <p className="mt-3 text-sm text-danger">Enter all 6 digits to continue.</p>
            )}
          </div>

          <button
            onClick={() => setCountdown(RESEND_SECONDS)}
            disabled={countdown > 0}
            className="mt-5 text-sm font-medium text-primary disabled:text-text-muted"
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Your session is secure.
          </div>

          <div className="mt-7 flex items-center gap-3">
            <Button variant="secondary" icon={ArrowLeft} onClick={onBack} aria-label="Back">
              Back
            </Button>
            <Button
              fullWidth
              loading={status === "verifying"}
              icon={status === "success" ? CheckCircle2 : undefined}
              onClick={handleVerify}
              className={status === "success" ? "bg-success hover:bg-success" : ""}
            >
              {status === "success" ? "Verified" : "Login"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

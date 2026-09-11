import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Phone, PhoneOff, CheckCircle2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { playSiren, playSOS, playRingTone } from "../../lib/sound";
import { useLanguage } from "../../context/LanguageContext";

export default function EmergencyModal({ open, onClose, triggeredByAI = false }) {
  const { t } = useLanguage();
  const [callState, setCallState] = useState("idle"); // idle | calling | connected
  const stopSirenRef = useRef(null);
  const stopRingRef = useRef(null);

  // When the AI itself flags an emergency, sound the siren the instant the
  // modal appears — matches backend/alerts.py's intended contract
  // ("Red Screen + Siren Sound") even though that endpoint isn't wired up
  // yet; the frontend honors the same alert semantics on its own.
  useEffect(() => {
    if (open && triggeredByAI) {
      stopSirenRef.current = playSiren({ durationMs: 6000 });
    }
    return () => {
      stopSirenRef.current?.();
      stopSirenRef.current = null;
    };
  }, [open, triggeredByAI]);

  useEffect(() => {
    if (!open) {
      setCallState("idle");
      stopRingRef.current?.();
      stopRingRef.current = null;
    }
  }, [open]);

  function handleCall() {
    setCallState("calling");
    playSOS();
    stopRingRef.current = playRingTone({ loop: true });
    window.setTimeout(() => {
      stopRingRef.current?.();
      stopRingRef.current = null;
      setCallState("connected");
    }, 3600);
  }

  function handleEndCall() {
    stopRingRef.current?.();
    stopRingRef.current = null;
    setCallState("idle");
  }

  return (
    <Modal open={open} onClose={onClose} tone="danger" dismissible={!triggeredByAI && callState !== "calling"}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={[
            "flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft",
            callState === "calling" ? "animate-pulse" : "",
          ].join(" ")}
        >
          <AlertTriangle className="h-7 w-7 text-danger" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            {triggeredByAI ? t("emergency.aiTitle") : t("emergency.manualTitle")}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            {triggeredByAI ? t("emergency.aiBody") : t("emergency.manualBody")}
          </p>
        </div>

        <div className="w-full space-y-2.5 pt-1">
          {callState === "idle" && (
            <Button variant="danger" fullWidth icon={Phone} onClick={handleCall}>
              {t("emergency.call")}
            </Button>
          )}

          {callState === "calling" && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-danger/20 bg-danger-soft py-4">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <span className="absolute h-10 w-10 rounded-full bg-danger/30 animate-pulse-ring-slow" />
                <Phone className="relative h-5 w-5 text-danger" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-danger">{t("emergency.calling")}</p>
            </div>
          )}

          {callState === "connected" && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-success/20 bg-success-soft py-4 animate-bounce-in">
              <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
              <p className="text-sm font-semibold text-success">{t("emergency.connected")}</p>
              <Button variant="secondary" icon={PhoneOff} onClick={handleEndCall}>
                {t("emergency.endCall")}
              </Button>
            </div>
          )}

          {!triggeredByAI && callState === "idle" && (
            <Button variant="secondary" fullWidth onClick={onClose}>
              {t("emergency.okClose")}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
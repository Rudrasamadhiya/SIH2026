import React from "react";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";
import Waveform from "./Waveform";

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * state: "idle" | "recording" | "processing" | "speaking"
 */
export default function VoiceRecorder({ state, elapsedMs = 0, onStart, onStop }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {state === "recording" && (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <Waveform active tone="primary" />
          <div className="flex items-center gap-2 text-sm font-medium text-danger">
            <span className="h-2 w-2 animate-pulse rounded-full bg-danger" />
            Recording · {formatElapsed(elapsedMs)}
          </div>
        </div>
      )}

      {state === "processing" && (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-text-secondary">Understanding your response…</p>
        </div>
      )}

      {state === "speaking" && (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <Waveform active tone="primary" size="lg" />
          <p className="text-sm font-medium text-text-secondary">MediKiosk is speaking</p>
        </div>
      )}

      <div className="relative flex items-center justify-center">
        {state === "recording" && (
          <span className="absolute h-20 w-20 rounded-full bg-danger/30 animate-pulse-ring" />
        )}
        <button
          onClick={state === "recording" ? onStop : onStart}
          disabled={state === "processing" || state === "speaking"}
          aria-label={state === "recording" ? "Stop recording" : "Start speaking"}
          className={[
            "relative z-10 flex h-20 w-20 items-center justify-center rounded-full",
            "shadow-elevated transition-all duration-200 ease-out active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-50",
            state === "recording"
              ? "bg-danger text-white hover:bg-danger-dark"
              : "bg-primary text-white hover:bg-primary-dark",
          ].join(" ")}
        >
          {state === "recording" ? (
            <Square className="h-7 w-7" fill="currentColor" aria-hidden="true" />
          ) : state === "processing" || state === "speaking" ? (
            <Volume2 className="h-8 w-8" aria-hidden="true" />
          ) : (
            <Mic className="h-8 w-8" aria-hidden="true" />
          )}
        </button>
      </div>

      {state === "idle" && (
        <p className="text-sm text-text-muted">Tap to speak · Take your time</p>
      )}
    </div>
  );
}

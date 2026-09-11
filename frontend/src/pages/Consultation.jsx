import React from "react";
import Header from "../components/navigation/Header";
import StepIndicator from "../components/ui/StepIndicator";
import ConversationHistory from "../components/conversation/ConversationHistory";
import QuestionCard from "../components/conversation/QuestionCard";
import VoiceRecorder from "../components/voice/VoiceRecorder";
import ErrorState from "../components/ui/ErrorState";
import PatientBadge from "../components/patient/PatientBadge";
import { CONSULTATION_STEPS } from "../lib/constants";

export default function Consultation({
  abhaId,
  turns,
  currentQuestion,
  language,
  onToggleLanguage,
  onEmergency,
  voiceState,
  elapsedMs,
  onStart,
  onStop,
  permissionError,
  apiError,
  onRetry,
}) {
  const stepCount = Math.min(turns.length + 1, CONSULTATION_STEPS);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header
        status="Consultation"
        language={language}
        onToggleLanguage={onToggleLanguage}
        onEmergency={onEmergency}
        showLanguage
      />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-40 pt-8 sm:px-8">
        <div className="mb-6 flex items-center justify-between">
          <StepIndicator current={stepCount} total={CONSULTATION_STEPS} label="Consultation" />
          <PatientBadge abhaId={abhaId} />
        </div>

        {turns.length > 0 && (
          <div className="mb-8">
            <ConversationHistory turns={turns} />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center justify-center py-6">
          {apiError ? (
            <ErrorState onRetry={onRetry} />
          ) : (
            <QuestionCard question={currentQuestion} />
          )}
          {permissionError && (
            <p className="mt-4 max-w-sm text-center text-sm text-danger">{permissionError}</p>
          )}
        </div>
      </div>

      {!apiError && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-6 py-6 backdrop-blur-md">
          <VoiceRecorder
            state={voiceState}
            elapsedMs={elapsedMs}
            onStart={onStart}
            onStop={onStop}
          />
        </div>
      )}
    </div>
  );
}

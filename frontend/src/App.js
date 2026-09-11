import React, { useCallback, useState, useEffect } from "react";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import PatientIntro from "./pages/PatientIntro";
import Consultation from "./pages/Consultation";
import Summary from "./pages/Summary";
import Report from "./pages/Report";
import UploadDocuments from "./pages/UploadDocuments";
import PatientHistory from "./pages/PatientHistory";
import Dashboard from "./pages/Dashboard";

import EmergencyModal from "./components/emergency/EmergencyModal";
import useVoiceRecorder from "./hooks/useVoiceRecorder";
import { processAudio, saveConsultation } from "./lib/api";
import { useLanguage } from "./context/LanguageContext";

const SCREENS = {
  WELCOME: "WELCOME",
  LOGIN: "LOGIN",
  OTP: "OTP",
  DASHBOARD: "DASHBOARD",
  INTRO: "INTRO",
  CONSULTATION: "CONSULTATION",
  SUMMARY: "SUMMARY",
  REPORT: "REPORT",
  UPLOAD: "UPLOAD",
  HISTORY: "HISTORY",
};

const DEFAULT_QUESTION = "Welcome! How can I help you today?";

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const { language, toggleLanguage, t } = useLanguage();

  // Identity — same fields the original app tracked.
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("");

  // Consultation state — same fields/shape as the original app
  // (transcript, llm, history) so the /process_audio contract is untouched.
  const [transcript, setTranscript] = useState("");
  const [llm, setLlm] = useState(null);
  const [history, setHistory] = useState("");
  const [turns, setTurns] = useState([]); // [{ transcript, question }] — UI-only, not sent to the API

  // Voice UI state
  const [voiceState, setVoiceState] = useState("idle"); // idle | recording | processing | speaking
  const [apiError, setApiError] = useState(null);
  const [pendingBlob, setPendingBlob] = useState(null);

  // Emergency
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emergencyFromAI, setEmergencyFromAI] = useState(false);

  const openManualEmergency = useCallback(() => {
    setEmergencyFromAI(false);
    setEmergencyOpen(true);
  }, []);

  // --- Recording submission -------------------------------------------
  const submitRecording = useCallback(
    async (blob) => {
      setVoiceState("processing");
      setApiError(null);
      try {
        const data = await processAudio({ blob, abhaId, history });

        setTranscript(data.transcript);
        setLlm(data.llm);
        setHistory((prev) => `${prev}\nUser: ${data.transcript}\nAI: ${data.llm?.question ?? ""}`);
        setTurns((prev) => [...prev, { transcript: data.transcript, question: data.llm?.question }]);

        if (data.llm?.emergency) {
          setEmergencyFromAI(true);
          setEmergencyOpen(true);
        }

        if (data.tts_base64_wav) {
          setVoiceState("speaking");
          const audio = new Audio("data:audio/wav;base64," + data.tts_base64_wav);
          audio.onended = () => setVoiceState("idle");
          audio.onerror = () => setVoiceState("idle");
          audio.play().catch(() => setVoiceState("idle"));
        } else {
          setVoiceState("idle");
        }

        if (data.llm?.status === "complete") {
          // Save consultation before moving to summary
          try {
            await saveConsultation({
              abhaId,
              consultationData: {
                timestamp: new Date().toISOString(),
                transcript: data.transcript,
                llm: data.llm,
                history: history + `\nUser: ${data.transcript}\nAI: ${data.llm?.question ?? ""}`,
                turns: [...turns, { transcript: data.transcript, question: data.llm?.question }]
              }
            });
          } catch (saveErr) {
            console.error("Failed to save consultation:", saveErr);
            // Continue to summary even if save fails
          }
          setScreen(SCREENS.SUMMARY);
        }
      } catch (err) {
        console.error("process_audio failed:", err);
        setApiError(err.message || "Something went wrong.");
        setVoiceState("idle");
      }
    },
    [abhaId, history, turns]
  );

  const { recording, elapsedMs, permissionError, start, stop } = useVoiceRecorder({
    onStop: (blob) => {
      setPendingBlob(blob);
      submitRecording(blob);
    },
  });

  const handleStart = useCallback(() => {
    setApiError(null);
    setVoiceState("recording");
    start();
  }, [start]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleRetry = useCallback(() => {
    if (pendingBlob) submitRecording(pendingBlob);
  }, [pendingBlob, submitRecording]);

  function resetConsultation() {
    setScreen(SCREENS.WELCOME);
    setAbhaId("");
    setOtp("");
    setTranscript("");
    setLlm(null);
    setHistory("");
    setTurns([]);
    setApiError(null);
    setPendingBlob(null);
    setVoiceState("idle");
  }

  // Derive the effective recorder-visible voice state (recording hook drives
  // "recording" vs "idle"; API call drives "processing"/"speaking").
  const effectiveVoiceState = recording ? "recording" : voiceState;

  return (
    <>
      {screen === SCREENS.WELCOME && (
        <Welcome
          language={language}
          onToggleLanguage={toggleLanguage}
          onStart={() => setScreen(SCREENS.LOGIN)}
          onEmergency={openManualEmergency}
        />
      )}

      {screen === SCREENS.LOGIN && (
        <Login
          abhaId={abhaId}
          setAbhaId={setAbhaId}
          onBack={() => setScreen(SCREENS.WELCOME)}
          onContinue={() => setScreen(SCREENS.OTP)}
        />
      )}

      {screen === SCREENS.OTP && (
        <OTP
          abhaId={abhaId}
          otp={otp}
          setOtp={setOtp}
          onBack={() => setScreen(SCREENS.LOGIN)}
          onVerified={() => setScreen(SCREENS.DASHBOARD)}
        />
      )}

      {screen === SCREENS.DASHBOARD && (
        <Dashboard
          abhaId={abhaId}
          language={language}
          onToggleLanguage={toggleLanguage}
          onStartConsultation={() => setScreen(SCREENS.INTRO)}
          onViewHistory={() => setScreen(SCREENS.HISTORY)}
          onUploadDocuments={() => setScreen(SCREENS.UPLOAD)}
          onEmergency={openManualEmergency}
        />
      )}

      {screen === SCREENS.UPLOAD && (
        <UploadDocuments
          abhaId={abhaId}
          onBack={() => setScreen(SCREENS.DASHBOARD)}
          onComplete={() => setScreen(SCREENS.DASHBOARD)}
        />
      )}

      {screen === SCREENS.HISTORY && (
        <PatientHistory
          abhaId={abhaId}
          onBack={() => setScreen(SCREENS.DASHBOARD)}
        />
      )}

      {screen === SCREENS.INTRO && (
        <PatientIntro
          language={language}
          onToggleLanguage={toggleLanguage}
          onContinue={() => setScreen(SCREENS.CONSULTATION)}
        />
      )}

      {screen === SCREENS.CONSULTATION && (
        <Consultation
          abhaId={abhaId}
          turns={turns}
          currentQuestion={llm?.question || t("consultation.question")}
          language={language}
          onToggleLanguage={toggleLanguage}
          onEmergency={openManualEmergency}
          voiceState={effectiveVoiceState}
          elapsedMs={elapsedMs}
          onStart={handleStart}
          onStop={handleStop}
          permissionError={permissionError}
          apiError={apiError}
          onRetry={handleRetry}
        />
      )}

      {screen === SCREENS.SUMMARY && (
        <Summary
          abhaId={abhaId}
          turns={turns}
          notes={llm?.notes}
          onContinue={() => setScreen(SCREENS.REPORT)}
        />
      )}

      {screen === SCREENS.REPORT && (
        <Report
          abhaId={abhaId}
          llm={llm}
          transcript={transcript}
          turns={turns}
          onRestart={resetConsultation}
        />
      )}

      <EmergencyModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        triggeredByAI={emergencyFromAI}
      />
    </>
  );
}

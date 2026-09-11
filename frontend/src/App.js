import React, { useCallback, useState } from "react";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import PatientIntro from "./pages/PatientIntro";
import Consultation from "./pages/Consultation";
import Summary from "./pages/Summary";
import Report from "./pages/Report";

import EmergencyModal from "./components/emergency/EmergencyModal";
import useVoiceRecorder from "./hooks/useVoiceRecorder";
import { processAudio } from "./lib/api";

const SCREENS = {
  WELCOME: "WELCOME",
  LOGIN: "LOGIN",
  OTP: "OTP",
  INTRO: "INTRO",
  CONSULTATION: "CONSULTATION",
  SUMMARY: "SUMMARY",
  REPORT: "REPORT",
};

const DEFAULT_QUESTION = "Welcome! How can I help you today?";

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [language, setLanguage] = useState("en");

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

  const toggleLanguage = useCallback(() => {
    setLanguage((l) => (l === "en" ? "hi" : "en"));
  }, []);

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
          setScreen(SCREENS.SUMMARY);
        }
      } catch (err) {
        console.error("process_audio failed:", err);
        setApiError(err.message || "Something went wrong.");
        setVoiceState("idle");
      }
    },
    [abhaId, history]
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
          onVerified={() => setScreen(SCREENS.INTRO)}
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
          currentQuestion={llm?.question || DEFAULT_QUESTION}
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

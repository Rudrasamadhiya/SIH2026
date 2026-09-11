import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Encapsulates the exact same MediaRecorder behavior the original App.js
 * used (audio/webm blob), just organized as a reusable hook with elapsed
 * time tracking for the recording UI.
 */
export default function useVoiceRecorder({ onStop }) {
  const [recording, setRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [permissionError, setPermissionError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = useCallback(async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onStop?.(blob);
      };

      mediaRecorderRef.current.start();
      startTimeRef.current = Date.now();
      setElapsedMs(0);
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 200);
      setRecording(true);
    } catch (err) {
      setPermissionError(
        "We need microphone access to hear you. Please allow microphone permission and try again."
      );
    }
  }, [onStop]);

  const stop = useCallback(() => {
    setRecording(false);
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return { recording, elapsedMs, permissionError, start, stop };
}

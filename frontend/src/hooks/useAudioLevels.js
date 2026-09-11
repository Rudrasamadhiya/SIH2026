import { useCallback, useRef, useState } from "react";

const BAR_COUNT = 28;

/**
 * Drives a real, audio-reactive waveform (not a decorative CSS loop) off an
 * actual Web Audio AnalyserNode. Works with either a live MediaStream (the
 * mic while recording) or an <audio> element (the TTS playback while the
 * kiosk is speaking), so the same visual language represents both directions
 * of the conversation.
 */
export default function useAudioLevels() {
  const [levels, setLevels] = useState(() => new Array(BAR_COUNT).fill(0.05));
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const dataRef = useRef(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    try {
      sourceRef.current?.disconnect();
    } catch (e) {
      /* noop */
    }
    sourceRef.current = null;
    setLevels(new Array(BAR_COUNT).fill(0.05));
  }, []);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data) return;
    analyser.getByteFrequencyData(data);

    const bucketSize = Math.floor(data.length / BAR_COUNT) || 1;
    const next = new Array(BAR_COUNT);
    for (let i = 0; i < BAR_COUNT; i++) {
      let sum = 0;
      for (let j = 0; j < bucketSize; j++) {
        sum += data[i * bucketSize + j] || 0;
      }
      const avg = sum / bucketSize / 255; // 0..1
      // Slight curve so quiet speech still reads visually, min floor so
      // bars never fully flatten (feels alive rather than "broken").
      next[i] = Math.min(1, Math.max(0.06, Math.pow(avg, 0.7)));
    }
    setLevels(next);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startFromStream = useCallback(
    (stream) => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx || !stream) return;
      const audioCtx = ctxRef.current || new AudioCtx();
      ctxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  const startFromAudioElement = useCallback(
    (audioEl) => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx || !audioEl) return;
      try {
        const audioCtx = ctxRef.current || new AudioCtx();
        ctxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        const source = audioCtx.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyserRef.current = analyser;
        sourceRef.current = source;
        dataRef.current = new Uint8Array(analyser.frequencyBinCount);
        rafRef.current = requestAnimationFrame(tick);
      } catch (e) {
        // MediaElementSource can only be created once per element; if this
        // element was already wired up, just skip — playback still works,
        // we simply fall back to the ambient animation for that turn.
      }
    },
    [tick]
  );

  return { levels, startFromStream, startFromAudioElement, stop };
}
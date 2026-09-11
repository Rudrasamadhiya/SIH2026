let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone({ freq, start, duration, type = "sine", peakGain = 0.22 }) {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peakGain, start + 0.015);
  gain.gain.setValueAtTime(peakGain, start + duration - 0.03);
  gain.gain.linearRampToValueAtTime(0, start + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/**
 * Plays the international Morse pattern for SOS ( ... --- ... ) as short
 * high-pitched beeps — instantly recognizable as an emergency signal.
 * Returns a cancel() function; call it to stop a looping sequence early.
 */
export function playSOS({ loop = false, freq = 900 } = {}) {
  const audioCtx = getCtx();
  if (!audioCtx) return () => {};

  const dot = 0.11;
  const dash = dot * 3;
  const gap = dot;
  const letterGap = dot * 3;
  const pattern = [dot, dot, dot, dash, dash, dash, dot, dot, dot];

  let cancelled = false;
  let timeoutId = null;

  function playOnce(startAt) {
    let t = startAt;
    pattern.forEach((len) => {
      tone({ freq, start: t, duration: len, type: "square", peakGain: 0.18 });
      t += len + gap;
    });
    return t + letterGap;
  }

  function schedule() {
    if (cancelled) return;
    const audio2 = getCtx();
    const startAt = audio2.currentTime + 0.02;
    const endAt = playOnce(startAt);
    const totalMs = (endAt - startAt) * 1000;
    if (loop) {
      timeoutId = setTimeout(schedule, totalMs);
    }
  }

  schedule();

  return () => {
    cancelled = true;
    if (timeoutId) clearTimeout(timeoutId);
  };
}

/**
 * Two-tone emergency siren sweep (like an ambulance klaxon), used for the
 * red full-screen alert state. Returns a stop() function.
 */
export function playSiren({ durationMs = null } = {}) {
  const audioCtx = getCtx();
  if (!audioCtx) return () => {};

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sawtooth";
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.2);

  const now = audioCtx.currentTime;
  const sweep = 0.75; // seconds per up/down sweep
  let t = now;
  for (let i = 0; i < 40; i++) {
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(1050, t + sweep);
    osc.frequency.linearRampToValueAtTime(600, t + sweep * 2);
    t += sweep * 2;
  }

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);

  const stop = () => {
    try {
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      /* already stopped */
    }
  };

  if (durationMs) setTimeout(stop, durationMs);
  return stop;
}

/** A soft two-note ring, like a phone dial tone repeating. */
export function playRingTone({ loop = true } = {}) {
  let cancelled = false;
  let timeoutId = null;

  function ringOnce() {
    const audioCtx = getCtx();
    if (!audioCtx || cancelled) return;
    const start = audioCtx.currentTime + 0.02;
    tone({ freq: 480, start, duration: 0.4, type: "sine", peakGain: 0.15 });
    tone({ freq: 620, start: start + 0.45, duration: 0.4, type: "sine", peakGain: 0.15 });
    if (loop) timeoutId = setTimeout(ringOnce, 1800);
  }

  ringOnce();
  return () => {
    cancelled = true;
    if (timeoutId) clearTimeout(timeoutId);
  };
}

/** Tiny confirmation blip for lightweight UI feedback (tap, success, etc). */
export function playUiTone(kind = "tap") {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  if (kind === "success") {
    tone({ freq: 660, start: now, duration: 0.09, type: "sine", peakGain: 0.1 });
    tone({ freq: 880, start: now + 0.09, duration: 0.12, type: "sine", peakGain: 0.1 });
  } else {
    tone({ freq: 520, start: now, duration: 0.05, type: "sine", peakGain: 0.06 });
  }
}
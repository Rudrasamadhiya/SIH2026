
function pickVoice(lang) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const wantHi = lang === "hi";
  const match =
    voices.find((v) => v.lang?.toLowerCase().startsWith(wantHi ? "hi" : "en")) ||
    voices.find((v) => v.lang?.toLowerCase().includes(wantHi ? "in" : "us"));
  return match || voices[0];
}

export function speak(text, lang = "en", { onEnd, onStart } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd?.();
    return () => {};
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "hi" ? "hi-IN" : "en-US";
  utter.rate = 0.98;
  utter.pitch = 1.02;
  const voice = pickVoice(lang);
  if (voice) utter.voice = voice;

  utter.onstart = () => onStart?.();
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);

  return () => window.speechSynthesis.cancel();
}

export function cancelSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
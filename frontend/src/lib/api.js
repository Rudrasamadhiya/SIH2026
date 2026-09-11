// src/lib/api.js
//
// IMPORTANT: This preserves the EXISTING backend contract exactly.
// Endpoint: POST /process_audio
// Request (multipart/form-data): file, patient_history, history, model (optional)
// Response: { transcript: string, llm: {...}, tts_base64_wav: string }
//
// The base URL is now read from REACT_APP_API_BASE_URL so it can be configured
// per environment without touching code, but it defaults to the exact same
// Lightning AI cloudspace URL the original frontend was pointed at, so
// behavior is unchanged if no env var is set.

const DEFAULT_API_BASE_URL =
  "https://8000-01m13yme05xe5xcfzwss2cega0.cloudspaces.litng.ai";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;

/**
 * Sends a recorded audio blob to the existing /process_audio endpoint.
 * Field names and endpoint path are preserved exactly from the original
 * implementation — do not rename them without updating the backend.
 */
export async function processAudio({ blob, abhaId, history }) {
  const form = new FormData();
  form.append("file", blob, "speech.webm");
  form.append("patient_history", `ABHA ID: ${abhaId}`);
  form.append("history", history || "");

  const res = await fetch(`${API_BASE_URL}/process_audio`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}

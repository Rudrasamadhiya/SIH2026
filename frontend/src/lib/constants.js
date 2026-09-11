// The backend never commits to a fixed number of questions — the AI decides
// when it has enough information and sets status: "complete" itself (see
// prompt_template.py / app.py). So the UI must NOT hardcode a step count.
// STEP_ESTIMATE is only used as a soft visual reference (how full the
// progress dots *look*) — it is not a cap and consultations may run longer
// or shorter than it.
export const STEP_ESTIMATE = 6;
export const CONSULTATION_STEPS = 6; // For UI display purposes

export const PROCESSING_MESSAGES = [
  "Analyzing your response…",
  "Understanding your symptoms…",
  "Preparing the next question…",
  "Processing medical insights…",
];

// Toggle-able escape hatches for demos/pitches where walking through a full
// login + multi-turn voice interview isn't practical on stage. Every place
// this is used is clearly labeled "(demo)" in the UI and is safe to delete
// — search the codebase for DEV_SKIP_ENABLED to remove them before a real
// clinical deployment.
export const DEV_SKIP_ENABLED = true;
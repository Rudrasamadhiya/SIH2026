import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Header from "../components/navigation/Header";
import Button from "../components/ui/Button";
import PatientBadge from "../components/patient/PatientBadge";

/**
 * NOTE: The backend's LLM response only ever includes
 * { question, language, question_type, options, follow_up, emergency,
 *   status, notes } — there are no separate "symptoms" / "duration" /
 * "severity" fields. So this screen presents only what the API actually
 * returns (the running conversation + the model's own "notes" field)
 * rather than inventing structured fields the backend doesn't provide.
 */
export default function Summary({ abhaId, turns, notes, onContinue }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header status="Summary" showEmergency={false} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-6 py-12 text-center">
        <div className="animate-fade-slide-up">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft">
            <CheckCircle2 className="h-7 w-7 text-success" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Consultation Complete</h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Your responses have been recorded and are ready for review.
          </p>
          <div className="mt-3 flex justify-center">
            <PatientBadge abhaId={abhaId} />
          </div>
        </div>

        <div className="mt-8 w-full space-y-4 text-left animate-fade-slide-up">
          {turns.length > 0 && (
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-md">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Consultation Notes
              </h2>
              <ul className="mt-3 space-y-3">
                {turns.map((turn, i) => (
                  <li key={i} className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">You said: </span>
                    {turn.transcript}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {notes && (
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-md">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Clinical Observations
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{notes}</p>
            </section>
          )}
        </div>

        <div className="mt-8 w-full max-w-xs">
          <Button size="lg" fullWidth icon={ArrowRight} iconPosition="right" onClick={onContinue}>
            View Full Report
          </Button>
        </div>
      </main>
    </div>
  );
}

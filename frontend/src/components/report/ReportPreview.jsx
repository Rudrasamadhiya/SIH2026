import React from "react";
import { AlertTriangle, CheckCircle2, Stethoscope } from "lucide-react";

function Field({ label, value }) {
  return (
    <div className="py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="mt-1 text-[15px] leading-relaxed text-text-primary">{value}</dd>
    </div>
  );
}

export default function ReportPreview({ abhaId, dateTime, llm, transcript, emergency }) {
  const chiefComplaint = llm?.notes || "Not specified — the consultation ended before a chief complaint was fully captured.";

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-panel">
      {/* Document header, styled like a real clinical letterhead */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            MediKiosk · Clinical Summary Report
          </p>
          <p className="mt-0.5 text-sm text-text-secondary">{dateTime}</p>
        </div>
        {emergency ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-3 py-1 text-xs font-semibold text-danger">
            <AlertTriangle className="h-3.5 w-3.5" /> Flagged
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Routine
          </span>
        )}
      </div>

      <div className="px-6 py-2 sm:px-8">
        <dl className="divide-y divide-border">
          <Field label="Patient ID" value={`ABHA ${abhaId || "—"}`} />
          <Field label="Chief Complaint" value={chiefComplaint} />
          {transcript && <Field label="Most Recent Response" value={transcript} />}
          {llm?.question && <Field label="Last Question Asked" value={llm.question} />}
          <Field
            label="Recommended Next Step"
            value={
              emergency
                ? "Immediate in-person clinical review recommended."
                : "Routine physician review recommended before treatment decisions."
            }
          />
        </dl>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-6 py-4 text-xs text-text-muted sm:px-8">
        <Stethoscope className="h-4 w-4" aria-hidden="true" />
        Pending clinician review · Not a final diagnosis
      </div>
    </div>
  );
}

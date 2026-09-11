import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Stethoscope, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

function Field({ label, value }) {
  return (
    <div className="py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="mt-1 text-[15px] leading-relaxed text-text-primary">{value}</dd>
    </div>
  );
}

export default function ReportPreview({ abhaId, dateTime, llm, transcript, turns = [], emergency }) {
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  // Extract chief complaint from multiple sources
  const chiefComplaint = llm?.notes || 
    llm?.chief_complaint || 
    (turns.length > 0 ? turns[0]?.transcript : transcript) ||
    "Not specified — the consultation ended before a chief complaint was fully captured.";

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
          
          {/* Conversation History */}
          {turns && turns.length > 0 && (
            <div className="py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                Consultation Conversation ({turns.length} exchanges)
              </dt>
              <dd className="mt-2">
                <div className="space-y-3">
                  {turns.slice(0, showFullHistory ? turns.length : 2).map((turn, index) => (
                    <div key={index} className="rounded-lg bg-surface-muted p-3 border border-border/50">
                      {turn.question && (
                        <div className="mb-2">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-primary mb-1">AI Question {index + 1}:</p>
                              <p className="text-sm text-text-secondary">{turn.question}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {turn.transcript && (
                        <div className="pl-6">
                          <p className="text-xs font-semibold text-text-primary mb-1">Patient Response:</p>
                          <p className="text-sm text-text-primary bg-white rounded px-2 py-1 border border-border/30">
                            "{turn.transcript}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {turns.length > 2 && (
                    <button
                      onClick={() => setShowFullHistory(!showFullHistory)}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      {showFullHistory ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show All {turns.length} Exchanges
                        </>
                      )}
                    </button>
                  )}
                </div>
              </dd>
            </div>
          )}
          
          {transcript && !turns?.length && <Field label="Most Recent Response" value={transcript} />}
          {llm?.question && <Field label="Last Question Asked" value={llm.question} />}
          
          {/* SOCRATES Analysis if available */}
          {llm?.socrates_analysis && Object.keys(llm.socrates_analysis).length > 0 && (
            <div className="py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                SOCRATES Analysis
              </dt>
              <dd className="mt-2 space-y-1">
                {Object.entries(llm.socrates_analysis).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-text-primary capitalize">{key}:</span>{" "}
                    <span className="text-text-secondary">{value}</span>
                  </div>
                ))}
              </dd>
            </div>
          )}
          
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

import React from "react";
import { MessageSquare, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

/**
 * ConsultationSummary - Displays a formatted summary of a consultation
 * Used in Report pages and Timeline views
 */
export default function ConsultationSummary({ turns = [], llm = {}, compact = false }) {
  if (turns.length === 0) {
    return (
      <div className="text-center py-4 text-text-muted text-sm">
        No conversation data available
      </div>
    );
  }

  const isEmergency = llm?.emergency || false;
  const chiefComplaint = turns[0]?.transcript || "Not specified";

  if (compact) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-text-secondary">
              <span className="font-medium text-text-primary">Chief Complaint:</span>{" "}
              {chiefComplaint}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {turns.length} exchanges
          </span>
          {isEmergency && (
            <span className="flex items-center gap-1 text-danger">
              <AlertCircle className="h-3 w-3" />
              Emergency
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
          <MessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-900">{turns.length}</p>
          <p className="text-xs text-blue-700">Exchanges</p>
        </div>
        <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 text-center">
          <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-purple-900">
            ~{Math.max(3, turns.length * 2)}
          </p>
          <p className="text-xs text-purple-700">Minutes</p>
        </div>
        <div
          className={`rounded-lg border p-3 text-center ${
            isEmergency
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          {isEmergency ? (
            <AlertCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
          )}
          <p
            className={`text-lg font-bold ${
              isEmergency ? "text-red-900" : "text-green-900"
            }`}
          >
            {isEmergency ? "Alert" : "Normal"}
          </p>
          <p
            className={`text-xs ${
              isEmergency ? "text-red-700" : "text-green-700"
            }`}
          >
            Status
          </p>
        </div>
      </div>

      {/* Chief Complaint */}
      <div className="rounded-lg bg-surface-muted border border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
          Chief Complaint
        </p>
        <p className="text-sm text-text-primary">{chiefComplaint}</p>
      </div>

      {/* SOCRATES Analysis if available */}
      {llm?.socrates_analysis && Object.keys(llm.socrates_analysis).length > 0 && (
        <div className="rounded-lg bg-surface-muted border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
            SOCRATES Framework
          </p>
          <div className="space-y-1.5">
            {Object.entries(llm.socrates_analysis).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2 text-sm">
                <span className="font-medium text-text-primary capitalize min-w-[80px]">
                  {key}:
                </span>
                <span className="text-text-secondary">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Observations */}
      {llm?.impression && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-900 mb-2">
            AI Clinical Impression
          </p>
          <p className="text-sm text-blue-800">{llm.impression}</p>
        </div>
      )}
    </div>
  );
}

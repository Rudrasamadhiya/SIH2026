import React, { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import Header from "../components/navigation/Header";
import Button from "../components/ui/Button";
import ReportPreview from "../components/report/ReportPreview";
import MedicalTimeline from "../components/report/MedicalTimeline";
import Toast from "../components/ui/Toast";

export default function Report({ abhaId, llm, transcript, turns, onRestart }) {
  const [showLimitation, setShowLimitation] = useState(false);
  const dateTime = new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const timelineItems = [
    { label: "Consultation started", done: true },
    { label: "Symptoms recorded", done: turns.length > 0 },
    { label: "Follow-up questions", done: turns.length > 1 },
    { label: "Consultation completed", done: true },
  ];

  // NOTE: `report_generator.py` exists in the backend but is not wired into
  // any API route, so there is no real report-download endpoint to call.
  // Rather than fabricating one, this surfaces an honest, clearly-labeled
  // state instead of silently pretending a download happened.
  function handleDownload() {
    setShowLimitation(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header status="Report" showEmergency={false} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Clinical Report</h1>
          <p className="mt-1 text-sm text-text-secondary">
            A preview of your consultation summary, ready for clinician review.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="animate-fade-slide-up">
            <ReportPreview
              abhaId={abhaId}
              dateTime={dateTime}
              llm={llm}
              transcript={transcript}
              emergency={llm?.emergency}
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button icon={Download} onClick={handleDownload} fullWidth>
                Download Report
              </Button>
              <Button variant="secondary" icon={RotateCcw} onClick={onRestart} fullWidth>
                Start New Consultation
              </Button>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-surface-muted p-5 shadow-soft animate-fade-slide-up">
            <h2 className="mb-1 text-sm font-semibold text-text-primary">Medical Timeline</h2>
            <div className="mt-4">
              <MedicalTimeline items={timelineItems} />
            </div>
          </aside>
        </div>
      </main>

      {showLimitation && (
        <Toast
          message="Report download isn't connected to a backend endpoint yet."
          tone="info"
          onDismiss={() => setShowLimitation(false)}
        />
      )}
    </div>
  );
}

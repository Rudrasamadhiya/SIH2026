import React, { useEffect, useState } from "react";
import {
  Download,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Activity,
} from "lucide-react";
import Header from "../components/navigation/Header";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import { generateReport, getPatientTimeline } from "../lib/api";

export default function ConsultationReport({ abhaId, recordId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [consultation, setConsultation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsultation();
  }, [abhaId, recordId]);

  const fetchConsultation = async () => {
    setLoading(true);
    try {
      const data = await getPatientTimeline(abhaId);
      // Find the specific consultation by recordId or get the latest
      const record = recordId
        ? data.timeline?.find((item) => item.id === recordId)
        : data.timeline?.find((item) => item.type === "AI Consultation");

      if (record) {
        setConsultation(record);
      } else {
        setError("Consultation not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp.seconds * 1000 || timestamp);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleDownload = async () => {
    if (!consultation) return;

    setDownloading(true);
    try {
      const patientInfo = {
        name: `ABHA: ${abhaId}`,
        age_gender: "Not Provided",
        kiosk_id: "KIOSK-001",
      };

      const turns = consultation.data?.turns || [];
      const conversationHistory = turns
        .map((turn, i) => `Q${i + 1}: ${turn.question}\nA${i + 1}: ${turn.transcript}`)
        .join("\n\n");

      const llm = consultation.data?.llm || {};
      const aiSummary = {
        chief_complaint:
          llm.chief_complaint ||
          (turns.length > 0 ? turns[0].transcript : "") ||
          "Not specified",
        socrates_analysis: llm.socrates_analysis || {},
        ayush_notes: llm.ayush_notes || {},
        impression: llm.impression || "Consultation completed",
        emergency_flag: llm.emergency || false,
      };

      const blob = await generateReport({
        abhaId,
        patientInfo,
        conversationHistory,
        aiSummary,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `consultation_report_${abhaId}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header status="Consultation Report" showEmergency={false} />
        <div className="flex items-center justify-center py-20">
          <LoadingState message="Loading consultation report..." />
        </div>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header status="Consultation Report" showEmergency={false} />
        <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
          <Card className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-danger mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {error || "Consultation Not Found"}
            </h3>
            <Button variant="secondary" onClick={onBack} className="mt-4">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const turns = consultation.data?.turns || [];
  const llm = consultation.data?.llm || {};
  const isEmergency = llm.emergency || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header status="Consultation Report" showEmergency={false} />

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between animate-fade-slide-up">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-secondary transition-all hover:border-primary hover:text-primary hover:bg-primary-soft"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Consultation Report
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {formatDate(consultation.timestamp)}
              </p>
            </div>
          </div>
          <Button
            icon={Download}
            onClick={handleDownload}
            loading={downloading}
            className="btn-hover-lift"
          >
            {downloading ? "Generating..." : "Download Report"}
          </Button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Responses</p>
                <p className="text-2xl font-bold">{turns.length}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Duration</p>
                <p className="text-2xl font-bold">~{Math.max(3, turns.length * 2)} min</p>
              </div>
            </div>
          </Card>
          <Card
            className={`bg-gradient-to-br ${
              isEmergency ? "from-red-500 to-red-600" : "from-emerald-500 to-emerald-600"
            } text-white border-0`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                {isEmergency ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-sm opacity-90">Status</p>
                <p className="text-2xl font-bold">{isEmergency ? "Alert" : "Normal"}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Consultation Details */}
        <Card
          className="mb-6 animate-fade-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Consultation Details
            </h2>
            {isEmergency && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-3 py-1.5 text-xs font-semibold text-danger">
                <AlertTriangle className="h-3.5 w-3.5" />
                Emergency Flagged
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">
                Patient ID
              </p>
              <p className="text-sm text-text-primary">ABHA {abhaId}</p>
            </div>

            {turns.length > 0 && turns[0].transcript && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">
                  Chief Complaint
                </p>
                <p className="text-sm text-text-primary">{turns[0].transcript}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Conversation History */}
        {turns.length > 0 && (
          <Card
            className="animate-fade-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Conversation History ({turns.length} exchanges)
            </h2>
            <div className="space-y-4">
              {turns.map((turn, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-surface-muted p-4 border border-border/50"
                >
                  {turn.question && (
                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-primary mb-1">
                            AI Question {index + 1}:
                          </p>
                          <p className="text-sm text-text-secondary">{turn.question}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {turn.transcript && (
                    <div className="pl-6">
                      <p className="text-xs font-semibold text-text-primary mb-1">
                        Patient Response:
                      </p>
                      <p className="text-sm text-text-primary bg-white rounded px-3 py-2 border border-border/30">
                        "{turn.transcript}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Pill,
  Activity,
  AlertCircle,
  Download,
  Eye,
  Loader2,
  Clock,
  CheckCircle2,
  Filter,
  RefreshCw,
} from "lucide-react";
import Header from "../components/navigation/Header";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import { getPatientTimeline } from "../lib/api";

export default function PatientHistory({ abhaId, onBack }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, consultation, prescription

  useEffect(() => {
    fetchTimeline();
  }, [abhaId]);

  const fetchTimeline = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatientTimeline(abhaId);
      setTimeline(data.timeline || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRecordIcon = (type) => {
    if (type?.includes("Prescription")) return Pill;
    if (type?.includes("Report")) return FileText;
    if (type?.includes("Consultation")) return Activity;
    return FileText;
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setViewModalOpen(true);
  };

  const filteredTimeline = timeline.filter((record) => {
    if (filterType === "all") return true;
    if (filterType === "consultation") return record.type === "AI Consultation";
    if (filterType === "prescription") return record.type === "Prescription Extraction";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header status="Medical History" showEmergency={false} />
        <div className="flex items-center justify-center py-20">
          <LoadingState message="Loading your medical history..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header status="Medical History" showEmergency={false} />

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-slide-up">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-secondary transition-all hover:border-primary hover:text-primary hover:bg-primary-soft"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Medical History</h1>
              <p className="text-sm text-text-secondary mt-1">Your complete health timeline</p>
            </div>
          </div>
          
          {/* Filter & Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTimeline}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-medium text-text-secondary transition-all hover:border-primary hover:text-primary hover:bg-primary-soft disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="inline-flex rounded-lg border border-border bg-white p-1">
              <button
                onClick={() => setFilterType("all")}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                  filterType === "all"
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("consultation")}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                  filterType === "consultation"
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                Consultations
              </button>
              <button
                onClick={() => setFilterType("prescription")}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                  filterType === "prescription"
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                Prescriptions
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-slide-up" style={{ animationDelay: "100ms" }}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Records</p>
                <p className="text-3xl font-bold mt-1">{timeline.length}</p>
              </div>
              <FileText className="h-10 w-10 opacity-50" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Consultations</p>
                <p className="text-3xl font-bold mt-1">
                  {timeline.filter((r) => r.type === "AI Consultation").length}
                </p>
              </div>
              <Activity className="h-10 w-10 opacity-50" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Prescriptions</p>
                <p className="text-3xl font-bold mt-1">
                  {timeline.filter((r) => r.type === "Prescription Extraction").length}
                </p>
              </div>
              <Pill className="h-10 w-10 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-danger/20 bg-danger-soft animate-bounce-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-danger">Failed to load timeline</p>
                <p className="text-sm text-text-secondary mt-1">{error}</p>
                <Button variant="secondary" size="sm" onClick={fetchTimeline} className="mt-3">
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!error && timeline.length === 0 && (
          <Card className="text-center py-12 animate-fade-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-text-muted">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Records Yet</h3>
            <p className="text-sm text-text-secondary mb-4">
              Start by uploading your medical documents or completing a consultation.
            </p>
          </Card>
        )}
        
        {/* Filtered Empty State */}
        {!error && timeline.length > 0 && filteredTimeline.length === 0 && (
          <Card className="text-center py-12 animate-fade-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-text-muted">
              <Filter className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No {filterType === "consultation" ? "Consultations" : "Prescriptions"} Found</h3>
            <p className="text-sm text-text-secondary mb-4">
              Try selecting a different filter or add new records.
            </p>
            <Button variant="secondary" size="sm" onClick={() => setFilterType("all")}>
              Show All Records
            </Button>
          </Card>
        )}

        {/* Timeline */}
        {filteredTimeline.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-secondary">
                Showing {filteredTimeline.length} of {timeline.length} records
              </p>
            </div>
            {filteredTimeline.map((record, index) => {
              const IconComponent = getRecordIcon(record.type);
              return (
                <div
                  key={index}
                  className="group relative pl-8 animate-fade-slide-up"
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  {/* Timeline Line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-[15px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
                  )}

                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform">
                    <IconComponent className="h-4 w-4" />
                  </div>

                  {/* Content Card */}
                  <Card className="card-interactive">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                            <CheckCircle2 className="h-3 w-3" />
                            {record.type || "Medical Record"}
                          </span>
                          <span className="text-xs text-text-muted">
                            {formatDate(record.timestamp)}
                          </span>
                        </div>

                        {/* Display consultation data */}
                        {record.type === "AI Consultation" && record.data && (
                          <div className="space-y-2 text-sm">
                            {record.data.turns && record.data.turns.length > 0 && (
                              <>
                                <p className="text-text-secondary">
                                  <span className="font-medium text-text-primary">Consultation Type:</span>{" "}
                                  Voice-based AI Interview
                                </p>
                                <p className="text-text-secondary">
                                  <span className="font-medium text-text-primary">Questions Answered:</span>{" "}
                                  {record.data.turns.length} exchanges
                                </p>
                                {record.data.turns[0]?.transcript && (
                                  <p className="text-text-secondary">
                                    <span className="font-medium text-text-primary">First Response:</span>{" "}
                                    {record.data.turns[0].transcript.substring(0, 80)}
                                    {record.data.turns[0].transcript.length > 80 ? "..." : ""}
                                  </p>
                                )}
                                {record.data.llm?.emergency && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2 py-1 text-xs font-semibold text-danger">
                                    <AlertCircle className="h-3 w-3" />
                                    Emergency Flagged
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        )}

                        {/* Display prescription extraction data */}
                        {record.type === "Prescription Extraction" && record.data && (
                          <div className="space-y-2 text-sm">
                            {record.data.patient_name && (
                              <p className="text-text-secondary">
                                <span className="font-medium text-text-primary">Patient:</span>{" "}
                                {record.data.patient_name}
                              </p>
                            )}
                            {record.data.medications && record.data.medications.length > 0 && (
                              <p className="text-text-secondary">
                                <span className="font-medium text-text-primary">Medications:</span>{" "}
                                {record.data.medications.slice(0, 2).join(", ")}
                                {record.data.medications.length > 2 && ` +${record.data.medications.length - 2} more`}
                              </p>
                            )}
                            {record.data.diagnoses && record.data.diagnoses.length > 0 && (
                              <p className="text-text-secondary">
                                <span className="font-medium text-text-primary">Diagnosis:</span>{" "}
                                {record.data.diagnoses.slice(0, 2).join(", ")}
                              </p>
                            )}
                            {record.data.doctor_name && (
                              <p className="text-text-secondary">
                                <span className="font-medium text-text-primary">Prescribed by:</span>{" "}
                                {record.data.doctor_name}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(record)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-medium text-text-secondary transition-all hover:border-primary hover:text-primary hover:bg-primary-soft"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* View Modal */}
      {viewModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in flex flex-col">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedRecord.type || "Medical Record"}
                </h3>
                <p className="text-sm opacity-90 mt-0.5">
                  {formatDate(selectedRecord.timestamp)}
                </p>
              </div>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {/* Consultation View */}
              {selectedRecord.type === "AI Consultation" && selectedRecord.data?.turns && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Consultation Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Total Exchanges:</span> {selectedRecord.data.turns.length}</p>
                      {selectedRecord.data.llm?.emergency && (
                        <p className="text-danger font-medium flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Emergency Flag: YES
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-text-primary">Conversation History</h4>
                    {selectedRecord.data.turns.map((turn, idx) => (
                      <div key={idx} className="rounded-lg bg-surface-muted p-4 border border-border">
                        {turn.question && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-primary mb-1">AI Question {idx + 1}:</p>
                            <p className="text-sm text-text-primary">{turn.question}</p>
                          </div>
                        )}
                        {turn.transcript && (
                          <div>
                            <p className="text-xs font-semibold text-text-primary mb-1">Patient Response:</p>
                            <p className="text-sm text-text-secondary bg-white rounded px-3 py-2 border border-border/50">
                              "{turn.transcript}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Prescription View */}
              {selectedRecord.type === "Prescription Extraction" && (
                <div className="space-y-4">
                  {selectedRecord.data?.patient_name && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Patient Information</h4>
                      <p className="text-sm">{selectedRecord.data.patient_name}</p>
                    </div>
                  )}
                  
                  {selectedRecord.data?.medications && selectedRecord.data.medications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Medications</h4>
                      <ul className="space-y-2">
                        {selectedRecord.data.medications.map((med, idx) => (
                          <li key={idx} className="bg-surface-muted rounded-lg px-4 py-2 text-sm">
                            {med}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedRecord.data?.diagnoses && selectedRecord.data.diagnoses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Diagnoses</h4>
                      <ul className="space-y-2">
                        {selectedRecord.data.diagnoses.map((diag, idx) => (
                          <li key={idx} className="bg-surface-muted rounded-lg px-4 py-2 text-sm">
                            {diag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">Raw Data</h4>
                    <pre className="whitespace-pre-wrap text-xs bg-surface-muted rounded-lg p-4 border border-border overflow-auto">
                      {JSON.stringify(selectedRecord.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* Fallback for other types */}
              {selectedRecord.type !== "AI Consultation" && selectedRecord.type !== "Prescription Extraction" && (
                <pre className="whitespace-pre-wrap text-sm bg-surface-muted rounded-lg p-4 border border-border overflow-auto">
                  {JSON.stringify(selectedRecord.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

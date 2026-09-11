import { useState, useEffect } from "react";
import { Download, RotateCcw, FileText, CheckCircle2, Clock, AlertTriangle, Loader2 } from "lucide-react";
import Header from "../components/navigation/Header";
import Button from "../components/ui/Button";
import ReportPreview from "../components/report/ReportPreview";
import MedicalTimeline from "../components/report/MedicalTimeline";
import Toast from "../components/ui/Toast";
import Card from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import { generateReport, getPatientTimeline } from "../lib/api";

export default function Report({ abhaId, llm, transcript, turns, onRestart }) {
  const [showLimitation, setShowLimitation] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [currentConsultation, setCurrentConsultation] = useState(null);
  
  const dateTime = new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Fetch patient timeline data from Firebase
  useEffect(() => {
    fetchMedicalHistory();
  }, [abhaId]);

  const fetchMedicalHistory = async () => {
    setLoading(true);
    try {
      const data = await getPatientTimeline(abhaId);
      setMedicalHistory(data.timeline || []);
      
      // Find the most recent consultation (if current data not passed from props)
      if (!turns || turns.length === 0) {
        const latestConsultation = data.timeline?.find(item => item.type === "AI Consultation");
        if (latestConsultation) {
          setCurrentConsultation(latestConsultation);
        }
      }
    } catch (error) {
      console.error("Failed to fetch medical history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use Firebase data if no props data available
  const consultationTurns = turns && turns.length > 0 
    ? turns 
    : currentConsultation?.data?.turns || [];
  
  const consultationLlm = llm || currentConsultation?.data?.llm || null;
  const consultationTranscript = transcript || currentConsultation?.data?.transcript || "";
  const consultationHistory = currentConsultation?.data?.history || "";

  const timelineItems = [
    { label: "Consultation started", done: true },
    { label: "Symptoms recorded", done: consultationTurns.length > 0 },
    { label: "Follow-up questions", done: consultationTurns.length > 1 },
    { label: "Consultation completed", done: true },
  ];

  async function handleDownload() {
    setDownloading(true);
    try {
      const patientInfo = {
        name: `ABHA: ${abhaId}`,
        age_gender: "Not Provided",
        kiosk_id: "KIOSK-001"
      };

      const conversationHistory = consultationTurns.map((turn, i) => 
        `Q${i+1}: ${turn.question}\nA${i+1}: ${turn.transcript}`
      ).join("\n\n");

      const aiSummary = {
        chief_complaint: consultationLlm?.chief_complaint || consultationTranscript || "Not specified",
        socrates_analysis: consultationLlm?.socrates_analysis || {},
        ayush_notes: consultationLlm?.ayush_notes || {},
        impression: consultationLlm?.impression || "Consultation completed",
        emergency_flag: consultationLlm?.emergency || false
      };

      const blob = await generateReport({
        abhaId,
        patientInfo,
        conversationHistory,
        aiSummary
      });

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical_report_${abhaId}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      setShowLimitation(true);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header status="Report" showEmergency={false} />
        <div className="flex items-center justify-center py-20">
          <LoadingState message="Loading your medical report..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header status="Report" showEmergency={false} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-4 py-2 text-sm font-medium text-success mb-4">
            <CheckCircle2 className="h-4 w-4" />
            Consultation Complete
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Clinical Summary Report</h1>
          <p className="text-[15px] text-text-secondary">
            Your consultation has been documented and is ready for medical review
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Responses</p>
              <p className="text-2xl font-bold">{consultationTurns.length}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Duration</p>
              <p className="text-2xl font-bold">~{Math.max(3, consultationTurns.length * 2)} min</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              {consultationLlm?.emergency ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-sm opacity-90">Status</p>
              <p className="text-2xl font-bold">{consultationLlm?.emergency ? "Alert" : "Normal"}</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
            <ReportPreview
              abhaId={abhaId}
              dateTime={currentConsultation?.timestamp ? new Date(currentConsultation.timestamp.seconds * 1000 || currentConsultation.timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : dateTime}
              llm={consultationLlm}
              transcript={consultationTranscript}
              turns={consultationTurns}
              emergency={consultationLlm?.emergency}
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button 
                icon={Download} 
                onClick={handleDownload} 
                fullWidth
                loading={downloading}
                className="btn-hover-lift"
              >
                {downloading ? "Generating..." : "Download Report"}
              </Button>
              <Button 
                variant="secondary" 
                icon={RotateCcw} 
                onClick={onRestart} 
                fullWidth
                className="btn-hover-lift"
                disabled={downloading}
              >
                New Consultation
              </Button>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="animate-fade-slide-up" style={{ animationDelay: '300ms' }}>
              <h2 className="mb-1 text-sm font-semibold text-text-primary flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Consultation Timeline
              </h2>
              <div className="mt-4">
                <MedicalTimeline items={timelineItems} />
              </div>
            </Card>

            {/* Medical History Summary */}
            {medicalHistory.length > 0 && (
              <Card className="animate-fade-slide-up" style={{ animationDelay: '350ms' }}>
                <h2 className="mb-3 text-sm font-semibold text-text-primary flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Medical History ({medicalHistory.length} records)
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {medicalHistory.slice(0, 5).map((record, index) => {
                    const recordDate = record.timestamp?.toDate 
                      ? record.timestamp.toDate() 
                      : new Date(record.timestamp?.seconds * 1000 || record.timestamp);
                    
                    return (
                      <div key={index} className="rounded-lg bg-surface-muted p-3 text-sm border border-border/50">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-medium text-text-primary text-xs">
                            {record.type || "Medical Record"}
                          </span>
                          <span className="text-xs text-text-muted whitespace-nowrap">
                            {recordDate.toLocaleDateString()}
                          </span>
                        </div>
                        {record.data?.diagnoses && record.data.diagnoses.length > 0 && (
                          <p className="text-xs text-text-secondary">
                            {record.data.diagnoses[0]}
                          </p>
                        )}
                        {record.data?.medications && record.data.medications.length > 0 && (
                          <p className="text-xs text-text-muted mt-1">
                            {record.data.medications.length} medication(s)
                          </p>
                        )}
                        {record.data?.turns && record.data.turns.length > 0 && (
                          <p className="text-xs text-text-muted">
                            {record.data.turns.length} Q&A turns
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Next Steps
              </h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Share this report with your doctor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Schedule follow-up if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Keep tracking your symptoms</span>
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </main>

      {showLimitation && (
        <Toast
          message="Failed to download report. Please try again or contact support."
          tone="error"
          onDismiss={() => setShowLimitation(false)}
        />
      )}
    </div>
  );
}

import React, { useState, useRef } from "react";

// --- THEME COLORS ---
const COLORS = {
  primary: "#0056b3",    // Deep Medical Blue
  secondary: "#eef6ff",  // Soft Blue-White
  white: "#ffffff",
  accent: "#d32f2f",     // Emergency Red
  text: "#333333",
  gray: "#888888"
};

export default function App() {
  // --- STATE MANAGEMENT ---
  const [screen, setScreen] = useState("LOGIN"); // LOGIN, DASHBOARD, REPORT, PROFILE
  const [step, setStep] = useState(1); // 1: ABHA ID, 2: OTP
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [profileData, setProfileData] = useState([]);
  
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [llm, setLlm] = useState(null);
  const [history, setHistory] = useState("");
  const [emergencyMode, setEmergencyMode] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Replace this with your actual URL: https://8000-xxxx.cloudspaces.litng.ai
  const BACKEND_URL = "https://8000-01m13yme05xe5xcfzwss2cega0.cloudspaces.litng.ai/";

  const styles = {
    container: {
      backgroundColor: COLORS.secondary,
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: COLORS.text,
      display: "flex",
      flexDirection: "column",
      position: "relative"
    },
    header: {
      textAlign: "center",
      padding: "20px",
      color: COLORS.primary,
      fontSize: "28px",
      fontWeight: "bold",
      letterSpacing: "1px"
    },
    panel: {
      backgroundColor: COLORS.white,
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      width: "400px",
      maxWidth: "90%",
      alignSelf: "center",
      textAlign: "center",
      marginTop: "auto",
      marginBottom: "auto"
    },
    input: {
      width: "100%",
      padding: "15px",
      margin: "10px 0",
      borderRadius: "10px",
      border: `1px solid ${COLORS.primary}`,
      fontSize: "16px",
      boxSizing: "border-box"
    },
    button: {
      backgroundColor: COLORS.primary,
      color: "white",
      padding: "15px 30px",
      borderRadius: "10px",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
      fontWeight: "600",
      width: "100%",
      transition: "opacity 0.2s"
    },
    emergencyBtn: {
      position: "absolute",
      top: "20px",
      right: "20px",
      backgroundColor: COLORS.accent,
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
      zIndex: 10
    },
    topRightNav: {
      position: "absolute",
      top: "20px",
      right: "130px",
      display: "flex",
      gap: "15px",
      alignItems: "center",
      zIndex: 10
    },
    micBtn: {
      position: "fixed",
      bottom: "40px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: recording ? COLORS.accent : COLORS.primary,
      color: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "30px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
    },
    chatBox: {
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      width: "100%",
      display: "flex",
      flexDirection: "column"
    },
    bubbleUser: {
      backgroundColor: COLORS.primary,
      color: "white",
      padding: "12px 18px",
      borderRadius: "15px 15px 0px 15px",
      margin: "10px 0",
      maxWidth: "70%",
      alignSelf: "flex-end",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      textAlign: "right"
    },
    bubbleAi: {
      backgroundColor: COLORS.white,
      color: COLORS.text,
      padding: "12px 18px",
      borderRadius: "15px 15px 15px 0px",
      margin: "10px 0",
      maxWidth: "70%",
      alignSelf: "flex-start",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      textAlign: "left",
      border: `1px solid ${COLORS.secondary}`
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    },
    timelineItem: {
      borderLeft: `3px solid ${COLORS.primary}`,
      paddingLeft: "15px",
      marginBottom: "20px",
      position: "relative",
      textAlign: "left"
    }
  };

  // --- LOGIC FUNCTIONS ---

  async function handleLogin() {
    if (step === 1) setStep(2);
    else setScreen("DASHBOARD");
  }

  async function fetchProfile() {
    setScreen("PROFILE");
    try {
      const res = await fetch(`${BACKEND_URL}/patient_timeline?abha_id=${abhaId}`);
      const data = await res.json();
      setProfileData(data.timeline || []);
    } catch (e) {
      console.error("Timeline error:", e);
    }
  }

  async function uploadDoc(e) {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("abha_id", abhaId);

    try {
      const res = await fetch(`${BACKEND_URL}/upload_prescription`, { method: "POST", body: form });
      const data = await res.json();
      alert(data.status === "success" ? "Document Added to Timeline!" : "Error: " + data.error);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setIsUploadOpen(false);
    }
  }

  async function startRecord() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorderRef.current.onstop = onStop;
    mediaRecorderRef.current.start();
    setRecording(true);
  }

  async function stopRecord() {
    setRecording(false);
    mediaRecorderRef.current.stop();
  }

  async function onStop() {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const form = new FormData();
    form.append("file", blob, "speech.webm");
    form.append("patient_history", `ABHA ID: ${abhaId}`);
    form.append("history", history);

    try {
      const res = await fetch(`${BACKEND_URL}/process_audio`, { method: "POST", body: form });
      const data = await res.json();
      
      setTranscript(data.transcript);
      setLlm(data.llm);
      setHistory(prev => prev + `\nUser: ${data.transcript}\nAI: ${data.llm.question}`);

      if (data.llm.status === "complete") {
        setScreen("REPORT");
      }

      if (data.emergency_alert) {
        setEmergencyMode(true);
        const siren = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"); 
        siren.loop = true;
        siren.play();
        alert(data.emergency_alert.message);
      }

      if (data.tts_base64_wav) {
        const audio = new Audio("data:audio/wav;base64," + data.tts_base64_wav);
        audio.play();
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>MEDIKIOSK</div>
      
      {/* Emergency Button */}
      <button style={styles.emergencyBtn} onClick={() => {
        setEmergencyMode(!emergencyMode);
        if(!emergencyMode) alert("Emergency Staff Notified!");
      }}>
        {emergencyMode ? "🛑 STOP ALARM" : "🚨 EMERGENCY"}
      </button>

      {/* Navigation Icons (Only on Dashboard) */}
      {screen === "DASHBOARD" && (
        <div style={styles.topRightNav}>
          <button style={{cursor: "pointer", border: "none", background: "none", fontSize: "16px", color: COLORS.primary, fontWeight: "bold"}} onClick={() => setIsUploadOpen(true)}>📁 Upload Doc</button>
          <div style={{cursor: "pointer", fontSize: "24px"}} onClick={fetchProfile}>👤</div>
        </div>
      )}

      {/* SCREEN 1: LOGIN */}
      {screen === "LOGIN" && (
        <div style={styles.panel}>
          <h3 style={{color: COLORS.primary}}>Welcome</h3>
          <p style={{color: COLORS.gray}}>Please enter your details</p>
          <input 
            style={styles.input} 
            placeholder="Enter ABHA ID" 
            value={abhaId} 
            onChange={(e) => setAbhaId(e.target.value)} 
          />
          {step === 2 && (
            <input 
              style={styles.input} 
              placeholder="Enter 4-digit OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
            />
          )}
          <button style={styles.button} onClick={handleLogin}>
            {step === 1 ? "Next" : "Login"}
          </button>
        </div>
      )}

      {/* SCREEN 2: DASHBOARD */}
      {screen === "DASHBOARD" && (
        <>
          <div style={styles.chatBox}>
             <div style={{ display: "flex", flexDirection: "column" }}>
               <div style={styles.bubbleAi}>Welcome! How can I help you today?</div>
               {transcript && <div style={styles.bubbleUser}>{transcript}</div>}
               {llm && <div style={styles.bubbleAi}>{llm.question}</div>}
             </div>
          </div>
          <button style={styles.micBtn} onClick={recording ? stopRecord : startRecord}>
            {recording ? "🛑" : "🎤"}
          </button>
        </>
      )}

      {/* SCREEN 3: PROFILE / TIMELINE */}
      {screen === "PROFILE" && (
        <div style={{...styles.panel, width: "600px", textAlign: "left", marginTop: "50px"}}>
          <button style={{float: "right", cursor: "pointer", border: "none", background: "none", color: COLORS.primary}} onClick={() => setScreen("DASHBOARD")}>← Back to Chat</button>
          <h3 style={{color: COLORS.primary}}>Patient Profile: {abhaId}</h3>
          <hr style={{borderColor: COLORS.secondary}} />
          <h4 style={{marginTop: "20px"}}>Medical Timeline</h4>
          <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "10px" }}>
            {profileData.length > 0 ? profileData.map((item, i) => (
              <div key={i} style={styles.timelineItem}>
                <strong style={{color: COLORS.primary}}>{new Date(item.timestamp).toLocaleDateString()}</strong>
                <p style={{margin: "5px 0"}}>{item.data.diagnosed_disease || "General Consultation"}</p>
                <small style={{color: COLORS.gray}}>{item.data.doctor_name || "Unknown Doctor"}</small>
              </div>
            )) : <p style={{color: COLORS.gray}}>No previous medical history found in database.</p>}
          </div>
        </div>
      )}

      {/* SCREEN 4: REPORT */}
      {screen === "REPORT" && (
        <div style={{ display: "flex", padding: "40px", gap: "20px", justifyContent: "center" }}>
          <div style={{...styles.panel, width: "60%", textAlign: "left", marginTop: 0}}>
            <h3 style={{color: COLORS.primary}}>Consultation Summary</h3>
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "15px", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
               <p><strong>Patient ID:</strong> {abhaId}</p>
               <p><strong>Chief Complaint:</strong> {llm?.notes || "Consultation completed."}</p>
               <p><strong>Recommendation:</strong> Please download the full PDF/Word report for clinical details.</p>
            </div>
            <button style={styles.button} onClick={() => {
              const link = document.createElement('a');
              link.href = `YOUR_BACKEND_URL/download_report?abha_id=${abhaId}`; // You can implement this specific endpoint or use the existing logic
              link.download = "Medical_Report.docx";
              link.click();
            }}>
              Download Full Report
            </button>
            <button style={{...styles.button, marginTop: "10px", backgroundColor: COLORS.gray}} onClick={() => setScreen("DASHBOARD")}>
              New Session
            </button>
          </div>
        </div>
      )}

      {/* EMERGENCY OVERLAY */}
      {emergencyMode && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(211, 47, 47, 0.9)", color: "white", 
          display: "flex", justifyContent: "center", alignItems: "center", 
          fontSize: "32px", fontWeight: "bold", textAlign: "center", zIndex: 2000,
          animation: "blink 1s infinite"
        }}>
          <div>🚨 EMERGENCY DETECTED <br/> PLEASE REMAIN AT THE KIOSK <br/> MEDICAL STAFF IS ON THE WAY</div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.panel}>
            <h3 style={{color: COLORS.primary}}>Digitalize Record</h3>
            <p style={{color: COLORS.gray}}>Upload a photo of your prescription</p>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const form = new FormData();
              form.append("file", file);
              form.append("abha_id", abhaId);
              fetch(`${BACKEND_URL}/upload_prescription`, { method: "POST", body: form })
                .then(res => res.json())
                .then(data => {
                  alert(data.status === "success" ? "Record added to timeline!" : "Error: " + data.error);
                  setIsUploadOpen(false);
                });
            }} style={{margin: "20px 0"}} />
            <button style={styles.button} onClick={() => setIsUploadOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}
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
  const [screen, setScreen] = useState("LOGIN"); // LOGIN, DASHBOARD, REPORT
  const [step, setStep] = useState(1); // For Login: 1 (ABHA ID), 2 (OTP)
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("");
  
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [llm, setLlm] = useState(null);
  const [history, setHistory] = useState("");
  const [emergencyMode, setEmergencyMode] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // --- UI HELPERS ---
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
      cursor: "pointer"
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
      width: "100%"
    },
        chatBubbleUser: {
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
    chatBubbleAi: {
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
  };

  // --- LOGIC FUNCTIONS ---
  async function handleLogin() {
    if (step === 1) setStep(2);
    else setScreen("DASHBOARD");
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
      const res = await fetch("https://8000-01m13yme05xe5xcfzwss2cega0.cloudspaces.litng.ai/process_audio", { method: "POST", body: form });
      const data = await res.json();
      
      setTranscript(data.transcript);
      setLlm(data.llm);
      setHistory(prev => prev + `\nUser: ${data.transcript}\nAI: ${data.llm.question}`);

      if (data.llm.status === "complete") {
        setScreen("REPORT");
      }

      if (data.tts_base64_wav) {
        const audio = new Audio("data:audio/wav;base64," + data.tts_base64_wav);
        audio.play();
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  // --- SCREEN RENDERING ---
  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>MEDIKIOSK</div>
      
      {/* Emergency Button (Always Visible) */}
      <button style={styles.emergencyBtn} onClick={() => alert("Emergency Staff Notified!")}>
        🚨 EMERGENCY
      </button>

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
          <div style={{ position: "absolute", top: "20px", right: "120px", cursor: "pointer", fontSize: "24px" }}>
            👤
          </div>
          <div style={styles.chatBox}>
             <div style={{ display: "flex", flexDirection: "column" }}>
               {/* Initial Welcome Message */}
               <div style={styles.chatBubbleAi}>
                 Welcome! How can I help you today?
               </div>
               
               {/* Display the most recent interaction */}
               {transcript && (
                 <div style={styles.chatBubbleUser}>
                   {transcript}
                 </div>
               )}
               
               {llm && (
                 <div style={styles.chatBubbleAi}>
                   {llm.question}
                 </div>
               )}
             </div>
          </div>
          <button style={styles.micBtn} onClick={recording ? stopRecord : startRecord}>
            {recording ? "🛑" : "🎤"}
          </button>
        </>
      )}

      {/* SCREEN 3: REPORT */}
      {screen === "REPORT" && (
        <div style={{ display: "flex", padding: "40px", gap: "20px" }}>
          <div style={{...styles.panel, width: "60%", textAlign: "left", marginTop: 0}}>
            <h3>Report Preview</h3>
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "10px" }}>
               <p><strong>Chief Complaint:</strong> {llm?.notes || "Not specified"}</p>
               <p><strong>Patient ID:</strong> {abhaId}</p>
               <p><strong>Summary:</strong> Analysis complete. Please download the detailed report below.</p>
            </div>
            <button style={styles.button} onClick={() => alert("Downloading .docx...")}>
              Download Full Report
            </button>
          </div>
          <div style={{...styles.panel, width: "40%", textAlign: "left", marginTop: 0, backgroundColor: COLORS.secondary}}>
            <h3>Medical Timeline</h3>
            <p style={{color: COLORS.gray, fontSize: "14px"}}>
              Timeline data is not yet integrated into the backend.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
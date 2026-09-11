# backend/app.py

import json
import base64
import asyncio
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional
import requests
from io import BytesIO

from backend.firebase_manager import save_to_timeline, get_patient_timeline, save_consultation
from backend.asr import local_asr
from backend.tts import generate_tts_chunk, wav_to_base64
from backend.lightning_chat import call_lightning
from backend.prompt_template import PROMPT_TEMPLATE
from backend.report_generator import generate_clinical_report

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process_audio")
async def process_audio(
    file: UploadFile = File(...),
    patient_history: Optional[str] = Form(""),
    history: Optional[str] = Form(""),
    model: Optional[str] = Form("google/gemini-2.5-flash"),
):
    # 1. Fast ASR (Faster-Whisper)
    audio_bytes = await file.read()
    transcript = local_asr(audio_bytes)
    
    # 2. LLM Call
    prompt = PROMPT_TEMPLATE.format(
        patient_history=patient_history,
        transcript=transcript,
        history=history,
    )
    messages = [{"role":"user","content":[{"type":"text","text":prompt}]}]
    llm_out = call_lightning(messages, model=model)
    
    if isinstance(llm_out, str):
        cleaned = llm_out.replace("```json", "").replace("```", "").strip()
        try:
            llm_data = json.loads(cleaned)
        except:
            llm_data = {"question": cleaned, "language": "hi", "emergency": False}
    else:
        llm_data = llm_out

    # 3. Fast Neural TTS (Edge-TTS)
    # We use 'await' because edge-tts is asynchronous
    lang = llm_data.get("language", "hi")
    tts_bytes = await generate_tts_chunk(llm_data.get("question", ""), lang=lang)
    
    return {
        "transcript": transcript,
        "llm": llm_data,
        "tts_base64_wav": wav_to_base64(tts_bytes),
    }

EXTRACTOR_URL = "https://8000-01m16vfy8mpgpr7qn0fgxcjpqh.cloudspaces.litng.ai/extract"

@app.post("/upload_prescription")
async def upload_prescription(
    file: UploadFile = File(...),
    abha_id: str = Form(...)
):
    """
    Flow: Image -> Extractor API -> Firebase Timeline
    """
    # 1. Send image to the Medical Data Extractor
    files = {"file": (file.filename, await file.read(), file.content_type)}
    try:
        response = requests.post(EXTRACTOR_URL, files=files, timeout=30)
        response.raise_for_status()
        extracted_data = response.json() # This is the MedicalRecord object
    except Exception as e:
        return {"error": f"Extraction failed: {str(e)}"}

    # 2. Save extracted data to Firebase Timeline
    success = save_to_timeline(abha_id, extracted_data)
    
    if success:
        return {
            "status": "success",
            "message": "Record extracted and saved to timeline!",
            "data": extracted_data
        }
    else:
        return {"error": "Extraction worked, but saving to Firebase failed."}

@app.get("/patient_timeline")
async def get_timeline(abha_id: str):
    """Retrieves the medical history for a specific ABHA ID from Firebase"""
    timeline = get_patient_timeline(abha_id)
    return {"abha_id": abha_id, "timeline": timeline}

@app.post("/save_consultation")
async def save_consultation_endpoint(
    abha_id: str = Form(...),
    consultation_data: str = Form(...)
):
    """Saves consultation data to Firebase"""
    try:
        data = json.loads(consultation_data)
        success = save_consultation(abha_id, data)
        if success:
            return {"status": "success", "message": "Consultation saved"}
        else:
            return {"status": "error", "message": "Failed to save consultation"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/generate_report")
async def generate_report_endpoint(
    abha_id: str = Form(...),
    patient_info: str = Form(...),
    conversation_history: str = Form(...),
    ai_summary: str = Form(...)
):
    """Generates a clinical report as DOCX file"""
    try:
        patient_data = json.loads(patient_info)
        summary_data = json.loads(ai_summary)
        
        report_bytes = generate_clinical_report(
            patient_info=patient_data,
            conversation_history=conversation_history,
            ai_summary=summary_data
        )
        
        return StreamingResponse(
            BytesIO(report_bytes),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename=medical_report_{abha_id}.docx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/verify_otp")
async def verify_otp(abha_id: str = Form(...), otp: str = Form(...)):
    """Verifies OTP for ABHA ID - Mock implementation for demo"""
    # In production, this would verify with ABDM API
    # For demo, accept any 6-digit OTP
    if len(otp) == 6 and otp.isdigit():
        return {"status": "success", "verified": True}
    else:
        return {"status": "error", "verified": False, "message": "Invalid OTP"}
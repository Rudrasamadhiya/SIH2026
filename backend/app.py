# backend/app.py
import json
import base64
import asyncio
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import requests

from backend.firebase_manager import save_to_timeline
from backend.firebase_manager import get_patient_timeline

from backend.asr import local_asr
from backend.tts import generate_tts_chunk, wav_to_base64
from backend.lightning_chat import call_lightning
from backend.prompt_template import PROMPT_TEMPLATE

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
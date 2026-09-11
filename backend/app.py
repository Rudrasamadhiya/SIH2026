# backend/app.py
import json
import base64
import asyncio
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

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
# backend/tts.py
import edge_tts
import asyncio
import base64
from io import BytesIO

# Hindi voice: 'hi-IN-MadhurNeural' or 'hi-IN-SwaraNeural'
HINDI_VOICE = "hi-IN-MadhurNeural" 
ENGLISH_VOICE = "en-US-GuyNeural"

async def generate_tts_chunk(text: str, lang: str = "hi") -> bytes:
    voice = HINDI_VOICE if lang == "hi" else ENGLISH_VOICE
    communicate = edge_tts.Communicate(text, voice)
    
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
    
    return audio_data

def wav_to_base64(wav_bytes: bytes) -> str:
    return base64.b64encode(wav_bytes).decode("ascii")
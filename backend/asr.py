# backend/asr.py
from faster_whisper import WhisperModel
import tempfile
from pathlib import Path

# T4 GPU optimization: use float16 for speed
MODEL_SIZE = "small" 
device = "cuda" 
compute_type = "float32"




print("Loading Faster-Whisper model into GPU...")
model = WhisperModel(MODEL_SIZE, device=device, compute_type=compute_type)

def local_asr(audio_bytes: bytes, language_hint: str = "hi") -> str:
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(audio_bytes)
        temp_path = f.name
    
    # beam_size=5 is a good balance between speed and accuracy
    segments, info = model.transcribe(temp_path, beam_size=5, language=language_hint)
    
    # Combine segments into one text string
    text = " ".join([segment.text for segment in segments])
    
    Path(temp_path).unlink(missing_ok=True)
    return text.strip()
1) Install ffmpeg on your machine and ensure it's on PATH.
2) Set Lightning API key:
   PowerShell: $env:LIGHTNING_API_KEY="your_key_here"
3) Create and activate a Python venv.
4) pip install -r requirements.txt
   Note: torch & whisper can be heavy; on GPU machine install appropriate torch with CUDA support.
5) Run backend:
   cd backend
   uvicorn app:app --reload --port 8000
6) Use the frontend to record and POST to /process_audio, or test with curl:
   curl -F "file=@sample.wav" -F "patient_history=age 45 male" http://localhost:8000/process_audio
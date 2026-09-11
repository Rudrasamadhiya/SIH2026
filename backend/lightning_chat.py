# backend/lightning_chat.py
import os
import requests
import json
from typing import Any

LIGHTNING_KEY = os.environ.get("LIGHTNING_API_KEY")

if not LIGHTNING_KEY:
    # Allow continued local testing without key (will raise when called)
    pass

def call_lightning(messages: list, model: str = "google/gemini-2.5-flash") -> Any:
    """
    Call Lightning chat completions endpoint. messages should match:
    [{"role":"user","content":[{"type":"text","text":"..."}]}]
    Returns either parsed JSON object or raw string from the model response.
    """
    assert LIGHTNING_KEY, "Set LIGHTNING_API_KEY environment variable"
    url = "https://lightning.ai/api/v1/chat/completions"
    payload = {"model": model, "messages": messages}
    r = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {LIGHTNING_KEY}",
            "Content-Type": "application/json",
        },
        data=json.dumps(payload),
        timeout=30,
    )
    r.raise_for_status()
    body = r.json()
    # Response model may return structured content or string
    content = body["choices"][0]["message"]["content"]
    # If content already a dict/list, return directly; otherwise return string
    return content
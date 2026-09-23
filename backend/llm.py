"""
Cipher Autonomous AI Teammates - Gemini LLM Gateway
Utilizes Google Gemini for multi-agent reasoning, critic review, and explanation generation.
Features resilient multi-model fallback and deterministic heuristics when offline.
"""

import os
import ssl
import json
import urllib.request
import urllib.error
from typing import Optional

def load_gemini_api_key() -> Optional[str]:
    """
    Search multiple standard locations for Gemini / Google API Key.
    Supports root .env, root .env.local, backend/.env, and environment variables.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(current_dir, ".."))

    candidate_files = [
        os.path.join(current_dir, ".env"),
        os.path.join(root_dir, ".env.local"),
        os.path.join(root_dir, ".env"),
    ]

    for file_path in candidate_files:
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        line = line.strip()
                        for prefix in ("GEMINI_API_KEY=", "GOOGLE_API_KEY=", "NEXT_PUBLIC_GEMINI_API_KEY="):
                            if line.startswith(prefix):
                                val = line[len(prefix):].strip().strip("\"'")
                                if val:
                                    return val
            except Exception:
                pass

    return (
        os.environ.get("GEMINI_API_KEY")
        or os.environ.get("GOOGLE_API_KEY")
        or os.environ.get("NEXT_PUBLIC_GEMINI_API_KEY")
    )

GEMINI_KEY = load_gemini_api_key()

CANDIDATE_MODELS = [
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-flash-latest",
]

SSL_CTX = ssl._create_unverified_context()

def call_gemini(prompt: str, system_instruction: Optional[str] = None, timeout: int = 10) -> Optional[str]:
    """
    Invokes Gemini with given prompt and optional system instruction.
    Iterates through candidate models for maximum resilience.
    Returns response text or None if all models fail.
    """
    global GEMINI_KEY
    if not GEMINI_KEY:
        GEMINI_KEY = load_gemini_api_key()

    if not GEMINI_KEY:
        return None

    for model in CANDIDATE_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_KEY}"

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 350
            }
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

        try:
            with urllib.request.urlopen(req, context=SSL_CTX, timeout=timeout) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                candidates = res.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and parts[0].get("text"):
                        return parts[0]["text"].strip()
        except Exception:
            # Fall back to next candidate model
            continue

    return None

if __name__ == "__main__":
    print(f"Loaded Key: {GEMINI_KEY[:8] + '...' if GEMINI_KEY else 'None'}")
    reply = call_gemini("In 1 sentence, what is an autonomous teammate?")
    print("Gemini Test Response:", reply)

"""
Cipher Autonomous AI Teammates - Gemini LLM Gateway
Utilizes Gemini 3.8 Flash for multi-agent reasoning, critic review, and explanation generation.
Features resilient fallback to deterministic heuristics when offline.
"""

import os
import ssl
import json
import urllib.request
from typing import Optional

ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
GEMINI_KEY = None

if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r") as f:
        for line in f:
            if line.startswith("GEMINI_API_KEY="):
                GEMINI_KEY = line.strip().split("=", 1)[1]
                break

if not GEMINI_KEY:
    GEMINI_KEY = os.environ.get("GEMINI_API_KEY")

SSL_CTX = ssl._create_unverified_context()

def call_gemini(prompt: str, system_instruction: Optional[str] = None, timeout: int = 6) -> Optional[str]:
    """
    Invokes Gemini 3.8 Flash with given prompt and optional system instruction.
    Returns response text or None if request times out/fails.
    """
    if not GEMINI_KEY:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={GEMINI_KEY}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 300
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
                if parts:
                    return parts[0].get("text", "").strip()
    except Exception as e:
        # Fallback to local heuristic
        return None

    return None

if __name__ == "__main__":
    reply = call_gemini("In 1 sentence, what is an autonomous teammate?")
    print("Gemini Test Response:", reply)

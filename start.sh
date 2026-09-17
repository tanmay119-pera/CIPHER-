#!/bin/bash
echo "🚀 Starting Cipher Autonomous AI Teammates..."

# 1. Start Python FastAPI AI Backend
if [ -f "./backend/.venv/bin/python" ]; then
  ./backend/.venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
else
  python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
fi
BACKEND_PID=$!
echo "✓ AI Backend & Swarm running at: http://localhost:8000 (PID: $BACKEND_PID)"

# 2. Trap exit to terminate backend cleanly on Ctrl+C
trap "kill $BACKEND_PID 2>/dev/null; exit" SIGINT SIGTERM EXIT

# 3. Start Next.js Frontend
echo "✓ Starting Next.js UI on http://localhost:3000..."
npm run dev

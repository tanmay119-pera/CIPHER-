#!/bin/bash
echo "🚀 Starting Cipher Autonomous AI Teammates..."

# 1. Determine Python executable (macOS, Linux, WSL, Windows Git Bash)
PYTHON_CMD=""
if [ -f "./backend/.venv/bin/python" ]; then
  PYTHON_CMD="./backend/.venv/bin/python"
elif [ -f "./backend/.venv/Scripts/python.exe" ]; then
  PYTHON_CMD="./backend/.venv/Scripts/python.exe"
elif command -v python3 >/dev/null 2>&1; then
  PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_CMD="python"
elif command -v py >/dev/null 2>&1; then
  PYTHON_CMD="py"
else
  PYTHON_CMD="python"
fi

$PYTHON_CMD -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✓ AI Backend & Swarm running at: http://localhost:8000 (PID: $BACKEND_PID)"

# 2. Trap exit to terminate backend cleanly on Ctrl+C
trap "kill $BACKEND_PID 2>/dev/null; exit" SIGINT SIGTERM EXIT

# 3. Start Next.js Frontend
echo "✓ Starting Next.js UI on http://localhost:3000..."
npm run dev

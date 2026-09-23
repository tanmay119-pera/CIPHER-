@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Starting Cipher Autonomous AI Teammates (Windows)
echo ========================================================

:: Determine Python executable
set "PYTHON_CMD=python"
if exist "backend\.venv\Scripts\python.exe" (
    set "PYTHON_CMD=backend\.venv\Scripts\python.exe"
) else if exist "backend\.venv\bin\python.exe" (
    set "PYTHON_CMD=backend\.venv\bin\python.exe"
)

echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000...
start "Cipher Backend" cmd /k "!PYTHON_CMD! -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

echo [2/2] Starting Next.js Frontend on http://localhost:3000...
echo.
npm run dev

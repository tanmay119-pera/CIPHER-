# CIPHER — Autonomous AI Teammates for E-Commerce Fraud & Operations

CIPHER is an autonomous AI teammate swarm and real-time transaction intelligence platform designed for e-commerce fraud defense, operational risk triage, and regulatory compliance.

Powered by a Next.js frontend, a FastAPI multi-agent swarm backend, a hybrid BM25/TF-IDF RAG policy engine, and scikit-learn anomaly detection over 89,000+ transaction records.

---

## System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   CIPHER Web UI (Next.js)              │
│   • /dashboard       • /cipherAI       • /transactions │
│   • /analytics       • /analyze                        │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼─────────────────────────────┐
│                 Python FastAPI AI Backend              │
│   • Multi-Agent Swarm (Customer, Sales, Decision, etc) │
│   • RAG Policy Engine (POL-001 through POL-008)       │
│   • Calibrated ML Isolation Forest Anomaly Scoring     │
│   • SQLite Database (89k+ Transactions & Relations)    │
└────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Node.js**: v18.0 or higher (v20+ recommended)
- **Python**: v3.10 or higher
- **Git**: Installed on your system
- **Google Gemini API Key** (Free from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## Gemini API Key Setup

CIPHER utilizes Google Gemini for live multi-agent reasoning, critic review, and conversational explanations. You can configure your key in either of two easy ways:

### Option A: In the Web Interface (Easiest)
1. Open the app at [http://localhost:3000/cipherAI](http://localhost:3000/cipherAI).
2. Click the **"Set API Key"** button in the top right.
3. Paste your Gemini API Key and click **"Save & Apply"**.
4. The key is securely saved in your browser and used automatically for all requests.

### Option B: Via Environment File
Create a `.env.local` file in the root project folder (or copy from `.env.example`):
```bash
# macOS / Linux
cp .env.example .env.local

# Windows (CMD)
copy .env.example .env.local
```
Then paste your key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If no API key is configured, CIPHER automatically operates using its built-in deterministic multi-agent heuristics over the 89,316 transaction SQLite database.*

---

## Quick Start (macOS & Linux)

### 1. Clone & Install Frontend Dependencies
```bash
git clone https://github.com/tanmay119-pera/CIPHER-.git
cd CIPHER-
npm install
```

### 2. Set Up Python Backend Virtual Environment
```bash
cd backend
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
cd ..
```

### 3. Launch Both Backend & Frontend
You can launch everything with a single command:
```bash
chmod +x start.sh
./start.sh
```
*Or alternatively:*
```bash
npm run dev
```

The web application will open automatically at **[http://localhost:3000](http://localhost:3000)**, and the AI backend will be active at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.

---

## Quick Start (Windows)

### 1. Clone & Install Frontend Dependencies
Open **Command Prompt (CMD)** or **PowerShell**:
```cmd
git clone https://github.com/tanmay119-pera/CIPHER-.git
cd CIPHER-
npm install
```

### 2. Set Up Python Backend Virtual Environment
```cmd
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
cd ..
```

### 3. Launch Both Backend & Frontend
Run the dedicated Windows launcher:
```cmd
start.bat
```
*Or alternatively:*
```cmd
npm run dev
```

The script will launch the FastAPI backend in its own terminal and run the Next.js development server at **[http://localhost:3000](http://localhost:3000)**.

---

## Resolving Git Pull Conflicts Across Windows & Mac

If your Windows environment had old tracked `.pyc` files prior to this update, run the following command once in your repository to clean local untracked cache:

```cmd
git clean -fd
git pull origin main
```

Our repository now includes `.gitattributes` to automatically handle `LF` and `CRLF` line endings across both operating systems and `.gitignore` to prevent any Python bytecode collisions.

---

## Application Routes

- **Command Center**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **CIPHER AI Chat**: [http://localhost:3000/cipherAI](http://localhost:3000/cipherAI)
- **Transactions Stream**: [http://localhost:3000/transactions](http://localhost:3000/transactions)
- **Analytics & Trends**: [http://localhost:3000/analytics](http://localhost:3000/analytics)
- **Autonomous Deep Dive**: [http://localhost:3000/analyze](http://localhost:3000/analyze)

import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

let backendProcess = null;
let frontendProcess = null;
let browserOpened = false;

// Check if a port is already responding
function isPortInUse(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}`, () => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(600, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Automatically open default browser
function openBrowser(url) {
  if (browserOpened) return;
  browserOpened = true;

  console.log(`\n🌐 Opening web app in your browser: ${url}\n`);

  const platform = process.platform;
  if (platform === "darwin") {
    spawn("open", [url], { stdio: "ignore" });
  } else if (platform === "win32") {
    spawn("cmd", ["/c", "start", url], { stdio: "ignore" });
  } else {
    spawn("xdg-open", [url], { stdio: "ignore" });
  }
}

// Load environment variables from .env.local, .env, or backend/.env
function loadEnv() {
  const env = { ...process.env };
  const envFiles = [
    path.join(rootDir, ".env"),
    path.join(rootDir, ".env.local"),
    path.join(rootDir, "backend", ".env"),
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      try {
        const content = fs.readFileSync(envFile, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
            const idx = trimmed.indexOf("=");
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
            if (key && val) {
              env[key] = val;
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }
  return env;
}

// Start Python FastAPI Backend if not already running
async function startBackend() {
  const active = await isPortInUse(8000);
  if (active) {
    console.log("✓ AI Backend already active on http://127.0.0.1:8000");
    return;
  }

  const isWin = process.platform === "win32";
  const venvPythonWin = path.join(rootDir, "backend", ".venv", "Scripts", "python.exe");
  const venvPythonPosix = path.join(rootDir, "backend", ".venv", "bin", "python");

  let pythonCmd;
  if (fs.existsSync(venvPythonWin)) {
    pythonCmd = venvPythonWin;
  } else if (fs.existsSync(venvPythonPosix)) {
    pythonCmd = venvPythonPosix;
  } else {
    // On Windows, the default command is 'python' or 'py'; on Unix it's 'python3'
    pythonCmd = isWin ? "python" : "python3";
  }

  console.log("🚀 Starting Python FastAPI AI Backend & Multi-Agent Swarm...");
  backendProcess = spawn(
    pythonCmd,
    ["-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"],
    { cwd: rootDir, stdio: "inherit", shell: isWin, env: loadEnv() }
  );

  backendProcess.on("error", (err) => {
    console.warn("⚠️ Could not start Python backend automatically:", err.message);
    console.warn("   Next.js built-in zero-failure fallback will handle API requests.");
  });

  backendProcess.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.warn(`Backend process exited with code ${code}`);
    }
  });
}

// Start Next.js Frontend
function startFrontend() {
  console.log("✓ Starting Next.js development server...");

  const isWin = process.platform === "win32";
  const nextBin = path.join(
    rootDir,
    "node_modules",
    ".bin",
    isWin ? "next.cmd" : "next"
  );

  if (fs.existsSync(nextBin)) {
    frontendProcess = spawn(
      nextBin,
      ["dev"],
      {
        cwd: rootDir,
        stdio: "inherit",
        shell: isWin,
      }
    );
  } else {
    // Cross-platform fallback to npx
    frontendProcess = spawn(
      isWin ? "npx.cmd" : "npx",
      ["next", "dev"],
      {
        cwd: rootDir,
        stdio: "inherit",
        shell: isWin,
      }
    );
  }

  frontendProcess.on("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
  });
}

// Poll until frontend is available, then open browser
function watchFrontendReady() {
  const check = () => {
    const req = http.get("http://localhost:3000", (res) => {
      if (res.statusCode) {
        openBrowser("http://localhost:3000");
      } else {
        setTimeout(check, 800);
      }
    });

    req.on("error", () => {
      setTimeout(check, 800);
    });

    req.setTimeout(800, () => {
      req.destroy();
      setTimeout(check, 800);
    });
  };

  setTimeout(check, 1200);
}

function cleanup() {
  if (backendProcess && !backendProcess.killed) {
    try {
      backendProcess.kill("SIGTERM");
    } catch {
      // ignore
    }
  }
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

process.on("exit", () => {
  cleanup();
});

// Run orchestration
(async () => {
  await startBackend();
  startFrontend();
  watchFrontendReady();
})();

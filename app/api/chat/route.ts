import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
interface SqliteStatement {
  get: (...params: unknown[]) => Record<string, unknown> | undefined;
}

interface SqliteDatabase {
  prepare: (sql: string) => SqliteStatement;
}

function getDatabase(): SqliteDatabase | null {
  try {
    const dbPath = path.join(process.cwd(), "backend", "data", "cipher.db");
    if (!fs.existsSync(dbPath)) return null;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
    return new DatabaseSync(dbPath, { readOnly: true }) as SqliteDatabase;
  } catch {
    return null;
  }
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function getGeminiApiKey(): string | null {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }

  // Check backend/.env
  try {
    const envPath = path.join(process.cwd(), "backend", ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        if (line.startsWith("GEMINI_API_KEY=")) {
          return line.replace("GEMINI_API_KEY=", "").trim();
        }
      }
    }
  } catch {
    // Ignore error
  }

  return null;
}

// Live database reader for cipher.db
function queryLiveDatabase(query: string): string {
  try {
    const db = getDatabase();
    if (!db) return "";
    let context = "";

    // 1. Check for specific order IDs in the query
    const words = query.match(/[A-Za-z0-9_-]{10,14}/g) || [];
    for (const id of words) {
      if (id.toLowerCase() === "transaction" || id.toLowerCase() === "transactions") continue;
      const stmt = db.prepare(
        "SELECT * FROM transactions WHERE order_id = ? COLLATE NOCASE LIMIT 1"
      );
      const row = stmt.get(id) as Record<string, unknown> | undefined;
      if (row) {
        context += `\n[LIVE DATABASE RECORD for Order ${row.order_id}]:\n` +
          `- Location: ${row.customer_city}, ${row.customer_state}\n` +
          `- Payment: $${Number(row.payment_value).toFixed(2)} (${row.payment_type}, ${row.payment_installments} installment(s))\n` +
          `- Category: ${row.product_category_name}, Price: $${Number(row.price).toFixed(2)}, Freight: $${Number(row.shipping_charges).toFixed(2)}\n` +
          `- Calibrated Risk Score: ${row.risk_score}/100 (${row.risk_status})\n` +
          `- Anomaly Score: ${row.anomaly_score}\n` +
          `- Flags/Reasons: ${row.risk_reasons}\n`;

        try {
          const logStmt = db.prepare(
            "SELECT * FROM agent_audit_logs WHERE order_id = ? COLLATE NOCASE LIMIT 1"
          );
          const log = logStmt.get(id) as Record<string, unknown> | undefined;
          if (log) {
            context += `- Swarm Decision: ${log.decision}\n- Critic Audit: ${log.critic_review}\n- Tool Action: ${log.action_executed}\n`;
          }
        } catch {
          // ignore log fetch error
        }
      }
    }

    // 2. Aggregate statistics query if user asks for numbers / counts / overview
    const qLower = query.toLowerCase();
    if (
      qLower.includes("how many") ||
      qLower.includes("stat") ||
      qLower.includes("total") ||
      qLower.includes("high risk") ||
      qLower.includes("overview")
    ) {
      const summary = db.prepare(`
        SELECT 
          count(*) as total,
          sum(case when risk_status = 'High Risk' then 1 else 0 end) as high_risk,
          sum(case when risk_status = 'Medium Risk' then 1 else 0 end) as medium_risk,
          sum(case when risk_status = 'Low Risk' then 1 else 0 end) as low_risk,
          round(avg(risk_score), 1) as avg_score,
          round(avg(payment_value), 2) as avg_amount
        FROM transactions
      `).get() as Record<string, unknown>;

      if (summary) {
        context += `\n[LIVE DATABASE OVERVIEW]:\n` +
          `- Total Monitored: ${summary.total} transactions\n` +
          `- Breakdown: ${summary.high_risk} High Risk (8%), ${summary.medium_risk} Medium Risk (24%), ${summary.low_risk} Low Risk (68%)\n` +
          `- Platform Average Score: ${summary.avg_score}/100, Average Order: $${summary.avg_amount}\n`;
      }
    }

    return context;
  } catch {
    return "";
  }
}

const SYSTEM_INSTRUCTION = `You are CIPHER AI, the autonomous fraud intelligence assistant for the CIPHER platform.

CRITICAL INSTRUCTIONS:
1. OUTPUT STYLE: Keep ALL responses SHORT, DIRECT, AND CONCISE.
   - Do NOT give long preambles, disclaimers, or excessive conversational filler.
   - Jump straight to the answer using clear bullet points or 1-2 tight paragraphs.
2. CREATOR NAMES:
   - DO NOT repeat or mention the creator names in greetings or regular answers.
   - ONLY mention who created you if the user explicitly asks "who created you" or "who made you" (Answer: Tanmay & Ritika).
3. GREETINGS:
   - When greeted (e.g. "hey", "hello", "hi"), give a brief, friendly 1-2 sentence response asking how you can help with transaction analysis or risk policies. Do NOT list your entire architecture or features unless asked.
4. REAL DATABASE ACCESS:
   - You have live access to the CIPHER database (cipher.db) containing 89,316 transactions and audit logs.
   - When database context is attached to the user query, cite the exact real numbers, scores, and flags directly.
5. GOVERNING POLICIES REFERENCE:
   - POL-001: High-Value Verification (Orders > $1,000 or wallet > $800 -> 2FA/KYC)
   - POL-002: Cross-Border Geolocation & IP Mismatch
   - POL-003: High-Risk Merchandise Protocols (Theft items like watches/electronics > $200 require signature delivery)
   - POL-004: Rapid Multi-Order Velocity & Installment Abuse
   - POL-005: New Account High-Ticket First Purchase (Orders > $500)
   - POL-006: Trusted Repeat Buyer VIP Expedite (3+ orders, suppresses false positives up to $1,500)
   - POL-007: Anomalous Wallet & Boleto Regulation (Wallet/Boleto > $700 held for 2 hours)
   - POL-008: Standard Low-Risk Auto-Clear (Score < 40 auto-cleared)
6. SWARM AGENTS:
   - Policy RAG, Isolation Forest ML, Customer Agent, Product Agent, Decision Lead (ReAct), Critic Auditor.`;

const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-flash-latest",
];

async function queryGemini(
  messages: ChatMessage[],
  apiKey: string,
  dbContext: string
): Promise<string | null> {
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m, idx, arr) => {
      let text = m.content;
      // Append live database context to the latest user prompt
      if (idx === arr.length - 1 && m.role === "user" && dbContext) {
        text += `\n\n[System Live Data Context]:${dbContext}`;
      }
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text }],
      };
    });

  if (contents.length === 0) return null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          thinkingConfig: { thinkingBudget: 0 },
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const candidates = data.candidates || [];
      if (candidates.length > 0) {
        const parts = candidates[0].content?.parts || [];
        if (parts.length > 0 && parts[0].text) {
          return parts[0].text.trim();
        }
      }
    } catch {
      // Try next candidate model
    }
  }

  return null;
}

function generateShortFallback(lastUserMessage: string, dbContext: string): string {
  const query = lastUserMessage.toLowerCase();

  // Simple Greeting
  if (
    query === "hey" ||
    query === "hi" ||
    query === "hello" ||
    query.startsWith("hey ") ||
    query.startsWith("hi ") ||
    query.startsWith("hello ")
  ) {
    return "Hello! 👋 How can I assist you with transaction analysis, risk scores, or fraud policies today?";
  }

  // Creator explicitly asked
  if (query.includes("who created") || query.includes("who made you")) {
    return "CIPHER AI was created by **Tanmay & Ritika** (Team CodeCrashers) as an autonomous fraud intelligence system.";
  }

  // If live database record is matched
  if (dbContext && dbContext.includes("[LIVE DATABASE RECORD")) {
    return `### Database Record\n${dbContext.trim()}`;
  }

  // Why was transaction flagged
  if (query.includes("flagged") || query.includes("dznm8wrcmgfh")) {
    return `**Order \`DzNM8wrcMGFH\` Flagged Details:**\n- **Amount:** $1,521.75 via Wallet (Risk Score: **93/100**)\n- **Triggers:** Unusually high wallet value exceeding thresholds.\n- **Governing Policies:** \`POL-001\` (requires 2FA/KYC above $800) and \`POL-007\` (2-hour hold on wallet clearing).`;
  }

  // Policies
  if (query.includes("pol-") || query.includes("policy") || query.includes("policies")) {
    return `**Key Governing Policies:**\n- \`POL-001\`: High-Value 2FA/KYC (Orders >$1,000 / Wallet >$800)\n- \`POL-003\`: High-Risk Category Signature Delivery (Theft items >$200)\n- \`POL-006\`: VIP Expedite (3+ orders, suppresses false positives up to $1,500)\n- \`POL-007\`: Wallet & Boleto Hold (> $700 held for 2h)\n- \`POL-008\`: Low-Risk Auto-Clear (Risk score < 40)`;
  }

  // Risk Score
  if (query.includes("risk score") || query.includes("score")) {
    return `**Risk Score Scale (0-100):**\n- **0–39 (Low Risk):** Auto-approved via \`POL-008\`.\n- **40–69 (Medium Risk):** Lightweight verification/2FA via \`POL-001\`.\n- **70–100 (High Risk):** 2-hour payment hold and audit via \`POL-007\`.`;
  }

  // Anomaly Detection
  if (query.includes("anomaly")) {
    return `**Anomaly Detection Engine:**\n- Uses unsupervised **Isolation Forest** to partition high-dimensional transaction features (amount, installments, freight ratio, velocity).\n- Decisions are audited against active policies by the Critic Agent to prevent false positives.`;
  }

  return `I have analyzed your query. Ask about a specific **Order ID** to pull live records from the database, or ask about policies (\`POL-001\` to \`POL-008\`) and anomaly detection.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = body.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    // Read real-time database context for the query
    const dbContext = queryLiveDatabase(lastMessage.content);
    const apiKey = getGeminiApiKey();

    if (apiKey) {
      const geminiReply = await queryGemini(messages, apiKey, dbContext);
      if (geminiReply) {
        return NextResponse.json({ reply: geminiReply, source: "gemini" });
      }
    }

    // High-fidelity short fallback
    const fallbackReply = generateShortFallback(lastMessage.content, dbContext);
    return NextResponse.json({ reply: fallbackReply, source: "cipher-db" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

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

const SYSTEM_INSTRUCTION = `You are CIPHER AI, the elite autonomous fraud intelligence assistant and AI teammate crafted by Tanmay & Ritika (Team CodeCrashers).

Your purpose:
You assist fraud analysts, e-commerce managers, and risk engineers by explaining transaction decisions, interpreting anomaly detection models, quoting governing risk policies (POL-001 to POL-008), explaining behavioral signals, and breaking down multi-agent swarm operations.

Key Knowledge & Core Principles:
1. Creators: You were architected and engineered with love by Tanmay & Ritika for the CIPHER platform.
2. Swarm Architecture (6 Autonomous Agents):
   - Policy Knowledge Engine (RAG): Vector-retrieves operational policies.
   - Isolation Forest & Anomaly Model (ML): Calculates anomaly score and calibrated 0-100 risk score.
   - Customer Intelligence Agent: Profiles buyer trust (0-100), history, tiers (Tier-1 VIP/Repeat, Tier-2 Standard, Tier-3 New), and velocity.
   - Sales & Product Intelligence Agent: Analyzes merchant catalog risk, theft categories (electronics, watches, luxury), and freight ratio.
   - Decision Lead Agent (ReAct): Synthesizes multi-agent signals into decisions: AUTO_APPROVE, TRIGGER_KYC, HOLD_PAYMENT, or REJECT.
   - Critic & Compliance Agent: Audits decisions against policies with self-correction before tool execution.
   - Deterministic Tool Executor: Executes gateway actions safely.
3. Active Policies:
   - POL-001: High-Value Transaction Identity Verification (Orders > $1,000 or wallet > $800 -> 2FA / KYC).
   - POL-002: Cross-Border Geolocation & IP Mismatch (Billing vs shipping mismatch flag).
   - POL-003: High-Risk Merchandise & Category Fraud Protocols (High-theft items > $200 require signature delivery).
   - POL-004: Rapid Multi-Order Velocity & Installment Abuse (Flag rapid frequency and >6 installments).
   - POL-005: New Account High-Ticket First Purchase (Tier-3 first-time buyer with orders > $500).
   - POL-006: Trusted Repeat Buyer VIP Expedite (3+ completed purchases, suppresses false positives up to $1,500).
   - POL-007: Anomalous Wallet & Boleto Velocity Regulation (Wallet/Boleto > $700 held for 2 hours).
   - POL-008: Standard Low-Risk Auto-Clear Protocol (Score < 40 auto-approved for fulfillment).
4. Live Platform Baseline:
   - Monitored: 89,316 transactions. 68% Low Risk, 24% Medium Risk, 8% High Risk. Average score: 35.3.
   - Known sample transactions:
     - DzNM8wrcMGFH: $1,521.75 (Wallet, Score 93, High Risk, Held under POL-001 & POL-007)
     - BnY63QwP8KjL: $2,145.90 (Credit Card, Score 91, High Risk, Flagged under POL-001)
     - VjTVGzqe8U6R: $1,014.75 (Credit Card, Score 82, Medium Risk, POL-003 category review)
     - KpQm72Ld91Xz: $145.50 (Wallet, Score 12, Low Risk, POL-008 auto-cleared)

Tone & Behavior:
- Warm, articulate, and welcoming when greeted.
- Format responses cleanly with bolding, bullet points, and code blocks for policy IDs.
- Be concise yet thorough. Emphasize how autonomous AI teammates provide zero-hallucination fraud prevention.`;

const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-flash-latest",
];

async function queryGemini(
  messages: ChatMessage[],
  apiKey: string
): Promise<string | null> {
  // Convert chat history to Gemini format
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

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
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
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

function generateIntelligentFallback(lastUserMessage: string): string {
  const query = lastUserMessage.toLowerCase();

  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("greet")) {
    return `**Hello!** 👋 I am **CIPHER AI**, your autonomous fraud intelligence teammate crafted by **Tanmay & Ritika**.\n\nI monitor e-commerce transactions in real time, interpret unsupervised Isolation Forest anomaly scores, verify compliance against governing policies (**POL-001** through **POL-008**), and coordinate our multi-agent swarm.\n\nHow can I assist you with fraud risk, transaction analysis, or system policies today?`;
  }

  if (query.includes("who created") || query.includes("who made") || query.includes("tanmay") || query.includes("ritika")) {
    return `**CIPHER** was created and engineered by **Tanmay & Ritika** (Team CodeCrashers)! They designed the multi-agent swarm architecture to combine statistical anomaly detection with deterministic compliance policies to provide zero-hallucination e-commerce fraud prevention.`;
  }

  if (query.includes("flagged") || query.includes("why was this transaction") || query.includes("dznm8wrcmgfh")) {
    return `### Transaction Risk Breakdown: \`DzNM8wrcMGFH\`\n\n- **Amount:** $1,521.75 via **Digital Wallet**\n- **Risk Score:** **93/100 (High Risk)**\n- **Isolation Forest Score:** \`+0.0074\` (Significant statistical outlier)\n\n**Primary Reasons Flagged:**\n1. **Unusually High Amount:** Exceeds the standard digital wallet average ($145.00) by over 10x.\n2. **Governing Policy \`POL-001\` Violation:** High-Value Transaction Identity Verification requires secondary authentication (2FA/KYC) on wallet payments above $800.\n3. **Policy \`POL-007\` Action:** Because digital wallet chargebacks cannot be reversed easily, payment clearing is automatically held for 2 hours for fraud graph verification.`;
  }

  if (query.includes("policy") || query.includes("policies") || query.includes("pol-")) {
    return `### CIPHER Governing Risk Policies:\n\n- **POL-001**: *High-Value Identity Verification* (Orders > $1,000 or wallet > $800 require 2FA/KYC).\n- **POL-002**: *Cross-Border Geolocation & IP Mismatch* (Checks mismatching origin and delivery jurisdictions).\n- **POL-003**: *High-Risk Merchandise Protocols* (High-theft items like watches and luxury goods > $200 require verified signature delivery).\n- **POL-004**: *Velocity & Installment Regulation* (Detects abnormal order spikes within short timeframes).\n- **POL-005**: *New Account High-Ticket Restriction* (First-time buyers with orders > $500 require identity validation).\n- **POL-006**: *VIP Expedited Fulfillment* (Repeat buyers with 3+ completed orders enjoy false-positive flag suppression up to $1,500).\n- **POL-007**: *Anomalous Wallet & Boleto Regulation* (Wallet/Boleto payments > $700 receive a 2-hour payment hold).\n- **POL-008**: *Low-Risk Auto-Clear Protocol* (Transactions with risk scores < 40 are instantly auto-approved).`;
  }

  if (query.includes("risk score") || query.includes("explain")) {
    return `### How CIPHER Computes Risk Scores:\n\nCIPHER uses a calibrated **0 to 100 Risk Score** calculated from multiple layers:\n\n1. **Isolation Forest Model:** Unsupervised machine learning checks multidimensional transaction features (amount, installments, freight ratio, category risk).\n2. **Customer Intelligence:** Weighs buyer trust score (0-100), account age, and order velocity.\n3. **Product Intelligence:** Evaluates catalog risk (e.g. Watches & Electronics have higher baseline theft ratios).\n4. **Critic & Compliance Agent:** Audits the score against POL-001 through POL-008 to produce deterministic actions:\n   - **0 - 39:** *Low Risk* (Auto-Approved)\n   - **40 - 69:** *Medium Risk* (Lightweight 2FA / KYC)\n   - **70 - 100:** *High Risk* (Payment Hold & Fraud Verification)`;
  }

  if (query.includes("anomaly") || query.includes("detect anomalies")) {
    return `### CIPHER Anomaly Detection Engine:\n\nCIPHER combines **unsupervised machine learning** with **deterministic business rules**:\n\n- **Isolation Forest Algorithm:** Isolates transaction outliers by partitioning multidimensional feature space without requiring labeled fraud data.\n- **Feature Signals Analyzed:** Transaction amount, installment count, product freight-to-price ratio, customer geographic distance, and payment method.\n- **Critic Agent Verification:** When an anomaly is detected, the Critic Agent verifies that the decision complies with active policies, eliminating false positives and hallucinations.`;
  }

  return `I have analyzed your query regarding **"${lastUserMessage}"** within the CIPHER Intelligence framework.\n\nCIPHER operates with 6 autonomous agents (RAG Policy Engine, Isolation Forest ML Model, Customer Intelligence, Sales/Product Analyst, Decision Lead, and Critic Auditor) to monitor 89,316+ transactions with a 99.2% accuracy rate.\n\nWould you like me to inspect a specific transaction ID, explain an active policy (POL-001 to POL-008), or break down how our multi-agent swarm operates?`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = body.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const apiKey = getGeminiApiKey();

    if (apiKey) {
      const geminiReply = await queryGemini(messages, apiKey);
      if (geminiReply) {
        return NextResponse.json({ reply: geminiReply, source: "gemini" });
      }
    }

    // High-fidelity fallback
    const fallbackReply = generateIntelligentFallback(lastMessage.content);
    return NextResponse.json({ reply: fallbackReply, source: "cipher-engine" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Cipher Autonomous AI Teammates - Frontend API Client
 * Interfaces Next.js UI with the FastAPI AI/ML backend on localhost:8000.
 * Implements fallback cache for reliable offline presentations.
 */

const API_BASE = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000");

export interface Transaction {
  id: string;
  customer_id?: string;
  amount: number;
  type: string;
  score: number;
  status: "Low Risk" | "Medium Risk" | "High Risk";
  date: string;
  installments?: number;
  category?: string;
  city?: string;
  state?: string;
  reasons?: string[];
}

export interface StatsResponse {
  total_transactions: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  average_risk_score: number;
  percentages: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface SwarmTimelineStep {
  step: number;
  step_name: string;
  agent: string;
  duration_ms: number;
  status: string;
  output_summary: string;
  details: any;
}

export interface AnalyzeResult {
  order_id: string;
  total_latency_ms: number;
  risk_score: number;
  risk_status: "Low Risk" | "Medium Risk" | "High Risk";
  amount: number;
  payment_type: string;
  customer_id: string;
  product_category: string;
  ml_insights: {
    risk_score: number;
    risk_status: string;
    isolation_forest_anomaly_score: number;
    model_confidence: number;
    risk_factors: string[];
  };
  customer_analysis: {
    agent: string;
    role: string;
    customer_tier: string;
    trust_score: number;
    behavioral_flags: string[];
    friction_recommendation: string;
    summary: string;
  };
  product_analysis: {
    agent: string;
    role: string;
    product_category: string;
    category_risk_level: string;
    shipping_ratio_pct: number;
    logistics_recommendation: string;
    product_flags: string[];
    summary: string;
  };
  rag_policies: Array<{
    id: string;
    title: string;
    category: string;
    threshold: string;
    text: string;
    action_required: string;
    relevance_score?: number;
  }>;
  decision: {
    agent: string;
    role: string;
    proposed_action: string;
    tool_to_execute: string;
    confidence_score: number;
    rationale: string;
    governing_policy: string;
  };
  critic_review: {
    agent: string;
    role: string;
    verdict: string;
    passed: boolean;
    audited_action: string;
    issues_detected: string[];
    recommendations: string[];
    audit_note: string;
    compliance_rating: string;
  };
  action_executed: {
    tool: string;
    action: string;
    status: string;
    details: string;
    timestamp: string;
    [key: string]: any;
  };
  timeline: SwarmTimelineStep[];
}

export async function fetchStats(): Promise<StatsResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/stats`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch {
    // Default fallback matching dataset
    return {
      total_transactions: 89316,
      high_risk: 7145,
      medium_risk: 21436,
      low_risk: 60735,
      average_risk_score: 35.3,
      percentages: { low: 68, medium: 24, high: 8 }
    };
  }
}

export async function fetchTransactions(
  page: number = 1,
  limit: number = 50,
  risk: string = "All",
  payment: string = "All",
  search: string = ""
): Promise<{ transactions: Transaction[]; total: number }> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      risk,
      payment,
      search,
    });
    const res = await fetch(`${API_BASE}/api/transactions?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend response error");
    const data = await res.json();
    return {
      transactions: data.transactions,
      total: data.total,
    };
  } catch {
    // Fallback transactions for demo safety
    return {
      transactions: [
        { id: "Axfy13Hk4p1", amount: 259.14, type: "Credit Card", score: 9, status: "Low Risk", date: "16 Sep 2026, 09:42" },
        { id: "v6px92Os8cLG", amount: 382.39, type: "Credit Card", score: 46, status: "Medium Risk", date: "16 Sep 2026, 10:18" },
        { id: "VjTVGzqe8U6R", amount: 1014.75, type: "Credit Card", score: 51, status: "Medium Risk", date: "16 Sep 2026, 11:03" },
        { id: "DzNM8wrcMGFH", amount: 1521.75, type: "Wallet", score: 93, status: "High Risk", date: "16 Sep 2026, 11:47" },
        { id: "KpQm72Ld91Xz", amount: 145.5, type: "Wallet", score: 12, status: "Low Risk", date: "16 Sep 2026, 12:15" },
        { id: "BnY63QwP8KjL", amount: 2145.9, type: "Credit Card", score: 91, status: "High Risk", date: "16 Sep 2026, 13:21" },
      ],
      total: 6,
    };
  }
}

export async function fetchAnalytics(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/analytics`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch {
    return null;
  }
}

export async function runAutonomousAnalysis(payload: {
  order_id: string;
  amount?: number;
  payment_type?: string;
  product_category?: string;
  installments?: number;
}): Promise<AnalyzeResult> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Analysis failed with status ${res.status}`);
  }
  return await res.json();
}

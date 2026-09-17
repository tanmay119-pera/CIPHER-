"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { runAutonomousAnalysis, AnalyzeResult } from "@/lib/api";

function AnalyzeContent() {
  const searchParams = useSearchParams();

  const searchId = searchParams.get("id") ?? "";
  const searchAmount = searchParams.get("amount") ?? "";

  const [transactionId, setTransactionId] = useState(searchId || "DzNM8wrcMGFH");
  const [amount, setAmount] = useState(searchAmount || "1521.75");
  const [paymentType, setPaymentType] = useState("wallet");
  const [activeTab, setActiveTab] = useState<"overview" | "swarm" | "policies">("overview");

  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!transactionId && !amount) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await runAutonomousAnalysis({
        order_id: transactionId,
        amount: amount ? parseFloat(amount) : undefined,
        payment_type: paymentType,
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "Failed to complete multi-agent analysis.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (id: string, amt: string, pType: string) => {
    setTransactionId(id);
    setAmount(amt);
    setPaymentType(pType);
    setResult(null);
  };

  const resetAnalysis = () => {
    setResult(null);
    setLoading(false);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="border-b border-slate-800 px-8 py-5 flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-2xl font-bold">
            CIPHER
          </Link>
          <p className="text-xs text-slate-400">
            Autonomous AI Teammates Architecture
          </p>
        </div>

        <div className="flex gap-6 text-sm text-slate-300">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/transactions" className="hover:text-white">
            Transactions
          </Link>
          <Link href="/analytics" className="hover:text-white">
            Analytics
          </Link>
        </div>
      </nav>

      {/* PAGE */}
      <section className="max-w-7xl mx-auto p-8">

        {/* HEADER */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Autonomous Multi-Agent Swarm
          </div>
          <h2 className="text-3xl font-bold">
            Analyze Transaction with AI Teammates
          </h2>
          <p className="text-slate-400 mt-2">
            Experience 5-step zero-handoff autonomous decisioning: RAG ➔ ML ➔ Customer &amp; Sales Agents ➔ Decision ➔ Critic ➔ Tool Execution.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT INPUT CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">

            <h3 className="text-xl font-semibold mb-4">
              Transaction Inputs
            </h3>

            {/* QUICK PRESETS */}
            <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">
              Quick Test Presets
            </p>
            <div className="flex flex-col gap-2 mb-6">
              <button
                type="button"
                onClick={() => loadSample("DzNM8wrcMGFH", "1521.75", "wallet")}
                className="text-left text-xs p-2.5 rounded-lg border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-300 transition"
              >
                🔴 High Risk Wallet ($1,521.75)
              </button>

              <button
                type="button"
                onClick={() => loadSample("v6px92oS8cLG", "382.39", "credit_card")}
                className="text-left text-xs p-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-300 transition"
              >
                🟡 Medium Risk Installments ($382.39)
              </button>

              <button
                type="button"
                onClick={() => loadSample("Axfy13Hk4PIk", "259.14", "credit_card")}
                className="text-left text-xs p-2.5 rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 text-green-300 transition"
              >
                🟢 Low Risk Clean Order ($259.14)
              </button>
            </div>

            {/* TRANSACTION ID */}
            <label className="text-sm text-slate-400">
              Transaction / Order ID
            </label>
            <input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID from dataset"
              className="w-full mt-2 mb-4 p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-indigo-500 font-mono text-sm"
            />

            {/* AMOUNT */}
            <label className="text-sm text-slate-400">
              Amount ($ USD)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              type="number"
              className="w-full mt-2 mb-4 p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-indigo-500 text-sm"
            />

            {/* PAYMENT TYPE */}
            <label className="text-sm text-slate-400">
              Payment Method
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full mt-2 mb-6 p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-indigo-500 text-sm"
            >
              <option value="credit_card">Credit Card</option>
              <option value="wallet">Digital Wallet</option>
              <option value="boleto">Boleto</option>
              <option value="voucher">Voucher</option>
            </select>

            {/* ANALYZE BUTTON */}
            <button
              onClick={analyze}
              disabled={(!transactionId && !amount) || loading}
              className="w-full py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running AI Swarm...
                </>
              ) : (
                "Deploy AI Teammates Swarm 🚀"
              )}
            </button>

            {/* RESET */}
            {result && (
              <button
                onClick={resetAnalysis}
                className="w-full mt-3 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition text-sm"
              >
                Reset Analysis
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

          </div>

          {/* RIGHT RESULT AREA */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[500px]">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  Swarm Execution &amp; Risk Intelligence
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Multi-agent audit with automated Critic review
                </p>
              </div>

              {result && (
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                    ⚡ {result.total_latency_ms} ms
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium border ${
                      result.risk_score >= 70
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : result.risk_score >= 40
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20"
                    }`}
                  >
                    {result.risk_status} ({result.risk_score}/100)
                  </span>
                </div>
              )}
            </div>

            {/* EMPTY STATE */}
            {!result && !loading && (
              <div className="h-96 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-3xl">
                  🤖
                </div>
                <p className="text-lg font-semibold text-slate-200">
                  Ready to Deploy Autonomous Teammates
                </p>
                <p className="text-slate-400 text-sm mt-1 max-w-md">
                  Select a test preset or enter any transaction details on the left, then click &quot;Deploy AI Teammates Swarm&quot;.
                </p>
                <p className="text-xs text-slate-500 mt-4">
                  The Swarm will run RAG retrieval, ML anomaly scoring, Customer profiling, Product risk, ReAct decisioning, Critic verification, and execute deterministic tools.
                </p>
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-6" />
                <p className="text-lg font-semibold">
                  Autonomous Teammates in Session...
                </p>
                <p className="text-xs text-indigo-400 font-mono mt-2 animate-pulse">
                  Analyzing RAG Policies ➔ Profiling Customer ➔ Auditing Logistics ➔ Synthesizing Decision ➔ Critic Reviewing
                </p>
              </div>
            )}

            {/* RESULT VIEW */}
            {result && (
              <div className="space-y-6">

                {/* TAB SWITCHER */}
                <div className="flex border-b border-slate-800 text-sm font-medium gap-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-3 transition border-b-2 ${
                      activeTab === "overview"
                        ? "border-indigo-500 text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Summary &amp; Action
                  </button>

                  <button
                    onClick={() => setActiveTab("swarm")}
                    className={`pb-3 transition border-b-2 flex items-center gap-2 ${
                      activeTab === "swarm"
                        ? "border-indigo-500 text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>Specialized Agents Swarm</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  </button>

                  <button
                    onClick={() => setActiveTab("policies")}
                    className={`pb-3 transition border-b-2 ${
                      activeTab === "policies"
                        ? "border-indigo-500 text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    RAG Knowledge Context ({result.rag_policies?.length || 0})
                  </button>
                </div>

                {/* TAB 1: OVERVIEW & AUTONOMOUS ACTION */}
                {activeTab === "overview" && (
                  <div className="space-y-5">

                    {/* TOP SCORE METRICS */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* RISK SCORE */}
                      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Risk Score</p>
                        <div className="flex items-end gap-2 mt-2">
                          <p className="text-4xl font-bold">{result.risk_score}</p>
                          <p className="text-slate-500 mb-1 text-sm">/ 100</p>
                        </div>
                        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              result.risk_score >= 70 ? "bg-red-500" : result.risk_score >= 40 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${result.risk_score}%` }}
                          />
                        </div>
                      </div>

                      {/* AUTONOMOUS ACTION EXECUTED */}
                      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Executed Action</p>
                        <p className="text-lg font-bold text-indigo-400 mt-2">
                          {result.action_executed?.action || "ORDER_APPROVED"}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 font-mono">
                          Tool: `{result.action_executed?.tool}`
                        </p>
                      </div>

                      {/* CRITIC AUDIT VERDICT */}
                      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Critic Safety Review</p>
                        <p className="text-lg font-bold text-green-400 mt-2 flex items-center gap-1.5">
                          ✓ {result.critic_review?.verdict}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          {result.critic_review?.compliance_rating}
                        </p>
                      </div>
                    </div>

                    {/* DECISION RATIONALE */}
                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm text-slate-200">
                          Decision Lead Agent Rationale
                        </h4>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          Confidence: {result.decision?.confidence_score}%
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {result.decision?.rationale}
                      </p>
                    </div>

                    {/* KEY RISK FACTORS */}
                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
                      <h4 className="font-semibold text-sm text-slate-200 mb-3">
                        Model Risk Factors Identified
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {result.ml_insights?.risk_factors?.map((factor: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-slate-700/70 bg-slate-900/50 flex items-start gap-2 text-xs text-slate-300"
                          >
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DETERMINISTIC TOOL DISPATCH LOG */}
                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-sm text-slate-200">
                          Deterministic Tool Execution Output
                        </h4>
                        <span className="text-xs text-green-400 font-mono">STATUS: {result.action_executed?.status}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                        <pre>{JSON.stringify(result.action_executed, null, 2)}</pre>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 2: SPECIALIZED AGENT SWARM CARDS */}
                {activeTab === "swarm" && (
                  <div className="space-y-4">

                    {/* CUSTOMER AGENT */}
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                            Agent 1
                          </span>
                          <h4 className="font-bold text-base text-white mt-1">
                            {result.customer_analysis?.agent}
                          </h4>
                          <p className="text-xs text-slate-400">{result.customer_analysis?.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Trust Score</p>
                          <p className="text-xl font-bold text-blue-400">{result.customer_analysis?.trust_score}/100</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                        {result.customer_analysis?.summary}
                      </p>
                      <div className="flex gap-4 mt-3 text-xs text-slate-400">
                        <span>Classification: <strong className="text-slate-200">{result.customer_analysis?.customer_tier}</strong></span>
                        <span>Friction Strategy: <strong className="text-slate-200">{result.customer_analysis?.friction_recommendation}</strong></span>
                      </div>
                    </div>

                    {/* PRODUCT & SALES AGENT */}
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold">
                            Agent 2
                          </span>
                          <h4 className="font-bold text-base text-white mt-1">
                            {result.product_analysis?.agent}
                          </h4>
                          <p className="text-xs text-slate-400">{result.product_analysis?.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Category Risk</p>
                          <p className={`text-xl font-bold ${result.product_analysis?.category_risk_level === "HIGH" ? "text-red-400" : "text-green-400"}`}>
                            {result.product_analysis?.category_risk_level}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                        {result.product_analysis?.summary}
                      </p>
                      <div className="flex gap-4 mt-3 text-xs text-slate-400">
                        <span>Category: <strong className="text-slate-200">{result.product_analysis?.product_category}</strong></span>
                        <span>Logistics Rule: <strong className="text-slate-200">{result.product_analysis?.logistics_recommendation}</strong></span>
                      </div>
                    </div>

                    {/* CRITIC AGENT (SELF-CORRECTION) */}
                    <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                            Agent 4 (Supervisor)
                          </span>
                          <h4 className="font-bold text-base text-white mt-1">
                            {result.critic_review?.agent}
                          </h4>
                          <p className="text-xs text-slate-400">{result.critic_review?.role}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {result.critic_review?.verdict}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                        {result.critic_review?.audit_note}
                      </p>
                      <p className="text-xs text-slate-400 mt-3">
                        Audited Action: <strong className="text-emerald-300">{result.critic_review?.audited_action}</strong> | Policy Safeguard: <strong>Active</strong>
                      </p>
                    </div>

                    {/* WORKFLOW TIMELINE */}
                    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-5">
                      <h4 className="font-semibold text-sm text-slate-300 mb-4">
                        Autonomous Execution Graph
                      </h4>
                      <div className="space-y-3">
                        {result.timeline?.map((step: any) => (
                          <div
                            key={step.step}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                                {step.step}
                              </span>
                              <div>
                                <p className="font-semibold text-slate-200">{step.step_name}</p>
                                <p className="text-slate-500 text-[11px]">{step.output_summary}</p>
                              </div>
                            </div>
                            <span className="font-mono text-slate-400 text-[11px]">{step.duration_ms} ms</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 3: RAG POLICIES */}
                {activeTab === "policies" && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">
                      Vector-retrieved operational policies governing this transaction:
                    </p>

                    {result.rag_policies?.map((policy: any) => (
                      <div
                        key={policy.id}
                        className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {policy.id} • {policy.category}
                          </span>
                          <span className="text-xs text-amber-400 font-medium">
                            Mandate: {policy.action_required}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-white mb-2">
                          {policy.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {policy.text}
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-500">
                          <span>Threshold: {policy.threshold}</span>
                          {policy.relevance_score && (
                            <span>Relevance: {policy.relevance_score}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default function Analyze() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  );
}

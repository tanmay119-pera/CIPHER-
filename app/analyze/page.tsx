"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { runAutonomousAnalysis, AnalyzeResult } from "@/lib/api";

function AnalyzeContent() {
  const searchParams = useSearchParams();

  const searchId = searchParams.get("id") ?? "";
  const searchAmount = searchParams.get("amount") ?? "";

  const [transactionId, setTransactionId] = useState(
    searchId || "DzNM8wrcMGFH"
  );
  const [amount, setAmount] = useState(searchAmount || "1521.75");
  const [paymentType, setPaymentType] = useState("wallet");

  const [activeTab, setActiveTab] = useState<
    "overview" | "swarm" | "policies"
  >("overview");

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
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to complete multi-agent analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (id: string, amt: string, pType: string) => {
    setTransactionId(id);
    setAmount(amt);
    setPaymentType(pType);
    setResult(null);
    setError(null);
  };

  const resetAnalysis = () => {
    setResult(null);
    setLoading(false);
    setError(null);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f3ec] text-[#241d2d]">

      {/* ========================================================= */}
      {/* ANIMATED BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(36,29,45,0.055) 1px, transparent 1px),
              linear-gradient(90deg, rgba(36,29,45,0.055) 1px, transparent 1px)
            `,
            backgroundSize: "43px 43px",
          }}
        />

        {/* pink bubble */}
        <div className="bubble bubble-pink" />

        {/* purple bubble */}
        <div className="bubble bubble-purple" />

        {/* cyan bubble */}
        <div className="bubble bubble-cyan" />

        {/* small floating dots */}
        <div className="floating-dot dot-purple" />
        <div className="floating-dot dot-cyan" />
        <div className="floating-dot dot-pink" />

        {/* soft glows */}
        <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-pink-200/20 blur-3xl" />
        <div className="absolute -right-32 top-[500px] h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" />
      </div>


      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="relative z-20 border-b border-[#ded8d0] bg-[#f7f3ec]/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-[90px] max-w-[1450px] items-center justify-between px-6 py-4 lg:px-10">

          {/* LOGO */}
          <Link href="/dashboard" className="flex items-center gap-3">

            {/* EXACT CIPHER LOGO STYLE */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] border border-[#eadcf0] bg-white shadow-[0_8px_22px_rgba(126,74,143,0.12)]">
              <span className="text-[31px] font-black leading-none tracking-[-4px] text-[#292130]">
                C
              </span>

              {/* cyan dot */}
              <span className="absolute right-[7px] top-[8px] h-3 w-3 rounded-full bg-[#13b9d5]" />

              {/* pink dot */}
              <span className="absolute bottom-[8px] right-[10px] h-[6px] w-[6px] rounded-full bg-[#e94b9b]" />
            </div>

            <div>
              <div className="text-[21px] font-black tracking-[0.18em] text-[#241d2d]">
                CIPHER
              </div>
              <div className="mt-[-2px] text-[9px] font-bold tracking-[0.19em] text-[#81768a]">
                AI TRANSACTION INTELLIGENCE
              </div>
            </div>
          </Link>


          {/* NAV LINKS */}
          <div className="hidden items-center gap-8 text-[15px] font-medium md:flex">
            <Link
              href="/dashboard"
              className="text-[#70677b] transition hover:text-[#241d2d]"
            >
              Dashboard
            </Link>

            <Link
              href="/transactions"
              className="text-[#70677b] transition hover:text-[#241d2d]"
            >
              Transactions
            </Link>

            <Link
              href="/analytics"
              className="text-[#70677b] transition hover:text-[#241d2d]"
            >
              Analytics
            </Link>

            <span className="font-bold text-[#6551e8]">
              Analyze
            </span>
          </div>


          {/* MOBILE NAV */}
          <div className="flex gap-3 md:hidden">
            <Link
              href="/analytics"
              className="rounded-lg border border-[#ddd5de] bg-white px-3 py-2 text-xs font-semibold"
            >
              Analytics
            </Link>
          </div>

        </div>
      </nav>


      {/* ========================================================= */}
      {/* PAGE CONTENT */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto w-full max-w-[1450px] px-5 py-8 lg:px-10 lg:py-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#008da8]">
              <span className="h-2 w-2 rounded-full bg-[#0da9c4]" />
              Autonomous Multi-Agent Swarm
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.035em] text-[#241d2d] md:text-5xl">
              Analyze Transaction{" "}
              <span className="text-[#6551e8]">
                with AI Teammates
              </span>
            </h1>

            <p className="mt-3 max-w-4xl text-[15px] leading-7 text-[#71687b]">
              Experience autonomous transaction decisioning through RAG
              retrieval, ML anomaly detection, specialized AI teammates,
              decision synthesis, Critic verification and deterministic
              tool execution.
            </p>

          </div>

        </div>


        {/* ========================================================= */}
        {/* MAIN GRID */}
        {/* ========================================================= */}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">


          {/* ======================================================= */}
          {/* LEFT INPUT PANEL */}
          {/* ======================================================= */}

          <div className="relative h-fit min-w-0 overflow-hidden rounded-[22px] border border-[#ded7df] bg-white/90 p-6 shadow-[0_12px_35px_rgba(46,35,53,0.07)] backdrop-blur">

            {/* little decorative bubble */}
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-purple-200/40 bg-purple-100/20" />

            <div className="relative">

              <div className="mb-5">
                <h2 className="text-xl font-black text-[#292232]">
                  Transaction Inputs
                </h2>
                <p className="mt-1 text-xs text-[#93899a]">
                  Configure the transaction to analyze
                </p>
              </div>


              {/* QUICK PRESETS */}
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.17em] text-[#8e8496]">
                Quick Test Presets
              </p>

              <div className="mb-6 flex flex-col gap-3">

                <button
                  type="button"
                  onClick={() =>
                    loadSample(
                      "DzNM8wrcMGFH",
                      "1521.75",
                      "wallet"
                    )
                  }
                  className="rounded-[15px] border border-[#ffb9bd] bg-[#fff5f4] p-3.5 text-left transition hover:-translate-y-[1px] hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#f05b62]">
                    <span className="h-3 w-3 rounded-full bg-[#f05b62]" />
                    High Risk Wallet
                  </div>
                  <div className="mt-1 text-xs text-[#ef7479]">
                    $1,521.75
                  </div>
                </button>


                <button
                  type="button"
                  onClick={() =>
                    loadSample(
                      "v6px92oS8cLG",
                      "382.39",
                      "credit_card"
                    )
                  }
                  className="rounded-[15px] border border-[#f3d68e] bg-[#fffaf0] p-3.5 text-left transition hover:-translate-y-[1px] hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#e5a900]">
                    <span className="h-3 w-3 rounded-full bg-[#eab21b]" />
                    Medium Risk Installments
                  </div>
                  <div className="mt-1 text-xs text-[#d9a829]">
                    $382.39
                  </div>
                </button>


                <button
                  type="button"
                  onClick={() =>
                    loadSample(
                      "Axfy13Hk4PIk",
                      "259.14",
                      "credit_card"
                    )
                  }
                  className="rounded-[15px] border border-[#a9e6c7] bg-[#f1fcf6] p-3.5 text-left transition hover:-translate-y-[1px] hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0ca95b]">
                    <span className="h-3 w-3 rounded-full bg-[#16bf6d]" />
                    Low Risk Clean Order
                  </div>
                  <div className="mt-1 text-xs text-[#13a65c]">
                    $259.14
                  </div>
                </button>

              </div>


              {/* TRANSACTION ID */}
              <label className="text-xs font-bold text-[#756b80]">
                Transaction / Order ID
              </label>

              <input
                value={transactionId}
                onChange={(e) =>
                  setTransactionId(e.target.value)
                }
                placeholder="Enter transaction ID from dataset"
                className="mt-2 mb-4 w-full rounded-[13px] border border-[#ddd7df] bg-[#fcfafc] p-3.5 font-mono text-sm text-[#302938] outline-none transition focus:border-[#7461e8] focus:ring-2 focus:ring-[#7461e8]/10"
              />


              {/* AMOUNT */}
              <label className="text-xs font-bold text-[#756b80]">
                Amount ($ USD)
              </label>

              <input
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Enter amount"
                type="number"
                className="mt-2 mb-4 w-full rounded-[13px] border border-[#ddd7df] bg-[#fcfafc] p-3.5 text-sm text-[#302938] outline-none transition focus:border-[#7461e8] focus:ring-2 focus:ring-[#7461e8]/10"
              />


              {/* PAYMENT TYPE */}
              <label className="text-xs font-bold text-[#756b80]">
                Payment Method
              </label>

              <select
                value={paymentType}
                onChange={(e) =>
                  setPaymentType(e.target.value)
                }
                className="mt-2 mb-6 w-full rounded-[13px] border border-[#ddd7df] bg-[#fcfafc] p-3.5 text-sm text-[#302938] outline-none transition focus:border-[#7461e8] focus:ring-2 focus:ring-[#7461e8]/10"
              >
                <option value="credit_card">
                  Credit Card
                </option>
                <option value="wallet">
                  Digital Wallet
                </option>
                <option value="boleto">
                  Boleto
                </option>
                <option value="voucher">
                  Voucher
                </option>
              </select>


              {/* ANALYZE */}
              <button
                onClick={analyze}
                disabled={(!transactionId && !amount) || loading}
                className="flex w-full items-center justify-center gap-2 rounded-[13px] bg-[#281f2f] py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(40,31,47,0.18)] transition hover:-translate-y-[1px] hover:bg-[#33283d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Running AI Swarm...
                  </>
                ) : (
                  <>
                    Deploy AI Teammates Swarm 🚀
                  </>
                )}
              </button>


              {/* RESET */}
              {result && (
                <button
                  onClick={resetAnalysis}
                  className="mt-3 w-full rounded-[13px] border border-[#ded7df] bg-white py-3 text-sm font-semibold text-[#81778b] transition hover:bg-[#f8f5f8]"
                >
                  Reset Analysis
                </button>
              )}


              {/* ERROR */}
              {error && (
                <div className="mt-4 rounded-[13px] border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-500">
                  {error}
                </div>
              )}

            </div>
          </div>


          {/* ======================================================= */}
          {/* RIGHT RESULT PANEL */}
          {/* ======================================================= */}

          <div className="min-w-0 rounded-[22px] border border-[#ded7df] bg-white/90 p-5 shadow-[0_12px_35px_rgba(46,35,53,0.07)] backdrop-blur md:p-6">

            {/* RESULT HEADER */}
            <div className="mb-6 flex flex-col gap-4 border-b border-[#e7e1e7] pb-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-black text-[#292232]">
                  Swarm Execution &amp; Risk Intelligence
                </h2>

                <p className="mt-1 text-xs text-[#918798]">
                  Multi-agent audit with automated Critic review
                </p>
              </div>


              {result && (
                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full border border-[#ddd5f8] bg-[#f5f2ff] px-3 py-1.5 font-mono text-xs font-semibold text-[#6955dd]">
                    ⚡ {result.total_latency_ms} ms
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                      result.risk_score >= 70
                        ? "border-red-200 bg-red-50 text-red-500"
                        : result.risk_score >= 40
                        ? "border-yellow-200 bg-yellow-50 text-yellow-600"
                        : "border-green-200 bg-green-50 text-green-600"
                    }`}
                  >
                    {result.risk_status} ({result.risk_score}/100)
                  </span>

                </div>
              )}

            </div>


            {/* ===================================================== */}
            {/* EMPTY STATE */}
            {/* ===================================================== */}

            {!result && !loading && (
              <div className="flex min-h-[520px] flex-col items-center justify-center px-5 py-10 text-center">

                <div className="relative mb-6">

                  <div className="absolute inset-0 animate-pulse rounded-full bg-purple-200/40 blur-2xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#ddd4fa] bg-[#f5f1ff] text-4xl shadow-sm">
                    🤖
                  </div>

                </div>

                <p className="text-xl font-black text-[#292232]">
                  Ready to Deploy Autonomous Teammates
                </p>

                <p className="mt-2 max-w-lg text-sm leading-6 text-[#81778b]">
                  Select a test preset or enter transaction details
                  on the left, then deploy the AI teammate swarm.
                </p>

                <p className="mt-5 max-w-xl text-xs leading-5 text-[#a098a7]">
                  The Swarm will run RAG retrieval, ML anomaly
                  scoring, Customer profiling, Product risk,
                  decision synthesis, Critic verification, and
                  deterministic tool execution.
                </p>

              </div>
            )}


            {/* ===================================================== */}
            {/* LOADING STATE */}
            {/* ===================================================== */}

            {loading && (
              <div className="flex min-h-[520px] flex-col items-center justify-center px-5 text-center">

                <div className="relative mb-7">

                  <div className="absolute inset-0 animate-ping rounded-full bg-purple-200/30" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#ddd4fa] bg-[#f5f1ff]">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ddd8e3] border-t-[#6955e8]" />
                  </div>

                </div>

                <p className="text-xl font-black text-[#292232]">
                  Autonomous Teammates in Session...
                </p>

                <p className="mt-3 max-w-xl text-xs font-mono leading-6 text-[#7161d9]">
                  Analyzing RAG Policies ➔ Profiling Customer ➔
                  Auditing Logistics ➔ Synthesizing Decision ➔
                  Critic Reviewing
                </p>

              </div>
            )}


            {/* ===================================================== */}
            {/* RESULT */}
            {/* ===================================================== */}

            {result && (
              <div className="min-w-0 space-y-6">

                {/* TABS */}
                <div className="flex gap-5 overflow-x-auto border-b border-[#e7e1e7] text-sm font-bold">

                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`shrink-0 border-b-2 pb-3 transition ${
                      activeTab === "overview"
                        ? "border-[#6955e8] text-[#292232]"
                        : "border-transparent text-[#918798] hover:text-[#4c4352]"
                    }`}
                  >
                    Summary &amp; Action
                  </button>

                  <button
                    onClick={() => setActiveTab("swarm")}
                    className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 transition ${
                      activeTab === "swarm"
                        ? "border-[#6955e8] text-[#292232]"
                        : "border-transparent text-[#918798] hover:text-[#4c4352]"
                    }`}
                  >
                    Specialized Agents Swarm
                    <span className="h-2 w-2 rounded-full bg-[#6955e8]" />
                  </button>

                  <button
                    onClick={() => setActiveTab("policies")}
                    className={`shrink-0 border-b-2 pb-3 transition ${
                      activeTab === "policies"
                        ? "border-[#6955e8] text-[#292232]"
                        : "border-transparent text-[#918798] hover:text-[#4c4352]"
                    }`}
                  >
                    RAG Knowledge Context (
                    {result.rag_policies?.length || 0})
                  </button>

                </div>


                {/* ================================================= */}
                {/* OVERVIEW */}
                {/* ================================================= */}

                {activeTab === "overview" && (
                  <div className="min-w-0 space-y-5">

                    {/* METRICS */}
                    <div className="grid gap-4 md:grid-cols-3">

                      {/* RISK SCORE */}
                      <div className="rounded-[17px] border border-[#e0d9e1] bg-[#fcfafc] p-5">

                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#958b99]">
                          Risk Score
                        </p>

                        <div className="mt-2 flex items-end gap-2">
                          <p className="text-4xl font-black text-[#292232]">
                            {result.risk_score}
                          </p>

                          <p className="mb-1 text-sm text-[#a39aa7]">
                            / 100
                          </p>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e7e2e8]">
                          <div
                            className={`h-full rounded-full transition-all ${
                              result.risk_score >= 70
                                ? "bg-[#ef4d59]"
                                : result.risk_score >= 40
                                ? "bg-[#eab21b]"
                                : "bg-[#16bd68]"
                            }`}
                            style={{
                              width: `${result.risk_score}%`,
                            }}
                          />
                        </div>

                      </div>


                      {/* ACTION */}
                      <div className="rounded-[17px] border border-[#e0d9e1] bg-[#fcfafc] p-5">

                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#958b99]">
                          Executed Action
                        </p>

                        <p className="mt-2 break-words text-lg font-black text-[#6955e8]">
                          {result.action_executed?.action ||
                            "ORDER_APPROVED"}
                        </p>

                        <p className="mt-2 break-all font-mono text-xs text-[#958b99]">
                          Tool: {result.action_executed?.tool}
                        </p>

                      </div>


                      {/* CRITIC */}
                      <div className="rounded-[17px] border border-[#bde8d0] bg-[#f7fdf9] p-5">

                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#82988b]">
                          Critic Safety Review
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 break-words text-lg font-black text-[#0ca75b]">
                          ✓ {result.critic_review?.verdict}
                        </p>

                        <p className="mt-2 text-xs text-[#83918a]">
                          {result.critic_review?.compliance_rating}
                        </p>

                      </div>

                    </div>


                    {/* DECISION */}
                    <div className="rounded-[17px] border border-[#e0d9e1] bg-[#fcfafc] p-5">

                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <h3 className="text-sm font-black text-[#292232]">
                          Decision Lead Agent Rationale
                        </h3>

                        <span className="w-fit rounded-md bg-[#eeeaff] px-2 py-1 font-mono text-[10px] font-bold text-[#6955e8]">
                          Confidence:{" "}
                          {result.decision?.confidence_score}%
                        </span>

                      </div>

                      <p className="break-words text-sm leading-6 text-[#706676]">
                        {result.decision?.rationale}
                      </p>

                    </div>


                    {/* RISK FACTORS */}
                    <div className="rounded-[17px] border border-[#e0d9e1] bg-[#fcfafc] p-5">

                      <h3 className="mb-3 text-sm font-black text-[#292232]">
                        Model Risk Factors Identified
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">

                        {result.ml_insights?.risk_factors?.map(
                          (factor: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex min-w-0 items-start gap-2 rounded-xl border border-[#e2dce3] bg-white p-3 text-xs leading-5 text-[#706676]"
                            >
                              <span className="font-bold text-[#eab21b]">
                                •
                              </span>

                              <span className="break-words">
                                {factor}
                              </span>
                            </div>
                          )
                        )}

                      </div>

                    </div>


                    {/* TOOL OUTPUT */}
                    <div className="rounded-[17px] border border-[#e0d9e1] bg-[#fcfafc] p-5">

                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <h3 className="text-sm font-black text-[#292232]">
                          Deterministic Tool Execution Output
                        </h3>

                        <span className="font-mono text-[10px] font-bold text-[#0ca75b]">
                          STATUS:{" "}
                          {result.action_executed?.status}
                        </span>

                      </div>

                      <div className="max-h-[400px] overflow-auto rounded-xl bg-[#281f2f] p-4 text-xs text-[#eee8f0]">

                        <pre className="whitespace-pre-wrap break-words font-mono">
                          {JSON.stringify(
                            result.action_executed,
                            null,
                            2
                          )}
                        </pre>

                      </div>

                    </div>

                  </div>
                )}


                {/* ================================================= */}
                {/* SWARM */}
                {/* ================================================= */}

                {activeTab === "swarm" && (
                  <div className="space-y-4">

                    {/* CUSTOMER AGENT */}
                    <div className="rounded-[17px] border border-[#ddd6e2] bg-[#fcfafc] p-5">

                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-500">
                            Agent 1
                          </span>

                          <h3 className="mt-2 text-base font-black text-[#292232]">
                            {result.customer_analysis?.agent}
                          </h3>

                          <p className="text-xs text-[#928898]">
                            {result.customer_analysis?.role}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-[10px] uppercase tracking-wider text-[#918798]">
                            Trust Score
                          </p>

                          <p className="text-xl font-black text-blue-500">
                            {result.customer_analysis?.trust_score}/100
                          </p>
                        </div>

                      </div>

                      <p className="rounded-xl border border-[#e3dde4] bg-white p-3 text-sm leading-6 text-[#706676]">
                        {result.customer_analysis?.summary}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#918798]">
                        <span>
                          Classification:{" "}
                          <strong className="text-[#393140]">
                            {result.customer_analysis?.customer_tier}
                          </strong>
                        </span>

                        <span>
                          Friction Strategy:{" "}
                          <strong className="text-[#393140]">
                            {
                              result.customer_analysis
                                ?.friction_recommendation
                            }
                          </strong>
                        </span>
                      </div>

                    </div>


                    {/* PRODUCT AGENT */}
                    <div className="rounded-[17px] border border-[#ddd6e2] bg-[#fcfafc] p-5">

                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-[10px] font-black text-purple-500">
                            Agent 2
                          </span>

                          <h3 className="mt-2 text-base font-black text-[#292232]">
                            {result.product_analysis?.agent}
                          </h3>

                          <p className="text-xs text-[#928898]">
                            {result.product_analysis?.role}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-[10px] uppercase tracking-wider text-[#918798]">
                            Category Risk
                          </p>

                          <p
                            className={`text-xl font-black ${
                              result.product_analysis
                                ?.category_risk_level === "HIGH"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {
                              result.product_analysis
                                ?.category_risk_level
                            }
                          </p>
                        </div>

                      </div>

                      <p className="rounded-xl border border-[#e3dde4] bg-white p-3 text-sm leading-6 text-[#706676]">
                        {result.product_analysis?.summary}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#918798]">
                        <span>
                          Category:{" "}
                          <strong className="text-[#393140]">
                            {
                              result.product_analysis
                                ?.product_category
                            }
                          </strong>
                        </span>

                        <span>
                          Logistics Rule:{" "}
                          <strong className="text-[#393140]">
                            {
                              result.product_analysis
                                ?.logistics_recommendation
                            }
                          </strong>
                        </span>
                      </div>

                    </div>


                    {/* CRITIC */}
                    <div className="rounded-[17px] border border-[#bce7cf] bg-[#f9fdf9] p-5">

                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600">
                            Agent 4 — Supervisor
                          </span>

                          <h3 className="mt-2 text-base font-black text-[#292232]">
                            {result.critic_review?.agent}
                          </h3>

                          <p className="text-xs text-[#83918a]">
                            {result.critic_review?.role}
                          </p>
                        </div>

                        <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                          {result.critic_review?.verdict}
                        </span>

                      </div>

                      <p className="rounded-xl border border-emerald-100 bg-white p-3 text-sm leading-6 text-[#66736b]">
                        {result.critic_review?.audit_note}
                      </p>

                      <p className="mt-3 text-xs text-[#83918a]">
                        Audited Action:{" "}
                        <strong className="text-emerald-600">
                          {result.critic_review?.audited_action}
                        </strong>{" "}
                        | Policy Safeguard:{" "}
                        <strong>Active</strong>
                      </p>

                    </div>


                    {/* TIMELINE */}
                    <div className="rounded-[17px] border border-[#ddd6e2] bg-[#fcfafc] p-5">

                      <h3 className="mb-4 text-sm font-black text-[#292232]">
                        Autonomous Execution Graph
                      </h3>

                      <div className="space-y-3">

                        {result.timeline?.map(
                          (step) => (
                            <div
                              key={step.step}
                              className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-[#e4dee5] bg-white p-3"
                            >

                              <div className="flex min-w-0 items-center gap-3">

                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eeeaff] text-xs font-black text-[#6955e8]">
                                  {step.step}
                                </span>

                                <div className="min-w-0">
                                  <p className="truncate text-xs font-black text-[#393140]">
                                    {step.step_name}
                                  </p>

                                  <p className="mt-0.5 break-words text-[11px] leading-4 text-[#968c9b]">
                                    {step.output_summary}
                                  </p>
                                </div>

                              </div>

                              <span className="shrink-0 font-mono text-[10px] text-[#958b99]">
                                {step.duration_ms} ms
                              </span>

                            </div>
                          )
                        )}

                      </div>

                    </div>

                  </div>
                )}


                {/* ================================================= */}
                {/* POLICIES */}
                {/* ================================================= */}

                {activeTab === "policies" && (
                  <div className="space-y-4">

                    <p className="text-xs leading-5 text-[#8d8393]">
                      Vector-retrieved operational policies governing
                      this transaction:
                    </p>

                    {result.rag_policies?.map(
                      (policy) => (
                        <div
                          key={policy.id}
                          className="rounded-[17px] border border-[#ddd6e2] bg-[#fcfafc] p-5"
                        >

                          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <span className="w-fit rounded-md bg-[#eeeaff] px-2 py-1 font-mono text-[10px] font-black text-[#6955e8]">
                              {policy.id} • {policy.category}
                            </span>

                            <span className="text-xs font-bold text-[#d19c00]">
                              Mandate:{" "}
                              {policy.action_required}
                            </span>

                          </div>

                          <h3 className="mb-2 text-sm font-black text-[#292232]">
                            {policy.title}
                          </h3>

                          <p className="break-words text-xs leading-5 text-[#706676]">
                            {policy.text}
                          </p>

                          <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-[#e7e1e7] pt-3 text-[10px] text-[#988e9d]">
                            <span>
                              Threshold: {policy.threshold}
                            </span>

                            {policy.relevance_score && (
                              <span>
                                Relevance:{" "}
                                {policy.relevance_score}
                              </span>
                            )}
                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* ANIMATIONS */}
      {/* ========================================================= */}

      <style jsx>{`
        .bubble {
          position: absolute;
          border-radius: 9999px;
          border: 1px solid rgba(130, 75, 220, 0.12);
          animation: floatBubble 9s ease-in-out infinite;
        }

        .bubble-pink {
          width: 165px;
          height: 165px;
          left: 7%;
          top: 105px;
          background: rgba(245, 184, 217, 0.18);
          box-shadow: 0 0 50px rgba(238, 150, 205, 0.12);
        }

        .bubble-purple {
          width: 130px;
          height: 130px;
          left: 27%;
          top: 220px;
          background: rgba(176, 137, 245, 0.13);
          animation-delay: -3s;
        }

        .bubble-cyan {
          width: 190px;
          height: 190px;
          right: 8%;
          top: 420px;
          background: rgba(93, 215, 224, 0.12);
          border-color: rgba(33, 183, 200, 0.14);
          animation-delay: -5s;
        }

        .floating-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          animation: floatDot 6s ease-in-out infinite;
        }

        .dot-purple {
          left: 28%;
          top: 145px;
          background: #a94bed;
        }

        .dot-cyan {
          right: 30%;
          top: 345px;
          background: #25b9d0;
          animation-delay: -2s;
        }

        .dot-pink {
          right: 15%;
          top: 690px;
          background: #e98cc5;
          animation-delay: -4s;
        }

        @keyframes floatBubble {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          25% {
            transform: translate3d(15px, -18px, 0) scale(1.025);
          }

          50% {
            transform: translate3d(-8px, -30px, 0) scale(0.98);
          }

          75% {
            transform: translate3d(-18px, -10px, 0) scale(1.015);
          }
        }

        @keyframes floatDot {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.8;
          }

          50% {
            transform: translate3d(12px, -22px, 0);
            opacity: 1;
          }
        }
      `}</style>

    </main>
  );
}


export default function Analyze() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f3ec]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ddd7e5] border-t-[#6955e8]" />
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
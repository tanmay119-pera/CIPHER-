"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function AnalyzeContent() {
  const searchParams = useSearchParams();

  const searchId = searchParams.get("id") ?? "";
  const searchAmount = searchParams.get("amount") ?? "";

  const [transactionId, setTransactionId] = useState(searchId);
  const [amount, setAmount] = useState(searchAmount);
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevParams, setPrevParams] = useState({ id: searchId, amount: searchAmount });

  if (searchId !== prevParams.id || searchAmount !== prevParams.amount) {
    setPrevParams({ id: searchId, amount: searchAmount });
    if (searchId) setTransactionId(searchId);
    if (searchAmount) setAmount(searchAmount);
  }

  const analyze = () => {
    if (!transactionId || !amount) return;

    setLoading(true);
    setResult(false);

    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 1200);
  };

  const resetAnalysis = () => {
    setResult(false);
    setLoading(false);
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
            AI Transaction Monitoring & Analysis
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Analyze Transaction
          </h2>

          <p className="text-slate-400 mt-2">
            Generate an AI-powered risk assessment and understand
            potentially suspicious behaviour.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* INPUT CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">
              Transaction Details
            </h3>

            <label className="text-sm text-slate-400">
              Transaction ID
            </label>

            <input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              className="w-full mt-2 mb-5 p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-indigo-500"
            />

            <label className="text-sm text-slate-400">
              Amount
            </label>

            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              type="number"
              className="w-full mt-2 mb-6 p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-indigo-500"
            />

            <button
              onClick={analyze}
              disabled={!transactionId || !amount || loading}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 font-semibold transition"
            >
              {loading ? "Analyzing..." : "Analyze with AI"}
            </button>

            {result && (
              <button
                onClick={resetAnalysis}
                className="w-full mt-3 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
              >
                Reset Analysis
              </button>
            )}
          </div>

          {/* RESULT AREA */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                AI Risk Assessment
              </h3>

              {result && (
                <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  AI Analysis Complete
                </span>
              )}
            </div>

            {!result && !loading && (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-2xl">
                  AI
                </div>

                <p className="text-slate-400">
                  Enter transaction details and run AI analysis.
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  Risk score, explanation and model insights will appear here.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-5" />

                <p className="text-lg font-semibold">
                  Analyzing transaction...
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Evaluating transaction behaviour and risk indicators.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-5">

                {/* SCORE CARDS */}
                <div className="grid md:grid-cols-3 gap-4">

                  <div className="bg-slate-800 rounded-xl p-5">
                    <p className="text-sm text-slate-400">
                      Risk Score
                    </p>

                    <div className="flex items-end gap-2 mt-2">
                      <p className="text-4xl font-bold">
                        82
                      </p>

                      <p className="text-slate-500 mb-1">
                        /100
                      </p>
                    </div>

                    <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-2 bg-red-500 rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-5">
                    <p className="text-sm text-slate-400">
                      Risk Status
                    </p>

                    <p className="text-2xl font-bold text-red-400 mt-3">
                      High Risk
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      Requires attention
                    </p>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-5">
                    <p className="text-sm text-slate-400">
                      Transaction Amount
                    </p>

                    <p className="text-2xl font-bold mt-3">
                      ${amount}
                    </p>
                  </div>

                </div>

                {/* EXPLANATION */}
                <div className="bg-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">
                      Why was this transaction flagged?
                    </h4>

                    <span className="text-xs text-slate-500">
                      AI Explanation
                    </span>
                  </div>

                  <p className="text-slate-300 leading-7">
                    The transaction shows an unusually high amount compared
                    with normal transaction patterns. The model has identified
                    this behaviour as a potential anomaly requiring further
                    review.
                  </p>
                </div>

                {/* RISK FACTORS */}
                <div className="bg-slate-800 rounded-xl p-5">
                  <h4 className="font-semibold mb-4">
                    Key Risk Factors
                  </h4>

                  <div className="grid md:grid-cols-2 gap-3">

                    <div className="border border-slate-700 rounded-lg p-4">
                      <p className="text-sm font-medium">
                        Unusual Amount
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Transaction amount differs from expected patterns.
                      </p>
                    </div>

                    <div className="border border-slate-700 rounded-lg p-4">
                      <p className="text-sm font-medium">
                        Behaviour Anomaly
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Transaction behaviour appears unusual.
                      </p>
                    </div>

                    <div className="border border-slate-700 rounded-lg p-4">
                      <p className="text-sm font-medium">
                        Risk Threshold
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Model score exceeds the high-risk threshold.
                      </p>
                    </div>

                    <div className="border border-slate-700 rounded-lg p-4">
                      <p className="text-sm font-medium">
                        Anomaly Detected
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Pattern requires additional investigation.
                      </p>
                    </div>

                  </div>
                </div>

                {/* MODEL INSIGHTS */}
                <div className="bg-slate-800 rounded-xl p-5">
                  <h4 className="font-semibold mb-4">
                    AI Model Insights
                  </h4>

                  <div className="grid md:grid-cols-3 gap-4">

                    <div>
                      <p className="text-xs text-slate-500">
                        Anomaly Detection
                      </p>

                      <p className="mt-1 font-medium text-red-400">
                        Detected
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Model Confidence
                      </p>

                      <p className="mt-1 font-medium">
                        91%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Analysis Status
                      </p>

                      <p className="mt-1 font-medium text-green-400">
                        Complete
                      </p>
                    </div>

                  </div>
                </div>

                {/* TRANSACTION INFO */}
                <div className="bg-slate-800 rounded-xl p-5">
                  <h4 className="font-semibold mb-4">
                    Transaction Information
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">

                    <div>
                      <p className="text-slate-500">
                        Transaction ID
                      </p>

                      <p className="mt-1 font-medium break-all">
                        {transactionId}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Amount
                      </p>

                      <p className="mt-1 font-medium">
                        ${amount}
                      </p>
                    </div>

                  </div>
                </div>

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
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <p className="text-slate-400">
            Loading CIPHER...
          </p>
        </main>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
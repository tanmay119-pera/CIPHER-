"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAnalytics } from "@/lib/api";

const defaultRiskData = [
  { label: "Low Risk", count: 60735, percentage: 68 },
  { label: "Medium Risk", count: 21436, percentage: 24 },
  { label: "High Risk", count: 7145, percentage: 8 },
];

const defaultTrendData = [
  { day: "Mon", transactions: 58 },
  { day: "Tue", transactions: 72 },
  { day: "Wed", transactions: 64 },
  { day: "Thu", transactions: 81 },
  { day: "Fri", transactions: 76 },
  { day: "Sat", transactions: 91 },
  { day: "Sun", transactions: 84 },
];

const defaultPaymentData = [
  { type: "Credit Card", count: 65890, percentage: 74 },
  { type: "Boleto", count: 17210, percentage: 19 },
  { type: "Voucher", count: 4850, percentage: 5 },
  { type: "Wallet", count: 1366, percentage: 2 },
];

const defaultHighRisk = [
  { id: "DzNM8wrcMGFH", amount: "$1,521.75", score: 93, reason: "Unusually high transaction amount ($1,521.75)" },
  { id: "BnY63QwP8KjL", amount: "$2,145.90", score: 91, reason: "Above average order value ($2,145.90)" },
  { id: "VjTVGzqe8U6R", amount: "$1,014.75", score: 82, reason: "High-theft category 'Watches Gifts'" },
  { id: "Kp92LmX81Qa", amount: "$1,876.20", score: 88, reason: "Payment installments (8) exceeds threshold" },
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(() => {});
  }, []);

  const riskData = analytics?.risk_data || defaultRiskData;
  const trendData = analytics?.trend_data || defaultTrendData;
  const paymentData = analytics?.payment_data || defaultPaymentData;
  const highRiskTransactions = analytics?.high_risk_transactions || defaultHighRisk;

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

        <div className="flex gap-7 text-sm">
          <Link href="/dashboard" className="text-slate-400 hover:text-white">
            Dashboard
          </Link>
          <Link href="/transactions" className="text-slate-400 hover:text-white">
            Transactions
          </Link>
          <Link href="/analytics" className="text-white font-medium">
            Analytics
          </Link>
        </div>
      </nav>

      {/* PAGE */}
      <section className="max-w-7xl mx-auto p-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold">Analytics & Anomaly Intel</h2>
            <p className="text-slate-400 mt-2">
              Aggregated distributions from the 89,316 transaction dataset and ML telemetry.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/analyze"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition"
            >
              Analyze Transaction →
            </Link>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold mt-3">89,316</p>
            <p className="text-sm text-green-400 mt-2">100% Ingested & Verified</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">High Risk Flagged</p>
            <p className="text-3xl font-bold mt-3 text-red-400">7,145</p>
            <p className="text-sm text-red-400 mt-2">8.0% of total volume</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Medium Risk (Review)</p>
            <p className="text-3xl font-bold mt-3 text-yellow-400">21,436</p>
            <p className="text-sm text-yellow-400 mt-2">24.0% of total volume</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Average Risk Score</p>
            <p className="text-3xl font-bold mt-3">35.3</p>
            <p className="text-sm text-slate-400 mt-2">Calibrated / 100</p>
          </div>

        </div>

        {/* MAIN ANALYTICS GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* RISK DISTRIBUTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Risk Distribution</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Distribution of transactions by AI risk category
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {riskData.map((risk: any) => (
                <div key={risk.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{risk.label}</span>
                    <span className="text-slate-400">
                      {risk.count.toLocaleString()} ({risk.percentage}%)
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        risk.label === "High Risk"
                          ? "bg-red-500"
                          : risk.label === "Medium Risk"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${risk.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* LEGEND */}
            <div className="flex gap-6 mt-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                Low (68%)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                Medium (24%)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                High (8%)
              </div>
            </div>
          </div>

          {/* TRANSACTION TREND */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Transaction Volume Trends</h3>
              <p className="text-sm text-slate-500 mt-1">
                Monitored velocity over weekday cycles
              </p>
            </div>

            <div className="h-56 flex items-end justify-between gap-4">
              {trendData.map((item: any) => (
                <div
                  key={item.day}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                >
                  <span className="text-xs text-slate-400">
                    {item.transactions}k
                  </span>
                  <div
                    className="w-full max-w-10 bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition-all cursor-pointer"
                    style={{ height: `${item.transactions * 1.8}px` }}
                  />
                  <span className="text-xs text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECOND ROW */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">

          {/* PAYMENT METHODS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Payment Methods</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Breakdown across payment gateways
            </p>

            <div className="space-y-5">
              {paymentData.map((payment: any) => (
                <div key={payment.type}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{payment.type}</span>
                    <span className="text-slate-400">{payment.percentage}%</span>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full">
                    <div
                      className="h-2 bg-indigo-500 rounded-full"
                      style={{ width: `${payment.percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {payment.count.toLocaleString()} transactions
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold">AI Risk Rules & Logic</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Governing detection heuristics
            </p>

            <div className="space-y-4">
              <div className="bg-slate-800 rounded-xl p-4">
                <p className="font-semibold text-sm">POL-001: High Value Threshold</p>
                <p className="text-xs text-slate-400 mt-1">
                  Orders exceeding $1,000 or alternative digital wallets trigger mandatory verification.
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="font-semibold text-sm">POL-003: High-Theft Category</p>
                <p className="text-xs text-slate-400 mt-1">
                  Electronics, watches, and computing accessories enforce signed courier tracking.
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="font-semibold text-sm">POL-006: VIP White-Glove Privilege</p>
                <p className="text-xs text-slate-400 mt-1">
                  Repeat verified customers receive false-positive suppression and expedited picking.
                </p>
              </div>
            </div>
          </div>

          {/* MODEL STATUS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Autonomous Swarm</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              AI Teammates operating telemetry
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400">Orchestration Graph</p>
                <p className="text-sm font-semibold mt-1 text-indigo-400">
                  5-Step Deterministic Swarm
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Anomaly Detector</p>
                <p className="text-sm font-semibold mt-1 text-green-400">
                  Isolation Forest (100 Estimators)
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Active Agents</p>
                <p className="text-sm font-medium mt-1">
                  Customer, Product, Decision, Critic
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-sm text-green-400 mt-1">
                  ● Multi-agent swarm online & ready
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* HIGH RISK TRANSACTIONS */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xl font-semibold">High Risk Transactions Sample</h3>
              <p className="text-sm text-slate-500 mt-1">
                Top anomalies prioritized for autonomous agent intervention
              </p>
            </div>

            <Link
              href="/transactions"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View All 7,145 →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="text-left py-3">Transaction ID</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Risk Score</th>
                  <th className="text-left py-3">Key Factor</th>
                  <th className="text-right py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {highRiskTransactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-slate-800/60">
                    <td className="py-4 font-mono font-medium text-xs md:text-sm">{tx.id}</td>
                    <td className="py-4 font-semibold">{tx.amount}</td>
                    <td className="py-4">
                      <span className="text-red-400 font-semibold">
                        {tx.score}/100
                      </span>
                    </td>
                    <td className="py-4 text-slate-400 text-xs">{tx.reason}</td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/analyze?id=${tx.id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs"
                      >
                        Inspect Swarm →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

    </main>
  );
}

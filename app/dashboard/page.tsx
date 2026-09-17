"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStats, fetchTransactions, Transaction, StatsResponse } from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState<StatsResponse>({
    total_transactions: 89316,
    high_risk: 7145,
    medium_risk: 21436,
    low_risk: 60735,
    average_risk_score: 35.3,
    percentages: { low: 68, medium: 24, high: 8 }
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    { id: "Axfy13Hk4PIk", amount: 259.14, type: "Credit Card", score: 9, status: "Low Risk", date: "22 Oct 2017, 18:57" },
    { id: "v6px92oS8cLG", amount: 382.39, type: "Credit Card", score: 46, status: "Medium Risk", date: "20 Jun 2018, 21:40" },
    { id: "VjTVGzqe8U6R", amount: 1014.75, type: "Credit Card", score: 51, status: "Medium Risk", date: "01 Sep 2017, 14:38" },
    { id: "DzNM8wrcMGFH", amount: 1521.75, type: "Wallet", score: 93, status: "High Risk", date: "24 Nov 2017, 19:12" },
  ]);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
    fetchTransactions(1, 5).then((data) => {
      if (data?.transactions?.length) {
        setRecentTransactions(data.transactions);
      }
    }).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="border-b border-slate-800 px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CIPHER</h1>
          <p className="text-xs text-slate-400">
            AI Transaction Monitoring & Analysis
          </p>
        </div>

        <div className="flex gap-7 text-sm">
          <Link href="/dashboard" className="text-white font-medium">
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className="text-slate-400 hover:text-white"
          >
            Transactions
          </Link>

          <Link
            href="/analytics"
            className="text-slate-400 hover:text-white"
          >
            Analytics
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto p-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-slate-400 mt-2">
            Monitor transactions and identify potentially risky activity.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold mt-3">
              {stats.total_transactions.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">High Risk</p>
            <p className="text-3xl font-bold mt-3 text-red-400">
              {stats.high_risk.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Medium Risk</p>
            <p className="text-3xl font-bold mt-3 text-yellow-400">
              {stats.medium_risk.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Average Risk Score</p>
            <p className="text-3xl font-bold mt-3">
              {stats.average_risk_score}
            </p>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* RISK OVERVIEW */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h3 className="text-xl font-semibold mb-6">
              Risk Overview
            </h3>

            <div className="space-y-5">

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Low Risk</span>
                  <span className="text-slate-400">{stats.percentages.low}%</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full">
                  <div 
                    className="h-3 bg-green-500 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.percentages.low}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Medium Risk</span>
                  <span className="text-slate-400">{stats.percentages.medium}%</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full">
                  <div 
                    className="h-3 bg-yellow-500 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.percentages.medium}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>High Risk</span>
                  <span className="text-slate-400">{stats.percentages.high}%</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full">
                  <div 
                    className="h-3 bg-red-500 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.percentages.high}%` }} 
                  />
                </div>
              </div>

            </div>

            <Link
              href="/analytics"
              className="block text-center mt-8 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              View Analytics
            </Link>

          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold">
                Recent Transactions
              </h3>

              <Link
                href="/transactions"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="text-left py-3">Order ID</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Payment</th>
                    <th className="text-left py-3">Risk</th>
                    <th className="text-right py-3">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-800/60 hover:bg-slate-800/30 transition"
                    >

                      <td className="py-4 font-mono font-medium text-xs md:text-sm">
                        {tx.id}
                      </td>

                      <td className="py-4 font-semibold">
                        ${typeof tx.amount === "number" ? tx.amount.toFixed(2) : tx.amount}
                      </td>

                      <td className="py-4 text-slate-400">
                        {tx.type}
                      </td>

                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            tx.score >= 70
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : tx.score >= 40
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-green-500/10 text-green-400 border border-green-500/20"
                          }`}
                        >
                          {tx.status} ({tx.score})
                        </span>
                      </td>

                      <td className="py-4 text-right">
                        <Link
                          href={`/analyze?id=${tx.id}&amount=${tx.amount}`}
                          className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
                        >
                          Analyze →
                        </Link>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* ANALYZE BUTTON */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <h3 className="text-lg font-semibold">
              Analyze a Transaction with AI Teammates
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Deploy Customer, Product, Decision, and Critic agents to autonomously review anomalies.
            </p>
          </div>

          <Link
            href="/analyze"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold transition"
          >
            Launch Swarm Analysis →
          </Link>

        </div>

      </section>

    </main>
  );
}

"use client";

import Link from "next/link";

const transactions = [
  {
    id: "Axfy13Hk4p1",
    amount: "259.14",
    type: "credit_card",
    score: 18,
    status: "Low Risk",
  },
  {
    id: "v6px92Os8cLG",
    amount: "382.39",
    type: "credit_card",
    score: 34,
    status: "Medium Risk",
  },
  {
    id: "VjTVGzqe8U6R",
    amount: "1014.75",
    type: "credit_card",
    score: 82,
    status: "High Risk",
  },
  {
    id: "DzNM8wrcMGFH",
    amount: "1521.75",
    type: "wallet",
    score: 91,
    status: "High Risk",
  },
];

export default function Home() {
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
          <Link href="/" className="text-white font-medium">
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
            <p className="text-3xl font-bold mt-3">99,441</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">High Risk</p>
            <p className="text-3xl font-bold mt-3">4,823</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Medium Risk</p>
            <p className="text-3xl font-bold mt-3">12,641</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Average Risk Score</p>
            <p className="text-3xl font-bold mt-3">32.6</p>
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
                  <span className="text-slate-400">68%</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full">
                  <div className="h-3 bg-green-500 rounded-full w-[68%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Medium Risk</span>
                  <span className="text-slate-400">24%</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full">
                  <div className="h-3 bg-yellow-500 rounded-full w-[24%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>High Risk</span>
                  <span className="text-slate-400">8%</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full">
                  <div className="h-3 bg-red-500 rounded-full w-[8%]" />
                </div>
              </div>

            </div>

            <Link
              href="/analytics"
              className="block text-center mt-8 py-3 rounded-lg bg-slate-800 hover:bg-slate-700"
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
                View All
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
                  </tr>
                </thead>

                <tbody>

                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-800/60"
                    >

                      <td className="py-4">
                        {tx.id}
                      </td>

                      <td className="py-4">
                        ${tx.amount}
                      </td>

                      <td className="py-4 text-slate-400">
                        {tx.type}
                      </td>

                      <td className="py-4">
                        <span
                          className={
                            tx.score >= 70
                              ? "text-red-400"
                              : tx.score >= 40
                              ? "text-yellow-400"
                              : "text-green-400"
                          }
                        >
                          {tx.status}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* ANALYZE BUTTON */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">

          <div>
            <h3 className="text-lg font-semibold">
              Analyze a Transaction
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Use AI to detect unusual transaction behavior.
            </p>
          </div>

          <Link
            href="/analyze"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold"
          >
            Analyze Transaction
          </Link>

        </div>

      </section>

    </main>
  );
}
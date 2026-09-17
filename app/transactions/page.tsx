"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTransactions, Transaction } from "@/lib/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState<number>(89316);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchTransactions(page, 25, riskFilter, paymentFilter, search)
      .then((res) => {
        if (isMounted && res) {
          setTransactions(res.transactions);
          setTotalCount(res.total);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, riskFilter, paymentFilter, search]);

  const getRiskStyle = (score: number) => {
    if (score >= 70) {
      return {
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
      };
    }
    if (score >= 40) {
      return {
        text: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
      };
    }
    return {
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    };
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

        <div className="flex gap-7 text-sm">
          <Link href="/dashboard" className="text-slate-400 hover:text-white">
            Dashboard
          </Link>
          <Link href="/transactions" className="text-white font-medium">
            Transactions
          </Link>
          <Link href="/analytics" className="text-slate-400 hover:text-white">
            Analytics
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Transactions</h2>
          <p className="text-slate-400 mt-2">
            Real-time multi-agent monitoring and risk triage over 89,000+ e-commerce transactions.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Total Ingested</p>
            <p className="text-3xl font-bold mt-2">89,316</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">High Risk Flagged</p>
            <p className="text-3xl font-bold mt-2 text-red-400">7,145</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Medium Risk</p>
            <p className="text-3xl font-bold mt-2 text-yellow-400">21,436</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Matched Queries</p>
            <p className="text-3xl font-bold mt-2">{totalCount.toLocaleString()}</p>
          </div>

        </div>

        {/* TABLE CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* FILTER BAR */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex flex-col lg:flex-row gap-4">

              {/* SEARCH */}
              <div className="flex-1">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by Order ID or City (e.g. Sao Paulo, DzNM8wrcMGFH)..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              {/* RISK FILTER */}
              <select
                value={riskFilter}
                onChange={(e) => {
                  setRiskFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none cursor-pointer"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low Risk">Low Risk (&lt; 40)</option>
                <option value="Medium Risk">Medium Risk (40-69)</option>
                <option value="High Risk">High Risk (≥ 70)</option>
              </select>

              {/* PAYMENT FILTER */}
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none cursor-pointer"
              >
                <option value="All">All Payment Types</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Wallet">Wallet</option>
                <option value="Boleto">Boleto</option>
                <option value="Voucher">Voucher</option>
              </select>

            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="text-left px-6 py-4 font-medium">Transaction ID</th>
                  <th className="text-left px-6 py-4 font-medium">Amount</th>
                  <th className="text-left px-6 py-4 font-medium">Payment Type</th>
                  <th className="text-left px-6 py-4 font-medium">Risk Score</th>
                  <th className="text-left px-6 py-4 font-medium">Status</th>
                  <th className="text-left px-6 py-4 font-medium">Date</th>
                  <th className="text-right px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
                      Loading live dataset records...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-500">
                      No transactions found matching filters.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const risk = getRiskStyle(tx.score);
                    return (
                      <tr
                        key={tx.id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/40 transition"
                      >
                        <td className="px-6 py-4 font-mono font-medium text-xs md:text-sm">
                          {tx.id}
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          ${typeof tx.amount === "number" ? tx.amount.toFixed(2) : tx.amount}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {tx.type}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">{tx.score}</span>
                            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  tx.score >= 70 ? "bg-red-500" : tx.score >= 40 ? "bg-yellow-500" : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min(100, tx.score)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${risk.bg} ${risk.text} ${risk.border}`}
                          >
                            {tx.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs">
                          {tx.date}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/analyze?id=${tx.id}&amount=${tx.amount}`}
                            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium text-xs bg-indigo-500/10 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition"
                          >
                            Analyze Swarm →
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-400">
            <span>
              Showing Page <strong className="text-white">{page}</strong> of{" "}
              <strong className="text-white">{Math.max(1, Math.ceil(totalCount / 25))}</strong> (
              {totalCount.toLocaleString()} total transactions)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800 transition text-xs"
              >
                ← Previous
              </button>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 25 >= totalCount}
                className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800 transition text-xs"
              >
                Next →
              </button>

              <Link
                href="/analyze"
                className="ml-3 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                + Custom Analysis
              </Link>
            </div>
          </div>

        </div>

      </section>

    </main>
  );
}

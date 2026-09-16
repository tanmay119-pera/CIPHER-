"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type RiskLevel = "Low Risk" | "Medium Risk" | "High Risk";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  score: number;
  status: RiskLevel;
  date: string;
};

const transactions: Transaction[] = [
  {
    id: "Axfy13Hk4p1",
    amount: 259.14,
    type: "Credit Card",
    score: 18,
    status: "Low Risk",
    date: "16 Sep 2026, 09:42",
  },
  {
    id: "v6px92Os8cLG",
    amount: 382.39,
    type: "Credit Card",
    score: 34,
    status: "Medium Risk",
    date: "16 Sep 2026, 10:18",
  },
  {
    id: "VjTVGzqe8U6R",
    amount: 1014.75,
    type: "Credit Card",
    score: 82,
    status: "High Risk",
    date: "16 Sep 2026, 11:03",
  },
  {
    id: "DzNM8wrcMGFH",
    amount: 1521.75,
    type: "Wallet",
    score: 91,
    status: "High Risk",
    date: "16 Sep 2026, 11:47",
  },
  {
    id: "KpQm72Ld91Xz",
    amount: 145.5,
    type: "Wallet",
    score: 12,
    status: "Low Risk",
    date: "16 Sep 2026, 12:15",
  },
  {
    id: "TxR84LmQ21Az",
    amount: 678.2,
    type: "Voucher",
    score: 56,
    status: "Medium Risk",
    date: "16 Sep 2026, 12:44",
  },
  {
    id: "BnY63QwP8KjL",
    amount: 2145.9,
    type: "Credit Card",
    score: 88,
    status: "High Risk",
    date: "16 Sep 2026, 13:21",
  },
  {
    id: "LmZ52RtN7VxP",
    amount: 89.99,
    type: "Wallet",
    score: 9,
    status: "Low Risk",
    date: "16 Sep 2026, 14:02",
  },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(search.toLowerCase());

      const matchesRisk =
        riskFilter === "All" || tx.status === riskFilter;

      const matchesPayment =
        paymentFilter === "All" || tx.type === paymentFilter;

      return matchesSearch && matchesRisk && matchesPayment;
    });
  }, [search, riskFilter, paymentFilter]);

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
          <Link href="/" className="text-2xl font-bold">
            CIPHER
          </Link>

          <p className="text-xs text-slate-400">
            AI Transaction Monitoring & Analysis
          </p>
        </div>

        <div className="flex gap-7 text-sm">
          <Link
            href="/"
            className="text-slate-400 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className="text-white font-medium"
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

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Transactions
          </h2>

          <p className="text-slate-400 mt-2">
            Monitor, filter and investigate transaction risk.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">
              Total Transactions
            </p>

            <p className="text-3xl font-bold mt-2">
              {transactions.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">
              High Risk
            </p>

            <p className="text-3xl font-bold mt-2 text-red-400">
              {transactions.filter((tx) => tx.score >= 70).length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">
              Medium Risk
            </p>

            <p className="text-3xl font-bold mt-2 text-yellow-400">
              {transactions.filter(
                (tx) => tx.score >= 40 && tx.score < 70
              ).length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">
              Showing
            </p>

            <p className="text-3xl font-bold mt-2">
              {filteredTransactions.length}
            </p>
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search transaction ID..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              {/* RISK FILTER */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
              </select>

              {/* PAYMENT FILTER */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
              >
                <option value="All">All Payment Types</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Wallet">Wallet</option>
                <option value="Voucher">Voucher</option>
              </select>

            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-slate-800 text-slate-400">

                  <th className="text-left px-6 py-4 font-medium">
                    Transaction ID
                  </th>

                  <th className="text-left px-6 py-4 font-medium">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4 font-medium">
                    Payment Type
                  </th>

                  <th className="text-left px-6 py-4 font-medium">
                    Risk Score
                  </th>

                  <th className="text-left px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 font-medium">
                    Date
                  </th>

                  <th className="text-right px-6 py-4 font-medium">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredTransactions.length === 0 ? (

                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-slate-500"
                    >
                      No transactions found.
                    </td>
                  </tr>

                ) : (

                  filteredTransactions.map((tx) => {

                    const risk = getRiskStyle(tx.score);

                    return (
                      <tr
                        key={tx.id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/40 transition"
                      >

                        {/* ID */}
                        <td className="px-6 py-5 font-medium">
                          {tx.id}
                        </td>

                        {/* AMOUNT */}
                        <td className="px-6 py-5">
                          ${tx.amount.toFixed(2)}
                        </td>

                        {/* PAYMENT */}
                        <td className="px-6 py-5 text-slate-400">
                          {tx.type}
                        </td>

                        {/* SCORE */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <span className="font-semibold">
                              {tx.score}
                            </span>

                            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">

                              <div
                                className={`h-full rounded-full ${
                                  tx.score >= 70
                                    ? "bg-red-500"
                                    : tx.score >= 40
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${tx.score}%`,
                                }}
                              />

                            </div>

                          </div>

                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${risk.bg} ${risk.text} ${risk.border}`}
                          >
                            {tx.status}
                          </span>

                        </td>

                        {/* DATE */}
                        <td className="px-6 py-5 text-slate-400 whitespace-nowrap">
                          {tx.date}
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-5 text-right">

                          <Link
                            href={`/analyze?id=${tx.id}&amount=${tx.amount}`}
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            Analyze →
                          </Link>

                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-400">

            <span>
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions
            </span>

            <Link
              href="/analyze"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            >
              + Analyze New Transaction
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
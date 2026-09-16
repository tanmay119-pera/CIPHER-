"use client";

import Link from "next/link";

const riskData = [
  { label: "Low Risk", count: 67600, percentage: 68 },
  { label: "Medium Risk", count: 23800, percentage: 24 },
  { label: "High Risk", count: 8041, percentage: 8 },
];

const trendData = [
  { day: "Mon", transactions: 58 },
  { day: "Tue", transactions: 72 },
  { day: "Wed", transactions: 64 },
  { day: "Thu", transactions: 81 },
  { day: "Fri", transactions: 76 },
  { day: "Sat", transactions: 91 },
  { day: "Sun", transactions: 84 },
];

const paymentData = [
  { type: "Credit Card", count: 52140, percentage: 52 },
  { type: "Wallet", count: 28420, percentage: 29 },
  { type: "Boleto", count: 11980, percentage: 12 },
  { type: "Voucher", count: 6901, percentage: 7 },
];

const highRiskTransactions = [
  {
    id: "DzNM8wrcMGFH",
    amount: "$1521.75",
    score: 91,
    reason: "Unusual amount",
  },
  {
    id: "VjTVGzqe8U6R",
    amount: "$1014.75",
    score: 82,
    reason: "Behaviour anomaly",
  },
  {
    id: "Kp92LmX81Qa",
    amount: "$1876.20",
    score: 88,
    reason: "Unusual transaction pattern",
  },
];

export default function Analytics() {
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
          <Link
            href="/"
            className="text-slate-400 hover:text-white"
          >
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
            className="text-white font-medium"
          >
            Analytics
          </Link>
        </div>
      </nav>

      {/* PAGE */}
      <section className="max-w-7xl mx-auto p-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold">
              Analytics
            </h2>

            <p className="text-slate-400 mt-2">
              Monitor transaction patterns and AI-based risk insights.
            </p>
          </div>

          <div className="flex gap-3">
            <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>

            <Link
              href="/analyze"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold"
            >
              Analyze Transaction
            </Link>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Total Transactions
            </p>
            <p className="text-3xl font-bold mt-3">
              99,441
            </p>
            <p className="text-sm text-green-400 mt-2">
              +8.4% from previous period
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              High Risk
            </p>
            <p className="text-3xl font-bold mt-3">
              4,823
            </p>
            <p className="text-sm text-red-400 mt-2">
              8% of transactions
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Medium Risk
            </p>
            <p className="text-3xl font-bold mt-3">
              12,641
            </p>
            <p className="text-sm text-yellow-400 mt-2">
              24% of transactions
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Average Risk Score
            </p>
            <p className="text-3xl font-bold mt-3">
              32.6
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Out of 100
            </p>
          </div>

        </div>

        {/* MAIN ANALYTICS GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* RISK DISTRIBUTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">
                  Risk Distribution
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Distribution of transactions by AI risk category
                </p>
              </div>
            </div>

            <div className="space-y-6">

              {riskData.map((risk) => (
                <div key={risk.label}>

                  <div className="flex justify-between text-sm mb-2">
                    <span>{risk.label}</span>

                    <span className="text-slate-400">
                      {risk.count.toLocaleString()} ({risk.percentage}%)
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
                        risk.label === "High Risk"
                          ? "bg-red-500"
                          : risk.label === "Medium Risk"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${risk.percentage}%`,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

            {/* LEGEND */}
            <div className="flex gap-6 mt-8 text-sm text-slate-400">

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                Low
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                Medium
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                High
              </div>

            </div>

          </div>

          {/* TRANSACTION TREND */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                Transaction Trends
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Transaction volume over the selected period
              </p>
            </div>

            <div className="h-56 flex items-end justify-between gap-4">

              {trendData.map((item) => (
                <div
                  key={item.day}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                >

                  <span className="text-xs text-slate-400">
                    {item.transactions}k
                  </span>

                  <div
                    className="w-full max-w-10 bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition-all"
                    style={{
                      height: `${item.transactions * 1.8}px`,
                    }}
                  />

                  <span className="text-xs text-slate-500">
                    {item.day}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* SECOND ROW */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">

          {/* PAYMENT TYPES */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h3 className="text-xl font-semibold">
              Payment Methods
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Transaction distribution by payment type
            </p>

            <div className="space-y-5">

              {paymentData.map((payment) => (
                <div key={payment.type}>

                  <div className="flex justify-between text-sm mb-2">
                    <span>{payment.type}</span>

                    <span className="text-slate-400">
                      {payment.percentage}%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full">
                    <div
                      className="h-2 bg-indigo-500 rounded-full"
                      style={{
                        width: `${payment.percentage}%`,
                      }}
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

            <h3 className="text-xl font-semibold">
              AI Risk Insights
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Patterns identified by the monitoring system
            </p>

            <div className="space-y-4">

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="font-semibold">
                  Unusual Amount
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Large transaction amounts are deviating from
                  expected transaction patterns.
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="font-semibold">
                  Behaviour Anomaly
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Transaction behaviour appears different from
                  historical patterns.
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="font-semibold">
                  High Risk Threshold
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Transactions exceeding the model threshold
                  require additional investigation.
                </p>
              </div>

            </div>

          </div>

          {/* MODEL STATUS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h3 className="text-xl font-semibold">
              Model Performance
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Current AI monitoring status
            </p>

            <div className="space-y-5">

              <div>
                <p className="text-sm text-slate-400">
                  Anomaly Detection
                </p>

                <p className="text-lg font-semibold mt-1 text-green-400">
                  Active
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Model Confidence
                </p>

                <p className="text-2xl font-bold mt-1">
                  91%
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Transactions Analyzed
                </p>

                <p className="text-2xl font-bold mt-1">
                  99,441
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-500">
                  Status
                </p>

                <p className="text-sm text-green-400 mt-1">
                  ● Monitoring system operational
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* HIGH RISK TRANSACTIONS */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h3 className="text-xl font-semibold">
                High Risk Transactions
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Transactions requiring further review
              </p>
            </div>

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

                  <th className="text-left py-3">
                    Transaction ID
                  </th>

                  <th className="text-left py-3">
                    Amount
                  </th>

                  <th className="text-left py-3">
                    Risk Score
                  </th>

                  <th className="text-left py-3">
                    Key Factor
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {highRiskTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-slate-800/60"
                  >

                    <td className="py-4 font-medium">
                      {tx.id}
                    </td>

                    <td className="py-4">
                      {tx.amount}
                    </td>

                    <td className="py-4">
                      <span className="text-red-400 font-semibold">
                        {tx.score}/100
                      </span>
                    </td>

                    <td className="py-4 text-slate-400">
                      {tx.reason}
                    </td>

                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs">
                        High Risk
                      </span>
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
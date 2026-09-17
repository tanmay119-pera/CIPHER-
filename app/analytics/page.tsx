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
  {
    id: "DzNM8wrcMGFH",
    amount: "$1,521.75",
    score: 93,
    reason: "Unusually high transaction amount ($1,521.75)",
  },
  {
    id: "BnY63QwP8KjL",
    amount: "$2,145.90",
    score: 91,
    reason: "Above average order value ($2,145.90)",
  },
  {
    id: "VjTVGzqe8U6R",
    amount: "$1,014.75",
    score: 82,
    reason: "High-theft category 'Watches Gifts'",
  },
  {
    id: "Kp92LmX81Qa",
    amount: "$1,876.20",
    score: 88,
    reason: "Payment installments (8) exceeds threshold",
  },
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [dark, setDark] = useState(true);

  /* ---------------------------------------------
     LOAD SAVED THEME
  --------------------------------------------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("cipher-theme");

    if (savedTheme === "light") {
      setDark(false);
    } else {
      setDark(true);
    }
  }, []);

  /* ---------------------------------------------
     LOAD ANALYTICS
  --------------------------------------------- */
  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(() => {});
  }, []);

  /* ---------------------------------------------
     THEME CHANGE
  --------------------------------------------- */
  const changeTheme = (isDark: boolean) => {
    setDark(isDark);

    localStorage.setItem(
      "cipher-theme",
      isDark ? "dark" : "light"
    );
  };

  const riskData = analytics?.risk_data || defaultRiskData;
  const trendData = analytics?.trend_data || defaultTrendData;
  const paymentData =
    analytics?.payment_data || defaultPaymentData;
  const highRiskTransactions =
    analytics?.high_risk_transactions || defaultHighRisk;

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${
        dark
          ? "bg-[#0B0812] text-white"
          : "bg-[#F7F2EA] text-[#211827]"
      }`}
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Central glow */}
        <div
          className={`absolute left-1/2 top-[35%] h-[600px] w-[600px]
          -translate-x-1/2 rounded-full blur-3xl transition-all duration-700 ${
            dark
              ? "bg-purple-500/[0.10]"
              : "bg-purple-300/[0.20]"
          }`}
        />

        {/* Pink glow */}
        <div
          className={`absolute -left-48 top-20 h-[450px] w-[450px]
          rounded-full blur-3xl transition-all duration-700 ${
            dark
              ? "bg-pink-500/[0.08]"
              : "bg-pink-300/[0.18]"
          }`}
        />

        {/* Cyan glow */}
        <div
          className={`absolute -right-48 bottom-20 h-[450px] w-[450px]
          rounded-full blur-3xl transition-all duration-700 ${
            dark
              ? "bg-cyan-400/[0.08]"
              : "bg-cyan-300/[0.18]"
          }`}
        />

        {/* =================================================
            FLOATING BUBBLES
        ================================================== */}

        <div
          className={`absolute left-[5%] top-[18%] h-36 w-36 rounded-full border bubble-one ${
            dark
              ? "border-purple-300/20 bg-purple-400/[0.06]"
              : "border-purple-500/20 bg-purple-300/[0.18]"
          }`}
        />

        <div
          className={`absolute right-[7%] top-[23%] h-44 w-44 rounded-full border bubble-two ${
            dark
              ? "border-cyan-300/20 bg-cyan-400/[0.05]"
              : "border-cyan-500/20 bg-cyan-300/[0.15]"
          }`}
        />

        <div
          className={`absolute left-[13%] bottom-[18%] h-40 w-40 rounded-full border bubble-three ${
            dark
              ? "border-pink-300/20 bg-pink-400/[0.05]"
              : "border-pink-500/20 bg-pink-300/[0.15]"
          }`}
        />

        <div
          className={`absolute right-[14%] bottom-[10%] h-28 w-28 rounded-full border bubble-four ${
            dark
              ? "border-yellow-200/20 bg-yellow-300/[0.05]"
              : "border-yellow-500/20 bg-yellow-300/[0.15]"
          }`}
        />

        {/* Small floating particles */}

        <div
          className={`absolute left-[28%] top-[20%] h-2 w-2 rounded-full ${
            dark
              ? "bg-purple-300 shadow-[0_0_12px_#C084FC]"
              : "bg-purple-500"
          } bubble-five`}
        />

        <div
          className={`absolute right-[30%] top-[32%] h-2 w-2 rounded-full ${
            dark
              ? "bg-cyan-300 shadow-[0_0_12px_#67E8F9]"
              : "bg-cyan-500"
          } bubble-six`}
        />

        <div
          className={`absolute left-[35%] bottom-[15%] h-1.5 w-1.5 rounded-full ${
            dark
              ? "bg-pink-300 shadow-[0_0_10px_#F472B6]"
              : "bg-pink-500"
          } bubble-seven`}
        />

        {/* Subtle grid */}

        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            dark ? "opacity-[0.025]" : "opacity-[0.035]"
          }`}
          style={{
            backgroundImage: dark
              ? "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)"
              : "linear-gradient(#211827 1px, transparent 1px), linear-gradient(90deg, #211827 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style jsx>{`
        @keyframes floatOne {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          25% {
            transform: translate(45px, -55px) scale(1.08);
          }
          50% {
            transform: translate(-25px, -90px) scale(0.95);
          }
          75% {
            transform: translate(35px, -35px) scale(1.05);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes floatTwo {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          25% {
            transform: translate(-55px, 45px) scale(0.92);
          }
          50% {
            transform: translate(25px, 90px) scale(1.08);
          }
          75% {
            transform: translate(-35px, 25px) scale(0.97);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes floatThree {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          30% {
            transform: translate(65px, -30px) scale(1.1);
          }
          60% {
            transform: translate(-30px, -70px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes floatFour {
          0% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(-45px, -55px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(0px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-45px);
            opacity: 1;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.5;
          }
        }

        .bubble-one {
          animation: floatOne 15s ease-in-out infinite;
        }

        .bubble-two {
          animation: floatTwo 18s ease-in-out infinite;
        }

        .bubble-three {
          animation: floatThree 20s ease-in-out infinite;
        }

        .bubble-four {
          animation: floatFour 13s ease-in-out infinite;
        }

        .bubble-five {
          animation: particleFloat 7s ease-in-out infinite;
        }

        .bubble-six {
          animation: particleFloat 9s ease-in-out infinite reverse;
        }

        .bubble-seven {
          animation: particleFloat 8s ease-in-out infinite;
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav
        className={`relative z-20 border-b px-8 py-5 backdrop-blur-xl transition-colors duration-700 ${
          dark
            ? "border-white/[0.08] bg-[#0B0812]/70"
            : "border-black/[0.08] bg-[#F7F2EA]/75"
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          {/* LOGO */}

          <Link href="/dashboard" className="group flex items-center gap-3">
            <div
              className={`relative flex h-11 w-11 items-center justify-center
              rounded-[13px] border transition-all duration-500 ${
                dark
                  ? "border-purple-300/30 bg-purple-400/[0.08] shadow-lg shadow-purple-500/10"
                  : "border-purple-300/40 bg-white shadow-lg shadow-purple-300/20"
              }`}
            >
              <span
                className={`text-xl font-black ${
                  dark ? "text-[#FFFDF8]" : "text-[#211827]"
                }`}
              >
                C
              </span>

              <span
                className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                  dark
                    ? "bg-cyan-300 shadow-[0_0_8px_#67E8F9]"
                    : "bg-cyan-500"
                }`}
              />

              <span
                className={`absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${
                  dark
                    ? "bg-pink-300 shadow-[0_0_8px_#F9A8D4]"
                    : "bg-pink-500"
                }`}
              />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-[0.16em]">
                CIPHER
              </h1>

              <p
                className={`text-[9px] font-semibold tracking-[0.16em] ${
                  dark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                AI TRANSACTION INTELLIGENCE
              </p>
            </div>
          </Link>

          {/* NAV LINKS + THEME */}

          <div className="flex items-center gap-5 md:gap-7">
            <div className="hidden items-center gap-7 text-sm md:flex">
              <Link
                href="/dashboard"
                className={`font-medium transition ${
                  dark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-[#211827]"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/transactions"
                className={`font-medium transition ${
                  dark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-[#211827]"
                }`}
              >
                Transactions
              </Link>

              <Link
                href="/analytics"
                className={`font-bold ${
                  dark ? "text-white" : "text-[#211827]"
                }`}
              >
                Analytics
              </Link>
            </div>

            {/* THEME SELECTOR */}

            <div
              className={`flex items-center gap-1 rounded-full border p-1 backdrop-blur-xl ${
                dark
                  ? "border-white/10 bg-white/[0.06]"
                  : "border-black/10 bg-white/75"
              }`}
            >
              <button
                onClick={() => changeTheme(false)}
                aria-label="Light mode"
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
                  !dark
                    ? "bg-[#211827] text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ☀
              </button>

              <button
                onClick={() => changeTheme(true)}
                aria-label="Dark mode"
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
                  dark
                    ? "bg-white text-[#211827] shadow-md"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                ☾
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAV */}

        <div className="mt-4 flex gap-5 text-xs md:hidden">
          <Link
            href="/dashboard"
            className={
              dark
                ? "text-gray-400"
                : "text-gray-500"
            }
          >
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className={
              dark
                ? "text-gray-400"
                : "text-gray-500"
            }
          >
            Transactions
          </Link>

          <Link
            href="/analytics"
            className={
              dark
                ? "font-bold text-white"
                : "font-bold text-[#211827]"
            }
          >
            Analytics
          </Link>
        </div>
      </nav>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  dark
                    ? "bg-cyan-300 shadow-[0_0_10px_#67E8F9]"
                    : "bg-cyan-600"
                }`}
              />

              <span
                className={`text-[10px] font-black uppercase tracking-[0.25em] ${
                  dark ? "text-cyan-300" : "text-cyan-700"
                }`}
              >
                Intelligence Center
              </span>
            </div>

            <h2
              className={`text-3xl font-black md:text-4xl ${
                dark ? "text-[#FFFDF8]" : "text-[#211827]"
              }`}
            >
              Analytics & Anomaly Intel
            </h2>

            <p
              className={`mt-2 max-w-2xl text-sm font-semibold ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Aggregated distributions from the 89,316 transaction
              dataset and ML telemetry.
            </p>
          </div>

          <Link
            href="/analyze"
            className={`rounded-xl px-5 py-3 text-sm font-black transition-all hover:scale-[1.02] ${
              dark
                ? "bg-white text-[#211827] shadow-lg shadow-white/10 hover:bg-yellow-100"
                : "bg-[#211827] text-white shadow-lg hover:bg-purple-700"
            }`}
          >
            Analyze Transaction →
          </Link>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl transition-all ${
              dark
                ? "border-white/[0.08] bg-white/[0.035] hover:bg-white/[0.055]"
                : "border-black/[0.07] bg-white/70 shadow-sm hover:bg-white/90"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Transactions
            </p>

            <p className="mt-3 text-3xl font-black">
              89,316
            </p>

            <p
              className={`mt-2 text-sm font-bold ${
                dark ? "text-green-400" : "text-green-700"
              }`}
            >
              100% Ingested & Verified
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl transition-all ${
              dark
                ? "border-white/[0.08] bg-white/[0.035] hover:bg-white/[0.055]"
                : "border-black/[0.07] bg-white/70 shadow-sm hover:bg-white/90"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              High Risk Flagged
            </p>

            <p className="mt-3 text-3xl font-black text-red-400">
              7,145
            </p>

            <p className="mt-2 text-sm font-bold text-red-400">
              8.0% of total volume
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl transition-all ${
              dark
                ? "border-white/[0.08] bg-white/[0.035] hover:bg-white/[0.055]"
                : "border-black/[0.07] bg-white/70 shadow-sm hover:bg-white/90"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Medium Risk (Review)
            </p>

            <p className="mt-3 text-3xl font-black text-yellow-400">
              21,436
            </p>

            <p className="mt-2 text-sm font-bold text-yellow-500">
              24.0% of total volume
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl transition-all ${
              dark
                ? "border-white/[0.08] bg-white/[0.035] hover:bg-white/[0.055]"
                : "border-black/[0.07] bg-white/70 shadow-sm hover:bg-white/90"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Average Risk Score
            </p>

            <p className="mt-3 text-3xl font-black">
              35.3
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Calibrated / 100
            </p>
          </div>
        </div>

        {/* =====================================================
            MAIN ANALYTICS
        ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* RISK DISTRIBUTION */}

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl ${
              dark
                ? "border-white/[0.08] bg-white/[0.035]"
                : "border-black/[0.07] bg-white/70 shadow-sm"
            }`}
          >
            <h3 className="text-xl font-black">
              Risk Distribution
            </h3>

            <p
              className={`mt-1 text-sm font-medium ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Distribution of transactions by AI risk category
            </p>

            <div className="mt-7 space-y-6">
              {riskData.map((risk: any) => (
                <div key={risk.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-bold">
                      {risk.label}
                    </span>

                    <span
                      className={`font-semibold ${
                        dark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {risk.count.toLocaleString()} (
                      {risk.percentage}%)
                    </span>
                  </div>

                  <div
                    className={`h-3 overflow-hidden rounded-full ${
                      dark ? "bg-white/[0.08]" : "bg-black/[0.07]"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
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

            <div
              className={`mt-8 flex flex-wrap gap-6 text-sm font-semibold ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Low (68%)
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                Medium (24%)
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                High (8%)
              </div>
            </div>
          </div>

          {/* TRANSACTION TREND */}

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl ${
              dark
                ? "border-white/[0.08] bg-white/[0.035]"
                : "border-black/[0.07] bg-white/70 shadow-sm"
            }`}
          >
            <h3 className="text-xl font-black">
              Transaction Volume Trends
            </h3>

            <p
              className={`mt-1 text-sm font-medium ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Monitored velocity over weekday cycles
            </p>

            <div className="mt-7 flex h-56 items-end justify-between gap-3 md:gap-4">
              {trendData.map((item: any) => (
                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span
                    className={`text-xs font-bold ${
                      dark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.transactions}k
                  </span>

                  <div
                    className="w-full max-w-10 cursor-pointer rounded-t-lg bg-purple-500 transition-all duration-500 hover:bg-purple-400"
                    style={{
                      height: `${item.transactions * 1.8}px`,
                    }}
                  />

                  <span
                    className={`text-xs font-bold ${
                      dark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            SECOND ROW
        ====================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* PAYMENT METHODS */}

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl ${
              dark
                ? "border-white/[0.08] bg-white/[0.035]"
                : "border-black/[0.07] bg-white/70 shadow-sm"
            }`}
          >
            <h3 className="text-xl font-black">
              Payment Methods
            </h3>

            <p
              className={`mt-1 mb-6 text-sm font-medium ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Breakdown across payment gateways
            </p>

            <div className="space-y-5">
              {paymentData.map((payment: any) => (
                <div key={payment.type}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-bold">
                      {payment.type}
                    </span>

                    <span
                      className={`font-bold ${
                        dark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {payment.percentage}%
                    </span>
                  </div>

                  <div
                    className={`h-2 rounded-full ${
                      dark ? "bg-white/[0.08]" : "bg-black/[0.07]"
                    }`}
                  >
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{
                        width: `${payment.percentage}%`,
                      }}
                    />
                  </div>

                  <p
                    className={`mt-1 text-xs font-medium ${
                      dark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {payment.count.toLocaleString()} transactions
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI INSIGHTS */}

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl ${
              dark
                ? "border-white/[0.08] bg-white/[0.035]"
                : "border-black/[0.07] bg-white/70 shadow-sm"
            }`}
          >
            <h3 className="text-xl font-black">
              AI Risk Rules & Logic
            </h3>

            <p
              className={`mt-1 mb-6 text-sm font-medium ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Governing detection heuristics
            </p>

            <div className="space-y-4">
              <div
                className={`rounded-xl border p-4 ${
                  dark
                    ? "border-white/[0.06] bg-white/[0.04]"
                    : "border-black/[0.06] bg-black/[0.025]"
                }`}
              >
                <p className="text-sm font-black">
                  POL-001: High Value Threshold
                </p>

                <p
                  className={`mt-1 text-xs font-medium leading-5 ${
                    dark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Orders exceeding $1,000 or alternative
                  digital wallets trigger mandatory
                  verification.
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  dark
                    ? "border-white/[0.06] bg-white/[0.04]"
                    : "border-black/[0.06] bg-black/[0.025]"
                }`}
              >
                <p className="text-sm font-black">
                  POL-003: High-Theft Category
                </p>

                <p
                  className={`mt-1 text-xs font-medium leading-5 ${
                    dark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Electronics, watches, and computing
                  accessories enforce signed courier
                  tracking.
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  dark
                    ? "border-white/[0.06] bg-white/[0.04]"
                    : "border-black/[0.06] bg-black/[0.025]"
                }`}
              >
                <p className="text-sm font-black">
                  POL-006: VIP White-Glove Privilege
                </p>

                <p
                  className={`mt-1 text-xs font-medium leading-5 ${
                    dark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Repeat verified customers receive
                  false-positive suppression and expedited
                  picking.
                </p>
              </div>
            </div>
          </div>

          {/* MODEL STATUS */}

          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl ${
              dark
                ? "border-white/[0.08] bg-white/[0.035]"
                : "border-black/[0.07] bg-white/70 shadow-sm"
            }`}
          >
            <h3 className="text-xl font-black">
              Autonomous Swarm
            </h3>

            <p
              className={`mt-1 mb-6 text-sm font-medium ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              AI Teammates operating telemetry
            </p>

            <div className="space-y-5">
              <div>
                <p
                  className={`text-xs font-semibold ${
                    dark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Orchestration Graph
                </p>

                <p className="mt-1 text-sm font-black text-purple-500">
                  5-Step Deterministic Swarm
                </p>
              </div>

              <div>
                <p
                  className={`text-xs font-semibold ${
                    dark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Anomaly Detector
                </p>

                <p className="mt-1 text-sm font-black text-green-500">
                  Isolation Forest (100 Estimators)
                </p>
              </div>

              <div>
                <p
                  className={`text-xs font-semibold ${
                    dark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Active Agents
                </p>

                <p className="mt-1 text-sm font-bold">
                  Customer, Product, Decision, Critic
                </p>
              </div>

              <div
                className={`border-t pt-4 ${
                  dark
                    ? "border-white/[0.08]"
                    : "border-black/[0.08]"
                }`}
              >
                <p
                  className={`text-xs font-semibold ${
                    dark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Status
                </p>

                <p className="mt-1 text-sm font-bold text-green-500">
                  ● Multi-agent swarm online & ready
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            HIGH RISK TRANSACTIONS
        ====================================================== */}

        <div
          className={`mt-6 overflow-hidden rounded-2xl border backdrop-blur-xl ${
            dark
              ? "border-white/[0.08] bg-white/[0.035]"
              : "border-black/[0.07] bg-white/70 shadow-sm"
          }`}
        >
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black">
                High Risk Transactions Sample
              </h3>

              <p
                className={`mt-1 text-sm font-medium ${
                  dark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Top anomalies prioritized for autonomous
                agent intervention
              </p>
            </div>

            <Link
              href="/transactions"
              className={`text-sm font-bold transition ${
                dark
                  ? "text-purple-300 hover:text-purple-200"
                  : "text-purple-700 hover:text-purple-600"
              }`}
            >
              View All 7,145 →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b text-xs uppercase tracking-wider ${
                    dark
                      ? "border-white/[0.08] text-gray-500"
                      : "border-black/[0.08] text-gray-500"
                  }`}
                >
                  <th className="px-6 py-4 text-left font-bold">
                    Transaction ID
                  </th>

                  <th className="px-6 py-4 text-left font-bold">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left font-bold">
                    Risk Score
                  </th>

                  <th className="px-6 py-4 text-left font-bold">
                    Key Factor
                  </th>

                  <th className="px-6 py-4 text-right font-bold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {highRiskTransactions.map((tx: any) => (
                  <tr
                    key={tx.id}
                    className={`border-b transition ${
                      dark
                        ? "border-white/[0.05] hover:bg-white/[0.025]"
                        : "border-black/[0.05] hover:bg-black/[0.025]"
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold">
                      {tx.id}
                    </td>

                    <td className="px-6 py-4 font-bold">
                      {tx.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-black text-red-400">
                        {tx.score}/100
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-xs font-medium ${
                        dark
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {tx.reason}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/analyze?id=${tx.id}`}
                        className={`font-bold text-xs ${
                          dark
                            ? "text-purple-300 hover:text-purple-200"
                            : "text-purple-700 hover:text-purple-600"
                        }`}
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

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="py-10 text-center">
          <p
            className={`text-[9px] font-black uppercase tracking-[0.4em] ${
              dark ? "text-gray-600" : "text-gray-400"
            }`}
          >
            CODECRASHERS
          </p>

          <p
            className={`mt-2 text-[9px] font-semibold uppercase tracking-[0.3em] ${
              dark ? "text-gray-700" : "text-gray-400"
            }`}
          >
            TANMAY × RITIKA · FROM TRANSACTIONS TO INTELLIGENCE
          </p>
        </div>
      </section>
    </main>
  );
}
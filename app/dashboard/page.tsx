"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchStats,
  fetchTransactions,
  Transaction,
  StatsResponse,
} from "@/lib/api";

export default function DashboardPage() {
  const [dark, setDark] = useState(true);

  const [stats, setStats] = useState<StatsResponse>({
    total_transactions: 89316,
    high_risk: 7145,
    medium_risk: 21436,
    low_risk: 60735,
    average_risk_score: 35.3,
    percentages: {
      low: 68,
      medium: 24,
      high: 8,
    },
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: "Axfy13Hk4p1",
      amount: 259.14,
      type: "Credit Card",
      score: 9,
      status: "Low Risk",
      date: "22 Oct 2017, 18:57",
    },
    {
      id: "v6px92oS8cLG",
      amount: 382.39,
      type: "Credit Card",
      score: 46,
      status: "Medium Risk",
      date: "20 Jun 2018, 21:40",
    },
    {
      id: "VjTVGzqe8U6R",
      amount: 1014.75,
      type: "Credit Card",
      score: 51,
      status: "Medium Risk",
      date: "01 Sep 2017, 14:38",
    },
    {
      id: "DzNM8wrcMGFH",
      amount: 1521.75,
      type: "Wallet",
      score: 93,
      status: "High Risk",
      date: "24 Nov 2017, 19:12",
    },
  ]);

  /* =====================================================
     LOAD THEME
  ===================================================== */

  useEffect(() => {
    const savedTheme = localStorage.getItem("cipher-theme");

    if (savedTheme === "light") {
      requestAnimationFrame(() => setDark(false));
    } else {
      requestAnimationFrame(() => setDark(true));
    }
  }, []);

  /* =====================================================
     FETCH DATA
  ===================================================== */

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => {});

    fetchTransactions(1, 5)
      .then((data) => {
        if (data?.transactions?.length) {
          setRecentTransactions(data.transactions);
        }
      })
      .catch(() => {});
  }, []);

  /* =====================================================
     CHANGE THEME
  ===================================================== */

  const changeTheme = (isDark: boolean) => {
    setDark(isDark);

    localStorage.setItem(
      "cipher-theme",
      isDark ? "dark" : "light"
    );
  };

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${
        dark
          ? "bg-[#0B0812] text-white"
          : "bg-[#F7F2EA] text-[#211827]"
      }`}
    >

      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">

        {/* Central glow */}

        <div
          className={`absolute left-1/2 top-[45%]
          h-[600px] w-[600px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-3xl
          transition-all duration-700 ${
            dark
              ? "bg-purple-500/10"
              : "bg-purple-300/25"
          }`}
        />

        {/* =================================================
            ANIMATED BUBBLES
        ================================================== */}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMidYMid slice"
        >

          {/* =================================================
              PURPLE LARGE BUBBLE
          ================================================= */}

          <circle
            cx="120"
            cy="330"
            r="105"
            fill={dark ? "#A78BFA" : "#C4B5FD"}
            fillOpacity={dark ? "0.08" : "0.20"}
            stroke={dark ? "#C4B5FD" : "#8B5CF6"}
            strokeOpacity="0.22"
            strokeWidth="1"
          >
            <animate
              attributeName="cx"
              values="120;190;95;175;120"
              dur="14s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="330;250;390;285;330"
              dur="14s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="105;120;92;115;105"
              dur="14s"
              repeatCount="indefinite"
            />
          </circle>

          {/* =================================================
              CYAN LARGE BUBBLE
          ================================================= */}

          <circle
            cx="1080"
            cy="400"
            r="125"
            fill="#67E8F9"
            fillOpacity={dark ? "0.07" : "0.18"}
            stroke="#22D3EE"
            strokeOpacity="0.22"
            strokeWidth="1"
          >
            <animate
              attributeName="cx"
              values="1080;1000;1120;1030;1080"
              dur="17s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="400;310;460;350;400"
              dur="17s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="125;105;135;115;125"
              dur="17s"
              repeatCount="indefinite"
            />
          </circle>

          {/* =================================================
              PINK BUBBLE
          ================================================= */}

          <circle
            cx="180"
            cy="760"
            r="115"
            fill="#F9A8D4"
            fillOpacity={dark ? "0.06" : "0.17"}
            stroke="#F472B6"
            strokeOpacity="0.20"
            strokeWidth="1"
          >
            <animate
              attributeName="cx"
              values="180;260;135;230;180"
              dur="19s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="760;680;800;700;760"
              dur="19s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="115;95;125;105;115"
              dur="19s"
              repeatCount="indefinite"
            />
          </circle>

          {/* =================================================
              GOLD BUBBLE
          ================================================= */}

          <circle
            cx="1030"
            cy="760"
            r="85"
            fill="#FDE68A"
            fillOpacity={dark ? "0.06" : "0.15"}
            stroke="#FACC15"
            strokeOpacity="0.20"
            strokeWidth="1"
          >
            <animate
              attributeName="cx"
              values="1030;970;1080;990;1030"
              dur="13s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="760;700;815;720;760"
              dur="13s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="85;100;72;95;85"
              dur="13s"
              repeatCount="indefinite"
            />
          </circle>

          {/* =================================================
              SMALL PURPLE BUBBLE
          ================================================= */}

          <circle
            cx="300"
            cy="180"
            r="22"
            fill="#C084FC"
            fillOpacity="0.45"
          >
            <animate
              attributeName="cx"
              values="300;340;275;320;300"
              dur="9s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="180;130;210;150;180"
              dur="9s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="22;28;17;25;22"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>

          {/* =================================================
              SMALL CYAN BUBBLE
          ================================================= */}

          <circle
            cx="850"
            cy="250"
            r="15"
            fill="#67E8F9"
            fillOpacity="0.55"
          >
            <animate
              attributeName="cx"
              values="850;900;825;880;850"
              dur="8s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="250;200;285;215;250"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* =================================================
              SMALL PINK BUBBLE
          ================================================= */}

          <circle
            cx="430"
            cy="700"
            r="12"
            fill="#F472B6"
            fillOpacity="0.55"
          >
            <animate
              attributeName="cx"
              values="430;470;400;450;430"
              dur="10s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="700;650;740;675;700"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>

          {/* =================================================
              SMALL GOLD BUBBLE
          ================================================= */}

          <circle
            cx="750"
            cy="700"
            r="10"
            fill="#FACC15"
            fillOpacity="0.55"
          >
            <animate
              attributeName="cx"
              values="750;790;720;770;750"
              dur="8s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="700;650;730;670;700"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

        </svg>

        {/* =================================================
            GRID
        ================================================== */}

        <div
          className={`absolute inset-0 ${
            dark ? "opacity-[0.025]" : "opacity-[0.045]"
          }`}
          style={{
            backgroundImage: dark
              ? "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)"
              : "linear-gradient(#211827 1px, transparent 1px), linear-gradient(90deg, #211827 1px, transparent 1px)",
            backgroundSize: "86px 86px",
          }}
        />

      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className={`relative z-20 border-b px-8 py-4 ${
          dark
            ? "border-white/10 bg-[#0B0812]/80"
            : "border-black/10 bg-[#F7F2EA]/85"
        } backdrop-blur-xl`}
      >

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LOGO */}

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >

            <div
              className={`relative flex h-12 w-12
              items-center justify-center
              rounded-[15px]
              border
              bg-white
              shadow-lg ${
                dark
                  ? "border-purple-300/20 shadow-purple-500/10"
                  : "border-purple-200 shadow-purple-300/30"
              }`}
            >

              <span className="text-[30px] font-black leading-none text-[#211827]">
                C
              </span>

              {/* Cyan dot */}

              <span
                className="absolute right-[7px] top-[7px]
                h-2.5 w-2.5 rounded-full
                bg-cyan-400"
              />

              {/* Pink dot */}

              <span
                className="absolute bottom-[7px] right-[7px]
                h-2.5 w-2.5 rounded-full
                bg-pink-500"
              />

            </div>

            <div>
              <div
                className={`text-xl font-black tracking-[0.18em] ${
                  dark ? "text-white" : "text-[#211827]"
                }`}
              >
                CIPHER
              </div>

              <div
                className={`text-[9px] font-bold tracking-[0.32em] ${
                  dark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                AI TRANSACTION INTELLIGENCE
              </div>
            </div>

          </Link>

          {/* NAV LINKS */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              href="/dashboard"
              className={`rounded-full px-5 py-2.5 text-sm font-bold ${
                dark
                  ? "bg-white text-[#211827]"
                  : "bg-[#211827] text-white"
              }`}
            >
              Dashboard
            </Link>
            
            <Link
              href="/cipherAI"
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                dark
                  ? "text-gray-400 hover:bg-white/5 hover:text-white"
                  : "text-gray-500 hover:bg-black/5 hover:text-[#211827]"
              }`}
            >
              CIPHER AI
            </Link>

            <Link
              href="/transactions"
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                dark
                  ? "text-gray-400 hover:bg-white/5 hover:text-white"
                  : "text-gray-500 hover:bg-black/5 hover:text-[#211827]"
              }`}
            >
              Transactions
            </Link>

            <Link
              href="/analytics"
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                dark
                  ? "text-gray-400 hover:bg-white/5 hover:text-white"
                  : "text-gray-500 hover:bg-black/5 hover:text-[#211827]"
              }`}
            >
              Analytics
            </Link>

          </div>

          {/* THEME TOGGLE */}

          <div
            className={`flex items-center gap-1 rounded-full
            border p-1 ${
              dark
                ? "border-white/10 bg-white/[0.06]"
                : "border-black/10 bg-white/80"
            }`}
          >

            <button
              onClick={() => changeTheme(false)}
              aria-label="Light mode"
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                !dark
                  ? "bg-[#211827] text-white shadow-md"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              ☀
            </button>

            <button
              onClick={() => changeTheme(true)}
              aria-label="Dark mode"
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                dark
                  ? "bg-white text-[#211827] shadow-md"
                  : "text-gray-500 hover:text-[#211827]"
              }`}
            >
              ☾
            </button>

          </div>

        </div>

      </nav>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-8">

        {/* HEADER */}

        <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p
              className={`mb-2 text-xs font-black tracking-[0.45em] ${
                dark ? "text-purple-300" : "text-purple-700"
              }`}
            >
              INTELLIGENCE WORKSPACE
            </p>

            <h1
              className={`text-5xl font-black tracking-tight md:text-6xl ${
                dark ? "text-white" : "text-[#211827]"
              }`}
            >
              Dashboard
            </h1>

            <p
              className={`mt-3 max-w-2xl text-base ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Monitor transactions, identify anomalies, and understand
              the behavior behind potential risk.
            </p>

          </div>

          <Link
            href="/analyze"
            className={`inline-flex w-fit items-center rounded-full
            px-6 py-3.5 text-sm font-black
            shadow-xl transition-all hover:scale-105 ${
              dark
                ? "bg-white text-[#211827] hover:bg-yellow-100"
                : "bg-[#211827] text-white hover:bg-purple-700"
            }`}
          >
            Launch AI Analysis
            <span className="ml-2 text-lg">→</span>
          </Link>

        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div className="mb-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-all hover:-translate-y-1 ${
              dark
                ? "border-white/10 bg-white/[0.04]"
                : "border-black/10 bg-white/75 shadow-sm"
            }`}
          >

            <div className="flex justify-between">

              <p
                className={`text-xs font-bold tracking-wider ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                TOTAL TRANSACTIONS
              </p>

              <span>◇</span>

            </div>

            <p
              className={`mt-6 text-4xl font-black ${
                dark ? "text-white" : "text-[#211827]"
              }`}
            >
              {stats.total_transactions.toLocaleString()}
            </p>

            <p
              className={`mt-2 text-sm ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Transactions monitored
            </p>

          </div>

          {/* HIGH RISK */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-all hover:-translate-y-1 ${
              dark
                ? "border-red-500/20 bg-red-500/[0.05]"
                : "border-red-200 bg-red-50/70"
            }`}
          >

            <div className="flex justify-between">

              <p
                className={`text-xs font-bold tracking-wider ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                HIGH RISK
              </p>

              <span className="text-red-400">⚠</span>

            </div>

            <p className="mt-6 text-4xl font-black text-red-400">
              {stats.high_risk.toLocaleString()}
            </p>

            <p
              className={`mt-2 text-sm ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Requires attention
            </p>

          </div>

          {/* MEDIUM RISK */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-all hover:-translate-y-1 ${
              dark
                ? "border-yellow-500/20 bg-yellow-500/[0.05]"
                : "border-yellow-200 bg-yellow-50/70"
            }`}
          >

            <div className="flex justify-between">

              <p
                className={`text-xs font-bold tracking-wider ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                MEDIUM RISK
              </p>

              <span className="text-yellow-400">◐</span>

            </div>

            <p className="mt-6 text-4xl font-black text-yellow-400">
              {stats.medium_risk.toLocaleString()}
            </p>

            <p
              className={`mt-2 text-sm ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Worth reviewing
            </p>

          </div>

          {/* AVG SCORE */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-all hover:-translate-y-1 ${
              dark
                ? "border-cyan-500/20 bg-cyan-500/[0.05]"
                : "border-cyan-200 bg-cyan-50/70"
            }`}
          >

            <div className="flex justify-between">

              <p
                className={`text-xs font-bold tracking-wider ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                AVG RISK SCORE
              </p>

              <span className="text-cyan-400">◎</span>

            </div>

            <p
              className={`mt-6 text-4xl font-black ${
                dark ? "text-white" : "text-[#211827]"
              }`}
            >
              {stats.average_risk_score}
            </p>

            <p
              className={`mt-2 text-sm ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Overall transaction risk
            </p>

          </div>

        </div>

        {/* =====================================================
            LOWER SECTION
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-5">

          {/* RISK OVERVIEW */}

          <div
            className={`rounded-3xl border p-6 lg:col-span-2 ${
              dark
                ? "border-white/10 bg-white/[0.04]"
                : "border-black/10 bg-white/75"
            }`}
          >

            <p
              className={`text-xs font-black tracking-[0.3em] ${
                dark ? "text-purple-300" : "text-purple-700"
              }`}
            >
              RISK DISTRIBUTION
            </p>

            <h2
              className={`mt-2 text-2xl font-black ${
                dark ? "text-white" : "text-[#211827]"
              }`}
            >
              Risk Overview
            </h2>

            <div className="mt-9 space-y-7">

              {/* LOW */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm font-bold">
                    Low Risk
                  </span>

                  <span className="text-sm font-black text-green-500">
                    {stats.percentages.low}%
                  </span>

                </div>

                <div
                  className={`h-3 overflow-hidden rounded-full ${
                    dark ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-700"
                    style={{
                      width: `${stats.percentages.low}%`,
                    }}
                  />
                </div>

              </div>

              {/* MEDIUM */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm font-bold">
                    Medium Risk
                  </span>

                  <span className="text-sm font-black text-yellow-500">
                    {stats.percentages.medium}%
                  </span>

                </div>

                <div
                  className={`h-3 overflow-hidden rounded-full ${
                    dark ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                    style={{
                      width: `${stats.percentages.medium}%`,
                    }}
                  />
                </div>

              </div>

              {/* HIGH */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm font-bold">
                    High Risk
                  </span>

                  <span className="text-sm font-black text-red-500">
                    {stats.percentages.high}%
                  </span>

                </div>

                <div
                  className={`h-3 overflow-hidden rounded-full ${
                    dark ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-red-500 transition-all duration-700"
                    style={{
                      width: `${stats.percentages.high}%`,
                    }}
                  />
                </div>

              </div>

            </div>

            <Link
              href="/analytics"
              className={`mt-9 block rounded-xl py-3 text-center text-sm font-bold transition ${
                dark
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-black/5 hover:bg-black/10"
              }`}
            >
              View Analytics →
            </Link>

          </div>

          {/* =================================================
              RECENT TRANSACTIONS
          ================================================== */}

          <div
            className={`rounded-3xl border p-6 lg:col-span-3 ${
              dark
                ? "border-white/10 bg-white/[0.04]"
                : "border-black/10 bg-white/75"
            }`}
          >

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p
                  className={`text-xs font-black tracking-[0.3em] ${
                    dark ? "text-cyan-300" : "text-cyan-700"
                  }`}
                >
                  LIVE FEED
                </p>

                <h2
                  className={`mt-2 text-2xl font-black ${
                    dark ? "text-white" : "text-[#211827]"
                  }`}
                >
                  Recent Transactions
                </h2>

              </div>

              <Link
                href="/transactions"
                className={`text-sm font-bold ${
                  dark ? "text-purple-300" : "text-purple-700"
                }`}
              >
                View All →
              </Link>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] text-sm">

                <thead>

                  <tr
                    className={`border-b ${
                      dark
                        ? "border-white/10 text-gray-500"
                        : "border-black/10 text-gray-500"
                    }`}
                  >

                    <th className="py-3 text-left">
                      ORDER ID
                    </th>

                    <th className="py-3 text-left">
                      AMOUNT
                    </th>

                    <th className="py-3 text-left">
                      PAYMENT
                    </th>

                    <th className="py-3 text-left">
                      RISK
                    </th>

                    <th className="py-3 text-right">
                      ACTION
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentTransactions.map((tx) => (

                    <tr
                      key={tx.id}
                      className={`border-b transition ${
                        dark
                          ? "border-white/[0.06] hover:bg-white/[0.03]"
                          : "border-black/[0.06] hover:bg-black/[0.025]"
                      }`}
                    >

                      <td
                        className={`py-4 font-mono text-xs font-bold ${
                          dark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {tx.id}
                      </td>

                      <td className="py-4 font-black">
                        $
                        {typeof tx.amount === "number"
                          ? tx.amount.toFixed(2)
                          : tx.amount}
                      </td>

                      <td
                        className={`py-4 ${
                          dark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {tx.type}
                      </td>

                      <td className="py-4">

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            tx.score >= 70
                              ? "border-red-500/30 bg-red-500/10 text-red-500"
                              : tx.score >= 40
                              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                              : "border-green-500/30 bg-green-500/10 text-green-500"
                          }`}
                        >
                          {tx.status} ({tx.score})
                        </span>

                      </td>

                      <td className="py-4 text-right">

                        <Link
                          href={`/analyze?id=${tx.id}&amount=${tx.amount}`}
                          className={`text-xs font-black ${
                            dark
                              ? "text-cyan-300 hover:text-cyan-200"
                              : "text-purple-700 hover:text-purple-500"
                          }`}
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

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer
          className={`mt-10 border-t py-6 text-center text-[10px]
          font-bold uppercase tracking-[0.35em] ${
            dark
              ? "border-white/10 text-gray-600"
              : "border-black/10 text-black-400"
          }`}
        >
          CIPHER • From transactions to intelligence • TANMAY × RITIKA
        </footer>

      </section>

    </main>
  );
}
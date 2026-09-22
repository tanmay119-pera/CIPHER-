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
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${
        dark
          ? "bg-[#0B0812] text-white"
          : "bg-[#F7F2EA] text-[#211827]"
      }`}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">

        {/* Central glow */}

        <div
          className={`absolute left-1/2 top-[35%] h-[600px] w-[600px]
          -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
            dark
              ? "bg-purple-500/[0.07]"
              : "bg-purple-300/[0.16]"
          }`}
        />

        {/* Lightweight floating blobs */}

        {/* Floating animated bubbles */}

<div
  className={`cipher-bubble-1 absolute left-[6%] top-[22%] h-24 w-24 rounded-full border ${
    dark
      ? "border-purple-300/10 bg-purple-500/[0.07]"
      : "border-purple-300/20 bg-purple-300/[0.12]"
  }`}
/>

<div
  className={`cipher-bubble-2 absolute right-[8%] top-[30%] h-16 w-16 rounded-full border ${
    dark
      ? "border-cyan-300/10 bg-cyan-400/[0.06]"
      : "border-cyan-300/20 bg-cyan-300/[0.10]"
  }`}
/>

<div
  className={`cipher-bubble-3 absolute left-[18%] bottom-[18%] h-14 w-14 rounded-full border ${
    dark
      ? "border-pink-300/10 bg-pink-500/[0.06]"
      : "border-pink-300/20 bg-pink-300/[0.10]"
  }`}
/>

<div
  className={`cipher-bubble-4 absolute right-[20%] bottom-[12%] h-28 w-28 rounded-full border ${
    dark
      ? "border-purple-300/10 bg-purple-500/[0.05]"
      : "border-purple-300/20 bg-purple-300/[0.09]"
  }`}
/>

        {/* Grid */}

        <div
          className={`absolute inset-0 ${
            dark ? "opacity-[0.02]" : "opacity-[0.035]"
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
        className={`relative z-20 border-b px-6 py-4 md:px-8 ${
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
              className={`relative flex h-12 w-12 items-center justify-center
              rounded-[15px] border bg-white shadow-lg ${
                dark
                  ? "border-purple-300/20 shadow-purple-500/10"
                  : "border-purple-200 shadow-purple-300/30"
              }`}
            >
              <span className="text-[30px] font-black leading-none text-[#211827]">
                C
              </span>

              <span className="absolute right-[7px] top-[7px] h-2.5 w-2.5 rounded-full bg-cyan-400" />

              <span className="absolute bottom-[7px] right-[7px] h-2.5 w-2.5 rounded-full bg-pink-500" />
            </div>

            <div>
              <div
                className={`text-xl font-black tracking-[0.18em] ${
                  dark ? "text-white" : "text-[#211827]"
                }`}
              >
                CIPHER
              </div>

              <div className="text-[9px] font-bold tracking-[0.32em] text-gray-500">
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
              className={`group rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${
                dark
                  ? "border-purple-400/20 bg-purple-500/10 text-purple-200 hover:border-purple-400/40 hover:bg-purple-500/20"
                  : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              <span className="mr-2">✦</span>
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
            className={`flex items-center gap-1 rounded-full border p-1 ${
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

        {/* =====================================================
            HEADER
        ===================================================== */}

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
            href="/cipherAI"
            className={`inline-flex w-fit items-center rounded-full
            px-6 py-3.5 text-sm font-black shadow-xl transition-all
            hover:-translate-y-0.5 ${
              dark
                ? "bg-white text-[#211827] hover:bg-purple-100"
                : "bg-[#211827] text-white hover:bg-purple-700"
            }`}
          >
            Launch CIPHER AI
            <span className="ml-2 text-lg">→</span>
          </Link>
        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ${
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

            <p className="mt-2 text-sm text-gray-500">
              Transactions monitored
            </p>
          </div>

          {/* HIGH RISK */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ${
              dark
                ? "border-red-500/20 bg-red-500/[0.05]"
                : "border-red-200 bg-red-50/70"
            }`}
          >
            <div className="flex justify-between">
              <p className="text-xs font-bold tracking-wider text-gray-400">
                HIGH RISK
              </p>

              <span className="text-red-400">⚠</span>
            </div>

            <p className="mt-6 text-4xl font-black text-red-400">
              {stats.high_risk.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Requires attention
            </p>
          </div>

          {/* MEDIUM RISK */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ${
              dark
                ? "border-yellow-500/20 bg-yellow-500/[0.05]"
                : "border-yellow-200 bg-yellow-50/70"
            }`}
          >
            <div className="flex justify-between">
              <p className="text-xs font-bold tracking-wider text-gray-400">
                MEDIUM RISK
              </p>

              <span className="text-yellow-400">◐</span>
            </div>

            <p className="mt-6 text-4xl font-black text-yellow-400">
              {stats.medium_risk.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Worth reviewing
            </p>
          </div>

          {/* AVG SCORE */}

          <div
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ${
              dark
                ? "border-cyan-500/20 bg-cyan-500/[0.05]"
                : "border-cyan-200 bg-cyan-50/70"
            }`}
          >
            <div className="flex justify-between">
              <p className="text-xs font-bold tracking-wider text-gray-400">
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

            <p className="mt-2 text-sm text-gray-500">
              Overall transaction risk
            </p>
          </div>
        </div>

        {/* =====================================================
            CIPHER AI COMMAND CENTER
        ===================================================== */}

        <section
          className={`mb-8 overflow-hidden rounded-[28px] border p-7 md:p-8 ${
            dark
              ? "border-purple-400/20 bg-gradient-to-br from-purple-500/[0.12] via-white/[0.04] to-cyan-500/[0.05]"
              : "border-purple-200 bg-gradient-to-br from-purple-50 via-white to-cyan-50"
          }`}
        >
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    dark
                      ? "bg-purple-500/20 text-purple-200"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  ✦
                </span>

                <p
                  className={`text-xs font-black tracking-[0.3em] ${
                    dark ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  CIPHER AI COMMAND CENTER
                </p>
              </div>

              <h2
                className={`text-3xl font-black md:text-4xl ${
                  dark ? "text-white" : "text-[#211827]"
                }`}
              >
                Autonomous transaction intelligence.
              </h2>

              <p
                className={`mt-3 max-w-xl leading-7 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Investigate suspicious transactions, ask questions about
                risk, and let CIPHER's intelligence layer help turn raw
                transaction data into actionable insight.
              </p>

              <Link
                href="/cipherAI"
                className={`mt-6 inline-flex items-center rounded-xl px-5 py-3 text-sm font-black transition ${
                  dark
                    ? "bg-white text-[#211827] hover:bg-purple-100"
                    : "bg-[#211827] text-white hover:bg-purple-700"
                }`}
              >
                Open CIPHER AI
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:w-[360px]">

              <div
                className={`rounded-2xl border p-5 ${
                  dark
                    ? "border-white/10 bg-black/10"
                    : "border-black/5 bg-white/70"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-xs font-bold text-gray-500">
                    SYSTEM
                  </span>
                </div>

                <p className="text-xl font-black">
                  ACTIVE
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  dark
                    ? "border-white/10 bg-black/10"
                    : "border-black/5 bg-white/70"
                }`}
              >
                <p className="text-xs font-bold text-gray-500">
                  HIGH-RISK
                </p>

                <p className="mt-2 text-xl font-black text-red-400">
                  {stats.high_risk.toLocaleString()}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  dark
                    ? "border-white/10 bg-black/10"
                    : "border-black/5 bg-white/70"
                }`}
              >
                <p className="text-xs font-bold text-gray-500">
                  AVG SCORE
                </p>

                <p className="mt-2 text-xl font-black text-cyan-400">
                  {stats.average_risk_score}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  dark
                    ? "border-white/10 bg-black/10"
                    : "border-black/5 bg-white/70"
                }`}
              >
                <p className="text-xs font-bold text-gray-500">
                  MONITORED
                </p>

                <p className="mt-2 text-xl font-black">
                  24/7
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RISK OVERVIEW + RECENT TRANSACTIONS
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

          {/* RECENT TRANSACTIONS */}

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
            SWARM ACTIVITY
        ===================================================== */}

        <section
          className={`mt-8 rounded-3xl border p-7 ${
            dark
              ? "border-white/10 bg-white/[0.04]"
              : "border-black/10 bg-white/75"
          }`}
        >
          <div className="mb-7">

            <p
              className={`text-xs font-black tracking-[0.3em] ${
                dark ? "text-purple-300" : "text-purple-700"
              }`}
            >
              INTELLIGENCE PIPELINE
            </p>

            <h2
              className={`mt-2 text-2xl font-black ${
                dark ? "text-white" : "text-[#211827]"
              }`}
            >
              CIPHER Swarm Activity
            </h2>

            <p
              className={`mt-2 max-w-2xl text-sm ${
                dark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              A coordinated intelligence pipeline designed to examine
              transaction signals before producing a final risk assessment.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">

            {[
              {
                number: "01",
                title: "Transaction",
                subtitle: "Incoming data",
                icon: "↓",
              },
              {
                number: "02",
                title: "Risk Agent",
                subtitle: "Risk signals",
                icon: "◇",
              },
              {
                number: "03",
                title: "Pattern Agent",
                subtitle: "Behavior analysis",
                icon: "⌁",
              },
              {
                number: "04",
                title: "Decision Lead",
                subtitle: "Evidence synthesis",
                icon: "✦",
              },
              {
                number: "05",
                title: "Final Result",
                subtitle: "Risk assessment",
                icon: "✓",
              },
            ].map((agent, index) => (
              <div
                key={agent.number}
                className="relative"
              >
                <div
                  className={`h-full rounded-2xl border p-5 ${
                    dark
                      ? "border-white/10 bg-black/10"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">

                    <span
                      className={`text-[10px] font-black tracking-widest ${
                        dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {agent.number}
                    </span>

                    <span
                      className={`text-lg ${
                        index === 4
                          ? "text-green-400"
                          : "text-purple-300"
                      }`}
                    >
                      {agent.icon}
                    </span>
                  </div>

                  <p className="mt-6 text-sm font-black">
                    {agent.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {agent.subtitle}
                  </p>
                </div>

                {index < 4 && (
                  <span
                    className={`absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block ${
                      dark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            INTELLIGENCE INSIGHTS
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5">
            <p
              className={`text-xs font-black tracking-[0.3em] ${
                dark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              TRANSACTION INTELLIGENCE
            </p>

            <h2
              className={`mt-2 text-2xl font-black ${
                dark ? "text-white" : "text-[#211827]"
              }`}
            >
              What the data is telling you
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* INSIGHT 1 */}

            <div
              className={`rounded-3xl border p-6 ${
                dark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-black/10 bg-white/75"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    dark
                      ? "bg-red-500/10 text-red-400"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  ⚠
                </span>

                <span className="text-xs font-bold text-gray-500">
                  RISK
                </span>
              </div>

              <h3 className="text-lg font-black">
                High-risk activity
              </h3>

              <p
                className={`mt-2 text-sm leading-6 ${
                  dark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {stats.percentages.high}% of monitored transactions
                currently fall into the high-risk segment.
              </p>
            </div>

            {/* INSIGHT 2 */}

            <div
              className={`rounded-3xl border p-6 ${
                dark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-black/10 bg-white/75"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    dark
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  ◐
                </span>

                <span className="text-xs font-bold text-gray-500">
                  REVIEW
                </span>
              </div>

              <h3 className="text-lg font-black">
                Medium-risk volume
              </h3>

              <p
                className={`mt-2 text-sm leading-6 ${
                  dark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {stats.percentages.medium}% of transactions are in the
                medium-risk range and may require additional review.
              </p>
            </div>

            {/* INSIGHT 3 */}

            <div
              className={`rounded-3xl border p-6 ${
                dark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-black/10 bg-white/75"
              }`}
            >
              <div className="mb-5 flex items-center justify-between">

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    dark
                      ? "bg-green-500/10 text-green-400"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  ✓
                </span>

                <span className="text-xs font-bold text-gray-500">
                  BASELINE
                </span>
              </div>

              <h3 className="text-lg font-black">
                Low-risk majority
              </h3>

              <p
                className={`mt-2 text-sm leading-6 ${
                  dark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {stats.percentages.low}% of monitored transactions are
                currently classified as low risk.
              </p>
            </div>

          </div>
        </section>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section
          className={`mt-8 rounded-3xl border p-7 ${
            dark
              ? "border-white/10 bg-white/[0.04]"
              : "border-black/10 bg-white/75"
          }`}
        >
          <div className="mb-6">

            <p
              className={`text-xs font-black tracking-[0.3em] ${
                dark ? "text-purple-300" : "text-purple-700"
              }`}
            >
              QUICK ACTIONS
            </p>

            <h2
              className={`mt-2 text-2xl font-black ${
                dark ? "text-white" : "text-[#211827]"
              }`}
            >
              Continue investigating
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <Link
              href="/cipherAI"
              className={`group rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
                dark
                  ? "border-purple-400/20 bg-purple-500/[0.06] hover:bg-purple-500/[0.10]"
                  : "border-purple-200 bg-purple-50 hover:bg-purple-100"
              }`}
            >
              <span className="text-2xl">✦</span>

              <h3 className="mt-4 font-black">
                Ask CIPHER AI
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Investigate transactions using the AI interface.
              </p>

              <span className="mt-4 block text-sm font-bold text-purple-400">
                Open AI →
              </span>
            </Link>

            <Link
              href="/transactions"
              className={`group rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
                dark
                  ? "border-cyan-400/20 bg-cyan-500/[0.04] hover:bg-cyan-500/[0.08]"
                  : "border-cyan-200 bg-cyan-50 hover:bg-cyan-100"
              }`}
            >
              <span className="text-2xl">◇</span>

              <h3 className="mt-4 font-black">
                Browse Transactions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Explore the monitored transaction stream.
              </p>

              <span className="mt-4 block text-sm font-bold text-cyan-400">
                View transactions →
              </span>
            </Link>

            <Link
              href="/analytics"
              className={`group rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
                dark
                  ? "border-yellow-400/20 bg-yellow-500/[0.04] hover:bg-yellow-500/[0.08]"
                  : "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
              }`}
            >
              <span className="text-2xl">◐</span>

              <h3 className="mt-4 font-black">
                Explore Analytics
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Understand risk distribution and trends.
              </p>

              <span className="mt-4 block text-sm font-bold text-yellow-500">
                Open analytics →
              </span>
            </Link>

          </div>
        </section>

        {/* =====================================================
            SYSTEM STATUS
        ===================================================== */}

        <section
          className={`mt-8 rounded-3xl border p-6 ${
            dark
              ? "border-white/10 bg-white/[0.025]"
              : "border-black/10 bg-white/60"
          }`}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p
                className={`text-xs font-black tracking-[0.3em] ${
                  dark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                SYSTEM STATUS
              </p>

              <h3 className="mt-2 text-lg font-black">
                CIPHER intelligence environment
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {[
                "Transaction Monitor",
                "Risk Engine",
                "CIPHER AI",
                "Data Pipeline",
              ].map((item) => (
                <div
                  key={item}
                  className={`rounded-xl border px-4 py-3 ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />

                    <span className="text-[10px] font-bold text-gray-500">
                      ACTIVE
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-bold">
                    {item}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer
          className={`mt-10 border-t py-8 text-center text-[10px]
          font-bold uppercase tracking-[0.35em] ${
            dark
              ? "border-white/10 text-gray-600"
              : "border-black/10 text-gray-400"
          }`}
        >
          CIPHER • From transactions to intelligence • TANMAY × RITIKA
        </footer>

      </section>
    </main>
  );
}
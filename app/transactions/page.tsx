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

  // THEME
  const [dark, setDark] = useState(true);
  const [themeLoaded, setThemeLoaded] = useState(false);

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

    setThemeLoaded(true);
  }, []);

  /* ---------------------------------------------
     FETCH TRANSACTIONS
  --------------------------------------------- */
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

  /* ---------------------------------------------
     RISK STYLE
  --------------------------------------------- */
  const getRiskStyle = (score: number) => {
    if (score >= 70) {
      return {
        text: dark ? "text-red-300" : "text-red-600",
        bg: dark ? "bg-red-500/10" : "bg-red-50",
        border: dark ? "border-red-400/20" : "border-red-200",
      };
    }

    if (score >= 40) {
      return {
        text: dark ? "text-yellow-200" : "text-yellow-700",
        bg: dark ? "bg-yellow-500/10" : "bg-yellow-50",
        border: dark ? "border-yellow-400/20" : "border-yellow-200",
      };
    }

    return {
      text: dark ? "text-green-300" : "text-green-700",
      bg: dark ? "bg-green-500/10" : "bg-green-50",
      border: dark ? "border-green-400/20" : "border-green-200",
    };
  };

  if (!themeLoaded) {
    return (
      <main className="min-h-screen bg-[#0B0812]" />
    );
  }

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

        {/* CENTRAL GLOW */}

        <div
          className={`absolute left-1/2 top-[35%]
          h-[600px] w-[600px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full blur-3xl transition-all duration-700 ${
            dark
              ? "bg-purple-500/[0.10]"
              : "bg-purple-300/[0.20]"
          }`}
        />

        {/* TOP LEFT GLOW */}

        <div
          className={`absolute -left-40 -top-40
          h-[450px] w-[450px]
          rounded-full blur-3xl ${
            dark
              ? "bg-pink-500/[0.08]"
              : "bg-pink-300/[0.22]"
          }`}
        />

        {/* BOTTOM RIGHT GLOW */}

        <div
          className={`absolute -bottom-40 -right-40
          h-[450px] w-[450px]
          rounded-full blur-3xl ${
            dark
              ? "bg-cyan-400/[0.08]"
              : "bg-cyan-300/[0.22]"
          }`}
        />

        {/* =================================================
            FLOATING BUBBLES
        ================================================== */}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 900"
          preserveAspectRatio="xMidYMid slice"
        >

          {/* PURPLE */}

          <circle
            cx="90"
            cy="180"
            r="75"
            fill={dark ? "#A78BFA" : "#C4B5FD"}
            fillOpacity={dark ? "0.07" : "0.22"}
            stroke={dark ? "#C4B5FD" : "#8B5CF6"}
            strokeOpacity="0.25"
          >
            <animate
              attributeName="cx"
              values="90;150;110;175;90"
              dur="14s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="180;120;220;150;180"
              dur="14s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="75;88;68;82;75"
              dur="14s"
              repeatCount="indefinite"
            />
          </circle>

          {/* CYAN */}

          <circle
            cx="910"
            cy="260"
            r="82"
            fill="#67E8F9"
            fillOpacity={dark ? "0.06" : "0.20"}
            stroke="#22D3EE"
            strokeOpacity="0.22"
          >
            <animate
              attributeName="cx"
              values="910;850;930;875;910"
              dur="17s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="260;200;300;220;260"
              dur="17s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="82;70;90;76;82"
              dur="17s"
              repeatCount="indefinite"
            />
          </circle>

          {/* PINK */}

          <circle
            cx="120"
            cy="760"
            r="90"
            fill="#F9A8D4"
            fillOpacity={dark ? "0.06" : "0.18"}
            stroke="#F472B6"
            strokeOpacity="0.20"
          >
            <animate
              attributeName="cx"
              values="120;190;90;160;120"
              dur="19s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="760;700;790;720;760"
              dur="19s"
              repeatCount="indefinite"
            />
          </circle>

          {/* GOLD */}

          <circle
            cx="870"
            cy="760"
            r="62"
            fill="#FDE68A"
            fillOpacity={dark ? "0.06" : "0.18"}
            stroke="#FACC15"
            strokeOpacity="0.22"
          >
            <animate
              attributeName="cx"
              values="870;810;900;835;870"
              dur="13s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="760;710;800;730;760"
              dur="13s"
              repeatCount="indefinite"
            />
          </circle>

          {/* SMALL BUBBLES */}

          <circle
            cx="280"
            cy="120"
            r="15"
            fill="#C084FC"
            fillOpacity="0.40"
          >
            <animate
              attributeName="cx"
              values="280;310;260;300;280"
              dur="9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="120;80;140;95;120"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            cx="750"
            cy="600"
            r="13"
            fill="#67E8F9"
            fillOpacity="0.45"
          >
            <animate
              attributeName="cx"
              values="750;790;735;775;750"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="600;550;630;570;600"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            cx="55"
            cy="450"
            r="9"
            fill="#F472B6"
            fillOpacity="0.50"
          >
            <animate
              attributeName="cy"
              values="450;400;480;420;450"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            cx="950"
            cy="500"
            r="9"
            fill="#FACC15"
            fillOpacity="0.50"
          >
            <animate
              attributeName="cy"
              values="500;450;530;470;500"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

        </svg>

        {/* SUBTLE GRID */}

        <div
          className={`absolute inset-0 ${
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
          NAVBAR
      ====================================================== */}

      <nav
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          dark
            ? "border-white/[0.08] bg-[#0B0812]/80"
            : "border-black/[0.08] bg-[#F7F2EA]/85"
        }`}
      >

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">

          {/* LOGO */}

          <Link
            href="/dashboard"
            className="group flex items-center gap-3"
          >

            <div
              className={`relative flex h-11 w-11 items-center
              justify-center rounded-[14px] border transition ${
                dark
                  ? "border-purple-300/25 bg-purple-400/10 shadow-lg shadow-purple-500/10"
                  : "border-purple-300/40 bg-white shadow-lg shadow-purple-300/20"
              }`}
            >

              <span
                className={`text-xl font-black ${
                  dark
                    ? "text-white"
                    : "text-[#211827]"
                }`}
              >
                C
              </span>

              <span
                className={`absolute right-1.5 top-1.5
                h-1.5 w-1.5 rounded-full ${
                  dark
                    ? "bg-cyan-300 shadow-[0_0_8px_#67E8F9]"
                    : "bg-cyan-500"
                }`}
              />

              <span
                className={`absolute bottom-1.5 right-1.5
                h-1.5 w-1.5 rounded-full ${
                  dark
                    ? "bg-pink-300 shadow-[0_0_8px_#F472B6]"
                    : "bg-pink-500"
                }`}
              />

            </div>

            <div>
              <p className="text-lg font-black tracking-[0.18em]">
                CIPHER
              </p>

              <p
                className={`hidden text-[9px] font-bold
                uppercase tracking-[0.18em] sm:block ${
                  dark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Transaction Intelligence
              </p>
            </div>

          </Link>

          {/* NAVIGATION */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              href="/dashboard"
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                dark
                  ? "text-gray-400 hover:bg-white/5 hover:text-white"
                  : "text-gray-500 hover:bg-black/5 hover:text-[#211827]"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/transactions"
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                dark
                  ? "bg-white/10 text-white"
                  : "bg-[#211827] text-white"
              }`}
            >
              Transactions
            </Link>

            <Link
              href="/analytics"
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                dark
                  ? "text-gray-400 hover:bg-white/5 hover:text-white"
                  : "text-gray-500 hover:bg-black/5 hover:text-[#211827]"
              }`}
            >
              Analytics
            </Link>

          </div>

          {/* THEME */}

          <div
            className={`flex items-center gap-1 rounded-full border p-1 ${
              dark
                ? "border-white/10 bg-white/[0.05]"
                : "border-black/10 bg-white/70"
            }`}
          >

            <button
              onClick={() => changeTheme(false)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                !dark
                  ? "bg-[#211827] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-label="Light mode"
            >
              ☀
            </button>

            <button
              onClick={() => changeTheme(true)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                dark
                  ? "bg-white text-[#211827] shadow-md"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-label="Dark mode"
            >
              ☾
            </button>

          </div>

        </div>

        {/* MOBILE NAV */}

        <div className="flex justify-center gap-2 border-t border-black/5 px-4 py-2 md:hidden">

          <Link
            href="/dashboard"
            className="rounded-full px-3 py-1 text-xs font-bold"
          >
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              dark
                ? "bg-white/10"
                : "bg-black/10"
            }`}
          >
            Transactions
          </Link>

          <Link
            href="/analytics"
            className="rounded-full px-3 py-1 text-xs font-bold"
          >
            Analytics
          </Link>

        </div>

      </nav>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">

        {/* HEADER */}

        <div className="mb-8">

          <div className="mb-3 flex items-center gap-3">

            <span
              className={`h-2 w-2 rounded-full ${
                dark
                  ? "bg-cyan-300 shadow-[0_0_12px_#67E8F9]"
                  : "bg-cyan-600"
              }`}
            />

            <span
              className={`text-xs font-black uppercase
              tracking-[0.3em] ${
                dark
                  ? "text-cyan-200"
                  : "text-cyan-700"
              }`}
            >
              Live Transaction Intelligence
            </span>

          </div>

          <h1
            className={`text-4xl font-black tracking-tight md:text-5xl ${
              dark ? "text-white" : "text-[#211827]"
            }`}
          >
            Transactions
          </h1>

          <p
            className={`mt-2 max-w-2xl text-sm font-semibold leading-6 ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Real-time multi-agent monitoring and risk triage
            over 89,000+ e-commerce transactions.
          </p>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              label: "Total Ingested",
              value: "89,316",
              accent: dark ? "text-white" : "text-[#211827]",
              icon: "◈",
            },
            {
              label: "High Risk Flagged",
              value: "7,145",
              accent: dark ? "text-red-300" : "text-red-600",
              icon: "!",
            },
            {
              label: "Medium Risk",
              value: "21,436",
              accent: dark ? "text-yellow-200" : "text-yellow-700",
              icon: "◐",
            },
            {
              label: "Matched Queries",
              value: totalCount.toLocaleString(),
              accent: dark ? "text-cyan-300" : "text-cyan-700",
              icon: "⌕",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl border p-5
              backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                dark
                  ? "border-white/[0.08] bg-white/[0.045] hover:border-purple-300/20 hover:bg-white/[0.06]"
                  : "border-black/[0.07] bg-white/65 shadow-sm hover:-translate-y-1 hover:shadow-xl"
              }`}
            >

              <div
                className={`absolute -right-8 -top-8 h-24 w-24
                rounded-full blur-2xl ${
                  dark
                    ? "bg-purple-500/10"
                    : "bg-purple-300/20"
                }`}
              />

              <div className="relative">

                <div className="mb-4 flex items-center justify-between">

                  <p
                    className={`text-xs font-bold uppercase tracking-[0.15em] ${
                      dark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {card.label}
                  </p>

                  <span
                    className={`text-lg ${
                      dark ? "text-purple-300" : "text-purple-600"
                    }`}
                  >
                    {card.icon}
                  </span>

                </div>

                <p
                  className={`text-3xl font-black ${card.accent}`}
                >
                  {card.value}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* =================================================
            TABLE CARD
        ================================================== */}

        <div
          className={`overflow-hidden rounded-3xl border backdrop-blur-xl ${
            dark
              ? "border-white/[0.08] bg-white/[0.035]"
              : "border-black/[0.07] bg-white/70 shadow-xl shadow-purple-900/5"
          }`}
        >

          {/* FILTER HEADER */}

          <div
            className={`border-b p-5 md:p-6 ${
              dark
                ? "border-white/[0.07]"
                : "border-black/[0.07]"
            }`}
          >

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-black">
                  Transaction Records
                </h2>

                <p
                  className={`mt-1 text-xs font-medium ${
                    dark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Search, filter and investigate individual records.
                </p>

              </div>

              <div
                className={`hidden rounded-full px-3 py-1.5 text-[10px]
                font-black uppercase tracking-[0.15em] sm:block ${
                  dark
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "bg-cyan-50 text-cyan-700"
                }`}
              >
                Live Dataset
              </div>

            </div>

            <div className="flex flex-col gap-3 lg:flex-row">

              {/* SEARCH */}

              <div className="relative flex-1">

                <span
                  className={`absolute left-4 top-1/2
                  -translate-y-1/2 text-sm ${
                    dark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search Order ID or City..."
                  className={`w-full rounded-xl border py-3 pl-10 pr-4
                  text-sm font-medium outline-none transition ${
                    dark
                      ? "border-white/[0.08] bg-black/20 text-white placeholder:text-gray-600 focus:border-purple-400/50"
                      : "border-black/[0.08] bg-white text-[#211827] placeholder:text-gray-400 focus:border-purple-500/50"
                  }`}
                />

              </div>

              {/* RISK */}

              <select
                value={riskFilter}
                onChange={(e) => {
                  setRiskFilter(e.target.value);
                  setPage(1);
                }}
                className={`rounded-xl border px-4 py-3 text-sm
                font-semibold outline-none ${
                  dark
                    ? "border-white/[0.08] bg-[#15111D] text-white"
                    : "border-black/[0.08] bg-white text-[#211827]"
                }`}
              >
                <option value="All">All Risk Levels</option>
                <option value="Low Risk">Low Risk (&lt; 40)</option>
                <option value="Medium Risk">
                  Medium Risk (40-69)
                </option>
                <option value="High Risk">High Risk (≥ 70)</option>
              </select>

              {/* PAYMENT */}

              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPage(1);
                }}
                className={`rounded-xl border px-4 py-3 text-sm
                font-semibold outline-none ${
                  dark
                    ? "border-white/[0.08] bg-[#15111D] text-white"
                    : "border-black/[0.08] bg-white text-[#211827]"
                }`}
              >
                <option value="All">All Payment Types</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Wallet">Wallet</option>
                <option value="Boleto">Boleto</option>
                <option value="Voucher">Voucher</option>
              </select>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-sm">

              <thead>

                <tr
                  className={`border-b text-left ${
                    dark
                      ? "border-white/[0.07] text-gray-500"
                      : "border-black/[0.07] text-gray-500"
                  }`}
                >

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">
                    Transaction ID
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">
                    Payment Type
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">
                    Risk Score
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={7}
                      className={`py-16 text-center ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >

                      <div className="mb-3">

                        <div
                          className={`mx-auto h-8 w-8 animate-spin
                          rounded-full border-2 border-t-transparent ${
                            dark
                              ? "border-purple-300"
                              : "border-purple-600"
                          }`}
                        />

                      </div>

                      <p className="font-bold">
                        Loading live dataset records...
                      </p>

                      <p className="mt-1 text-xs opacity-60">
                        Fetching transaction intelligence
                      </p>

                    </td>

                  </tr>

                ) : transactions.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className={`py-16 text-center ${
                        dark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      No transactions found matching filters.
                    </td>

                  </tr>

                ) : (

                  transactions.map((tx) => {

                    const risk = getRiskStyle(tx.score);

                    return (

                      <tr
                        key={tx.id}
                        className={`border-b transition-all duration-200 ${
                          dark
                            ? "border-white/[0.05] hover:bg-white/[0.035]"
                            : "border-black/[0.05] hover:bg-purple-50/50"
                        }`}
                      >

                        {/* ID */}

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-md px-2 py-1 font-mono
                            text-xs font-bold ${
                              dark
                                ? "bg-white/[0.04] text-gray-300"
                                : "bg-black/[0.035] text-gray-700"
                            }`}
                          >
                            {tx.id}
                          </span>

                        </td>

                        {/* AMOUNT */}

                        <td className="px-6 py-4 font-black">
                          $
                          {typeof tx.amount === "number"
                            ? tx.amount.toFixed(2)
                            : tx.amount}
                        </td>

                        {/* PAYMENT */}

                        <td
                          className={`px-6 py-4 font-semibold ${
                            dark
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {tx.type}
                        </td>

                        {/* SCORE */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <span className="w-7 font-black">
                              {tx.score}
                            </span>

                            <div
                              className={`h-2 w-20 overflow-hidden rounded-full ${
                                dark
                                  ? "bg-white/[0.08]"
                                  : "bg-black/[0.08]"
                              }`}
                            >

                              <div
                                className={`h-full rounded-full ${
                                  tx.score >= 70
                                    ? "bg-red-500"
                                    : tx.score >= 40
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    tx.score
                                  )}%`,
                                }}
                              />

                            </div>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex rounded-full border
                            px-3 py-1 text-xs font-black
                            ${risk.bg}
                            ${risk.text}
                            ${risk.border}`}
                          >
                            {tx.status}
                          </span>

                        </td>

                        {/* DATE */}

                        <td
                          className={`whitespace-nowrap px-6 py-4
                          text-xs font-medium ${
                            dark
                              ? "text-gray-500"
                              : "text-gray-500"
                          }`}
                        >
                          {tx.date}
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">

                          <Link
                            href={`/analyze?id=${tx.id}&amount=${tx.amount}`}
                            className={`inline-flex items-center gap-1
                            rounded-full border px-4 py-2 text-xs
                            font-black transition-all hover:-translate-y-0.5 ${
                              dark
                                ? "border-purple-300/20 bg-purple-400/10 text-purple-200 hover:bg-purple-400/20"
                                : "border-purple-300/40 bg-purple-50 text-purple-700 hover:bg-purple-100"
                            }`}
                          >
                            Analyze
                            <span className="transition-transform hover:translate-x-1">
                              →
                            </span>
                          </Link>

                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              PAGINATION
          ================================================== */}

          <div
            className={`flex flex-col items-center justify-between
            gap-4 border-t px-6 py-5 sm:flex-row ${
              dark
                ? "border-white/[0.07]"
                : "border-black/[0.07]"
            }`}
          >

            <span
              className={`text-xs font-semibold ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Showing Page{" "}
              <strong
                className={
                  dark ? "text-white" : "text-[#211827]"
                }
              >
                {page}
              </strong>{" "}
              of{" "}
              <strong
                className={
                  dark ? "text-white" : "text-[#211827]"
                }
              >
                {Math.max(
                  1,
                  Math.ceil(totalCount / 25)
                )}
              </strong>{" "}
              · {totalCount.toLocaleString()} total
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">

              <button
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                disabled={page === 1}
                className={`rounded-full border px-4 py-2 text-xs
                font-bold transition disabled:cursor-not-allowed
                disabled:opacity-30 ${
                  dark
                    ? "border-white/10 hover:bg-white/10"
                    : "border-black/10 hover:bg-black/5"
                }`}
              >
                ← Previous
              </button>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 25 >= totalCount}
                className={`rounded-full border px-4 py-2 text-xs
                font-bold transition disabled:cursor-not-allowed
                disabled:opacity-30 ${
                  dark
                    ? "border-white/10 hover:bg-white/10"
                    : "border-black/10 hover:bg-black/5"
                }`}
              >
                Next →
              </button>

              <Link
                href="/analyze"
                className={`rounded-full px-5 py-2 text-xs
                font-black transition-all hover:-translate-y-0.5 ${
                  dark
                    ? "bg-white text-[#211827] hover:bg-yellow-100"
                    : "bg-[#211827] text-white hover:bg-purple-700"
                }`}
              >
                + Custom Analysis
              </Link>

            </div>

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 pb-4 sm:flex-row">

          <p
            className={`text-[9px] font-black uppercase
            tracking-[0.35em] ${
              dark ? "text-gray-700" : "text-gray-400"
            }`}
          >
            From transactions to intelligence
          </p>

          <p
            className={`text-[9px] font-black uppercase
            tracking-[0.25em] ${
              dark ? "text-gray-700" : "text-gray-400"
            }`}
          >
            CODECRASHERS · TANMAY × RITIKA
          </p>

        </div>

      </section>

    </main>
  );
}
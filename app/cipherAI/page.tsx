"use client";

import { useState } from "react";
import Link from "next/link";

export default function CipherAI() {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState("New conversation");

  const suggestions = [
    "Why was this transaction flagged?",
    "Explain the risk score",
    "What policies apply to this transaction?",
    "How does CIPHER detect anomalies?",
  ];

  const history = [
    {
      title: "Transaction risk analysis",
      time: "Today",
    },
    {
      title: "Why was payment held?",
      time: "Today",
    },
    {
      title: "Explain anomaly detection",
      time: "Yesterday",
    },
    {
      title: "Customer risk profile",
      time: "Yesterday",
    },
    {
      title: "CIPHER policies",
      time: "Sep 15",
    },
  ];

  const newChat = () => {
    setMessage("");
    setActiveChat("New conversation");
  };

  return (
    <main className="h-screen overflow-hidden bg-[#0d0b0a] text-[#f8f5ee] flex flex-col">

      {/* =========================================================
          ANIMATED BACKGROUND
      ========================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,85,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,85,0.35) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* BIG GOLD BUBBLE 1 */}
        <div
          className="absolute -top-48 -left-40 w-[520px] h-[520px] rounded-full border border-[#d4af55]/15 bg-[#d4af55]/[0.035] animate-[floatOne_14s_ease-in-out_infinite]"
        />

        {/* BIG GOLD BUBBLE 2 */}
        <div
          className="absolute -right-44 top-[12%] w-[460px] h-[460px] rounded-full border border-[#d4af55]/20 bg-[#d4af55]/[0.025] animate-[floatTwo_18s_ease-in-out_infinite]"
        />

        {/* BIG GOLD BUBBLE 3 */}
        <div
          className="absolute left-[35%] -bottom-56 w-[500px] h-[500px] rounded-full border border-[#d4af55]/10 bg-[#d4af55]/[0.025] animate-[floatThree_16s_ease-in-out_infinite]"
        />

        {/* FLOATING DOTS */}
        <div className="absolute top-[18%] left-[30%] w-2.5 h-2.5 rounded-full bg-[#d4af55] shadow-[0_0_25px_rgba(212,175,85,0.8)] animate-[dotFloat_6s_ease-in-out_infinite]" />

        <div className="absolute top-[62%] left-[8%] w-2 h-2 rounded-full bg-[#f0d78c] shadow-[0_0_18px_rgba(212,175,85,0.7)] animate-[dotFloat_8s_ease-in-out_infinite_1s]" />

        <div className="absolute top-[30%] right-[12%] w-2 h-2 rounded-full bg-[#c49b43] shadow-[0_0_18px_rgba(212,175,85,0.7)] animate-[dotFloat_7s_ease-in-out_infinite_2s]" />

        <div className="absolute bottom-[16%] right-[30%] w-1.5 h-1.5 rounded-full bg-[#ead083] animate-[dotFloat_9s_ease-in-out_infinite_3s]" />

      </div>


      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <nav className="relative z-20 h-[82px] shrink-0 border-b border-[#d4af55]/15 bg-[#0d0b0a]/90 backdrop-blur-xl flex items-center justify-between px-6 md:px-10">

        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center gap-3">

          <div className="relative w-12 h-12 rounded-2xl bg-[#fffdf8] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,85,0.10)]">

            <span className="text-[28px] font-black text-[#211827] leading-none">
              C
            </span>

            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#10b8d8]" />

            <span className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ed3b91]" />

          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-[0.18em]">
              CIPHER
            </h1>

            <p className="text-[9px] tracking-[0.25em] text-[#a99f8d] font-semibold">
              AI TRANSACTION INTELLIGENCE
            </p>
          </div>

        </Link>


        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-8 text-sm">

          <Link
            href="/dashboard"
            className="text-[#9d9588] hover:text-[#f8f5ee] transition"
          >
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className="text-[#9d9588] hover:text-[#f8f5ee] transition"
          >
            Transactions
          </Link>

          <Link
            href="/analytics"
            className="text-[#9d9588] hover:text-[#f8f5ee] transition"
          >
            Analytics
          </Link>

          <span className="text-[#d4af55] font-semibold">
            CIPHER AI
          </span>

        </div>

      </nav>


      {/* =========================================================
          MAIN AREA
      ========================================================= */}
      <section className="relative z-10 flex-1 min-h-0 flex overflow-hidden">


        {/* =======================================================
            HISTORY SIDEBAR
        ======================================================= */}
        <aside className="hidden md:flex w-[260px] shrink-0 border-r border-[#d4af55]/15 bg-[#100e0c]/80 backdrop-blur-xl flex-col">

          {/* NEW CHAT */}
          <div className="p-4">

            <button
              onClick={newChat}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#d4af55]/35 bg-[#d4af55]/10 hover:bg-[#d4af55]/15 text-[#e4c56f] py-3 text-sm font-semibold transition"
            >
              <span className="text-lg">+</span>
              New Chat
            </button>

          </div>


          {/* HISTORY TITLE */}
          <div className="px-4 pb-2">

            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#716b61]">
              Recent Conversations
            </p>

          </div>


          {/* HISTORY LIST */}
          <div className="flex-1 min-h-0 px-3 overflow-hidden">

            <div className="space-y-1">

              {history.map((chat, index) => (

                <button
                  key={index}
                  onClick={() => setActiveChat(chat.title)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition group ${
                    activeChat === chat.title
                      ? "bg-[#d4af55]/10 border border-[#d4af55]/20"
                      : "border border-transparent hover:bg-white/[0.025]"
                  }`}
                >

                  <div className="flex items-start gap-2">

                    <span
                      className={`mt-1 text-xs ${
                        activeChat === chat.title
                          ? "text-[#d4af55]"
                          : "text-[#625d55]"
                      }`}
                    >
                      ✦
                    </span>

                    <div className="min-w-0">

                      <p
                        className={`text-xs truncate ${
                          activeChat === chat.title
                            ? "text-[#eee5d5]"
                            : "text-[#aaa296]"
                        }`}
                      >
                        {chat.title}
                      </p>

                      <p className="text-[9px] text-[#5f5a52] mt-1">
                        {chat.time}
                      </p>

                    </div>

                  </div>

                </button>

              ))}

            </div>

          </div>


          {/* SIDEBAR FOOTER */}
          <div className="p-4 border-t border-[#d4af55]/10">

            <div className="flex items-center gap-2 text-[10px] text-[#625d55]">

              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />

              CIPHER AI is online

            </div>

          </div>

        </aside>


        {/* =======================================================
            MAIN AI AREA
        ======================================================= */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">


          {/* AI HEADER */}
          <div className="px-5 md:px-8 py-4 shrink-0 border-b border-[#d4af55]/10 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#d4af55]/10 border border-[#d4af55]/25 flex items-center justify-center">

                <span className="text-lg text-[#d4af55]">
                  ✦
                </span>

              </div>

              <div>

                <p className="font-bold text-sm">
                  CIPHER AI Teammate
                </p>

                <div className="flex items-center gap-1.5">

                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />

                  <span className="text-[10px] text-[#81796d]">
                    Ready to assist
                  </span>

                </div>

              </div>

            </div>


            <div className="hidden sm:block text-[9px] tracking-[0.2em] text-[#5f5a52]">
              AUTONOMOUS INTELLIGENCE
            </div>

          </div>


          {/* =====================================================
              CHAT CENTER
          ===================================================== */}
          <div className="flex-1 min-h-0 flex flex-col justify-center px-5 md:px-10 overflow-hidden">

            <div className="max-w-3xl mx-auto w-full">


              {/* LOGO */}
              <div className="flex justify-center mb-4">

                <div className="relative w-[70px] h-[70px] rounded-2xl bg-[#fffdf8] flex items-center justify-center shadow-[0_0_45px_rgba(212,175,85,0.12)] animate-[logoFloat_5s_ease-in-out_infinite]">

                  <span className="text-[34px] font-black text-[#211827]">
                    C
                  </span>

                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#10b8d8]" />

                  <span className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#ed3b91]" />

                </div>

              </div>


              {/* HEADING */}
              <div className="text-center">

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af55] font-bold mb-2">
                  Intelligence Assistant
                </p>

                <h2 className="text-2xl md:text-4xl font-black">

                  Ask{" "}

                  <span className="text-[#d4af55]">
                    CIPHER AI
                  </span>

                </h2>

                <p className="mt-2 text-sm text-[#8d8579]">
                  Ask questions about transactions, risk, anomalies,
                  policies and CIPHER&apos;s decisions.
                </p>

              </div>


              {/* SUGGESTIONS */}
              <div className="grid grid-cols-2 gap-3 mt-6">

                {suggestions.map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() => setMessage(item)}
                    className="group text-left px-4 py-3.5 rounded-xl border border-[#d4af55]/15 bg-[#d4af55]/[0.035] hover:bg-[#d4af55]/[0.09] hover:border-[#d4af55]/35 transition"
                  >

                    <div className="flex items-start gap-2">

                      <span className="text-[#d4af55] text-sm group-hover:translate-x-1 transition">
                        →
                      </span>

                      <span className="text-xs text-[#bcb4a7]">
                        {item}
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            </div>

          </div>


          {/* =====================================================
              INPUT
          ===================================================== */}
          <div className="px-5 md:px-8 pb-2 shrink-0">

            <div className="max-w-3xl mx-auto">

              <div className="rounded-2xl border border-[#d4af55]/25 bg-[#0b0908]/95 p-2 flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] focus-within:border-[#d4af55]/50 transition">

                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask CIPHER AI anything..."
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-sm text-[#f8f5ee] placeholder:text-[#625d55]"
                />

                <button
                  type="button"
                  className="w-11 h-11 shrink-0 rounded-xl bg-[#d4af55] hover:bg-[#e2c36e] text-[#15120f] flex items-center justify-center font-bold text-lg transition shadow-[0_0_22px_rgba(212,175,85,0.16)]"
                >
                  ↑
                </button>

              </div>

              <p className="text-center text-[9px] text-[#565149] mt-1">
                CIPHER AI uses available transaction and policy context to
                provide intelligent assistance.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FIXED FOOTER
      ========================================================= */}
      <footer className="relative z-20 h-[32px] shrink-0 flex items-center justify-center border-t border-[#d4af55]/10 bg-[#0d0b0a]/95">

        <p className="text-[9px] tracking-[0.22em] text-[#8b7c62] uppercase">

          Crafted by{" "}

          <span className="text-[#d4af55] font-bold">
           Tanmay
          </span>

          <span className="mx-2 text-[#625746]">
            ×
          </span>

          <span className="text-[#d4af55] font-bold">
            Ritika
          </span>

        </p>

      </footer>


      {/* =========================================================
          ANIMATIONS
      ========================================================= */}
      <style jsx global>{`

        @keyframes floatOne {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }

          25% {
            transform: translate(45px, 25px) scale(1.04);
          }

          50% {
            transform: translate(20px, 65px) scale(0.98);
          }

          75% {
            transform: translate(-30px, 35px) scale(1.03);
          }
        }

        @keyframes floatTwo {
          0%, 100% {
            transform: translate(0px, 0px);
          }

          30% {
            transform: translate(-50px, 35px);
          }

          60% {
            transform: translate(-20px, 80px);
          }

          80% {
            transform: translate(25px, 40px);
          }
        }

        @keyframes floatThree {
          0%, 100% {
            transform: translate(0px, 0px);
          }

          25% {
            transform: translate(-35px, -25px);
          }

          50% {
            transform: translate(30px, -50px);
          }

          75% {
            transform: translate(50px, -15px);
          }
        }

        @keyframes dotFloat {
          0%, 100% {
            transform: translate(0px, 0px);
            opacity: 0.55;
          }

          50% {
            transform: translate(20px, -28px);
            opacity: 1;
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-7px);
          }
        }

      `}</style>

    </main>
  );
}
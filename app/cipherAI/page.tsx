"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hello! 👋 I am **CIPHER AI**. How can I assist you with transaction analysis, risk scores, or fraud policies today?",
  timestamp: "Just now",
};

const SHORTENED_RECOMMENDATIONS = [
  {
    icon: "⚡",
    label: "Why flagged?",
    query:
      "Explain why order DzNM8wrcMGFH was marked high risk and what policies were triggered.",
  },
  {
    icon: "📊",
    label: "Risk score",
    query: "Explain the risk score calibration (0-100) and risk tiers.",
  },
  {
    icon: "🛡️",
    label: "Active policies",
    query:
      "What governing policies apply to transactions? List POL-001 through POL-008.",
  },
  {
    icon: "🔍",
    label: "Anomaly detection",
    query: "How does CIPHER detect anomalies using the Isolation Forest model?",
  },
];

const PRESET_CONVERSATIONS = [
  {
    title: "Transaction risk analysis",
    time: "Today",
    query:
      "Explain why order DzNM8wrcMGFH was marked high risk and what policies were triggered.",
  },
  {
    title: "Why was payment held?",
    time: "Today",
    query:
      "Why does POL-007 enforce a 2-hour payment clearing hold on wallet transactions?",
  },
  {
    title: "Explain anomaly detection",
    time: "Yesterday",
    query:
      "How does the Isolation Forest model compute outlier scores without labeled fraud data?",
  },
  {
    title: "Customer risk profile",
    time: "Yesterday",
    query:
      "How does Customer Intelligence determine customer tiers and trust scores?",
  },
  {
    title: "CIPHER policies",
    time: "Sep 15",
    query:
      "List all active governing policies from POL-001 to POL-008 and their thresholds.",
  },
];

let idCounter = 0;
function createMessageId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

// Helper to format timestamps
function getFormattedTime(): string {
  return "Just now";
}

// Lightweight Markdown Renderer for clean, secure presentation
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed text-[#eee5d5]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className="text-base font-bold text-[#d4af55] mt-3 mb-1"
            >
              {renderInlineStyles(trimmed.slice(4))}
            </h4>
          );
        }

        // Bullet items
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-[#d4af55] mt-1 text-xs">•</span>
              <span className="flex-1">
                {renderInlineStyles(trimmed.slice(2))}
              </span>
            </div>
          );
        }

        // Numbered list items (e.g. 1. )
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="font-mono text-xs font-bold text-[#d4af55] mt-0.5">
                {numMatch[1]}.
              </span>
              <span className="flex-1">{renderInlineStyles(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{renderInlineStyles(line)}</p>;
      })}
    </div>
  );
}

// Inline styling parser for **bold**, `code`, and highlighting
function renderInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-[#fcf9f2]">
          {boldText}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className="rounded bg-[#d4af55]/15 px-1.5 py-0.5 font-mono text-xs text-[#f1d78f] border border-[#d4af55]/25"
        >
          {codeText}
        </code>
      );
    }

    return part;
  });
}

export default function CipherAI() {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState("New conversation");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const bottomInputRef = useRef<HTMLInputElement>(null);

  const isThreadStarted = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isThreadStarted) {
      scrollToBottom();
    }
  }, [messages, isGenerating, isThreadStarted]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit query to AI
  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText ?? message).trim();
    if (!textToSend || isGenerating) return;

    setMessage("");

    const userMessage: Message = {
      id: createMessageId("user"),
      role: "user",
      content: textToSend,
      timestamp: getFormattedTime(),
    };

    // If starting a fresh thread, prepend initial greeting for context
    const currentHistory =
      messages.length === 0 ? [INITIAL_GREETING] : messages;
    const newHistory = [...currentHistory, userMessage];

    setMessages(newHistory);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Service returned an unexpected response.");
      }

      const data = (await res.json()) as { reply?: string; error?: string };
      const replyContent =
        data.reply ||
        "I analyzed the transaction context. Let me know if you need deeper policy details.";

      const assistantMessage: Message = {
        id: createMessageId("ai"),
        role: "assistant",
        content: replyContent,
        timestamp: getFormattedTime(),
      };

      startTransition(() => {
        setMessages((prev) => [...prev, assistantMessage]);
      });
    } catch {
      const errorMessage: Message = {
        id: createMessageId("err"),
        role: "assistant",
        content:
          "⚠️ **Temporary Network Alert**: I encountered a momentary connection interruption with the AI reasoning engine. Your query was logged. Please retry or pick one of the active risk inspection shortcuts below.",
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => bottomInputRef.current?.focus(), 50);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveChat("New conversation");
    setMessage("");
    setTimeout(() => heroInputRef.current?.focus(), 50);
  };

  const selectConversation = (conv: (typeof PRESET_CONVERSATIONS)[0]) => {
    setActiveChat(conv.title);
    handleSend(conv.query);
  };

  return (
    <main className="h-screen overflow-hidden bg-[#0d0b0a] text-[#f8f5ee] flex flex-col font-sans">
      {/* =========================================================
          BACKGROUND EFFECTS
      ========================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,85,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,85,0.35) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="absolute -top-48 -left-40 w-[520px] h-[520px] rounded-full border border-[#d4af55]/15 bg-[#d4af55]/[0.035] animate-[floatOne_14s_ease-in-out_infinite]" />
        <div className="absolute -right-44 top-[12%] w-[460px] h-[460px] rounded-full border border-[#d4af55]/20 bg-[#d4af55]/[0.025] animate-[floatTwo_18s_ease-in-out_infinite]" />
        <div className="absolute left-[35%] -bottom-56 w-[500px] h-[500px] rounded-full border border-[#d4af55]/10 bg-[#d4af55]/[0.025] animate-[floatThree_16s_ease-in-out_infinite]" />

        <div className="absolute top-[18%] left-[30%] w-2.5 h-2.5 rounded-full bg-[#d4af55] shadow-[0_0_25px_rgba(212,175,85,0.8)] animate-[dotFloat_6s_ease-in-out_infinite]" />
        <div className="absolute top-[62%] left-[8%] w-2 h-2 rounded-full bg-[#f0d78c] shadow-[0_0_18px_rgba(212,175,85,0.7)] animate-[dotFloat_8s_ease-in-out_infinite_1s]" />
        <div className="absolute top-[30%] right-[12%] w-2 h-2 rounded-full bg-[#c49b43] shadow-[0_0_18px_rgba(212,175,85,0.7)] animate-[dotFloat_7s_ease-in-out_infinite_2s]" />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <nav className="relative z-20 h-[82px] shrink-0 border-b border-[#d4af55]/15 bg-[#0d0b0a]/90 backdrop-blur-xl flex items-center justify-between px-6 md:px-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* SLEEK CIRCULAR CYBER EMBLEM */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#241e17] via-[#14100c] to-[#070605] border border-[#d4af55]/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,85,0.2)] group-hover:scale-105 group-hover:border-[#d4af55]/70 transition">
            <span className="text-[22px] font-black text-[#fffdf8] leading-none tracking-tight">
              C
            </span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10b8d8] shadow-[0_0_8px_#10b8d8]" />
            <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ed3b91] shadow-[0_0_8px_#ed3b91]" />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-[0.18em] text-[#fffdf8]">
              CIPHER
            </h1>
            <p className="text-[9px] tracking-[0.25em] text-[#a99f8d] font-semibold">
              AI TRANSACTION INTELLIGENCE
            </p>
          </div>
        </Link>

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
          <span className="text-[#d4af55] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4af55] shadow-[0_0_8px_#d4af55]" />
            CIPHER AI
          </span>
        </div>
      </nav>

      {/* =========================================================
          MAIN BODY
      ========================================================= */}
      <section className="relative z-10 flex-1 min-h-0 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-[270px] shrink-0 border-r border-[#d4af55]/15 bg-[#100e0c]/80 backdrop-blur-xl flex-col">
          <div className="p-4">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#d4af55]/35 bg-[#d4af55]/10 hover:bg-[#d4af55]/20 text-[#e4c56f] py-3 text-sm font-bold transition shadow-[0_0_15px_rgba(212,175,85,0.08)] cursor-pointer"
            >
              <span className="text-lg leading-none">+</span>
              New Chat
            </button>
          </div>

          <div className="px-4 pb-2">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#716b61]">
              Recent Conversations
            </p>
          </div>

          <div className="flex-1 min-h-0 px-3 overflow-y-auto space-y-1 custom-scrollbar">
            {PRESET_CONVERSATIONS.map((chat, idx) => (
              <button
                key={idx}
                onClick={() => selectConversation(chat)}
                className={`w-full text-left px-3 py-3 rounded-xl transition group cursor-pointer ${
                  activeChat === chat.title
                    ? "bg-[#d4af55]/15 border border-[#d4af55]/30"
                    : "border border-transparent hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 text-xs transition ${
                      activeChat === chat.title
                        ? "text-[#d4af55]"
                        : "text-[#625d55] group-hover:text-[#a59a87]"
                    }`}
                  >
                    ✦
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        activeChat === chat.title
                          ? "text-[#f8f5ee]"
                          : "text-[#aaa296] group-hover:text-[#eee5d5]"
                      }`}
                    >
                      {chat.title}
                    </p>
                    <p className="text-[9px] text-[#5f5a52] mt-0.5">
                      {chat.time}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-[#d4af55]/10">
            <div className="flex items-center gap-2 text-[10px] text-[#8e8576]">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
              <span>CIPHER AI is online</span>
            </div>
          </div>
        </aside>

        {/* CHAT / INTERACTIVE AREA */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden bg-gradient-to-b from-transparent to-[#0a0807]/60">
          {/* HEADER */}
          <div className="px-5 md:px-8 py-3.5 shrink-0 border-b border-[#d4af55]/10 flex items-center justify-between bg-[#0d0b0a]/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-[#d4af55]/10 border border-[#d4af55]/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,85,0.12)]">
                <span className="text-base font-black text-[#d4af55] leading-none">
                  C
                </span>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#10b8d8]" />
                <span className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#ed3b91]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#f8f5ee] flex items-center gap-2">
                  CIPHER AI Teammate
                  <span className="rounded bg-[#d4af55]/20 px-2 py-0.5 font-mono text-[9px] font-bold text-[#f5db96] border border-[#d4af55]/30">
                    AUTONOMOUS SWARM
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={startNewChat}
              className="text-xs text-[#d4af55] font-semibold border border-[#d4af55]/25 rounded-lg px-3 py-1.5 hover:bg-[#d4af55]/10 transition flex items-center gap-1 cursor-pointer"
            >
              <span>+</span> New Chat
            </button>
          </div>

          {/* =========================================================
              VIEW 1: INITIAL CENTERED ASKING HERO (EMPTY THREAD)
          ========================================================= */}
          {!isThreadStarted ? (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 md:px-8 py-8 overflow-y-auto custom-scrollbar">
              <div className="w-full max-w-2xl text-center">
                {/* CIRCULAR CYBER EMBLEM */}
                <div className="flex justify-center mb-5">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#2a2219] via-[#16120e] to-[#080706] border-2 border-[#d4af55]/50 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,85,0.25)] animate-[logoFloat_5s_ease-in-out_infinite]">
                    {/* Outer glowing pulsing ring */}
                    <div className="absolute -inset-2 rounded-full border border-[#d4af55]/20 animate-pulse pointer-events-none" />

                    <span className="text-4xl font-black text-[#fffdf8] tracking-tight">
                      C
                    </span>
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#10b8d8] shadow-[0_0_12px_#10b8d8]" />
                    <span className="absolute bottom-3.5 right-3.5 w-2 h-2 rounded-full bg-[#ed3b91] shadow-[0_0_10px_#ed3b91]" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af55]/30 bg-[#d4af55]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#e5c97b] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af55] animate-pulse" />
                  Intelligence Assistant
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-[#fffdf8] tracking-tight">
                  Ask <span className="text-[#d4af55]">CIPHER AI</span>
                </h2>

                {/* =====================================================
                    MAIN ASKING BAR IN MIDDLE
                ===================================================== */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="mt-7 w-full"
                >
                  <div className="group relative rounded-2xl border border-[#d4af55]/40 bg-[#070605]/95 p-2 shadow-[0_12px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl focus-within:border-[#d4af55]/85 focus-within:shadow-[0_0_35px_rgba(212,175,85,0.25)] transition-all duration-300">
                    <div className="flex items-center gap-3 px-2">
                      <span className="text-lg text-[#d4af55]/70 group-focus-within:text-[#d4af55] transition">
                        ✦
                      </span>
                      <input
                        ref={heroInputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask CIPHER AI anything about transactions, anomalies, or policies..."
                        disabled={isGenerating}
                        autoFocus
                        className="flex-1 bg-transparent py-2.5 text-sm md:text-base text-[#f8f5ee] placeholder:text-[#6a6357] outline-none disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!message.trim() || isGenerating}
                        aria-label="Send query to CIPHER AI"
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-base transition duration-200 ${
                          message.trim() && !isGenerating
                            ? "bg-[#d4af55] hover:bg-[#e2c36e] text-[#15120f] shadow-[0_0_20px_rgba(212,175,85,0.4)] cursor-pointer scale-100"
                            : "bg-[#d4af55]/15 text-[#5e5647] cursor-not-allowed"
                        }`}
                      >
                        ↑
                      </button>
                    </div>
                  </div>
                </form>

                {/* =====================================================
                    SHORTENED RECOMMENDATIONS JUST BELOW ASKING BAR
                ===================================================== */}
                <div className="mt-4 w-full">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {SHORTENED_RECOMMENDATIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(item.query)}
                        className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#d4af55]/25 bg-[#d4af55]/[0.05] hover:bg-[#d4af55]/[0.15] hover:border-[#d4af55]/50 transition cursor-pointer text-xs text-[#dcd2be] hover:text-white shadow-sm"
                      >
                        <span className="text-xs">{item.icon}</span>
                        <span className="font-medium tracking-wide">
                          {item.label}
                        </span>
                        <span className="text-[#d4af55] text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================
                VIEW 2: ACTIVE CONVERSATION STREAM
            ========================================================= */
            <>
              {/* CHAT MESSAGES STREAM */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* MESSAGE HISTORY */}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-3.5 ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* AI AVATAR */}
                      {m.role === "assistant" && (
                        <div className="relative w-8 h-8 shrink-0 rounded-xl bg-[#d4af55]/15 border border-[#d4af55]/30 flex items-center justify-center text-[#d4af55] text-xs font-black shadow-[0_0_12px_rgba(212,175,85,0.15)] mt-0.5">
                          C
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#10b8d8]" />
                          <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#ed3b91]" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-lg ${
                          m.role === "user"
                            ? "bg-[#d4af55]/20 border border-[#d4af55]/40 text-[#fffdf8]"
                            : "bg-[#14110e]/95 border border-[#d4af55]/20 text-[#eee5d5]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/[0.06]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9d9382]">
                            {m.role === "assistant"
                              ? "CIPHER AI Teammate"
                              : "You"}
                          </span>
                          <div className="flex items-center gap-2">
                            {m.role === "assistant" && (
                              <button
                                onClick={() => handleCopy(m.id, m.content)}
                                className="text-[10px] text-[#9d9382] hover:text-[#d4af55] transition flex items-center gap-1 cursor-pointer"
                                title="Copy message"
                              >
                                {copiedId === m.id ? (
                                  <span className="text-green-400 font-semibold">
                                    ✓ Copied
                                  </span>
                                ) : (
                                  <span>📋 Copy</span>
                                )}
                              </button>
                            )}
                            <span className="text-[9px] font-mono text-[#71695c]">
                              {m.timestamp}
                            </span>
                          </div>
                        </div>

                        <FormattedMessage content={m.content} />
                      </div>

                      {/* USER AVATAR */}
                      {m.role === "user" && (
                        <div className="w-8 h-8 shrink-0 rounded-xl bg-[#2a241b] border border-[#d4af55]/30 flex items-center justify-center text-[#d4af55] text-xs font-bold mt-0.5">
                          YOU
                        </div>
                      )}
                    </div>
                  ))}

                  {/* TYPING INDICATOR */}
                  {isGenerating && (
                    <div className="flex gap-3.5 justify-start">
                      <div className="relative w-8 h-8 shrink-0 rounded-xl bg-[#d4af55]/15 border border-[#d4af55]/30 flex items-center justify-center text-[#d4af55] text-xs font-black shadow-[0_0_12px_rgba(212,175,85,0.15)] animate-pulse">
                        C
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#10b8d8]" />
                        <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#ed3b91]" />
                      </div>
                      <div className="bg-[#14110e]/95 border border-[#d4af55]/25 rounded-2xl px-4 py-3 flex items-center gap-2.5">
                        <span className="text-xs text-[#a99f8d] font-medium">
                          CIPHER AI is synthesizing multi-agent reasoning
                        </span>
                        <span className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af55] animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af55] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af55] animate-bounce" />
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* DOCKED BOTTOM INPUT BAR */}
              <div className="px-4 md:px-8 pb-3 pt-2 shrink-0 bg-[#0d0b0a]/90 border-t border-[#d4af55]/15 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto">
                  {/* COMPACT SHORT RECOMMENDATIONS QUICK BAR */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-1">
                    <span className="text-[10px] text-[#71695c] uppercase font-bold shrink-0">
                      Shortcuts:
                    </span>
                    {SHORTENED_RECOMMENDATIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(item.query)}
                        disabled={isGenerating}
                        className="shrink-0 text-[11px] px-2.5 py-0.5 rounded-full border border-[#d4af55]/20 bg-[#d4af55]/[0.04] hover:bg-[#d4af55]/[0.12] text-[#c9bfae] hover:text-white transition cursor-pointer"
                      >
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="rounded-2xl border border-[#d4af55]/30 bg-[#070605]/95 p-1.5 flex items-center gap-2 shadow-[0_10px_35px_rgba(0,0,0,0.4)] focus-within:border-[#d4af55]/70 focus-within:ring-1 focus-within:ring-[#d4af55]/40 transition"
                  >
                    <input
                      ref={bottomInputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask CIPHER AI anything about transactions, anomalies, or policies..."
                      disabled={isGenerating}
                      className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-[#f8f5ee] placeholder:text-[#6a6357] disabled:opacity-50"
                    />

                    <button
                      type="submit"
                      disabled={!message.trim() || isGenerating}
                      aria-label="Send query to CIPHER AI"
                      className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-base transition shadow-[0_0_20px_rgba(212,175,85,0.2)] ${
                        message.trim() && !isGenerating
                          ? "bg-[#d4af55] hover:bg-[#e2c36e] text-[#15120f] cursor-pointer"
                          : "bg-[#d4af55]/20 text-[#6d6453] cursor-not-allowed"
                      }`}
                    >
                      ↑
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================================================
          FIXED FOOTER
      ========================================================= */}
      <footer className="relative z-20 h-[32px] shrink-0 flex items-center justify-center border-t border-[#d4af55]/10 bg-[#0d0b0a]">
        <p className="text-[9px] tracking-[0.22em] text-[#8b7c62] uppercase">
          Crafted by{" "}
          <span className="text-[#d4af55] font-bold">Tanmay</span>
          <span className="mx-2 text-[#625746]">×</span>
          <span className="text-[#d4af55] font-bold">Ritika</span>
        </p>
      </footer>

      {/* =========================================================
          ANIMATIONS
      ========================================================= */}
      <style jsx global>{`
        @keyframes floatOne {
          0%,
          100% {
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
          0%,
          100% {
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
          0%,
          100% {
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
          0%,
          100% {
            transform: translate(0px, 0px);
            opacity: 0.55;
          }
          50% {
            transform: translate(20px, -28px);
            opacity: 1;
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 175, 85, 0.03);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 85, 0.2);
          border-radius: 9999px;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
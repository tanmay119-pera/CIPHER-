"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [dark, setDark] = useState(true);
  const [ready, setReady] = useState(false);

  /* ---------------------------------------------
     APPLY THEME TO ENTIRE WEBSITE
  --------------------------------------------- */
  const applyTheme = (isDark: boolean) => {
    setDark(isDark);

    localStorage.setItem(
      "cipher-theme",
      isDark ? "dark" : "light"
    );

    // Apply theme globally
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    // Also apply dark class for Tailwind dark mode if needed
    document.documentElement.classList.toggle("dark", isDark);
  };

  /* ---------------------------------------------
     LOAD SAVED THEME
  --------------------------------------------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("cipher-theme");

    if (savedTheme === "light") {
      requestAnimationFrame(() => setDark(false));

      document.documentElement.setAttribute(
        "data-theme",
        "light"
      );

      document.documentElement.classList.remove("dark");
    } else {
      // Default = DARK
      requestAnimationFrame(() => setDark(true));

      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );

      document.documentElement.classList.add("dark");
    }
  }, []);

  /* ---------------------------------------------
     LOADING ANIMATION
  --------------------------------------------- */
  useEffect(() => {
    const duration = 3500;
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const progressInterval = setInterval(() => {
      setProgress((previous) => {
        const next = previous + increment;

        if (next >= 100) {
          clearInterval(progressInterval);
          setReady(true);
          return 100;
        }

        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  /* ---------------------------------------------
     ENTER DASHBOARD
  --------------------------------------------- */
  const enterDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <main
      className={`relative flex h-screen w-screen items-center justify-center overflow-hidden transition-colors duration-700 ${
        dark
          ? "bg-[#0B0812] text-white"
          : "bg-[#F7F2EA] text-[#211827]"
      }`}
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* MAIN CENTRAL GLOW */}

        <div
          className={`absolute left-1/2 top-1/2 h-[500px] w-[500px]
          -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl
          transition-all duration-700 ${
            dark
              ? "bg-purple-500/20"
              : "bg-purple-300/35"
          }`}
        />

        {/* PINK GLOW */}

        <div
          className={`absolute -left-40 -top-40 h-[420px] w-[420px]
          rounded-full blur-3xl transition-all duration-700 ${
            dark
              ? "bg-pink-500/10"
              : "bg-pink-300/30"
          }`}
        />

        {/* CYAN GLOW */}

        <div
          className={`absolute -bottom-40 -right-40 h-[420px] w-[420px]
          rounded-full blur-3xl transition-all duration-700 ${
            dark
              ? "bg-cyan-400/10"
              : "bg-cyan-300/30"
          }`}
        />

        {/* =================================================
            FLOATING BUBBLES
        ================================================== */}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
        >

          {/* PURPLE BUBBLE */}

          <circle
            cx="120"
            cy="180"
            r="68"
            fill={dark ? "#A78BFA" : "#C4B5FD"}
            fillOpacity={dark ? "0.08" : "0.25"}
            stroke={dark ? "#C4B5FD" : "#8B5CF6"}
            strokeOpacity="0.25"
          >
            <animate
              attributeName="cx"
              values="120;170;105;155;120"
              dur="13s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="180;120;210;145;180"
              dur="13s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="68;78;60;74;68"
              dur="13s"
              repeatCount="indefinite"
            />
          </circle>

          {/* CYAN BUBBLE */}

          <circle
            cx="880"
            cy="210"
            r="75"
            fill="#67E8F9"
            fillOpacity={dark ? "0.07" : "0.23"}
            stroke="#22D3EE"
            strokeOpacity="0.25"
          >
            <animate
              attributeName="cx"
              values="880;825;910;850;880"
              dur="16s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="210;275;175;240;210"
              dur="16s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="75;65;84;70;75"
              dur="16s"
              repeatCount="indefinite"
            />
          </circle>

          {/* PINK BUBBLE */}

          <circle
            cx="160"
            cy="590"
            r="82"
            fill="#F9A8D4"
            fillOpacity={dark ? "0.07" : "0.20"}
            stroke="#F472B6"
            strokeOpacity="0.23"
          >
            <animate
              attributeName="cx"
              values="160;220;135;195;160"
              dur="18s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="590;535;620;555;590"
              dur="18s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="82;70;90;75;82"
              dur="18s"
              repeatCount="indefinite"
            />
          </circle>

          {/* GOLD BUBBLE */}

          <circle
            cx="850"
            cy="580"
            r="58"
            fill="#FDE68A"
            fillOpacity={dark ? "0.07" : "0.22"}
            stroke="#FACC15"
            strokeOpacity="0.25"
          >
            <animate
              attributeName="cx"
              values="850;805;875;830;850"
              dur="12s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="580;535;620;555;580"
              dur="12s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="58;65;50;62;58"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>

          {/* SMALL PURPLE */}

          <circle
            cx="270"
            cy="100"
            r="16"
            fill="#C084FC"
            fillOpacity="0.40"
          >
            <animate
              attributeName="cx"
              values="270;300;250;285;270"
              dur="9s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="100;65;120;80;100"
              dur="9s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="r"
              values="16;21;13;19;16"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>

          {/* SMALL CYAN */}

          <circle
            cx="760"
            cy="560"
            r="13"
            fill="#67E8F9"
            fillOpacity="0.45"
          >
            <animate
              attributeName="cx"
              values="760;790;745;775;760"
              dur="8s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="cy"
              values="560;520;590;535;560"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* SMALL PINK */}

          <circle
            cx="90"
            cy="390"
            r="9"
            fill="#F472B6"
            fillOpacity="0.50"
          >
            <animate
              attributeName="cy"
              values="390;350;420;365;390"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>

          {/* SMALL GOLD */}

          <circle
            cx="925"
            cy="390"
            r="9"
            fill="#FACC15"
            fillOpacity="0.50"
          >
            <animate
              attributeName="cy"
              values="390;350;420;365;390"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

        </svg>

        {/* =================================================
            SUBTLE GRID
        ================================================== */}

        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            dark
              ? "opacity-[0.025]"
              : "opacity-[0.045]"
          }`}
          style={{
            backgroundImage: dark
              ? "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)"
              : "linear-gradient(#211827 1px, transparent 1px), linear-gradient(90deg, #211827 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* =================================================
            FLOATING PARTICLES
        ================================================== */}

        <div
          className={`absolute left-[22%] top-[28%] h-1.5 w-1.5
          rounded-full ${
            dark
              ? "bg-purple-300 shadow-[0_0_12px_#C084FC]"
              : "bg-purple-500"
          }`}
        />

        <div
          className={`absolute right-[24%] top-[32%] h-1.5 w-1.5
          rounded-full ${
            dark
              ? "bg-cyan-300 shadow-[0_0_12px_#67E8F9]"
              : "bg-cyan-500"
          }`}
        />

        <div
          className={`absolute bottom-[25%] left-[30%] h-1 w-1
          rounded-full ${
            dark
              ? "bg-pink-300 shadow-[0_0_10px_#F472B6]"
              : "bg-pink-500"
          }`}
        />

      </div>

      {/* =====================================================
          THEME SELECTOR
      ====================================================== */}

      <div className="absolute right-6 top-5 z-30">

        <div
          className={`flex items-center gap-1 rounded-full border p-1
          backdrop-blur-xl ${
            dark
              ? "border-white/10 bg-white/[0.06]"
              : "border-black/10 bg-white/75"
          }`}
        >

          {/* LIGHT */}

          <button
            onClick={() => applyTheme(false)}
            aria-label="Light mode"
            className={`rounded-full px-3 py-1.5 text-xs font-bold
            transition-all duration-300 ${
              !dark
                ? "bg-[#211827] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ☀
          </button>

          {/* DARK */}

          <button
            onClick={() => applyTheme(true)}
            aria-label="Dark mode"
            className={`rounded-full px-3 py-1.5 text-xs font-bold
            transition-all duration-300 ${
              dark
                ? "bg-white text-[#211827] shadow-md"
                : "text-gray-500 hover:text-black"
            }`}
          >
            ☾
          </button>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="relative z-10 flex max-h-screen w-full max-w-3xl
        flex-col items-center justify-center px-6 py-5 text-center"
      >

        {/* TEAM */}

        <div className="mb-4">

          <div className="flex items-center justify-center gap-3">

            <div
              className={`h-px w-8 ${
                dark
                  ? "bg-yellow-200/40"
                  : "bg-purple-500/30"
              }`}
            />

            <p
              className={`text-[11px] font-black tracking-[0.55em] ${
                dark
                  ? "text-yellow-100"
                  : "text-purple-700"
              }`}
            >
              CODECRASHERS
            </p>

            <div
              className={`h-px w-8 ${
                dark
                  ? "bg-yellow-200/40"
                  : "bg-purple-500/30"
              }`}
            />

          </div>

          <p
            className={`mt-1.5 text-[10px] font-bold tracking-[0.35em] ${
              dark
                ? "text-gray-500"
                : "text-gray-500"
            }`}
          >
            TANMAY <span className="mx-2">×</span> RITIKA
          </p>

        </div>

        {/* CIPHER LOGO */}

        <div className="mb-4">

          <div
            className={`relative flex h-[76px] w-[76px]
            items-center justify-center rounded-[24px] border
            transition-all duration-700 ${
              dark
                ? "border-purple-300/30 bg-purple-400/[0.08] shadow-2xl shadow-purple-500/20"
                : "border-purple-300/40 bg-white shadow-xl shadow-purple-300/30"
            }`}
          >

            {/* OUTER GLOW */}

            <div
              className={`absolute inset-[-7px] rounded-[28px]
              border opacity-40 ${
                dark
                  ? "border-purple-400/20"
                  : "border-purple-400/15"
              }`}
            />

            {/* C */}

            <div
              className={`text-4xl font-black ${
                dark
                  ? "text-[#FFFDF8]"
                  : "text-[#211827]"
              }`}
            >
              C
            </div>

            {/* CYAN NODE */}

            <div
              className={`absolute right-3.5 top-3.5 h-2.5 w-2.5
              rounded-full ${
                dark
                  ? "bg-cyan-300 shadow-[0_0_14px_#67E8F9]"
                  : "bg-cyan-500"
              }`}
            />

            {/* PINK NODE */}

            <div
              className={`absolute bottom-3.5 right-3.5 h-2.5 w-2.5
              rounded-full ${
                dark
                  ? "bg-pink-300 shadow-[0_0_14px_#F9A8D4]"
                  : "bg-pink-500"
              }`}
            />

          </div>

        </div>

        {/* TITLE */}

        <h1
          className={`text-6xl font-black tracking-[0.17em] md:text-8xl ${
            dark
              ? "text-[#FFFDF8]"
              : "text-[#211827]"
          }`}
        >
          CIPHER
        </h1>

        {/* TAGLINE */}

        <p
          className={`mt-2 text-xs font-black uppercase
          tracking-[0.32em] md:text-sm ${
            dark
              ? "text-purple-300"
              : "text-purple-700"
          }`}
        >
          AI Transaction Intelligence
        </p>

        {/* DESCRIPTION */}

        <p
          className={`mx-auto mt-3 max-w-lg text-sm font-semibold
          leading-5 md:text-[15px] ${
            dark
              ? "text-gray-300"
              : "text-gray-600"
          }`}
        >
          Monitor e-commerce transactions, detect anomalies,
          <br className="hidden md:block" />
          and understand the behavior behind potential risk.
        </p>

        {/* DATA FLOW */}

        <div
          className="mx-auto mt-5 flex w-full max-w-sm
          items-center gap-3"
        >

          <div
            className={`h-2.5 w-2.5 rounded-full ${
              dark
                ? "bg-yellow-200 shadow-[0_0_12px_#FDE68A]"
                : "bg-purple-600"
            }`}
          />

          <div
            className={`h-px flex-1 ${
              dark
                ? "bg-yellow-100/20"
                : "bg-purple-600/20"
            }`}
          />

          <div
            className={`h-3.5 w-3.5 rounded-full ${
              dark
                ? "bg-cyan-300 shadow-[0_0_15px_#67E8F9]"
                : "bg-cyan-600"
            }`}
          />

          <div
            className={`h-px flex-1 ${
              dark
                ? "bg-pink-200/20"
                : "bg-pink-500/20"
            }`}
          />

          <div
            className={`h-2.5 w-2.5 rounded-full ${
              dark
                ? "bg-pink-300 shadow-[0_0_12px_#F9A8D4]"
                : "bg-pink-600"
            }`}
          />

        </div>

        {/* STATUS */}

        <div className="mt-4">

          <div className="flex items-center justify-center gap-2">

            <div
              className={`h-2 w-2 rounded-full ${
                ready
                  ? "bg-green-400"
                  : dark
                    ? "animate-pulse bg-cyan-300"
                    : "animate-pulse bg-cyan-600"
              }`}
            />

            <p
              className={`text-sm font-bold ${
                dark
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              {ready
                ? "CIPHER is ready"
                : "Initializing transaction intelligence"}
            </p>

          </div>

          <p
            className={`mt-1 text-[11px] font-medium ${
              dark
                ? "text-gray-500"
                : "text-gray-500"
            }`}
          >
            {ready
              ? "Your intelligence workspace is ready to enter."
              : "Preparing AI-powered risk analysis..."}
          </p>

        </div>

        {/* PROGRESS */}

        <div className="mx-auto mt-3 w-72 md:w-96">

          <div
            className={`h-1.5 overflow-hidden rounded-full ${
              dark
                ? "bg-white/10"
                : "bg-black/10"
            }`}
          >

            <div
              className={`h-full rounded-full transition-all duration-75 ${
                dark
                  ? "bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300"
                  : "bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500"
              }`}
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="mt-1 flex justify-between">

            <span
              className={`text-[9px] font-bold uppercase
              tracking-[0.2em] ${
                dark
                  ? "text-gray-600"
                  : "text-gray-500"
              }`}
            >
              {ready ? "Ready" : "Loading"}
            </span>

            <span
              className={`text-[9px] font-black ${
                dark
                  ? "text-yellow-200"
                  : "text-purple-700"
              }`}
            >
              {Math.round(progress)}%
            </span>

          </div>

        </div>

        {/* ENTER BUTTON */}

        <div className="mt-4">

          <button
            onClick={enterDashboard}
            disabled={!ready}
            className={`group rounded-full border px-7 py-2.5
            text-sm font-black tracking-wide transition-all
            duration-300 ${
              ready
                ? dark
                  ? "border-white/20 bg-white text-[#211827] shadow-xl shadow-white/10 hover:scale-105 hover:bg-yellow-100"
                  : "border-[#211827] bg-[#211827] text-white shadow-xl hover:scale-105 hover:bg-purple-700"
                : dark
                  ? "cursor-not-allowed border-white/5 bg-white/5 text-gray-600"
                  : "cursor-not-allowed border-black/5 bg-black/5 text-gray-400"
            }`}
          >
            {ready ? "Enter CIPHER" : "Preparing CIPHER"}

            <span
              className={`ml-2 ${
                ready
                  ? "transition-transform duration-300 group-hover:translate-x-1"
                  : ""
              }`}
            >
              →
            </span>

          </button>

        </div>

        {/* FOOTER */}

        <p
          className={`mt-3 text-[8px] font-bold uppercase
          tracking-[0.4em] ${
            dark
              ? "text-gray-700"
              : "text-gray-400"
          }`}
        >
          From transactions to intelligence
        </p>

      </div>
    </main>
  );
}
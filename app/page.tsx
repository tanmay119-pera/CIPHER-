"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 10000;
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;

        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }

        return next;
      });
    }, intervalTime);

    const redirectTimer = setTimeout(() => {
      router.push("/dashboard");
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const skipIntro = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden relative flex items-center justify-center">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="absolute top-20 left-20 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />

        <div className="absolute top-32 right-32 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />

        <div className="absolute bottom-32 left-40 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />

        <div className="absolute bottom-20 right-24 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />

      </div>

      {/* SKIP BUTTON */}
      <button
        onClick={skipIntro}
        className="absolute top-6 right-8 z-20 text-sm text-slate-500 hover:text-white transition"
      >
        Skip →
      </button>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6">

        {/* LOGO */}
        <div className="mb-8">

          <div className="inline-flex items-center justify-center">

            <div className="w-24 h-24 rounded-3xl border border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center shadow-2xl shadow-indigo-500/10 animate-pulse">

              <span className="text-4xl font-bold">
                C
              </span>

            </div>

          </div>

        </div>

        {/* BRAND */}
        <h1 className="text-6xl md:text-7xl font-bold tracking-[0.2em]">
          CIPHER
        </h1>

        <p className="text-indigo-400 text-sm md:text-base tracking-[0.25em] uppercase mt-4">
          AI Transaction Intelligence
        </p>

        <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm">
          Monitor e-commerce transactions, detect anomalies,
          and understand potential risk.
        </p>

        {/* DATA FLOW ANIMATION */}
        <div className="flex items-center justify-center gap-3 mt-10">

          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />

          <div className="w-12 md:w-20 h-px bg-gradient-to-r from-indigo-500 to-slate-700" />

          <div className="w-3 h-3 rounded-full bg-slate-500 animate-pulse" />

          <div className="w-12 md:w-20 h-px bg-gradient-to-r from-slate-700 to-indigo-500" />

          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />

        </div>

        {/* STATUS */}
        <div className="mt-10">

          <p className="text-sm text-slate-400">
            Initializing transaction monitoring
          </p>

          <p className="text-xs text-slate-600 mt-2">
            Preparing AI-powered risk analysis...
          </p>

        </div>

        {/* PROGRESS BAR */}
        <div className="w-72 md:w-96 mx-auto mt-6">

          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="flex justify-between mt-2 text-xs text-slate-600">

            <span>
              Loading
            </span>

            <span>
              {Math.round(progress)}%
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}
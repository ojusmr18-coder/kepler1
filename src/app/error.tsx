"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-2xl font-bold mb-6">
        ⚠️
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
        Something went wrong
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        An unexpected error occurred while rendering this page. You can reload or return to the main dashboard.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm text-sm"
        >
          <RotateCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors border border-slate-700 text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

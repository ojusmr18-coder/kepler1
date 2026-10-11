"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, CheckCircle2, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { LoggedMistake } from "@/types/api";

export default function ImprovePage() {
  const [mistakes, setMistakes] = React.useState<LoggedMistake[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchMistakes() {
      try {
        let currentStudentId: string | undefined;
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("current_student");
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed?.id) currentStudentId = String(parsed.id);
            } catch {}
          }
        }
        const response = await apiClient.mistakes.getMistakes(currentStudentId);
        if (isMounted && response?.mistakes) {
          setMistakes(response.mistakes);
        }
      } catch (err) {
        console.info("Using local mistakes state fallback:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchMistakes();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleReviewed = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reviewed: !currentStatus } : m))
    );

    try {
      let currentStudentId: string | undefined;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("current_student");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.id) currentStudentId = String(parsed.id);
          } catch {}
        }
      }
      await apiClient.mistakes.updateMistake(id, { reviewed: !currentStatus }, currentStudentId);
    } catch (err) {
      console.warn("Failed to update mistake review status:", err);
    }
  };

  const unreviewedCount = mistakes.filter((m) => !m.reviewed).length;

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-slate-800 flex flex-col items-center p-6 pl-20 sm:pl-24 antialiased">
      <div className="w-full max-w-4xl flex flex-col items-center text-center pt-8">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 text-amber-600 shadow-sm">
          <TrendingUp className="w-7 h-7" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Improvement Book
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 text-sm sm:text-base max-w-md mb-8">
          Personalized error tracking, incorrect questions analysis, and conceptual remediation from your test attempts.
        </p>

        {/* Status pill */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {unreviewedCount} Pending Review
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {mistakes.length - unreviewedCount} Reviewed
          </span>
        </div>

        {/* List of Mistakes or Clean Empty State */}
        {mistakes.length === 0 ? (
          <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700 mb-1">
              No mistakes recorded yet
            </span>
            <span className="text-xs text-slate-400 max-w-xs">
              Error log tracking will populate automatically after taking chapter quizzes and full-length tests.
            </span>
          </div>
        ) : (
          <div className="w-full space-y-4 text-left">
            {mistakes.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  m.reviewed
                    ? "bg-slate-50/80 border-slate-200 opacity-60"
                    : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {m.subject}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                      {m.errorCategory}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleReviewed(m.id, m.reviewed)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      m.reviewed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {m.reviewed ? "Reviewed" : "Mark as Reviewed"}
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-900 mb-3 leading-relaxed">
                  {m.questionSnippet}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                    <span className="font-semibold text-rose-700 block mb-0.5">Your Answer:</span>
                    <span className="text-rose-900 font-mono">{m.studentAnswer}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                    <span className="font-semibold text-emerald-700 block mb-0.5">Correct Answer:</span>
                    <span className="text-emerald-900 font-mono">{m.correctAnswer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

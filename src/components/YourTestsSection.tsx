"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type TestTabType = "upcoming" | "past" | "missed";

export interface YourTestsSectionProps {
  id?: string;
  onViewCalendar?: () => void;
}

export function YourTestsSection({
  id = "your-tests-home-section",
  onViewCalendar,
}: YourTestsSectionProps) {
  const [activeTab, setActiveTab] = React.useState<TestTabType>("upcoming");

  return (
    <section id={id} className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-10">
        
        {/* 1. Header Row: "Your tests" on Left, "View all" on Right (matching screenshot) */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Your tests
          </h2>

          <Link
            href="/calendar"
            onClick={onViewCalendar}
            className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors inline-flex items-center gap-1 group cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 2. Tabs: Upcoming, Past Tests, Missed Tests (matching screenshot) */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90"
            }`}
          >
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "past"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90"
            }`}
          >
            Past Tests
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("missed")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "missed"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90"
            }`}
          >
            Missed Tests
          </button>
        </div>

        {/* 3. Tab Content Stage */}
        {activeTab === "upcoming" && (
          <div className="py-10 sm:py-14 flex flex-col items-center justify-center text-center">
            {/* Custom SVG Illustration of Test Sheet with Pencil (matches user screenshot media_1791671774843.png) */}
            <div className="relative w-28 h-28 mb-5 flex items-center justify-center select-none">
              {/* Decorative Stars / Sparkles */}
              <svg className="absolute -top-1 -right-1 w-4 h-4 text-sky-500 fill-current animate-pulse" viewBox="0 0 24 24">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
              <svg className="absolute top-8 -left-3 w-3 h-3 text-amber-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>

              {/* Back tilted paper */}
              <div className="absolute w-16 h-20 bg-sky-400/80 rounded-xl rotate-[-8deg] shadow-sm transform -translate-x-2" />

              {/* Front main OMR / Test paper */}
              <div className="relative w-18 h-22 bg-white rounded-xl border border-sky-300 shadow-md flex flex-col p-2.5 z-10">
                {/* Header clip / bar */}
                <div className="w-full h-2 bg-sky-500 rounded-sm mb-2" />
                
                {/* OMR dots / answer rows */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                  <div className="flex items-center justify-between px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                </div>
              </div>

              {/* Tilted Pencil Writing on Paper */}
              <div className="absolute right-0 top-3 z-20 transform rotate-[-42deg]">
                <div className="w-4 h-12 bg-amber-400 rounded-sm border border-amber-600/40 relative shadow-md">
                  {/* Eraser */}
                  <div className="absolute -top-2 left-0 right-0 h-2 bg-rose-400 rounded-t-sm" />
                  {/* Metal band */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400" />
                  {/* Lead tip */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-amber-200">
                    <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-slate-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State Text (Exact copy from image) */}
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
              You have no upcoming tests
            </h3>
            <p className="text-sm sm:text-base text-slate-500 max-w-md">
              Tests will appear once admin schedules them
            </p>

            {/* Quick Link to Calendar */}
            <div className="mt-6">
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>Open Academic Calendar</span>
              </Link>
            </div>
          </div>
        )}

        {/* Past Tests Tab */}
        {activeTab === "past" && (
          <div className="py-8 space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Class 10 Science: Real Numbers &amp; Chemical Reactions Quiz
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Completed on Oct 8, 2026 &bull; Score: 24/25 (96%)
                  </p>
                </div>
              </div>
              <Link
                href="/test/result?id=sample_01"
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-2xs self-start sm:self-center"
              >
                Review Answers
              </Link>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Physics Mechanics: Kepler's Laws Assessment
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Completed on Oct 4, 2026 &bull; Score: 18/20 (90%)
                  </p>
                </div>
              </div>
              <Link
                href="/test/result?id=sample_02"
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-2xs self-start sm:self-center"
              >
                Review Answers
              </Link>
            </div>
          </div>
        )}

        {/* Missed Tests Tab */}
        {activeTab === "missed" && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              No Missed Tests
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
              Great attendance! You haven't missed any scheduled test deadlines.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

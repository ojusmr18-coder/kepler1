"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Video,
  User
} from "lucide-react";

// ----------------------------------------------------------------------------
// Calendar Graphic with Sparkles (Matching reference screenshot)
// ----------------------------------------------------------------------------
function ScheduleCalendarGraphic({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 w-12 h-12 select-none ${className}`}>
      {/* Sparkle Star (Top Left) */}
      <span className="absolute -top-1 -left-1 text-amber-400 text-xs font-bold select-none leading-none">
        ✦
      </span>

      {/* Main Calendar Body */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Soft Drop Shadow */}
        <rect
          x="4"
          y="7"
          width="30"
          height="27"
          rx="7"
          fill="#0F172A"
          fillOpacity="0.04"
        />

        {/* Calendar Outer Border & Sheet */}
        <rect
          x="4"
          y="6"
          width="30"
          height="27"
          rx="7"
          fill="#FFFFFF"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />

        {/* Top Header Strip */}
        <path
          d="M 4 13 C 4 9.686 6.686 7 10 7 L 28 7 C 31.314 7 34 9.686 34 13 L 34 14 L 4 14 Z"
          fill="#186470"
        />

        {/* Twin Hanging Binders / Rings */}
        <rect x="10" y="3.5" width="2" height="5" rx="1" fill="#475569" />
        <rect x="26" y="3.5" width="2" height="5" rx="1" fill="#475569" />

        {/* Inner Grid Dots */}
        <circle cx="11" cy="20" r="1.3" fill="#94A3B8" />
        <circle cx="19" cy="20" r="1.3" fill="#94A3B8" />
        <circle cx="27" cy="20" r="1.3" fill="#94A3B8" />

        <circle cx="11" cy="26" r="1.3" fill="#94A3B8" />
        <circle cx="19" cy="26" r="1.3" fill="#94A3B8" />
        <circle cx="27" cy="26" r="1.3" fill="#94A3B8" />
      </svg>

      {/* Sparkle Star (Bottom Right) */}
      <span className="absolute -bottom-1 -right-1 text-teal-600 text-xs font-bold select-none leading-none">
        ✦
      </span>
    </div>
  );
}

export interface ScheduledClassItem {
  id: string;
  title: string;
  subject: string;
  timeRange: string;
  instructor: string;
  status?: "live_soon" | "upcoming" | "completed";
  roomOrPlatform?: string;
}

export interface ScheduleSectionProps {
  id?: string;
  scheduledClasses?: ScheduledClassItem[];
  className?: string;
}

export function ScheduleSection({
  id = "schedule-home-section",
  scheduledClasses = [],
  className = "",
}: ScheduleSectionProps) {
  const hasClasses = scheduledClasses.length > 0;

  return (
    <section id={id} className={`w-full max-w-6xl mx-auto px-4 sm:px-6 select-none ${className}`}>
      {/* 1. Header Row: "Schedule" on Left, Calendar Icon on Right */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Schedule
        </h2>

        <Link
          href="/calendar"
          title="Open Academic Calendar"
          aria-label="Open Academic Calendar"
          className="w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 hover:text-slate-950 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <CalendarIcon className="w-4 h-4 text-slate-600" />
        </Link>
      </div>

      {/* 2. SCHEDULE CONTENT CONTAINER */}
      {!hasClasses ? (
        /* “You’re All Set!” Empty State (Matching reference design) */
        <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between gap-4 transition-all hover:border-slate-300">
          {/* Left: Calendar Graphic & Text Block */}
          <div className="flex items-center gap-4 min-w-0">
            <ScheduleCalendarGraphic />

            <div className="flex flex-col items-start min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                You&apos;re All Set!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate sm:whitespace-normal">
                No more classes scheduled. Check your calendar for what&apos;s next!
              </p>
            </div>
          </div>

          {/* Right: Round Chevron Action Button */}
          <Link
            href="/calendar"
            aria-label="View scheduled calendar"
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      ) : (
        /* Rendered Classes (When classes are scheduled) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduledClasses.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 px-2 py-0.5 bg-slate-100 rounded-md">
                    {item.subject}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timeRange}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <User className="w-3 h-3" /> {item.instructor}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{item.roomOrPlatform || "Virtual Lab"}</span>
                <Link
                  href="/calendar"
                  className="text-xs font-bold text-slate-800 hover:text-slate-950 inline-flex items-center gap-1"
                >
                  Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

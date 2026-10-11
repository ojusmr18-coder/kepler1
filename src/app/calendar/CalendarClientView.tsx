"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  FileText,
  Lock,
  PlayCircle,
  Timer,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { CalendarEvent } from "@/types/api";

type ScheduledEvent = CalendarEvent;

const SCHEDULED_EVENTS: ScheduledEvent[] = [
  {
    id: "evt-1",
    day: 8,
    dateStr: "Oct 8, 2026",
    title: "Science: Chemical Reactions & Equations Diagnostic",
    subject: "Science",
    durationMinutes: 30,
    questionsCount: 25,
    type: "quiz",
    timeStr: "10:00 AM",
    status: "completed",
    scheduledAt: "2026-10-08T10:00:00",
    quizTopicId: "chem-reactions",
  },
  {
    id: "evt-2",
    day: 12,
    dateStr: "Oct 12, 2026",
    title: "Kepler's 3 Laws & Gravitation Practice Test",
    subject: "Physics",
    durationMinutes: 45,
    questionsCount: 20,
    type: "quiz",
    timeStr: "11:30 AM",
    status: "scheduled",
    scheduledAt: "2026-10-12T11:30:00",
    quizTopicId: "kepler-laws",
  },
  {
    id: "evt-3",
    day: 15,
    dateStr: "Oct 15, 2026",
    title: "Light: Reflection & Refraction Chapter Exam",
    subject: "Physics",
    durationMinutes: 60,
    questionsCount: 30,
    type: "mock",
    timeStr: "02:00 PM",
    status: "scheduled",
    scheduledAt: "2026-10-15T14:00:00",
    quizTopicId: "light-reflection",
  },
  {
    id: "evt-4",
    day: 19,
    dateStr: "Oct 19, 2026",
    title: "Real Numbers & Polynomials Unit Test",
    subject: "Mathematics",
    durationMinutes: 60,
    questionsCount: 35,
    type: "mock",
    timeStr: "09:30 AM",
    status: "scheduled",
    scheduledAt: "2026-10-19T09:30:00",
    quizTopicId: "real-numbers",
  },
  {
    id: "evt-5",
    day: 22,
    dateStr: "Oct 22, 2026",
    title: "CBSE Class 10 Midterm Full Mock Test - Paper 1",
    subject: "Science & Math",
    durationMinutes: 180,
    questionsCount: 75,
    type: "mock",
    timeStr: "09:00 AM",
    status: "scheduled",
    scheduledAt: "2026-10-22T09:00:00",
    quizTopicId: "kepler-laws",
  },
  {
    id: "evt-6",
    day: 24,
    dateStr: "Oct 24, 2026",
    title: "Acids, Bases & Salts Mid-Chapter Evaluation",
    subject: "Chemistry",
    durationMinutes: 40,
    questionsCount: 20,
    type: "quiz",
    timeStr: "03:30 PM",
    status: "scheduled",
    scheduledAt: "2026-10-24T15:30:00",
    quizTopicId: "acids-bases",
  },
  {
    id: "evt-7",
    day: 29,
    dateStr: "Oct 29, 2026",
    title: "Class 10 CBSE Full Syllabus Pre-Board Mock #1",
    subject: "Combined Science",
    durationMinutes: 120,
    questionsCount: 60,
    type: "mock",
    timeStr: "10:00 AM",
    status: "scheduled",
    scheduledAt: "2026-10-29T10:00:00",
    quizTopicId: "kepler-laws",
  },
];

/**
 * Resolves the scheduled timestamp for an event.
 * Uses ISO 8601 `scheduledAt` when provided by the backend API,
 * with graceful fallback parsing from `dateStr` and `timeStr`.
 */
function parseTargetTime(evt: ScheduledEvent): number {
  if (evt.scheduledAt) {
    const parsed = new Date(evt.scheduledAt).getTime();
    if (!isNaN(parsed)) return parsed;
  }
  const timeMatch = evt.timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hours = 10;
  let mins = 0;
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    mins = parseInt(timeMatch[2], 10);
    const meridiem = timeMatch[3].toUpperCase();
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  }
  return new Date(2026, 9, evt.day, hours, mins, 0).getTime();
}

/**
 * Formats remaining time into the exact requested countdown format:
 * Example: `4 days 11 hours 12 min 34 sec`
 */
function formatCountdown(targetTimestamp: number, currentTimestamp: number): {
  formatted: string;
  isZero: boolean;
  diffMs: number;
} {
  const diffMs = targetTimestamp - currentTimestamp;
  if (diffMs <= 0) {
    return { formatted: "0 sec", isZero: true, diffMs: 0 };
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  }
  parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  parts.push(`${minutes} min`);
  parts.push(`${seconds} sec`);

  return {
    formatted: parts.join(" "),
    isZero: false,
    diffMs,
  };
}

export function CalendarClientView() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = React.useState<number>(12);
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  const [events, setEvents] = React.useState<ScheduledEvent[]>(SCHEDULED_EVENTS);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Live countdown state
  const [now, setNow] = React.useState<number>(Date.now());
  const [simulatedOverrides, setSimulatedOverrides] = React.useState<Record<string, number>>({});
  const [unlockedEvents, setUnlockedEvents] = React.useState<Record<string, boolean>>({});
  const [justUnlockedId, setJustUnlockedId] = React.useState<string | null>(null);

  // Auto-scroll ref mapping for Launch Test Session buttons
  const launchButtonRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});

  // 1. Fetch events from backend API
  React.useEffect(() => {
    let isMounted = true;
    async function fetchCalendar() {
      try {
        const response = await apiClient.dashboard.getCalendarEvents();
        if (isMounted && response?.events && response.events.length > 0) {
          setEvents(response.events);
        }
      } catch (err) {
        console.info("Using local calendar events fallback:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchCalendar();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Real-time ticker ticking every 1000ms
  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Monitor countdowns & automatically activate/jump to Launch Test Session button when time reaches zero
  React.useEffect(() => {
    events.forEach((evt) => {
      if (evt.status === "completed") return;
      const targetTime = simulatedOverrides[evt.id] ?? parseTargetTime(evt);
      const diff = targetTime - now;

      // When countdown reaches 0 and has not yet been unlocked
      if (diff <= 0 && !unlockedEvents[evt.id]) {
        setUnlockedEvents((prev) => ({ ...prev, [evt.id]: true }));
        setJustUnlockedId(evt.id);

        // Smooth jump/scroll to the Launch Test Session button
        setTimeout(() => {
          const btn = launchButtonRefs.current[evt.id];
          if (btn) {
            btn.scrollIntoView({ behavior: "smooth", block: "center" });
            btn.focus();
          }
        }, 150);
      }
    });
  }, [now, events, simulatedOverrides, unlockedEvents]);

  // Clear bounce/pulse effect after 4 seconds
  React.useEffect(() => {
    if (justUnlockedId) {
      const timer = setTimeout(() => {
        setJustUnlockedId(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [justUnlockedId]);

  // Simulation handler for easy testing of countdown hitting 0
  const handleSimulateCountdown = (evtId: string, seconds: number = 10) => {
    const simulatedTarget = Date.now() + seconds * 1000;
    setSimulatedOverrides((prev) => ({ ...prev, [evtId]: simulatedTarget }));
    setUnlockedEvents((prev) => ({ ...prev, [evtId]: false }));
  };

  // October 2026 starts on Thursday (index 4: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu)
  const startDayOffset = 4;
  const daysInMonth = 31;

  // Filter events
  const filteredEvents = React.useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) =>
      e.subject.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [events, activeFilter]);

  const selectedDayEvents = React.useMemo(() => {
    return filteredEvents.filter((e) => e.day === selectedDay);
  }, [filteredEvents, selectedDay]);

  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-800 flex flex-col p-4 sm:p-6 lg:p-8 pl-16 sm:pl-20 lg:pl-24 antialiased select-none">
      {/* 1. Top Navigation & Breadcrumbs */}
      <div className="w-full max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link
            href="/dashboard"
            className="hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            Dashboard
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="font-semibold text-slate-900">Academic Calendar</span>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* 2. Page Header */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <CalendarIcon className="w-7 h-7 text-slate-800" />
              <span>Tests &amp; Academic Calendar</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Class 10 CBSE scheduled evaluations, chapter diagnostics, and mock test milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/test"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95"
            >
              <span>Test Center</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/test/custom"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Custom Test</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main Stage: 2-Column Calendar Grid + Selected Day Agenda */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        {/* LEFT / CENTER: Full Calendar Grid Card */}
        <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          {/* Calendar Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                October 2026
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Term 1
              </span>
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["all", "Physics", "Chemistry", "Mathematics"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeFilter.toLowerCase() === f.toLowerCase()
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {f === "all" ? "All Subjects" : f}
                </button>
              ))}
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset days */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div
                key={`offset-${idx}`}
                className="h-20 sm:h-24 rounded-2xl bg-slate-50/50 border border-transparent"
              />
            ))}

            {/* Days 1 to 31 */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const hasEvents = filteredEvents.filter((e) => e.day === day);
              const isSelected = selectedDay === day;
              const isToday = day === 11;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : isToday
                      ? "bg-sky-50/60 border-sky-300 text-slate-900"
                      : hasEvents.length > 0
                      ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                      : "bg-white hover:bg-slate-50/50 border-slate-100 text-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? "text-white"
                          : isToday
                          ? "text-sky-700 font-extrabold"
                          : "text-slate-700"
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && !isSelected && (
                      <span className="text-[9px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded-full">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Scheduled Test Badges in Day Cell */}
                  <div className="space-y-1">
                    {hasEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : evt.status === "completed"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}
                        title={evt.title}
                      >
                        {evt.subject}
                      </div>
                    ))}
                    {hasEvents.length === 0 && (
                      <div className="hidden group-hover:block text-[9px] text-slate-400 font-medium truncate">
                        Self-Paced Test
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Selected Day Agenda & Action Panel */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Day Agenda Details Card */}
          <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Day Schedule
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  October {selectedDay}, 2026
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {selectedDayEvents.length > 0
                  ? `${selectedDayEvents.length} ${
                      selectedDayEvents.length === 1 ? "Event" : "Events"
                    }`
                  : "Open Day"}
              </span>
            </div>

            {/* Requirement: Users should be able to attend a test on ANY day */}
            {selectedDayEvents.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
                    Diagnostic Assessment
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open Anytime
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    Daily Class 10 Practice Assessment
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    No fixed board milestone on October {selectedDay}. You can attend an on-demand CBSE evaluation right now.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <span>30 mins &bull; 20 questions</span>
                  <span className="text-slate-600 font-medium">Core Science &amp; Math</span>
                </div>

                <div className="pt-1 space-y-2">
                  <Link
                    href={`/test?topic=kepler-laws&date=Oct+${selectedDay}+2026`}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center block transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Launch Test Session</span>
                  </Link>

                  <Link
                    href="/test/custom"
                    className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center block border border-slate-200 transition-all active:scale-95"
                  >
                    Configure Custom Test
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map((evt) => {
                  const targetTime =
                    simulatedOverrides[evt.id] ?? parseTargetTime(evt);
                  const countdown = formatCountdown(targetTime, now);
                  const isTimeUp = countdown.isZero;
                  const isUnlocked =
                    evt.status === "open" ||
                    isTimeUp ||
                    Boolean(unlockedEvents[evt.id]);
                  const isJustUnlocked = justUnlockedId === evt.id;

                  return (
                    <div
                      key={evt.id}
                      className={`p-4 rounded-2xl bg-slate-50 border transition-all space-y-3 ${
                        isJustUnlocked
                          ? "border-emerald-500 ring-2 ring-emerald-400/40 bg-emerald-50/20"
                          : "border-slate-200/80"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
                          {evt.subject}
                        </span>
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {evt.timeStr}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {evt.title}
                      </h4>

                      {/* Event Stats */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>
                          {evt.durationMinutes} mins &bull; {evt.questionsCount} questions
                        </span>
                        {evt.status === "completed" ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Now
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <Timer className="w-3 h-3 text-amber-600" />
                            Upcoming
                          </span>
                        )}
                      </div>

                      {/* Countdown Timer Block for upcoming tests */}
                      {evt.status !== "completed" && !isUnlocked && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <Clock className="w-3 h-3 text-slate-500" />
                              Test Window Opens In:
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded border border-slate-200/60">
                              {evt.timeStr}
                            </span>
                          </div>
                          {/* Exact format: 4 days 11 hours 12 min 34 sec */}
                          <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 tracking-tight flex items-center gap-1.5 pt-0.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span>{countdown.formatted}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {evt.status === "completed" ? (
                        <Link
                          href={`/test/result?testId=${encodeURIComponent(evt.id)}`}
                          className="w-full mt-2 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold text-center block transition-all shadow-2xs"
                        >
                          Review Test Result
                        </Link>
                      ) : (
                        <div className="pt-1 space-y-2">
                          {isUnlocked ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Test Window Open • Ready to begin!</span>
                              </div>
                              <Link
                                ref={(el) => {
                                  launchButtonRefs.current[evt.id] = el;
                                }}
                                href={`/test?topic=${encodeURIComponent(
                                  evt.quizTopicId || "kepler-laws"
                                )}`}
                                className={`w-full py-2.5 rounded-xl font-bold text-xs text-center block transition-all shadow-md active:scale-95 ${
                                  isJustUnlocked
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-300 ring-offset-2 animate-pulse"
                                    : "bg-slate-900 hover:bg-slate-800 text-white"
                                }`}
                              >
                                Launch Test Session
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {/* Disabled while countdown > 0 */}
                              <button
                                type="button"
                                disabled
                                className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold text-center flex items-center justify-center gap-2 cursor-not-allowed shadow-2xs"
                                title={`Opens in ${countdown.formatted}`}
                              >
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Launch Test Session (Locked)</span>
                              </button>

                              {/* Self-paced option ensuring users can attend a test on any day */}
                              <div className="flex items-center justify-between pt-1">
                                <Link
                                  href={`/test?topic=${encodeURIComponent(
                                    evt.quizTopicId || "kepler-laws"
                                  )}`}
                                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                                >
                                  <PlayCircle className="w-3 h-3 text-slate-500" />
                                  <span>Practice Test Now (Self-Paced)</span>
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleSimulateCountdown(evt.id, 10)}
                                  className="text-[10px] font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100/80 px-2 py-0.5 rounded-md border border-sky-200 transition-colors"
                                  title="Simulate 10-second countdown to witness automatic unlock"
                                >
                                  ⚡ Test 10s Timer
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Upcoming Scheduled Milestones */}
          <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>Next Upcoming Milestones</span>
            </h3>

            <div className="space-y-3">
              {events
                .filter((e) => e.status === "scheduled")
                .slice(0, 4)
                .map((item) => {
                  const target =
                    simulatedOverrides[item.id] ?? parseTargetTime(item);
                  const cd = formatCountdown(target, now);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDay(item.day)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                        selectedDay === item.day
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-slate-50/80 hover:bg-slate-100 border-slate-200/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span
                          className={`font-bold ${
                            selectedDay === item.day
                              ? "text-slate-200"
                              : "text-slate-700"
                          }`}
                        >
                          {item.dateStr}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-medium ${
                            selectedDay === item.day
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >
                          {cd.isZero ? "Live Now" : cd.formatted.split(" ")[0] + " " + cd.formatted.split(" ")[1] + " left"}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-bold truncate ${
                          selectedDay === item.day
                            ? "text-white"
                            : "text-slate-800 group-hover:text-slate-950"
                        }`}
                      >
                        {item.title}
                      </h4>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

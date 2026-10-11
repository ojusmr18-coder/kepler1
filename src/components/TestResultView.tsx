"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  RotateCcw,
  MoreHorizontal,
  FileText
} from "lucide-react";
import type { TestResultData, SubjectBreakdown } from "@/types/api";
import {
  EasyLightningIcon,
  ModerateLightningIcon,
  HardLightningIcon,
} from "@/components/ui/LightningIcons";

// ----------------------------------------------------------------------------
// Helper: Dynamically construct TestResultData from URL search parameters
// ----------------------------------------------------------------------------
export function buildResultFromParams(params: { get: (key: string) => string | null }): TestResultData | null {
  const scoreParam = params.get("score");
  const totalParam = params.get("total");
  if (scoreParam === null || totalParam === null) {
    return null;
  }

  const totalScore = parseInt(scoreParam, 10) || 0;
  const maxTotalMarks = parseInt(totalParam, 10) || 1;
  const correctParam = params.get("correct");
  const incorrectParam = params.get("incorrect");
  const unattemptedParam = params.get("unattempted");
  const topicParam = params.get("topic") || "";
  const titleParam = params.get("title") || "";
  const subjectParam = params.get("subject") || "Physics";
  const attemptParam = params.get("attempt") || "first";

  const totalCorrect = correctParam !== null ? parseInt(correctParam, 10) : totalScore;
  const totalIncorrect =
    incorrectParam !== null
      ? parseInt(incorrectParam, 10)
      : Math.max(0, maxTotalMarks - totalCorrect);
  const totalUnattempted =
    unattemptedParam !== null ? parseInt(unattemptedParam, 10) : 0;
  const accuracyPercentage =
    maxTotalMarks > 0 ? Math.round((totalCorrect / maxTotalMarks) * 100) : 0;

  const subjectBreakdown: SubjectBreakdown = {
    id: subjectParam.toLowerCase(),
    name: subjectParam,
    partLabel: `Part-1 : ${subjectParam}`,
    maxMarks: maxTotalMarks,
    score: totalScore,
    correctCount: totalCorrect,
    incorrectCount: totalIncorrect,
    unattemptedCount: totalUnattempted,
    positiveMarks: totalScore,
    negativeMarks: 0,
  };

  return {
    testId: topicParam || "quiz_attempt",
    testTitle: titleParam || `${subjectParam} Chapter Assessment`,
    dateAttempted: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    attemptType: attemptParam === "reattempt" ? "reattempt" : "first",
    roundLabel: "Main Test (R1)",
    totalScore,
    maxTotalMarks,
    accuracyPercentage,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    totalPositiveMarks: totalScore,
    totalNegativeMarks: 0,
    subjects: [subjectBreakdown],
  };
}

// ----------------------------------------------------------------------------
// Default reference data matching the images
// ----------------------------------------------------------------------------
export const DEFAULT_TEST_RESULT: TestResultData = {
  testId: "jee_mains_02_april_shift1",
  testTitle: "JEE MAINS 02 April Shift 1",
  dateAttempted: "1st Jan, 2026",
  attemptType: "reattempt",
  roundLabel: "Main Test (R1)",
  totalScore: 171,
  maxTotalMarks: 300,
  accuracyPercentage: 63,
  totalCorrect: 47,
  totalIncorrect: 17,
  totalUnattempted: 11,
  totalPositiveMarks: 188,
  totalNegativeMarks: 17,
  subjects: [
    {
      id: "physics",
      name: "Physics",
      partLabel: "Part-1 : physics",
      maxMarks: 100,
      score: 77,
      correctCount: 20,
      incorrectCount: 3,
      unattemptedCount: 2,
      positiveMarks: 80,
      negativeMarks: 3,
    },
    {
      id: "chemistry",
      name: "Chemistry",
      partLabel: "Part-2 : chemistry",
      maxMarks: 100,
      score: 67,
      correctCount: 18,
      incorrectCount: 5,
      unattemptedCount: 2,
      positiveMarks: 72,
      negativeMarks: 5,
    },
    {
      id: "mathematics",
      name: "Mathematics",
      partLabel: "Part-3 : mathematics",
      maxMarks: 100,
      score: 27,
      correctCount: 9,
      incorrectCount: 9,
      unattemptedCount: 7,
      positiveMarks: 36,
      negativeMarks: 9,
    },
  ],
};

// ----------------------------------------------------------------------------
// Zen Brush Score Circle Component (Hand-drawn ring matching reference images)
// ----------------------------------------------------------------------------
function ZenScoreCircle({
  score,
  maxMarks,
  className = "",
}: {
  score: number;
  maxMarks: number;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 ${className}`}
      aria-label={`Score: ${score} out of ${maxMarks}`}
    >
      {/* Hand-drawn style brush stroke ring */}
      <svg
        viewBox="0 0 160 160"
        className="absolute inset-0 w-full h-full -rotate-45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="80"
          cy="80"
          r="68"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="370 40"
          strokeDashoffset="15"
          opacity="0.95"
        />
        <circle
          cx="80"
          cy="80"
          r="61"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="290 80"
          strokeDashoffset="60"
          opacity="0.45"
        />
      </svg>

      {/* Numerical score display */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white select-none">
        <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
          {score}
        </span>
        <div className="w-14 sm:w-16 h-0.5 bg-white/90 my-1 rounded-full" />
        <span className="text-xl sm:text-2xl font-bold tracking-tight leading-none opacity-95">
          {maxMarks}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Main Test Result View Component
// ----------------------------------------------------------------------------
export interface TestResultViewProps {
  data?: TestResultData;
  onViewSolution?: (subjectId?: string) => void;
  className?: string;
}

export function TestResultView({
  data: propData,
  onViewSolution,
  className = "",
}: TestResultViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const taskId = searchParams?.get("taskId") || "";
  const difficultyParam = searchParams?.get("difficulty") || "1";
  const pointsParam = searchParams?.get("points") || "4";
  const sourceParam = searchParams?.get("source") || "";

  const difficulty = parseInt(difficultyParam, 10) || 1;
  const flashTier: "bronze" | "silver" | "gold" =
    difficulty === 3 ? "gold" : difficulty === 2 ? "silver" : "bronze";
  const flashTitle =
    flashTier === "gold"
      ? "Gold Flash"
      : flashTier === "silver"
      ? "Silver Flash"
      : "Bronze Flash";

  // Resolve test data dynamically:
  // 1. propData if passed and not default
  // 2. URL search parameters (?score=2&total=5...)
  // 3. Fallback to DEFAULT_TEST_RESULT initially, then load from localStorage after mount
  const [data, setData] = React.useState<TestResultData>(() => {
    if (propData && propData !== DEFAULT_TEST_RESULT) {
      return propData;
    }
    if (searchParams) {
      const fromParams = buildResultFromParams(searchParams);
      if (fromParams) return fromParams;
    }
    return propData || DEFAULT_TEST_RESULT;
  });

  // Client-side hydration: load real test result from localStorage if not in URL params
  React.useEffect(() => {
    if (searchParams) {
      const fromParams = buildResultFromParams(searchParams);
      if (fromParams) {
        setData(fromParams);
        return;
      }
    }

    if (typeof window !== "undefined") {
      try {
        const stored =
          localStorage.getItem("kepler_latest_test_result") ||
          sessionStorage.getItem("kepler_latest_test_result");
        if (stored) {
          const parsed = JSON.parse(stored) as TestResultData;
          if (
            parsed &&
            typeof parsed.totalScore === "number" &&
            typeof parsed.maxTotalMarks === "number"
          ) {
            setData(parsed);
          }
        }
      } catch (err) {
        console.error("Error loading test result from storage:", err);
      }
    }
  }, [searchParams]);

  // Active view: 'overview' | subjectId (e.g. 'physics', 'chemistry', 'mathematics')
  const [activeTab, setActiveTab] = React.useState<string>("overview");

  // Accordion state for Subjects list in sidebar
  const [isSubjectsOpen, setIsSubjectsOpen] = React.useState<boolean>(true);

  // Ensure activeTab is reset if subjects list changes
  React.useEffect(() => {
    if (activeTab !== "overview" && !data.subjects.some((s) => s.id === activeTab)) {
      setActiveTab("overview");
    }
  }, [data, activeTab]);

  // Current active subject if not in overview
  const activeSubject = React.useMemo(() => {
    if (activeTab === "overview") return null;
    return data.subjects.find((s) => s.id === activeTab) || data.subjects[0];
  }, [activeTab, data.subjects]);

  // Navigate to next/prev subject in carousel
  const handleNextSubject = () => {
    if (activeTab === "overview") {
      setActiveTab(data.subjects[0]?.id || "overview");
      return;
    }
    const currentIndex = data.subjects.findIndex((s) => s.id === activeTab);
    if (currentIndex < data.subjects.length - 1) {
      setActiveTab(data.subjects[currentIndex + 1].id);
    } else {
      setActiveTab("overview");
    }
  };

  const handlePrevSubject = () => {
    if (activeTab === "overview") {
      setActiveTab(data.subjects[data.subjects.length - 1]?.id || "overview");
      return;
    }
    const currentIndex = data.subjects.findIndex((s) => s.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(data.subjects[currentIndex - 1].id);
    } else {
      setActiveTab("overview");
    }
  };

  // Accuracy calculation for active view
  const accuracyText = React.useMemo(() => {
    if (activeSubject) {
      const totalQuestions =
        activeSubject.correctCount +
        activeSubject.incorrectCount +
        activeSubject.unattemptedCount;
      const pct =
        totalQuestions > 0
          ? Math.round((activeSubject.correctCount / totalQuestions) * 100)
          : 0;
      return `You've answered ${pct}% questions correctly`;
    }
    return `You've answered ${data.accuracyPercentage}% questions correctly`;
  }, [activeSubject, data.accuracyPercentage]);

  // Helper to format marks cleanly without artificial decimal places
  const formatMarksValue = (val: number, isPositive: boolean) => {
    if (val === 0) return "0 marks";
    const str = Number.isInteger(val) ? val.toString() : val.toFixed(1);
    return `${isPositive ? "+" : "-"}${str} marks`;
  };

  // Active card metrics
  const activeMetrics = React.useMemo(() => {
    if (activeSubject) {
      return {
        correct: activeSubject.correctCount,
        positiveMarks: formatMarksValue(activeSubject.positiveMarks, true),
        incorrect: activeSubject.incorrectCount,
        negativeMarks: formatMarksValue(activeSubject.negativeMarks, false),
        unattempted: activeSubject.unattemptedCount,
      };
    }
    return {
      correct: data.totalCorrect,
      positiveMarks: formatMarksValue(data.totalPositiveMarks, true),
      incorrect: data.totalIncorrect,
      negativeMarks: formatMarksValue(data.totalNegativeMarks, false),
      unattempted: data.totalUnattempted,
    };
  }, [activeSubject, data]);

  return (
    <div className={`min-h-screen w-full bg-[#F5F8FA] text-slate-800 flex flex-col antialiased ${className}`}>
      {/* ===================================================================== */}
      {/* TOP NAVIGATION BAR                                                    */}
      {/* ===================================================================== */}
      <header className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
        {/* Left: Back Arrow, Test Title, & Round Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
              Result: {data.testTitle}
            </span>
            <span className="text-slate-400 font-normal hidden sm:inline">|</span>
            <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline truncate">
              {data.dateAttempted}
            </span>

            {/* Test Attempt Round Pill */}
            {data.roundLabel && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 ml-1">
                <span>{data.roundLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="More options"
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onViewSolution) {
                onViewSolution(activeSubject?.id);
              } else {
                router.push(`/test?topic=${encodeURIComponent(data.testId)}&review=true`);
              }
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View test solution</span>
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN CONTAINER: 2-COLUMN LAYOUT                                       */}
      {/* Left: Overview & Subjects Sidebar | Right: Report Content             */}
      {/* ===================================================================== */}
      <div className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* =================================================================== */}
        {/* LEFT SIDEBAR: OVERVIEW & SUBJECTS                                   */}
        {/* =================================================================== */}
        <aside
          aria-label="Result navigation"
          className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex flex-col gap-1.5"
        >
          {/* 1. Overview Button */}
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            aria-selected={activeTab === "overview"}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm text-left transition-all cursor-pointer select-none ${
              activeTab === "overview"
                ? "bg-slate-50 text-slate-900 border-l-4 border-emerald-500 pl-3 shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold"
            }`}
          >
            <span>Overview</span>
            {activeTab === "overview" && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            )}
          </button>

          {/* 2. Subjects Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsSubjectsOpen((prev) => !prev)}
              aria-expanded={isSubjectsOpen}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              <span>Subjects</span>
              {isSubjectsOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isSubjectsOpen && (
              <div className="mt-1 space-y-1 pl-2">
                {data.subjects.map((sub) => {
                  const isSelected = activeTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTab(sub.id)}
                      aria-selected={isSelected}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all cursor-pointer select-none ${
                        isSelected
                          ? "bg-slate-50 text-slate-900 border-l-4 border-emerald-500 pl-2.5 shadow-2xs font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{sub.partLabel}</span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ml-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* =================================================================== */}
        {/* RIGHT MAIN AREA: TEST REPORT                                        */}
        {/* =================================================================== */}
        <main className="flex-1 w-full flex flex-col gap-6 min-w-0">
          {/* ================================================================= */}
          {/* SCORE BOOSTER TASK COMPLETION STATUS & FLASH MILESTONE            */}
          {/* ================================================================= */}
          {(taskId || sourceParam === "score-booster") && (
            data.accuracyPercentage > 66 ? (
              <div className="w-full rounded-3xl bg-white border-2 border-emerald-300/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                    {flashTier === "gold" ? (
                      <HardLightningIcon size={42} />
                    ) : flashTier === "silver" ? (
                      <ModerateLightningIcon size={42} />
                    ) : (
                      <EasyLightningIcon size={42} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                        Task Completed
                      </span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{flashTitle} Earned</span>
                        <span>⚡</span>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      Scored {data.accuracyPercentage}% &bull; Passed (&gt; 66% required)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      +{pointsParam} Marks added to your goal! Your task status is updated to <strong className="text-emerald-700 font-bold">Done</strong> in Score Booster.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>Return to Dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-3xl bg-rose-50/80 border-2 border-rose-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                    <X className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                        Task Incomplete
                      </span>
                      <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                        <span>{flashTitle} Locked</span>
                        <span>🔒</span>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      Scored {data.accuracyPercentage}% &bull; &gt; 66% Required to Complete
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      To complete this Score Booster task and unlock your {flashTitle}, you must score more than 66%. Retake the quiz to complete it!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <Link
                    href={`/test?topic=${data.testId || "kepler-laws"}&taskId=${taskId}&difficulty=${difficulty}&points=${pointsParam}&source=score-booster`}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz Now</span>
                  </Link>
                </div>
              </div>
            )
          )}
          {/* ================================================================= */}
          {/* 1. HERO SCORE BANNER (Using our signature dark teal/slate palette) */}
          {/* ================================================================= */}
          <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#186470] via-[#13535D] to-[#0E3E46] p-6 sm:p-8 text-white shadow-xl shadow-teal-950/10 overflow-hidden select-none">
            {/* Ambient Background Accents */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl" />
            </div>

            {/* Top Row: Reattempt Pill & Subject Report Title */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                {activeSubject ? (
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight capitalize text-white">
                    {activeSubject.partLabel} Report
                  </h2>
                ) : (
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    Overall Test Report
                  </h2>
                )}
              </div>

              {/* Status Badges & Quick Action */}
              <div className="flex items-center gap-2">
                {data.attemptType === "reattempt" && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold backdrop-blur-xs">
                    <RotateCcw className="w-3 h-3" />
                    <span>This is a reattempt</span>
                  </div>
                )}

                {activeSubject && (
                  <button
                    type="button"
                    onClick={() => onViewSolution?.(activeSubject.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
                  >
                    <span>View {activeSubject.name.toLowerCase()} solution</span>
                  </button>
                )}
              </div>
            </div>

            {/* Center Area: Zen Brush Score Circle */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-around gap-6 my-2 sm:my-4">
              {/* Zen Brush Circle */}
              <ZenScoreCircle
                score={activeSubject ? activeSubject.score : data.totalScore}
                maxMarks={activeSubject ? activeSubject.maxMarks : data.maxTotalMarks}
              />

              {/* Overview Mode: Predictive Rank & Growth Mindset Guidance Box */}
              {!activeSubject && (
                <div className="w-full sm:max-w-xs rounded-2xl border border-white/25 bg-black/15 backdrop-blur-xs p-4 sm:p-5 text-white/95 text-center sm:text-left shadow-2xs">
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight text-teal-200 mb-1">
                    Predictive Rank Unavailable
                  </h3>
                  <p className="text-xs leading-relaxed text-white/80 font-normal">
                    Don&apos;t worry about ranks &mdash; focus on understanding what went wrong and mastering it next time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. MARKS SUMMARY SECTION                                          */}
          {/* ================================================================= */}
          <div className="w-full flex flex-col gap-3">
            {/* Header & Carousel Arrow Controls */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  Marks Summary
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {accuracyText}
                </p>
              </div>

              {/* Carousel navigation arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSubject}
                  aria-label="Previous section"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSubject}
                  aria-label="Next section"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Summary Cards: Correct, Incorrect, Unattempted */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
              {/* Correct */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-2xs border-b-2 border-b-emerald-500 transition-all hover:shadow-xs">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 block mb-1">
                  Correct
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                  {activeMetrics.correct}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 mt-1 block">
                  ({activeMetrics.positiveMarks})
                </span>
              </div>

              {/* Incorrect */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-2xs border-b-2 border-b-rose-400 transition-all hover:shadow-xs">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 block mb-1">
                  Incorrect
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                  {activeMetrics.incorrect}
                </span>
                <span className="text-xs sm:text-sm font-bold text-rose-500 mt-1 block">
                  ({activeMetrics.negativeMarks})
                </span>
              </div>

              {/* Unattempted */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-2xs border-b-2 border-b-slate-300 transition-all hover:shadow-xs">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 block mb-1">
                  Unattempted
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                  {activeMetrics.unattempted}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium mt-1 block">
                  (0 marks)
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3. SUBJECT-WISE BREAKDOWN TABLE (Overview Mode)                   */}
          {/* ================================================================= */}
          {activeTab === "overview" && (
            <div className="w-full mt-2">
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">Subject</th>
                        <th className="py-3.5 px-5 text-center">Score</th>
                        <th className="py-3.5 px-5 text-center">
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Qs
                          </span>
                        </th>
                        <th className="py-3.5 px-5 text-center">
                          <span className="inline-flex items-center gap-1 text-rose-500">
                            <X className="w-3.5 h-3.5 stroke-[3]" /> Qs
                          </span>
                        </th>
                        <th className="py-3.5 px-5 text-right w-12" aria-label="Action" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {data.subjects.map((sub) => (
                        <tr
                          key={sub.id}
                          onClick={() => setActiveTab(sub.id)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-4 px-5">
                            <span className="font-bold text-slate-900 uppercase block text-xs tracking-tight">
                              {sub.partLabel}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({sub.maxMarks} marks)
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center font-bold text-slate-900">
                            {sub.score}
                          </td>
                          <td className="py-4 px-5 text-center font-semibold text-slate-700">
                            {sub.correctCount}
                          </td>
                          <td className="py-4 px-5 text-center font-semibold text-slate-700">
                            {sub.incorrectCount}
                          </td>
                          <td className="py-4 px-5 text-right text-slate-400 group-hover:text-slate-800 transition-colors">
                            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-0.5 transition-transform" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

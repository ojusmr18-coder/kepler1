"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Info, ThumbsUp, ArrowRight, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { TasksDoneCard } from "@/components/TasksDoneCard";
import { TasksDoneBreakdownModal, type TasksBreakdownData } from "@/components/TasksDoneBreakdownModal";
import { LockedInsightsIllustration } from "@/components/LockedInsightsIllustration";
import { apiClient } from "@/services/apiClient";

export interface ScoreBoosterTask {
  id: string;
  title: string;
  subject?: string;
  difficulty?: 1 | 2 | 3;
  actionLabel?: string;
  quizTarget?: string;
  completed?: boolean;
  pointsValue?: number;
}

export const DEFAULT_SCORE_BOOSTER_TASKS: ScoreBoosterTask[] = [
  {
    id: "task_101",
    title: "Master Mirror & Lens Formula Sign Conventions",
    subject: "Physics",
    difficulty: 1,
    completed: true,
    pointsValue: 4,
    actionLabel: "Practice Quiz",
    quizTarget: "/test?topic=light-reflection",
  },
  {
    id: "task_102",
    title: "Solve Resistor Combination Word Problems",
    subject: "Physics",
    difficulty: 2,
    completed: false,
    pointsValue: 4,
    actionLabel: "Practice Quiz",
    quizTarget: "/test?topic=electricity",
  },
  {
    id: "task_103",
    title: "Balancing Redox and Displacement Reactions",
    subject: "Chemistry",
    difficulty: 3,
    completed: false,
    pointsValue: 6,
    actionLabel: "Practice Quiz",
    quizTarget: "/test?topic=chem-reactions",
  },
  {
    id: "task_104",
    title: "Real Numbers: Prime Factorization & HCF-LCM Proofs",
    subject: "Mathematics",
    difficulty: 1,
    completed: false,
    pointsValue: 4,
    actionLabel: "Take Quiz",
    quizTarget: "/test?topic=real-numbers",
  },
];

export interface ScoreBoosterSectionProps {
  // Placeholder variables that can be dynamically populated from backend API
  currentMarks?: number | string;
  nextGoalMarks?: number | string;
  examName?: string;
  tasksCompleted?: number;
  tasksBreakdown?: TasksBreakdownData;
  initialViewMode?: "insights" | "stage";
  tasks?: ScoreBoosterTask[];
  // Backend task completion triggers
  isTaskCompleted?: boolean;
  onTaskCompletedTrigger?: (triggerFn: () => void) => void;
  onTryScoreBooster?: () => void;
  className?: string;
}

export function ScoreBoosterSection({
  // Dynamic placeholders with clean defaults ready for backend integration
  currentMarks = 142,
  nextGoalMarks = 180,
  examName = "JEE Mains",
  tasksCompleted = 14,
  tasksBreakdown = { easy: 10, moderate: 3, hard: 1 },
  initialViewMode = "insights",
  tasks = [], // Kept strictly empty by default as requested
  isTaskCompleted = false,
  onTaskCompletedTrigger,
  onTryScoreBooster,
  className = "",
}: ScoreBoosterSectionProps) {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = React.useState<string>("All");
  const [activeView, setActiveView] = React.useState<"insights" | "stage">(initialViewMode);
  const [isBreakdownOpen, setIsBreakdownOpen] = React.useState<boolean>(false);

  // Character stage state:
  // 'lower' (default at rest on lower platform, NO autoplay)
  // 'jumping' (parabolic jump flight, triggered ONLY on task completion)
  // 'higher' (stationed on higher goal platform celebrating)
  const [characterState, setCharacterState] = React.useState<"lower" | "jumping" | "higher">("lower");
  const [tasksCompletedCount, setTasksCompletedCount] = React.useState<number>(tasksCompleted);

  // Trigger jump function: called when backend marks a task as done
  const triggerTaskJump = React.useCallback(() => {
    setCharacterState("jumping");
    setTasksCompletedCount((prev) => prev + 1);
  }, []);

  // Reset character back to lower platform if needed
  const handleResetToLower = React.useCallback(() => {
    setCharacterState("lower");
  }, []);

  // 1. Expose trigger function to parent / backend service via callback hook
  React.useEffect(() => {
    if (onTaskCompletedTrigger) {
      onTaskCompletedTrigger(triggerTaskJump);
    }
  }, [onTaskCompletedTrigger, triggerTaskJump]);

  // 2. Trigger on prop state change from backend
  React.useEffect(() => {
    if (isTaskCompleted) {
      triggerTaskJump();
    }
  }, [isTaskCompleted, triggerTaskJump]);

  // 3. Trigger on global event for decoupled backend / API listeners
  React.useEffect(() => {
    const handleGlobalTaskDone = (e?: Event) => {
      const customEvent = e as CustomEvent;
      const completedTaskId = customEvent?.detail?.taskId;
      if (completedTaskId) {
        setCurrentTasks((prev) =>
          prev.map((t) => (t.id === completedTaskId ? { ...t, completed: true } : t))
        );
      }
      triggerTaskJump();
    };
    const handleGlobalReset = () => {
      handleResetToLower();
    };
    window.addEventListener("task-completed", handleGlobalTaskDone);
    window.addEventListener("score-booster:task-completed", handleGlobalTaskDone);
    window.addEventListener("score-booster:reset", handleGlobalReset);
    return () => {
      window.removeEventListener("task-completed", handleGlobalTaskDone);
      window.removeEventListener("score-booster:task-completed", handleGlobalTaskDone);
      window.removeEventListener("score-booster:reset", handleGlobalReset);
    };
  }, [triggerTaskJump, handleResetToLower]);

  const [currentTasks, setCurrentTasks] = React.useState<ScoreBoosterTask[]>(() => {
    const initial = tasks.length > 0 ? tasks : DEFAULT_SCORE_BOOSTER_TASKS;
    if (typeof window !== "undefined") {
      return initial.map((t) => {
        const isLocallyDone = localStorage.getItem(`score_booster_completed_${t.id}`) === "true";
        return isLocallyDone ? { ...t, completed: true } : t;
      });
    }
    return initial;
  });

  // Fetch tasks dynamically from Score Booster API
  React.useEffect(() => {
    let isMounted = true;
    async function loadTasks() {
      try {
        const response = await apiClient.scoreBooster.getTasks(
          selectedSubject === "All" ? undefined : selectedSubject
        );
        const sourceList = response?.tasks?.length
          ? response.tasks
          : DEFAULT_SCORE_BOOSTER_TASKS.filter(
              (t) =>
                selectedSubject === "All" ||
                t.subject?.toLowerCase() === selectedSubject.toLowerCase()
            );

        if (isMounted) {
          const synced = sourceList.map((t) => {
            const isLocallyDone =
              typeof window !== "undefined" &&
              localStorage.getItem(`score_booster_completed_${t.id}`) === "true";
            return isLocallyDone ? { ...t, completed: true } : t;
          });
          setCurrentTasks(synced);
        }
      } catch (err) {
        console.info("Using local tasks state fallback:", err);
      }
    }
    loadTasks();
    return () => {
      isMounted = false;
    };
  }, [selectedSubject]);

  // Navigate user to test/quiz window for that specific topic (instead of marking complete directly)
  const handleCompleteTask = (task: ScoreBoosterTask) => {
    if (task.completed) return;

    let topic = "kepler-laws";
    if (task.quizTarget && task.quizTarget.includes("topic=")) {
      const match = task.quizTarget.match(/topic=([^&]+)/);
      if (match) topic = match[1];
    } else if (task.id === "task_101") {
      topic = "light-reflection";
    } else if (task.id === "task_102") {
      topic = "electricity";
    } else if (task.id === "task_103") {
      topic = "chem-reactions";
    } else if (task.id === "task_104") {
      topic = "real-numbers";
    }

    const params = new URLSearchParams({
      topic,
      taskId: task.id,
      title: task.title,
      subject: task.subject || "Physics",
      difficulty: String(task.difficulty ?? 1),
      points: String(task.pointsValue || 4),
      source: "score-booster",
    });

    router.push(`/test?${params.toString()}`);
  };

  const completedCount = currentTasks.filter((t) => t.completed).length;
  const totalCount = currentTasks.length;

  return (
    <section
      id="score-booster-home-section"
      aria-label="Score Booster Section"
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
    >
      {/* 2-Column Responsive Layout matching reference images */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Blue Theme Score Booster Stage with Jump Animation           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#1E6DEB] via-[#1A62D6] to-[#0F4DB8] p-6 sm:p-7 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden min-h-[460px] select-none">
          {/* Subtle Starry Ambient Particles in Blue Sky */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span className="absolute top-8 left-12 w-1 h-1 bg-white/40 rounded-full animate-ping" />
            <span className="absolute top-24 right-16 w-1.5 h-1.5 bg-white/50 rounded-full" />
            <span className="absolute top-1/2 left-8 w-1 h-1 bg-white/30 rounded-full" />
            <span className="absolute bottom-20 right-28 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
            <span className="absolute top-16 left-1/2 w-1 h-1 bg-white/40 rounded-full" />
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Top Row: Info Buttons, View Switcher, & Introductory Heading */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-blue-200/90 mb-1">
                {activeView === "insights" ? "LOCKED INSIGHTS" : "INTRODUCING"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Score Booster
              </h2>
            </div>

            {/* View Switcher Pill & Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-full bg-black/20 p-0.5 backdrop-blur-md border border-white/15 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveView("insights")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeView === "insights"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Insights
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("stage")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeView === "stage"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Stage
                </button>
              </div>

              <button
                type="button"
                title="Like Score Booster"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white/90 transition-all active:scale-95 cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsBreakdownOpen(true)}
                title="View Tasks Done Breakdown"
                aria-label="View Tasks Done Breakdown"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white/90 transition-all active:scale-95 cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeView === "insights" ? (
            /* ======================================================================= */
            /* 1. LOCKED INSIGHTS VIEW (Matching Reference Image 1)                    */
            /* ======================================================================= */
            <div className="relative z-10 my-auto py-3 w-full flex flex-col items-center justify-center select-none">
              <LockedInsightsIllustration />
              <p className="mt-3 text-center text-sm sm:text-base font-bold text-white max-w-xs leading-snug drop-shadow-sm">
                Keep practicing &amp; take regular tests to unlock your insights
              </p>
            </div>
          ) : (
            /* ======================================================================= */
            /* 2. 3D PLATFORMS & ANIMATED JUMPING CHARACTER STAGE (SVG)                */
            /* ======================================================================= */
            <div
              className="relative z-10 my-auto py-2 w-full flex items-center justify-center select-none"
            >
            <svg
              viewBox="0 0 460 230"
              className="w-full max-w-[420px] h-auto overflow-visible select-none drop-shadow-lg"
              aria-label="Character jumping between current score and next goal platforms"
            >
              <defs>
                {/* Lower Green Platform Gradients */}
                <linearGradient id="greenTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <linearGradient id="greenFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                {/* Higher Blue Platform Gradients */}
                <linearGradient id="blueTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="blueFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1D4ED8" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>

                {/* Golden Lightning / Booster Gradient */}
                <linearGradient id="goldBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Platform Shadows */}
                <filter id="platformShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Parabolic Jump Trajectory Arc (Subtle dashed path) */}
              <path
                d="M 125 142 Q 235 22 335 78"
                fill="none"
                stroke="rgba(255, 255, 255, 0.28)"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="pointer-events-none"
              />

              {/* ===================================================================== */}
              {/* 1. LOWER PLATFORM (Green: Current Expected Marks)                     */}
              {/* ===================================================================== */}
              <g id="lower-platform" filter="url(#platformShadow)">
                {/* 3D Extrusion Bottom / Front Bevel */}
                <path
                  d="M 50 162 
                     L 125 186 
                     L 200 162 
                     L 200 178 
                     L 125 202 
                     L 50 178 Z"
                  fill="url(#greenFrontGrad)"
                />
                {/* 3D Top Surface Slab */}
                <path
                  d="M 125 138 
                     L 200 162 
                     L 125 186 
                     L 50 162 Z"
                  fill="url(#greenTopGrad)"
                  stroke="#6EE7B7"
                  strokeWidth="1.2"
                />
                {/* Front Bevel Text */}
                <text
                  x="125"
                  y="194"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="800"
                  letterSpacing="0.6"
                  className="select-none font-sans"
                >
                  YOUR AVG SCORE
                </text>
              </g>

              {/* Lower Platform Dynamic Score Pill */}
              <g transform="translate(125, 218)">
                <rect
                  x="-42"
                  y="-11"
                  width="84"
                  height="19"
                  rx="9.5"
                  fill="rgba(4, 120, 87, 0.85)"
                  stroke="rgba(110, 231, 183, 0.45)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="2.5"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="700"
                  className="font-sans"
                >
                  {currentMarks} Marks
                </text>
              </g>

              {/* ===================================================================== */}
              {/* 2. HIGHER PLATFORM (Blue: Next Goal Marks)                            */}
              {/* ===================================================================== */}
              <g id="higher-platform" filter="url(#platformShadow)">
                {/* 3D Extrusion Bottom / Front Bevel */}
                <path
                  d="M 260 98 
                     L 335 122 
                     L 410 98 
                     L 410 114 
                     L 335 138 
                     L 260 114 Z"
                  fill="url(#blueFrontGrad)"
                />
                {/* 3D Top Surface Slab */}
                <path
                  d="M 335 74 
                     L 410 98 
                     L 335 122 
                     L 260 98 Z"
                  fill="url(#blueTopGrad)"
                  stroke="#93C5FD"
                  strokeWidth="1.2"
                />
                {/* Front Bevel Text */}
                <text
                  x="335"
                  y="130"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="800"
                  letterSpacing="0.6"
                  className="select-none font-sans"
                >
                  NEXT GOAL
                </text>
              </g>

              {/* Higher Platform Dynamic Goal Pill */}
              <g transform="translate(335, 154)">
                <rect
                  x="-42"
                  y="-11"
                  width="84"
                  height="19"
                  rx="9.5"
                  fill="rgba(30, 64, 175, 0.85)"
                  stroke="rgba(147, 197, 253, 0.45)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="2.5"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="700"
                  className="font-sans"
                >
                  {nextGoalMarks} Marks
                </text>
              </g>

              {/* Goal Emblem Atop Higher Platform (Golden Lightning Bolt + Cloud Base) */}
              <g transform="translate(335, 52)">
                {/* Soft Cloud Base */}
                <path
                  d="M -16 6 
                     C -22 6, -24 0, -18 -3 
                     C -18 -8, -8 -10, -4 -6 
                     C 0 -12, 14 -12, 17 -4 
                     C 22 -4, 23 4, 16 6 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
                {/* Golden Lightning Bolt */}
                <path
                  d="M -1 -24 
                     L -10 -8 
                     L -2 -8 
                     L -5 4 
                     L 8 -9 
                     L 0 -9 
                     L 4 -24 Z"
                  fill="url(#goldBoltGrad)"
                  stroke="#D97706"
                  strokeWidth="0.8"
                />
                {/* Glow Sparkle */}
                <circle cx="12" cy="-18" r="1.5" fill="#FFFFFF" />
              </g>

              {/* ===================================================================== */}
              {/* 3. JUMPING CHARACTER (Smooth Parabolic Jump from Lower to Higher)     */}
              {/* ===================================================================== */}
              {/* Lower Platform Dynamic Ground Shadow */}
              <ellipse
                cx="125"
                cy="160"
                rx="14"
                ry="5"
                fill="rgba(4, 120, 87, 0.45)"
                className={`pointer-events-none transition-opacity duration-300 ${
                  characterState === "jumping"
                    ? "score-booster-shadow-lower-active"
                    : characterState === "higher"
                    ? "opacity-15"
                    : "opacity-100"
                }`}
              />

              {/* Higher Platform Dynamic Ground Shadow */}
              <ellipse
                cx="335"
                cy="96"
                rx="14"
                ry="5"
                fill="rgba(30, 64, 175, 0.45)"
                className={`pointer-events-none transition-opacity duration-300 ${
                  characterState === "jumping"
                    ? "score-booster-shadow-higher-active"
                    : characterState === "higher"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />

              {/* Main Jumping Character Anchor at (125, 142) */}
              <g transform="translate(125, 142)" className="pointer-events-none">
                <g
                  onAnimationEnd={() => {
                    if (characterState === "jumping") {
                      setCharacterState("higher");
                    }
                  }}
                  className={`${
                    characterState === "jumping"
                      ? "score-booster-jumper-active"
                      : characterState === "higher"
                      ? "score-booster-idle-higher"
                      : "score-booster-idle-lower"
                  }`}
                >
                  {/* Feet contact shadow */}
                  <ellipse cx="0" cy="18" rx="7" ry="2.8" fill="rgba(0, 0, 0, 0.25)" />

                  {/* White Minimalist Silhouette Humanoid Figure (Matching Reference Image) */}
                  {/* Head */}
                  <circle cx="0" cy="-14" r="5.2" fill="#FFFFFF" />
                  {/* Body / Torso */}
                  <path
                    d="M -4.5 -8 
                       C -4.5 -8, -5.5 6, -3 8 
                       C -1 9, 1 9, 3 8 
                       C 5.5 6, 4.5 -8, 4.5 -8 Z"
                    fill="#FFFFFF"
                  />
                  {/* Left Arm */}
                  <path
                    d="M -4.5 -5 C -8.5 -1, -8.5 4, -6.5 7"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Right Arm */}
                  <path
                    d="M 4.5 -5 C 8.5 -1, 8.5 4, 6.5 7"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Left Leg */}
                  <path
                    d="M -2 8 L -3.5 16"
                    stroke="#FFFFFF"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  {/* Right Leg */}
                  <path
                    d="M 2 8 L 3.5 16"
                    stroke="#FFFFFF"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </svg>
          </div>
        )}

          {/* Bottom Card Controls & Tasks Done Card (matching reference images) */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/15">
            <div className="text-xs sm:text-[13px] text-blue-100/90 font-medium text-center sm:text-left">
              Keep practicing &amp; take regular tests to unlock your insights
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Dynamic Tasks Done Card with 3D Lightning Icons matching Reference */}
              <TasksDoneCard
                tasksDoneCount={tasksCompletedCount}
                onClick={() => setIsBreakdownOpen(true)}
              />

              {/* Try Score Booster Action Pill */}
              {onTryScoreBooster && (
                <button
                  type="button"
                  onClick={onTryScoreBooster}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-blue-600 shadow-md hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Try</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: "Your today's task list" (Empty for now until backend data) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-slate-200/80 text-slate-800 min-h-[460px]">
          <div>
            {/* Header: Title and Completion Counter */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Your today&apos;s task list
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {completedCount}/{totalCount}
              </span>
            </div>

            {/* Dynamic Exam Readiness Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              Based on your {examName} readiness
            </p>

            {/* Subject Filters (matching reference image) */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              {["All", "Maths", "Physics", "Chemistry"].map((subject) => {
                const isSelected = selectedSubject === subject;
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => setSelectedSubject(subject)}
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>

            {/* ===================================================================== */}
            {/* TASK LIST AREA: Connected to Score Booster Tasks API                  */}
            {/* ===================================================================== */}
            {currentTasks.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-8 sm:p-10 flex flex-col items-center justify-center text-center my-4 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-3 shadow-xs">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                  All today&apos;s tasks completed!
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">
                  Great work! You have no pending practice tasks for {selectedSubject}. Check back tomorrow or take a mock test.
                </p>
              </div>
            ) : (
              /* Render tasks dynamically when supplied by backend */
              <div className="space-y-3 my-2">
                {currentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {task.subject || "General"}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-700">
                          +{task.pointsValue || 4} Marks
                        </span>
                      </div>
                      <span className={`font-semibold text-xs sm:text-sm block truncate ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                        {task.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={task.completed}
                      onClick={() => handleCompleteTask(task)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                        task.completed
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95"
                      }`}
                    >
                      {task.completed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Done</span>
                        </>
                      ) : (
                        <span>Complete</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Link (matching reference image) */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
            <button
              type="button"
              className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors cursor-pointer group"
            >
              <span>View My Completed Tasks</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <span className="text-xs text-slate-400 font-medium">Auto-synced</span>
          </div>
        </div>
      </div>

      {/* Tasks Done Breakdown Popup Modal (matching Reference Image 3) */}
      <TasksDoneBreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        totalTasks={tasksCompletedCount}
        breakdown={tasksBreakdown}
      />
    </section>
  );
}

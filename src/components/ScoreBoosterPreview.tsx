"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Zap,
  FileText
} from "lucide-react";
import { WhiteboardTodo, INITIAL_WHITEBOARD_DATA } from "@/components/ClassroomDashboard";

export interface ScoreBoosterPreviewProps {
  tasks?: WhiteboardTodo[];
  targetScore?: number | string;
  examName?: string;
  id?: string;
  className?: string;
}

export function ScoreBoosterPreview({
  tasks = INITIAL_WHITEBOARD_DATA.todos,
  targetScore = 300,
  examName = "JEE MAINS",
  id = "score-booster-home-section",
  className = "",
}: ScoreBoosterPreviewProps) {
  const router = useRouter();

  // Active carousel window index for right-hand task cards
  const [startIndex, setStartIndex] = React.useState<number>(0);

  const displayTasks = tasks && tasks.length > 0 ? tasks : INITIAL_WHITEBOARD_DATA.todos;
  const maxVisibleCards = 2;

  // Carousel handlers
  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, displayTasks.length - maxVisibleCards)));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + maxVisibleCards < displayTasks.length ? prev + 1 : 0));
  };

  // Navigates to the Topic Study Hub (matching whiteboard To-Do click)
  const handleOpenStudyHub = (todo: WhiteboardTodo) => {
    const topicParam = encodeURIComponent(todo.topicId || todo.id);
    const titleParam = encodeURIComponent(todo.topicTitle || todo.text);
    const idParam = encodeURIComponent(todo.id);
    router.push(`/study?topic=${topicParam}&title=${titleParam}&id=${idParam}`);
  };

  // Navigates directly to Take a Quiz for the topic
  const handleOpenQuiz = (e: React.MouseEvent, todo: WhiteboardTodo) => {
    e.stopPropagation();
    const topicParam = encodeURIComponent(todo.topicId || todo.id);
    const titleParam = encodeURIComponent(todo.topicTitle || todo.text);
    router.push(`/test?topic=${topicParam}&title=${titleParam}`);
  };

  // Visible window of cards for carousel
  const visibleTasks = React.useMemo(() => {
    if (displayTasks.length <= maxVisibleCards) {
      return displayTasks;
    }
    const sliced = displayTasks.slice(startIndex, startIndex + maxVisibleCards);
    if (sliced.length < maxVisibleCards) {
      return [...sliced, ...displayTasks.slice(0, maxVisibleCards - sliced.length)];
    }
    return sliced;
  }, [displayTasks, startIndex]);

  return (
    <section id={id} className={`w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 ${className}`}>
      {/* 1. SECTION HEADER: "Score Booster" with Expand / Arrow Navigation Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-[1.75rem] font-extrabold tracking-tight text-slate-900">
          Score Booster
        </h2>

        {/* Expand / Arrow button navigating to full Score Booster page */}
        <Link
          href="/score-booster"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all active:scale-95 group"
          title="Open full Score Booster page"
        >
          <span>Expand</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-slate-500 group-hover:text-blue-600" />
        </Link>
      </div>

      {/* 2. MAIN PREVIEW CONTAINER (Clean card style from reference image) */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ================================================================= */}
          {/* LEFT PANEL: "We have the next task ready for you!" Card           */}
          {/* ================================================================= */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center justify-between text-center pb-4 md:pb-0 md:pr-6 lg:pr-8 md:border-r md:border-slate-200/80">
            {/* Title */}
            <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight mb-5">
              We have the next task ready for you!
            </h3>

            {/* Target Score Arch Badge */}
            <div className="relative my-2 flex items-center justify-center">
              {/* Top-Left Sparkle Star */}
              <div className="absolute -top-2.5 left-2 select-none pointer-events-none">
                <svg className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" viewBox="0 0 24 24">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </div>

              {/* Right-Middle Sparkle Star */}
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 select-none pointer-events-none">
                <svg className="w-3 h-3 text-emerald-400 fill-emerald-400" viewBox="0 0 24 24">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </div>

              {/* Arch Shaped Container with vibrant green border */}
              <div className="w-32 sm:w-36 h-32 sm:h-36 rounded-t-[34px] rounded-b-2xl border-[2.8px] border-emerald-500 bg-white flex flex-col items-center justify-center pt-2 pb-5 px-3 relative shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                  TARGET
                </span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  {targetScore}
                </span>

                {/* Bottom Pill: JEE MAINS */}
                <div className="absolute -bottom-3.5 bg-emerald-500 text-white text-[11px] font-extrabold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
                  {examName}
                </div>
              </div>
            </div>

            {/* View all my tasks Link */}
            <div className="pt-6">
              <Link
                href="/score-booster"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer"
              >
                <span>View all my tasks</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT PANEL: "Your tasks" Cards Carousel                          */}
          {/* ================================================================= */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-between pt-2 md:pt-0">
            {/* Header: "Your tasks" & Carousel Arrow Buttons */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Your tasks
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  title="Previous tasks"
                  aria-label="Previous tasks"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  title="Next tasks"
                  aria-label="Next tasks"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tasks Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch my-auto">
              {visibleTasks.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => handleOpenStudyHub(todo)}
                  className="group rounded-2xl bg-[#EEF2F6] hover:bg-[#E5ECF3] border border-slate-200/70 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer select-none"
                  title={`Open Study Hub for ${todo.text}`}
                >
                  {/* Top: Topic Title & 3 Lightning Bolts */}
                  <div className="flex items-start justify-between gap-3 min-h-[44px]">
                    <h4 className="text-xs sm:text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-900 transition-colors">
                      {todo.text}
                    </h4>

                    {/* 3 Soft Blue Lightning Bolts (matching reference style) */}
                    <div className="flex items-center gap-0.5 shrink-0 text-blue-300">
                      <Zap className="w-3.5 h-3.5 fill-blue-300/60" />
                      <Zap className="w-3.5 h-3.5 fill-blue-300/60" />
                      <Zap className="w-3.5 h-3.5 fill-blue-300/60" />
                    </div>
                  </div>

                  {/* Horizontal Divider */}
                  <div className="border-b border-slate-300/40 my-3.5" />

                  {/* Bottom: "Take a Quiz" Action Area & Black Circle Arrow */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => handleOpenQuiz(e, todo)}
                      className="inline-flex items-center gap-2 text-left bg-transparent border-0 p-0 cursor-pointer group/quiz"
                      title={`Take Quiz for ${todo.text}`}
                    >
                      {/* Dark rounded icon */}
                      <div className="w-6 h-6 rounded-md bg-slate-600 text-white flex items-center justify-center shadow-2xs group-hover/quiz:bg-blue-600 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-800 group-hover/quiz:text-blue-600 transition-colors">
                        Take a Quiz
                      </span>
                    </button>

                    {/* Solid Black Circle with White Chevron */}
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

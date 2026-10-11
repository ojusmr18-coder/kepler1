"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  X,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { getStudyTopic, StudyTopic, FlashcardItem } from "@/data/studyTopics";
import { MathFormula, MathText } from "@/components/MathRenderer";

export function StudyClientView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicParam = searchParams?.get("topic") || "";
  const titleParam = searchParams?.get("title") || "";
  const idParam = searchParams?.get("id") || "";

  // Lookup topic data from shared registry or dynamic fallback
  const topic: StudyTopic = React.useMemo(() => {
    return getStudyTopic(topicParam || idParam, titleParam);
  }, [topicParam, idParam, titleParam]);

  // Modal states for interactive Flashcards and Revision Notes
  const [showFlashcards, setShowFlashcards] = React.useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = React.useState<number>(0);
  const [isFlipped, setIsFlipped] = React.useState<boolean>(false);
  const [showHint, setShowHint] = React.useState<boolean>(false);

  const [showNotes, setShowNotes] = React.useState<boolean>(false);

  // Auto-open modal if specified in search query (e.g. from Learn section shortcuts)
  const viewParam = searchParams?.get("view") || "";
  React.useEffect(() => {
    if (viewParam === "flashcards") {
      setShowFlashcards(true);
    } else if (viewParam === "notes") {
      setShowNotes(true);
    }
  }, [viewParam]);

  // Close modals on Escape key & keyboard controls for Flashcards modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest("input, textarea, select, [contenteditable='true']"))
      ) {
        return;
      }

      if (e.key === "Escape") {
        setShowFlashcards(false);
        setShowNotes(false);
        return;
      }

      if (showFlashcards) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setCurrentCardIndex((prev) => {
            if (prev > 0) {
              setIsFlipped(false);
              setShowHint(false);
              return prev - 1;
            }
            return prev;
          });
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setCurrentCardIndex((prev) => {
            if (prev < topic.flashcards.length - 1) {
              setIsFlipped(false);
              setShowHint(false);
              return prev + 1;
            }
            return prev;
          });
        } else if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFlashcards, topic.flashcards.length]);

  const handleStartQuiz = () => {
    router.push(topic.quizRoute);
  };

  const handleOpenFlashcards = () => {
    router.push(`/revision?topic=${encodeURIComponent(topic.id)}&title=${encodeURIComponent(topic.title)}&tab=flashcards`);
  };

  const handleOpenNotes = () => {
    router.push(`/revision-notes?subject=${encodeURIComponent(topic.subject?.toLowerCase() || "physics")}`);
  };

  const currentFlashcard: FlashcardItem | undefined = topic.flashcards[currentCardIndex];

  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-800 flex flex-col p-4 sm:p-6 lg:p-8 pl-16 sm:pl-20 lg:pl-24 antialiased select-none">
      {/* 1. TOP BREADCRUMB NAVIGATION */}
      <div className="w-full max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Classroom Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Active Study Module:
          </span>
          <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            {topic.chapter}
          </span>
        </div>
      </div>

      {/* 2. MAIN CENTER LANDSCAPE CONTAINER (Clean, Minimal, Neutral Original Web DNA) */}
      <main className="flex-1 w-full flex items-center justify-center my-auto py-4">
        <div className="w-full max-w-5xl xl:max-w-6xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Top Info Strip inside Box */}
          <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                TOPIC MASTERY HUB
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                {topic.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
              <span>Physics Mechanics &bull; JEE High-Yield</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2-COLUMN LANDSCAPE MERGED SPLIT                                          */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[380px] sm:min-h-[420px]">
            {/* --------------------------------------------------------------------- */}
            {/* LEFT HALF: “Start Quiz” (Clean neutral action area)                  */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-6 sm:p-10 flex flex-col justify-between lg:border-r lg:border-slate-100">
              <div>
                {/* Header Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
                  <Zap className="w-3.5 h-3.5 text-slate-700" />
                  <span>KNOWLEDGE ASSESSMENT</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Ready to test your understanding?
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                  Complete the targeted practice quiz to benchmark your exam readiness and unlock your Score Booster advancement.
                </p>

                {/* Key Quiz Metrics / Highlights (Clean Neutral styling, no colored numbers) */}
                <div className="grid grid-cols-3 gap-3 mb-8 max-w-md">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center">
                    <span className="block text-lg sm:text-xl font-extrabold text-slate-900">
                      {topic.quizQuestionCount}
                    </span>
                    <span className="block text-[11px] font-medium text-slate-500">
                      Questions
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center">
                    <span className="block text-lg sm:text-xl font-extrabold text-slate-900">
                      {topic.quizDurationMinutes}m
                    </span>
                    <span className="block text-[11px] font-medium text-slate-500">
                      Duration
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center">
                    <span className="block text-lg sm:text-xl font-extrabold text-slate-900">
                      +4
                    </span>
                    <span className="block text-[11px] font-medium text-slate-500">
                      Marks Boost
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Start Quiz (Original Dark Web DNA Button) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span>Start Quiz</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <p className="text-[11px] text-slate-400 mt-2">
                  Instant rubric evaluation &bull; Solutions available upon submission
                </p>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* RIGHT HALF: Revision Options (Clean, Minimal, Neutral)                 */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Header Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                  <span>CONCEPT REVISION</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Strengthen your concepts first
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                  Choose how you want to prepare before diving into the quiz. Review key formulas or test your recall with interactive cards.
                </p>

                {/* Two Revision Option Cards (Clean neutral cards) */}
                <div className="space-y-3.5 max-w-md">
                  {/* Option 1: Revise with Flashcards */}
                  <button
                    type="button"
                    onClick={handleOpenFlashcards}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-lg shadow-2xs group-hover:scale-105 transition-transform">
                      📇
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                          Revise with Flashcards
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                          {topic.flashcards.length} Cards
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        Interactive flip cards for definitions, laws, and key conceptual checkpoints.
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all self-center" />
                  </button>

                  {/* Option 2: Revise with Revision Notes */}
                  <button
                    type="button"
                    onClick={handleOpenNotes}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-lg shadow-2xs group-hover:scale-105 transition-transform">
                      📝
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                          Revise with Revision Notes
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                          Formulas & Theory
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        Structured chapter summary, derivation takeaways, and quick KaTeX formulas.
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all self-center" />
                  </button>
                </div>
              </div>

              <div className="pt-4 text-xs text-slate-500 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>Recommended: Review flashcards before attempting the quiz</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE FLASHCARDS MODAL (Neutral Web DNA)                         */}
      {/* ========================================================================= */}
      {showFlashcards && currentFlashcard && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowFlashcards(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl">📇</span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Flashcard {currentCardIndex + 1} of {topic.flashcards.length}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFlashcards(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flashcard Body */}
            <div className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[260px] text-center bg-slate-50/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {isFlipped ? "Answer / Solution" : "Question / Concept"}
              </span>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition-all active:scale-[0.99] flex flex-col items-center justify-center min-h-[160px]"
              >
                <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  <MathText content={isFlipped ? currentFlashcard.answer : currentFlashcard.question} />
                </div>
                <span className="text-[11px] text-slate-400 mt-4 underline decoration-dotted">
                  Click to {isFlipped ? "see question" : "reveal answer"}
                </span>
              </div>

              {/* Hint Drawer */}
              {currentFlashcard.hint && (
                <div className="w-full mt-4">
                  {showHint ? (
                    <div className="text-xs bg-slate-100 text-slate-800 p-2.5 rounded-xl border border-slate-200">
                      💡 <strong>Hint:</strong> <MathText content={currentFlashcard.hint} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline underline-offset-2 cursor-pointer"
                    >
                      Show Hint
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80">
              <button
                type="button"
                disabled={currentCardIndex === 0}
                aria-label="Previous Flashcard (Left Arrow key)"
                onClick={() => {
                  setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                  setIsFlipped(false);
                  setShowHint(false);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>&larr; Previous</span>
                <kbd className="hidden sm:inline-block font-mono text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  &larr;
                </kbd>
              </button>

              <button
                type="button"
                aria-label="Flip Flashcard (Spacebar)"
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <span>Flip Card</span>
                <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                  Space
                </kbd>
              </button>

              <button
                type="button"
                disabled={currentCardIndex === topic.flashcards.length - 1}
                aria-label="Next Flashcard (Right Arrow key)"
                onClick={() => {
                  setCurrentCardIndex((prev) => Math.min(topic.flashcards.length - 1, prev + 1));
                  setIsFlipped(false);
                  setShowHint(false);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>Next &rarr;</span>
                <kbd className="hidden sm:inline-block font-mono text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  &rarr;
                </kbd>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE REVISION NOTES MODAL (Neutral Web DNA)                     */}
      {/* ========================================================================= */}
      {showNotes && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowNotes(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl">📝</span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    Revision Notes &bull; {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-yield theory &bull; Formulas &bull; JEE Takeaways
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNotes(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notes Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-700">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Executive Summary
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800">
                  <MathText content={topic.revisionNotes.summary} />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Key Conceptual Points
                </h4>
                <ul className="space-y-2">
                  {topic.revisionNotes.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                      <span>
                        <MathText content={point} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {topic.revisionNotes.formulas && topic.revisionNotes.formulas.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                    Core Formula Sheet
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {topic.revisionNotes.formulas.map((formula, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs sm:text-sm text-center border border-slate-800 flex items-center justify-center overflow-x-auto min-h-[56px]"
                      >
                        <MathFormula math={formula} displayMode={true} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80">
              <span className="text-xs text-slate-500">
                Ready to test? Start the quiz when done.
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowNotes(false);
                  handleStartQuiz();
                }}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Proceed to Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

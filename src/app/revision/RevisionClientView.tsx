"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Sparkles,
  FileText,
  BookOpen,
  ArrowRight,
  Layers,
  Check
} from "lucide-react";
import { getStudyTopic, StudyTopic, FlashcardItem } from "@/data/studyTopics";
import { MathFormula, MathText } from "@/components/MathRenderer";
import { apiClient } from "@/services/apiClient";

export interface RevisionNoteSection {
  title: string;
  points: string[];
  formulas?: string[];
}

export function RevisionClientView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicParam = searchParams?.get("topic") || "";
  const titleParam = searchParams?.get("title") || "";
  const subjectParam = searchParams?.get("subject") || "";
  const initialTab = searchParams?.get("tab") || "both"; // 'flashcards' | 'notes' | 'both'

  const [activeTab, setActiveTab] = React.useState<"both" | "flashcards" | "notes">(
    initialTab === "flashcards" || initialTab === "notes" ? initialTab : "both"
  );

  // API state for dynamic loading
  const [apiFlashcards, setApiFlashcards] = React.useState<FlashcardItem[] | null>(null);
  const [apiNotes, setApiNotes] = React.useState<any | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    async function loadRevisionContent() {
      try {
        const [fcRes, notesRes] = await Promise.all([
          apiClient.learn.getFlashcards(topicParam || "kepler-laws").catch(() => null),
          apiClient.learn.getRevisionNotes(topicParam || "kepler-laws").catch(() => null),
        ]);
        if (isMounted) {
          if (fcRes?.flashcards && fcRes.flashcards.length > 0) {
            setApiFlashcards(fcRes.flashcards);
          }
          if (notesRes?.revisionNotes) {
            setApiNotes(notesRes.revisionNotes);
          }
        }
      } catch (err) {
        console.info("Using local revision data fallback:", err);
      }
    }
    loadRevisionContent();
    return () => {
      isMounted = false;
    };
  }, [topicParam]);

  // Load study topic from existing repository or generate clean fallback
  const topicData: StudyTopic = React.useMemo(() => {
    const base = getStudyTopic(topicParam, titleParam || (subjectParam ? `${subjectParam} Chapter Revision` : "Class 10 Revision"));
    if (apiNotes) {
      return {
        ...base,
        revisionNotes: apiNotes,
      };
    }
    return base;
  }, [topicParam, titleParam, subjectParam, apiNotes]);

  // Flashcards state
  const flashcards: FlashcardItem[] = React.useMemo(() => {
    if (apiFlashcards && apiFlashcards.length > 0) {
      return apiFlashcards;
    }
    if (topicData.flashcards && topicData.flashcards.length > 0) {
      return topicData.flashcards;
    }
    // High quality Class 10 placeholder cards if content is not uploaded yet
    return [
      {
        id: "rev_card_1",
        question: "Explain the core principle of: Fundamental Theorem of Arithmetic.",
        answer: "Every composite number can be uniquely factored into prime powers, regardless of the sequence of prime factors.",
        hint: "Recall: Every composite number = p1^a1 * p2^a2 * ... * pk^ak."
      },
      {
        id: "rev_card_2",
        question: "State Ohm's Law and its mathematical formula.",
        answer: "The electric current passing through a conductor is directly proportional to the potential difference across its terminals, provided temperature remains constant: V = I × R.",
        hint: "Linear relation between Voltage (V), Current (I), and Resistance (R)."
      },
      {
        id: "rev_card_3",
        question: "What is the difference between combination and decomposition reactions?",
        answer: "A combination reaction combines two or more reactants into a single product (A + B -> AB), while a decomposition reaction breaks a single compound into two or more substances (AB -> A + B).",
        hint: "Synthesis vs Breakdown under heat, light, or electricity."
      },
      {
        id: "rev_card_4",
        question: "What is the relationship between Focal Length and Radius of Curvature for spherical mirrors?",
        answer: "For spherical mirrors with small aperture, the focal length is half the radius of curvature: f = R / 2.",
        hint: "Distance from pole to focus vs center of curvature."
      },
      {
        id: "rev_card_5",
        question: "Define the term: Areal Velocity in Kepler's Second Law.",
        answer: "Areal velocity is the area swept out by the radius vector per unit time: dA/dt = L / (2m) = constant, derived directly from conservation of angular momentum under a central force.",
        hint: "Equal areas in equal intervals of time."
      }
    ];
  }, [topicData]);

  const [currentCardIndex, setCurrentCardIndex] = React.useState<number>(0);
  const [isFlipped, setIsFlipped] = React.useState<boolean>(false);
  const [showHint, setShowHint] = React.useState<boolean>(false);
  const [masteredCards, setMasteredCards] = React.useState<Set<string>>(new Set());

  const currentCard = flashcards[currentCardIndex];
  const isMastered = currentCard ? masteredCards.has(currentCard.id) : false;

  const handleNextCard = React.useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  }, [flashcards.length]);

  const handlePrevCard = React.useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  }, [flashcards.length]);

  const handleFlipCard = React.useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard shortcut listener:
  // - Left Arrow (←): Previous card
  // - Right Arrow (→): Next card
  // - Spacebar: Flip card
  // Safely ignores keystrokes when typing in inputs or text areas
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

      // Only handle when flashcards section is visible
      if (activeTab === "notes") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault(); // Prevents default browser scroll down on spacebar
        handleFlipCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextCard, handlePrevCard, handleFlipCard, activeTab]);

  const toggleMastered = () => {
    if (!currentCard) return;
    setMasteredCards((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-800 flex flex-col p-4 sm:p-6 lg:p-8 pl-16 sm:pl-20 lg:pl-24 pr-4 sm:pr-8 lg:pr-12 antialiased select-none">
      
      {/* 1. TOP BREADCRUMB & CONTROLS */}
      <div className="w-full max-w-7xl 2xl:max-w-[1560px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link
            href="/learn"
            className="hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            Learn
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link
            href="/dashboard"
            className="hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            {topicData.chapter || "Subject Chapter"}
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="font-semibold text-slate-900">Revision Hub</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href={`/test?topic=${encodeURIComponent(topicData.id)}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
          >
            <span>Practice Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. REVISION HUB HEADER */}
      <div className="w-full max-w-7xl 2xl:max-w-[1560px] mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Sparkles className="w-3 h-3 text-slate-500" />
              <span>CHAPTER REVISION &amp; MASTERY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {topicData.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review core definitions, flip flashcards, and revise high-yield formulas before taking your exam.
            </p>
          </div>

          {/* Section View Switcher Tabs (Both, Flashcards, Notes) */}
          <div className="inline-flex items-center rounded-2xl bg-white border border-slate-200/90 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("both")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "both"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("flashcards")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "flashcards"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📇 Flashcards</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "flashcards" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {flashcards.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (subjectParam) {
                  router.push(`/revision-notes?subject=${encodeURIComponent(subjectParam)}`);
                } else {
                  router.push("/revision-notes");
                }
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Revision Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT STAGE */}
      <div className="w-full max-w-7xl 2xl:max-w-[1560px] mx-auto flex-1 flex flex-col gap-8 pb-12">
        
        {/* =================================================================== */}
        {/* A. FLASHCARDS SECTION                                              */}
        {/* =================================================================== */}
        {(activeTab === "both" || activeTab === "flashcards") && (
          <section className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-10">
            
            {/* Flashcard Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-lg">
                  📇
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Interactive Flashcards
                  </h2>
                  <p className="text-xs text-slate-500">
                    Click card or press flip to reveal answers and key formulas.
                  </p>
                </div>
              </div>

              {/* Counter & Mastered Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {currentCardIndex + 1} / {flashcards.length}
                </span>

                <button
                  type="button"
                  onClick={toggleMastered}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isMastered
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isMastered ? "Mastered" : "Mark Mastered"}</span>
                </button>
              </div>
            </div>

            {/* 3D Flip Flashcard Container */}
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
              <div
                className="w-full h-[360px] sm:h-[380px] cursor-pointer"
                style={{ perspective: "1200px" }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT FACE (Question / Prompt) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        <Bookmark className="w-3 h-3 text-slate-500" />
                        Concept Checkpoint
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {currentCard?.id || `card_${currentCardIndex + 1}`}
                      </span>
                    </div>

                    {/* Question Content */}
                    <div className="my-auto py-4">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                        Question &bull; Prompt
                      </p>
                      <h3 className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed">
                        <MathText content={currentCard?.question || ""} />
                      </h3>

                      {/* Hint Toggle */}
                      {currentCard?.hint && (
                        <div
                          className="mt-4 pt-3 border-t border-slate-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(!showHint);
                          }}
                        >
                          <button className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{showHint ? "Hide Hint" : "Show Hint"}</span>
                          </button>
                          {showHint && (
                            <div className="mt-2 text-xs text-slate-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 leading-relaxed">
                              <MathText content={currentCard.hint} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom tip */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Click card or press</span>
                        <kbd className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">Space</kbd>
                        <span>to flip</span>
                      </span>
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Front</span>
                    </div>
                  </div>

                  {/* BACK FACE (Answer / Solution) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Explanation &amp; Formula
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {currentCard?.id || `card_${currentCardIndex + 1}`}
                      </span>
                    </div>

                    {/* Answer Content */}
                    <div className="my-auto py-4">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                        Key Concept &bull; Takeaway
                      </p>
                      <div className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans bg-slate-800/70 p-4 sm:p-5 rounded-2xl border border-slate-700/80">
                        <MathText content={currentCard?.answer || ""} />
                      </div>
                    </div>

                    {/* Bottom tip */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Click card or press</span>
                        <kbd className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Space</kbd>
                        <span>to flip back</span>
                      </span>
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Back</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex flex-col items-center gap-3 mt-6">
                <div className="flex items-center justify-center gap-2.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={handlePrevCard}
                    aria-label="Previous Flashcard (Left arrow key)"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs cursor-pointer group"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                    <kbd className="hidden sm:inline-flex items-center justify-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 ml-0.5 group-hover:text-slate-800 transition-colors">
                      &larr;
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={handleFlipCard}
                    aria-label="Flip Flashcard (Spacebar)"
                    className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all shadow-2xs cursor-pointer group"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Flip Card</span>
                    <kbd className="hidden sm:inline-flex items-center justify-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 ml-0.5 group-hover:bg-slate-700 transition-colors">
                      Space
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextCard}
                    aria-label="Next Flashcard (Right arrow key)"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs cursor-pointer group"
                  >
                    <span>Next</span>
                    <kbd className="hidden sm:inline-flex items-center justify-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 mr-0.5 group-hover:text-slate-800 transition-colors">
                      &rarr;
                    </kbd>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Keyboard Shortcuts Hint Bar */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
                  <span className="hidden sm:inline">Keyboard shortcuts:</span>
                  <span className="inline-flex items-center gap-1 font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                    &larr; Prev
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                    Space Flip
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                    &rarr; Next
                  </span>
                </div>
              </div>
            </div>

          </section>
        )}

        {/* =================================================================== */}
        {/* B. REVISION NOTES SECTION                                          */}
        {/* =================================================================== */}
        {(activeTab === "both" || activeTab === "notes") && (
          <section className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-10">
            
            {/* Notes Header Bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Structured Revision Notes
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive chapter theory summaries, derivations, and exam rubrics.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline-block">
                NCERT Class 10 Syllabus
              </span>
            </div>

            {/* Notes Content Grid */}
            <div className="space-y-6">
              {/* 1. Summary Overview */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                  Chapter Executive Summary
                </h3>
                <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
                  <MathText
                    content={
                      topicData.revisionNotes?.summary ||
                      "This unit covers foundational theoretical principles and mathematical relations established by the CBSE curriculum. Reviewing the core concepts, derivations, and formulas below guarantees complete exam readiness."
                    }
                  />
                </div>
              </div>

              {/* 2. Key Checkpoints & High-Yield Bullet Points */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4">
                  High-Yield Revision Points
                </h3>
                <ul className="space-y-3">
                  {(topicData.revisionNotes?.keyPoints || [
                    "Ensure definitions are stated with standard terminology and required physical conditions.",
                    "Verify units and signs carefully before performing numerical calculations.",
                    "Diagrams should be drawn neatly with proper labeling of ray paths or circuit poles.",
                    "Practice step-by-step reasoning for assertion-reason questions."
                  ]).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        {idx + 1}
                      </span>
                      <span>
                        <MathText content={point} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Formulas & Mathematical Expressions */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                  Essential Mathematical Expressions &amp; Formulas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(topicData.revisionNotes?.formulas || [
                    "V = I \\times R",
                    "P = V \\times I = I^2 R",
                    "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",
                    "T^2 = \\frac{4\\pi^2}{GM} a^3",
                    "H = I^2 R t"
                  ]).map((formula, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center text-sm sm:text-base font-semibold text-slate-900 flex items-center justify-center min-h-[68px] overflow-x-auto"
                    >
                      <MathFormula math={formula} displayMode={true} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>
        )}

      </div>
    </div>
  );
}

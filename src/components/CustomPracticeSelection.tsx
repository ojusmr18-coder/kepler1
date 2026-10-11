"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Zap,
  ChevronRight,
  Search,
  ChevronDown,
  Check,
  Globe,
  BookOpen,
  FlaskConical,
  Atom,
  Dna,
  Languages,
  Scroll,
  BookMarked,
  Sparkles,
  Inbox,
  Loader2,
} from "lucide-react";
import { getChaptersBySubjectMap } from "@/data/quizCatalog";
import { apiClient } from "@/services/apiClient";

// ----------------------------------------------------------------------------
// Custom Pi Icon for Maths matching reference image
// ----------------------------------------------------------------------------
function PiSymbolIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-serif text-lg font-bold leading-none select-none ${className}`}
      aria-hidden="true"
    >
      π
    </span>
  );
}

// ----------------------------------------------------------------------------
// Class 10 Subjects Definition
// ----------------------------------------------------------------------------
export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  gradeLabel: string;
}

export const CLASS_10_SUBJECTS: SubjectItem[] = [
  {
    id: "maths",
    name: "Maths",
    code: "MATH-10",
    icon: PiSymbolIcon,
    iconColor: "text-teal-500",
    gradeLabel: "Maths - 10",
  },
  {
    id: "physics",
    name: "Physics",
    code: "PHY-10",
    icon: Atom,
    iconColor: "text-indigo-500",
    gradeLabel: "Physics - 10",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    code: "CHEM-10",
    icon: FlaskConical,
    iconColor: "text-purple-500",
    gradeLabel: "Chemistry - 10",
  },
  {
    id: "biology",
    name: "Biology",
    code: "BIO-10",
    icon: Dna,
    iconColor: "text-emerald-500",
    gradeLabel: "Biology - 10",
  },
  {
    id: "sst",
    name: "SST",
    code: "SST-10",
    icon: Globe,
    iconColor: "text-amber-500",
    gradeLabel: "SST - 10",
  },
  {
    id: "english",
    name: "English",
    code: "ENG-10",
    icon: BookOpen,
    iconColor: "text-rose-500",
    gradeLabel: "English - 10",
  },
  {
    id: "hindi",
    name: "Hindi",
    code: "HIN-10",
    icon: Languages,
    iconColor: "text-orange-500",
    gradeLabel: "Hindi - 10",
  },
  {
    id: "sanskrit",
    name: "Sanskrit",
    code: "SAN-10",
    icon: Scroll,
    iconColor: "text-red-500",
    gradeLabel: "Sanskrit - 10",
  },
  {
    id: "kannada",
    name: "Kannada",
    code: "KAN-10",
    icon: BookMarked,
    iconColor: "text-cyan-500",
    gradeLabel: "Kannada - 10",
  },
  {
    id: "telugu",
    name: "Telugu",
    code: "TEL-10",
    icon: Sparkles,
    iconColor: "text-fuchsia-500",
    gradeLabel: "Telugu - 10",
  },
];

export interface ChapterItem {
  id: string;
  title: string;
  subtopicsCount?: number;
}

export interface CustomPracticeSelectionProps {
  initialSubjectId?: string;
  // Strictly empty by default as requested: "Do not generate any fake chapters"
  chaptersBySubject?: Record<string, ChapterItem[]>;
  onNextStep?: (selectedChapters: string[], subjectId: string) => void;
  className?: string;
}

export function CustomPracticeSelection({
  initialSubjectId = "maths",
  chaptersBySubject,
  onNextStep,
  className = "",
}: CustomPracticeSelectionProps) {
  const router = useRouter();

  // Active Subject selection
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>(initialSubjectId);

  // Search query
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Selected chapters (Set of IDs, max 9)
  const [selectedChapterIds, setSelectedChapterIds] = React.useState<Set<string>>(new Set());

  // Generating state for multi-chapter custom test creation
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  // Memoized full chapter map from master quiz catalog
  const defaultChaptersMap = React.useMemo(() => getChaptersBySubjectMap(), []);
  const resolvedChaptersMap = chaptersBySubject || defaultChaptersMap;

  // Current subject's chapters
  const availableChapters = React.useMemo(() => {
    return resolvedChaptersMap[selectedSubjectId] || [];
  }, [resolvedChaptersMap, selectedSubjectId]);

  // Filtered chapters based on search query
  const filteredChapters = React.useMemo(() => {
    if (!searchQuery.trim()) return availableChapters;
    const query = searchQuery.toLowerCase().trim();
    return availableChapters.filter((ch) => ch.title.toLowerCase().includes(query));
  }, [availableChapters, searchQuery]);

  // Handle chapter toggle with 9 chapters maximum rule
  const handleToggleChapter = (chapterId: string) => {
    setSelectedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        if (next.size >= 9) {
          alert("You can select up to 9 chapters only.");
          return prev;
        }
        next.add(chapterId);
      }
      return next;
    });
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedChapterIds(new Set());
    setSearchQuery("");
  };

  // Switch subject
  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    // Maintain or reset selections as desired; resetting per subject
    setSelectedChapterIds(new Set());
    setSearchQuery("");
  };

  const selectedCount = selectedChapterIds.size;
  const canProceed = selectedCount > 0;

  const currentSubject =
    CLASS_10_SUBJECTS.find((s) => s.id === selectedSubjectId) || CLASS_10_SUBJECTS[0];

  return (
    <div className={`min-h-screen w-full bg-[#F5F8FA] text-slate-800 flex flex-col antialiased ${className}`}>
      {/* ===================================================================== */}
      {/* TOP NAVIGATION BAR (Matching Reference Image 1)                       */}
      {/* ===================================================================== */}
      <header className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
        {/* Left: Back button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Custom Practice</span>
          </nav>
        </div>

        {/* Center: Weekly Target Progress Pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 border border-blue-200/80 px-3.5 py-1.5 text-xs font-semibold text-blue-900 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          <span>50 Qs</span>
          <span className="text-blue-400">&bull;</span>
          <span className="text-blue-700 font-medium">Weekly target</span>
          <Link
            href="/dashboard"
            className="text-blue-600 font-bold hover:underline inline-flex items-center ml-0.5"
          >
            Check progress <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* Right: View Previous Quizzes Link */}
        <div className="flex items-center">
          <Link
            href="/test"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
          >
            View Previous Quizzes
          </Link>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN CONTAINER: 2-COLUMN LAYOUT                                       */}
      {/* Left: Class 10 Subjects Sidebar | Right: Chapter Selection Area       */}
      {/* ===================================================================== */}
      <div className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* =================================================================== */}
        {/* LEFT SIDEBAR: CLASS 10 SUBJECTS LIST                                */}
        {/* =================================================================== */}
        <aside
          aria-label="Class 10 Subjects Navigation"
          className="w-full lg:w-64 shrink-0 flex flex-col gap-1.5"
        >
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">
            Class 10 Subjects
          </div>

          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {CLASS_10_SUBJECTS.map((subject) => {
              const isSelected = subject.id === selectedSubjectId;
              const IconComponent = subject.icon;

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => handleSelectSubject(subject.id)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm sm:text-base text-left transition-all cursor-pointer select-none shrink-0 lg:shrink ${
                    isSelected
                      ? "bg-[#186470] text-white shadow-md shadow-teal-900/15"
                      : "bg-transparent text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-2xs"
                  }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center shrink-0 ${
                      isSelected ? "text-white" : subject.iconColor
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="truncate">{subject.gradeLabel}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* =================================================================== */}
        {/* RIGHT MAIN AREA: "Select up to 9 chapters"                          */}
        {/* =================================================================== */}
        <main className="flex-1 w-full bg-transparent flex flex-col min-w-0">
          {/* Header Row: Title & 2-Step Progress Bar (1/2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Select up to 9 chapters
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentSubject.name} &bull; {selectedCount}/9 selected
              </p>
            </div>

            {/* Progress Bar Indicator: Step 1 of 2 (Matching Reference Image 1) */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5" aria-label="Step 1 of 2">
                {/* Active Segment 1 (Black/Dark Slate) */}
                <div className="h-1 sm:h-1.5 w-24 sm:w-32 bg-slate-900 rounded-full" />
                {/* Inactive Segment 2 (Light Gray) */}
                <div className="h-1 sm:h-1.5 w-24 sm:w-32 bg-slate-300 rounded-full" />
              </div>
              <span className="text-xs font-bold text-slate-600 select-none">1/2</span>
            </div>
          </div>

          {/* Search Bar & "Clear all" Action Row */}
          <div className="flex items-center gap-3 my-5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#186470]/30 focus:border-[#186470] shadow-2xs transition-all"
              />
            </div>

            {/* Clear all button */}
            <button
              type="button"
              onClick={handleClearAll}
              disabled={selectedCount === 0 && !searchQuery}
              className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedCount > 0 || searchQuery
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  : "text-slate-400 cursor-not-allowed opacity-70"
              }`}
            >
              Clear all
            </button>
          </div>

          {/* ================================================================= */}
          {/* CHAPTERS SELECTION LIST AREA                                      */}
          {/* Kept empty / placeholder as requested: No fake chapters generated*/}
          {/* ================================================================= */}
          <div className="flex-1 flex flex-col">
            {availableChapters.length === 0 ? (
              /* Clean Placeholder State: Ready for real backend chapters */
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/70 p-10 sm:p-14 flex flex-col items-center justify-center text-center my-4 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#186470] mb-4 shadow-2xs">
                  <Inbox className="w-7 h-7" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  Chapter list ready for {currentSubject.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-5 leading-relaxed">
                  No chapters loaded yet. When Class 10 {currentSubject.name} syllabus data is connected from the backend, chapter cards with checkboxes will appear here.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span>Awaiting chapter catalog API</span>
                </div>
              </div>
            ) : filteredChapters.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 my-4">
                No chapters matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              /* Render chapter cards dynamically when real chapters are provided */
              <div className="space-y-3 my-2">
                {filteredChapters.map((chapter) => {
                  const isChecked = selectedChapterIds.has(chapter.id);
                  return (
                    <div
                      key={chapter.id}
                      onClick={() => handleToggleChapter(chapter.id)}
                      className={`rounded-2xl border p-4 sm:p-4.5 flex items-center justify-between gap-4 transition-all cursor-pointer select-none ${
                        isChecked
                          ? "border-teal-500 bg-teal-50/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Rounded Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isChecked
                              ? "bg-[#186470] border-[#186470] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-slate-800 truncate">
                          {chapter.title}
                        </span>
                      </div>

                      {/* Dropdown Chevron */}
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* BOTTOM ACTION BAR: NEXT BUTTON                                    */}
          {/* ================================================================= */}
          <div className="mt-8 pt-4 flex flex-col items-center justify-center">
            <button
              type="button"
              disabled={!canProceed || isGenerating}
              onClick={async () => {
                if (!canProceed || isGenerating) return;

                const selectedArray = Array.from(selectedChapterIds);

                if (onNextStep) {
                  onNextStep(selectedArray, selectedSubjectId);
                  return;
                }

                if (selectedArray.length === 1) {
                  const chapterId = selectedArray[0];
                  const chapterObj = availableChapters.find((c) => c.id === chapterId);
                  const title = chapterObj?.title || `${currentSubject.name} Chapter Test`;
                  router.push(
                    `/test?topic=${encodeURIComponent(chapterId)}&subject=${encodeURIComponent(
                      currentSubject.name
                    )}&title=${encodeURIComponent(title)}`
                  );
                } else {
                  setIsGenerating(true);
                  try {
                    const res = await apiClient.test.createCustomPractice({
                      subjectId: selectedSubjectId,
                      chapterIds: selectedArray,
                      questionCount: Math.min(10, Math.max(5, selectedArray.length * 2)),
                    });
                    router.push(
                      `/test?topic=${encodeURIComponent(res.quizId)}&subject=${encodeURIComponent(
                        res.subject
                      )}&title=${encodeURIComponent(res.title)}`
                    );
                  } catch (err) {
                    console.error("Failed to create custom practice:", err);
                    const firstId = selectedArray[0];
                    const chapterObj = availableChapters.find((c) => c.id === firstId);
                    router.push(
                      `/test?topic=${encodeURIComponent(firstId)}&subject=${encodeURIComponent(
                        currentSubject.name
                      )}&title=${encodeURIComponent(chapterObj?.title || "Custom Practice Test")}`
                    );
                  } finally {
                    setIsGenerating(false);
                  }
                }
              }}
              className={`w-full max-w-md py-3 px-8 rounded-full font-bold text-sm text-center transition-all select-none flex items-center justify-center gap-2 ${
                canProceed && !isGenerating
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md cursor-pointer active:scale-[0.99]"
                  : "bg-[#E6E6E6] text-slate-400 cursor-not-allowed"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Questions...</span>
                </>
              ) : (
                <span>Next</span>
              )}
            </button>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              {isGenerating
                ? "Generating custom test from selected chapters..."
                : canProceed
                ? `${selectedCount} chapter${selectedCount > 1 ? "s" : ""} selected &bull; Ready to proceed`
                : "Select at least 1 chapter to continue"}
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

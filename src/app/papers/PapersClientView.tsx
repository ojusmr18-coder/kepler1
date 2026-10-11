"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  History,
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  RotateCcw,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { PastExamPaper, PapersResponse } from "@/types/api";

// =========================================================================
// DATA CONTRACTS & CATEGORIES
// =========================================================================

export type PaperCategoryType = "sample" | "pyq";

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
}

export interface SubjectCategoryGroup {
  categoryName: string;
  subjects: SubjectItem[];
}

// 1. Academic Sessions (2020-21 to 2026-27)
export const ACADEMIC_YEARS = [
  { year: "2026-27", label: "Upcoming Session", tag: "Latest Blueprint" },
  { year: "2025-26", label: "Current Session", tag: "Board Batch" },
  { year: "2024-25", label: "Previous Session", tag: "Official Exam" },
  { year: "2023-24", label: "Past Exam Session", tag: "Official Exam" },
  { year: "2022-23", label: "Past Exam Session", tag: "Official Exam" },
  { year: "2021-22", label: "Term I & II Session", tag: "Special Format" },
  { year: "2020-21", label: "COVID Session", tag: "Assessment Series" }
] as const;

export type AcademicYear = (typeof ACADEMIC_YEARS)[number]["year"];

// 2. Class 10 Categorized Subjects
export const SUBJECT_CATEGORIES: SubjectCategoryGroup[] = [
  {
    categoryName: "Core Science",
    subjects: [
      { id: "science", name: "Science (Full Syllabus)", code: "086" },
      { id: "physics", name: "Physics", code: "PHYS-10" },
      { id: "chemistry", name: "Chemistry", code: "CHEM-10" },
      { id: "biology", name: "Biology", code: "BIO-10" }
    ]
  },
  {
    categoryName: "Mathematics",
    subjects: [
      { id: "maths-standard", name: "Mathematics (Standard)", code: "041" },
      { id: "maths-basic", name: "Mathematics (Basic)", code: "241" }
    ]
  },
  {
    categoryName: "Social Science",
    subjects: [
      { id: "sst", name: "Social Science (SST)", code: "087" }
    ]
  },
  {
    categoryName: "Languages",
    subjects: [
      { id: "english", name: "English Language & Literature", code: "184" },
      { id: "hindi-a", name: "Hindi Course A", code: "002" },
      { id: "hindi-b", name: "Hindi Course B", code: "085" },
      { id: "sanskrit", name: "Sanskrit", code: "122" }
    ]
  }
];

export function PapersClientView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query parameters to determine current wizard step
  const typeParam = searchParams.get("type") as PaperCategoryType | null;
  const subjectParam = searchParams.get("subject");
  const yearParam = searchParams.get("year");

  // Determine active step (1 to 4)
  const currentStep: 1 | 2 | 3 | 4 = React.useMemo(() => {
    if (!typeParam) return 1;
    if (!subjectParam) return 2;
    if (!yearParam) return 3;
    return 4;
  }, [typeParam, subjectParam, yearParam]);

  // Lookup active subject details
  const allSubjects = React.useMemo(() => {
    return SUBJECT_CATEGORIES.flatMap((c) => c.subjects);
  }, []);

  const activeSubject = React.useMemo(() => {
    if (!subjectParam) return null;
    return allSubjects.find((s) => s.id === subjectParam) || {
      id: subjectParam,
      name: subjectParam.toUpperCase(),
      code: "10"
    };
  }, [subjectParam, allSubjects]);

  // Step Navigation Handlers
  const handleSelectType = (type: PaperCategoryType) => {
    router.push(`/papers?type=${encodeURIComponent(type)}`);
  };

  const handleSelectSubject = (subjectId: string) => {
    if (!typeParam) return;
    router.push(`/papers?type=${encodeURIComponent(typeParam)}&subject=${encodeURIComponent(subjectId)}`);
  };

  const handleSelectYear = (year: string) => {
    if (!typeParam || !subjectParam) return;
    router.push(
      `/papers?type=${encodeURIComponent(typeParam)}&subject=${encodeURIComponent(subjectParam)}&year=${encodeURIComponent(year)}`
    );
  };

  const handleBackToStep = (targetStep: 1 | 2 | 3) => {
    if (targetStep === 1) {
      router.push("/papers");
    } else if (targetStep === 2 && typeParam) {
      router.push(`/papers?type=${encodeURIComponent(typeParam)}`);
    } else if (targetStep === 3 && typeParam && subjectParam) {
      router.push(`/papers?type=${encodeURIComponent(typeParam)}&subject=${encodeURIComponent(subjectParam)}`);
    }
  };

  // =========================================================================
  // [BACKEND INTEGRATION POINT 1: Papers Data & Fetch State]
  // =========================================================================
  // When Step 4 is reached, papers will be fetched from the backend.
  // Kept strictly empty by default (0 fake records) as required.
  const [papers, setPapers] = React.useState<PastExamPaper[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentStep !== 4 || !typeParam || !subjectParam || !yearParam) {
      setPapers([]);
      return;
    }

    /* =======================================================================
     * [BACKEND INTEGRATION POINT 2: API Request Handler]
     * 
     * Endpoint: GET /api/papers?type=${typeParam}&subject=${subjectParam}&year=${yearParam}
     * Contract: { "papers": PastExamPaper[] } (see src/types/api.ts)
     * ======================================================================= */
    const fetchPapersFromBackend = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const queryParams = new URLSearchParams({
          type: typeParam,
          subject: subjectParam,
          year: yearParam
        });

        const response = await fetch(`/api/papers?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch papers`);
        }
        const data: PapersResponse = await response.json();
        setPapers(data.papers || []);
      } catch (err) {
        console.error("Failed to fetch papers:", err);
        setApiError(err instanceof Error ? err.message : "Failed to load papers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapersFromBackend();
  }, [currentStep, typeParam, subjectParam, yearParam]);

  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-800 flex flex-col p-4 sm:p-6 lg:p-8 pl-16 sm:pl-20 lg:pl-24 antialiased select-none">
      
      {/* 1. TOP BREADCRUMB & BACK NAVIGATION */}
      <div className="w-full max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        {currentStep === 1 ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Classroom Dashboard</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => handleBackToStep((currentStep - 1) as 1 | 2 | 3)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {currentStep === 2 && "Back to Paper Type"}
              {currentStep === 3 && "Back to Subject Selection"}
              {currentStep === 4 && "Back to Year Selection"}
            </span>
          </button>
        )}

        {/* Curriculum Pill */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
          <span>Class 10 CBSE &bull; NCERT</span>
        </div>
      </div>

      {/* 2. MAIN WIZARD CONTAINER */}
      <main className="w-full max-w-5xl mx-auto py-2">
        <div className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-10 lg:p-12">

          {/* PROGRESS STEPPER HEADER */}
          <div className="mb-8 pb-6 border-b border-slate-100">
            {/* Step badges */}
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="text-slate-900">Step {currentStep} of 4</span>
              <span>&bull;</span>
              <span>
                {currentStep === 1 && "Select Category"}
                {currentStep === 2 && "Select Subject"}
                {currentStep === 3 && "Select Session Year"}
                {currentStep === 4 && "Available PDFs"}
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-slate-900 transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>

            {/* Interactive Breadcrumb Trail for Previous Steps */}
            {currentStep > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-4 text-xs font-medium text-slate-500">
                <button
                  type="button"
                  onClick={() => handleBackToStep(1)}
                  className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  {typeParam === "sample" ? "Sample Paper" : "PYQ"}
                </button>

                {currentStep >= 3 && activeSubject && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <button
                      type="button"
                      onClick={() => handleBackToStep(2)}
                      className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                    >
                      {activeSubject.name}
                    </button>
                  </>
                )}

                {currentStep >= 4 && yearParam && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <button
                      type="button"
                      onClick={() => handleBackToStep(3)}
                      className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                    >
                      {yearParam}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: ONLY TWO OPTIONS (SAMPLE PAPER & PYQ)                             */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="animate-in fade-in duration-200">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <FileCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Papers Repository</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Choose Paper Category
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Select whether you would like to explore model Sample Question Papers or authentic Previous Year Board Exam Papers (PYQs).
                </p>
              </div>

              {/* TWO MAIN BOX-STYLE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
                
                {/* Option 1: Sample Paper */}
                <div
                  onClick={() => handleSelectType("sample")}
                  className="p-7 sm:p-8 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-400/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all mb-6 shadow-2xs">
                      <Sparkles className="w-7 h-7" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-slate-950 transition-colors">
                      Sample Paper
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                      Official board pattern model papers, blueprint question formats, marking schemes, and expert exemplar test papers.
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 group-hover:text-slate-900">
                    <span>Explore Sample Papers</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Option 2: PYQ */}
                <div
                  onClick={() => handleSelectType("pyq")}
                  className="p-7 sm:p-8 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-400/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all mb-6 shadow-2xs">
                      <History className="w-7 h-7" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-slate-950 transition-colors">
                      PYQ (Previous Year Questions)
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                      Authentic previous year board exam papers, session sets, compartment exam papers, and official step-by-step solutions.
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 group-hover:text-slate-900">
                    <span>Explore Past Year Papers</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: CATEGORIZED SUBJECT SELECTION                                     */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-200">
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span>{typeParam === "sample" ? "Sample Paper" : "Previous Year Questions"}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Select Subject
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Choose a subject to filter available {typeParam === "sample" ? "sample papers" : "past year questions"}.
                </p>
              </div>

              {/* Categorized Subjects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {SUBJECT_CATEGORIES.map((catGroup) => (
                  <div
                    key={catGroup.categoryName}
                    className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/90 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        {catGroup.categoryName}
                      </div>

                      <div className="space-y-2.5">
                        {catGroup.subjects.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => handleSelectSubject(sub.id)}
                            className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200/80 hover:border-slate-900 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                          >
                            <span className="text-xs sm:text-sm font-semibold truncate pr-2">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300 shrink-0">
                              {sub.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: ACADEMIC YEAR SELECTION (2020-21 TO 2026-27)                       */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="animate-in fade-in duration-200">
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span>{typeParam === "sample" ? "Sample Paper" : "PYQ"} &bull; {activeSubject?.name}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Select Academic Year
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Choose an academic examination session from 2020-21 to 2026-27.
                </p>
              </div>

              {/* Grid of Year Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {ACADEMIC_YEARS.map((session) => (
                  <div
                    key={session.year}
                    onClick={() => handleSelectYear(session.year)}
                    className="p-5 sm:p-6 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-slate-400/90 shadow-2xs hover:shadow-sm transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-slate-950">
                          {session.year}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {session.label} &bull; {session.tag}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: AVAILABLE PAPERS / PDFS VIEW (WITH BACKEND INTEGRATION CONTRACT)  */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="animate-in fade-in duration-200">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <span>{typeParam === "sample" ? "Sample Paper" : "PYQ"}</span>
                    <span>&bull;</span>
                    <span>{activeSubject?.name}</span>
                    <span>&bull;</span>
                    <span>Session {yearParam}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Available Papers &amp; Solutions
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Download official question papers and marking rubrics for offline preparation.
                  </p>
                </div>

                {/* Reset / Start Over */}
                <button
                  type="button"
                  onClick={() => handleBackToStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Change Selection</span>
                </button>
              </div>

              {/* Error Message if API fails */}
              {apiError && (
                <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-3" />
                  <span className="text-xs font-semibold text-slate-600">
                    Querying papers repository for {yearParam}...
                  </span>
                </div>
              )}

              {/* Empty State Layout (No fake papers generated) */}
              {!isLoading && papers.length === 0 && (
                <div className="w-full rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-10 sm:p-14 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs mb-4">
                    <FileText className="w-7 h-7 text-slate-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                    No Papers Uploaded Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
                    There are currently no uploaded {typeParam === "sample" ? "sample papers" : "previous year question papers"} for{" "}
                    <strong className="text-slate-800">{activeSubject?.name}</strong> in academic session{" "}
                    <strong className="text-slate-800">{yearParam}</strong>.
                  </p>

                  {/* Backend Integration Contract Hint */}
                  <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-500 font-mono text-left max-w-lg shadow-2xs">
                    <div className="font-bold text-slate-700 mb-1 font-sans">
                      Backend Integration Point:
                    </div>
                    <div>
                      <code>GET /api/papers?type={typeParam}&amp;subject={subjectParam}&amp;year={yearParam}</code>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================================== */}
              {/* [BACKEND INTEGRATION POINT 3: Papers Grid Render Template]            */}
              {/* This grid renders automatically when the backend populates `papers`.  */}
              {/* ===================================================================== */}
              {!isLoading && papers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {papers.map((paper) => (
                    <div
                      key={paper.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
                          <span>{paper.exam}</span>
                          <span>{paper.year}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {paper.title}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>

                        {paper.solutionUrl && (
                          <a
                            href={paper.solutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Marking Scheme</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

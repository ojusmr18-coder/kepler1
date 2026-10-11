"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  FileText,
  Download,
  Eye,
  X,
  ChevronRight,
  BookOpen,
  Calendar,
  Search,
  ExternalLink,
  Clock,
  Inbox
} from "lucide-react";
import { FloatingTaskbar } from "@/components/FloatingTaskbar";
import { apiClient } from "@/services/apiClient";
import { SubjectItem, SubjectChapter } from "@/types/api";

// CBSE Class 10 Subjects Definition
interface SubjectMeta {
  id: string;
  title: string;
  code: string;
  classLevel: string;
  description: string;
  chapterCount: number;
  icon: React.ComponentType<{ className?: string }>;
}

const CLASS_10_SUBJECTS: SubjectMeta[] = [
  {
    id: "physics",
    title: "Physics",
    code: "PHYS-10",
    classLevel: "Class 10 CBSE",
    description: "Light, Electricity, Magnetic Effects, and Sources of Energy.",
    chapterCount: 5,
    icon: Atom,
  },
  {
    id: "chemistry",
    title: "Chemistry",
    code: "CHEM-10",
    classLevel: "Class 10 CBSE",
    description: "Chemical Reactions, Acids & Bases, Metals, and Carbon Compounds.",
    chapterCount: 5,
    icon: FlaskConical,
  },
  {
    id: "biology",
    title: "Biology",
    code: "BIO-10",
    classLevel: "Class 10 CBSE",
    description: "Life Processes, Control & Coordination, Reproduction, and Heredity.",
    chapterCount: 4,
    icon: Dna,
  },
  {
    id: "mathematics",
    title: "Mathematics",
    code: "MATH-10",
    classLevel: "Class 10 CBSE",
    description: "Real Numbers, Polynomials, Linear Equations, Trigonometry, and Geometry.",
    chapterCount: 14,
    icon: Calculator,
  },
];

interface PdfResource {
  id: string;
  title: string;
  filename: string;
  chapterId?: string;
  chapterTitle?: string;
  subject: string;
  pdfUrl: string;
  fileSizeBytes?: number;
  uploadedAt?: string;
}

export function RevisionNotesClientView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read selected subject from query string (e.g. ?subject=physics)
  const subjectParam = searchParams.get("subject");
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string | null>(subjectParam || null);

  // Synchronize state when URL param changes
  React.useEffect(() => {
    setSelectedSubjectId(subjectParam || null);
  }, [subjectParam]);

  // Lessons/Chapters state for the selected subject
  const [chapters, setChapters] = React.useState<SubjectChapter[]>([]);
  const [uploadedPdfs, setUploadedPdfs] = React.useState<PdfResource[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Modal state for viewing a specific PDF
  const [activePdfModal, setActivePdfModal] = React.useState<PdfResource | null>(null);

  // Fetch chapters & uploaded PDFs when a subject is selected
  React.useEffect(() => {
    if (!selectedSubjectId) {
      setChapters([]);
      setUploadedPdfs([]);
      return;
    }

    let isMounted = true;
    async function loadSubjectData() {
      setIsLoadingChapters(true);
      try {
        // 1. Fetch curriculum chapters for this subject
        const chaptersRes = await apiClient.learn.getChapters(selectedSubjectId!).catch(() => null);
        
        // 2. Fetch any real teacher-uploaded Revision Notes PDFs
        const currentSubMeta = CLASS_10_SUBJECTS.find((s) => s.id === selectedSubjectId);
        const subName = currentSubMeta?.title || (selectedSubjectId ? selectedSubjectId : undefined);
        const uploadsRes = await apiClient.teacher
          .getUploads({ subject: subName, type: "Revision Notes" })
          .catch(() => null);

        if (isMounted) {
          if (chaptersRes?.chapters) {
            setChapters(chaptersRes.chapters);
          } else {
            setChapters([]);
          }

          if (uploadsRes?.uploads) {
            const mappedPdfs: PdfResource[] = uploadsRes.uploads
              .filter((u) => u.type === "Revision Notes" || u.type === "Study Material")
              .map((u) => ({
                id: u.id,
                title: u.title,
                filename: u.filename,
                chapterId: u.chapterId,
                chapterTitle: u.chapterTitle,
                subject: u.subject,
                pdfUrl: u.pdfUrl,
                fileSizeBytes: u.fileSizeBytes,
                uploadedAt: u.uploadedAt,
              }));
            setUploadedPdfs(mappedPdfs);
          } else {
            setUploadedPdfs([]);
          }
        }
      } catch (err) {
        console.warn("Failed to load subject chapters or PDFs:", err);
      } finally {
        if (isMounted) {
          setIsLoadingChapters(false);
        }
      }
    }

    loadSubjectData();
    return () => {
      isMounted = false;
    };
  }, [selectedSubjectId]);

  // Handle subject selection
  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    router.push(`/revision-notes?subject=${encodeURIComponent(subjectId)}`);
  };

  // Handle returning to subject list
  const handleBackToSubjects = () => {
    setSelectedSubjectId(null);
    router.push("/revision-notes");
  };

  const currentSubjectMeta = CLASS_10_SUBJECTS.find((s) => s.id === selectedSubjectId);

  // Filter lessons by search query
  const filteredChapters = chapters.filter((ch) =>
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ch.description && ch.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col pb-28">
      {/* ===================================================================== */}
      {/* TOP HEADER NAVIGATION (Base Color Palette: Dark Slate & White)        */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedSubjectId ? (
              <button
                type="button"
                onClick={handleBackToSubjects}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>All Subjects</span>
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>Dashboard</span>
              </Link>
            )}

            <div className="h-4 w-px bg-slate-200" />

            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="hidden sm:inline">Kepler</span>
              <span className="hidden sm:inline">&gt;</span>
              <span
                onClick={handleBackToSubjects}
                className={selectedSubjectId ? "cursor-pointer hover:text-slate-900 underline" : "text-slate-900 font-semibold"}
              >
                Revision Notes
              </span>
              {currentSubjectMeta && (
                <>
                  <span>&gt;</span>
                  <span className="text-slate-900 font-semibold">{currentSubjectMeta.title}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
              CBSE Class 10
            </span>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN VIEW CONTAINER                                                   */}
      {/* ===================================================================== */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-8 flex-1">
        
        {/* =================================================================== */}
        {/* VIEW 1: SUBJECT LIST PAGE (When no subject is chosen)               */}
        {/* =================================================================== */}
        {!selectedSubjectId && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header Title Section */}
            <div className="border-b border-slate-200/90 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-3">
                <FileText className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Curriculum Revision Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Revision Notes
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Select a subject below to view verified lesson revision notes and lesson PDF documents for CBSE Class 10.
              </p>
            </div>

            {/* Subject Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CLASS_10_SUBJECTS.map((subject) => {
                const IconComponent = subject.icon;
                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSelectSubject(subject.id)}
                    className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Subject Icon Box */}
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-xs">
                        <IconComponent className="w-6 h-6 text-[#2DD4BF]" />
                      </div>

                      {/* Subject Identifiers */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {subject.code}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {subject.chapterCount} Lessons
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                        {subject.title}
                      </h2>

                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {subject.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-slate-950">
                      <span>View Lesson PDFs</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: LESSON PDF VIEW PAGE (After a subject is selected)          */}
        {/* =================================================================== */}
        {selectedSubjectId && currentSubjectMeta && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Subject Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  {React.createElement(currentSubjectMeta.icon, {
                    className: "w-7 h-7 text-[#2DD4BF]",
                  })}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {currentSubjectMeta.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {currentSubjectMeta.classLevel}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {currentSubjectMeta.title} &bull; Lesson Revision Notes
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentSubjectMeta.description}
                  </p>
                </div>
              </div>

              {/* Search lessons filter */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            {/* Lessons and PDFs List */}
            {isLoadingChapters ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
                <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-[#0D9488]" />
                <p className="mt-3 text-xs text-slate-500 font-medium">
                  Loading lesson documents...
                </p>
              </div>
            ) : filteredChapters.length === 0 ? (
              /* Completely Empty State (No lessons found or no content) */
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No Lessons Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No lessons match your search query. Try clearing the search term.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredChapters.map((chapter) => {
                  // Find any real uploaded PDF matching this lesson/chapter
                  const matchedPdf = uploadedPdfs.find(
                    (p) =>
                      (chapter.topicId && p.chapterId === chapter.topicId) ||
                      (p.chapterTitle && p.chapterTitle.toLowerCase().includes(chapter.title.toLowerCase())) ||
                      (p.title && p.title.toLowerCase().includes(chapter.title.toLowerCase()))
                  );

                  return (
                    <div
                      key={chapter.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Lesson Header Information */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Lesson {chapter.number}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {chapter.durationMinutes} min read
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900">
                            {chapter.title}
                          </h3>
                          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                            {chapter.description}
                          </p>
                        </div>

                        {/* PDF Document Status & Actions */}
                        <div className="shrink-0 flex items-center gap-2.5">
                          {matchedPdf ? (
                            /* Real Uploaded PDF Available */
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActivePdfModal(matchedPdf)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#2DD4BF]" />
                                <span>View PDF</span>
                              </button>

                              <a
                                href={matchedPdf.pdfUrl}
                                download={matchedPdf.filename}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Download</span>
                              </a>
                            </div>
                          ) : (
                            /* REQUIREMENT 3: No fake or placeholder content. Empty state ready for uploaded PDF */
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-slate-500 text-xs">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium">Ready for uploaded PDF</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Display metadata if an uploaded PDF exists for this lesson */}
                      {matchedPdf && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span className="font-mono text-slate-700 font-medium">
                            📄 {matchedPdf.filename}
                          </span>
                          {matchedPdf.fileSizeBytes && (
                            <span>
                              &bull; {(matchedPdf.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          )}
                          {matchedPdf.uploadedAt && (
                            <span>
                              &bull; Uploaded {matchedPdf.uploadedAt}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* 4. PDF VIEW POPUP / MODAL (Clean Base Palette: Dark Slate & White)    */}
      {/* ===================================================================== */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[#2DD4BF]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md sm:max-w-lg">
                    {activePdfModal.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    {activePdfModal.subject} &bull; {activePdfModal.filename}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activePdfModal.pdfUrl}
                  download={activePdfModal.filename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <a
                  href={activePdfModal.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full Window</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close PDF Viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal PDF Viewport */}
            <div className="flex-1 w-full h-full bg-slate-100 relative">
              <iframe
                src={`${activePdfModal.pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-none"
                title={activePdfModal.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Taskbar */}
      <FloatingTaskbar />
    </div>
  );
}

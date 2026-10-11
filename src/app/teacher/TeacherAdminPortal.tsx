"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  FileText,
  Award,
  BarChart3,
  ShieldCheck,
  Calendar,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  X,
  ChevronRight,
  Star,
  BookOpen,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import {
  TeacherStudentSummary,
  TeacherStudentDetail,
  TeacherPdfUpload,
  TeacherRankingItem,
  TeacherClassAnalytics,
  TeacherPdfCategory,
  CalendarEvent,
} from "@/types/api";

type TabKey = "students" | "uploads" | "ranking" | "analytics" | "schedule" | "export";

export function TeacherAdminPortal() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("students");

  // ---------------------------------------------------------------------------
  // 1. Students & Tracking State
  // ---------------------------------------------------------------------------
  const [students, setStudents] = React.useState<TeacherStudentSummary[]>([]);
  const [studentStats, setStudentStats] = React.useState({
    totalStudents: 10,
    classAverageScore: 81,
    activeTodayCount: 6,
    needsAttentionCount: 2,
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSection, setSelectedSection] = React.useState<string>("all");
  const [selectedBand, setSelectedBand] = React.useState<string>("all");
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(true);

  // Student Inspector Modal State
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);
  const [studentDetail, setStudentDetail] = React.useState<TeacherStudentDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);
  const [detailRemarks, setDetailRemarks] = React.useState("");
  const [detailRank, setDetailRank] = React.useState<number>(10);
  const [isSavingRemarks, setIsSavingRemarks] = React.useState(false);
  const [remarksSaveSuccess, setRemarksSaveSuccess] = React.useState(false);

  // ---------------------------------------------------------------------------
  // 2. PDF Resource Hub State
  // ---------------------------------------------------------------------------
  const [uploads, setUploads] = React.useState<TeacherPdfUpload[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = React.useState(false);
  const [uploadCategoryFilter, setUploadCategoryFilter] = React.useState<string>("all");
  const [uploadSubjectFilter, setUploadSubjectFilter] = React.useState<string>("all");
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [newDocTitle, setNewDocTitle] = React.useState("");
  const [newDocSubject, setNewDocSubject] = React.useState("Physics");
  const [newDocChapter, setNewDocChapter] = React.useState("");
  const [newDocType, setNewDocType] = React.useState<TeacherPdfCategory>("Study Material");
  const [newDocYear, setNewDocYear] = React.useState("2025-26");
  const [newDocDesc, setNewDocDesc] = React.useState("");
  const [isSubmittingUpload, setIsSubmittingUpload] = React.useState(false);

  // ---------------------------------------------------------------------------
  // 3. Student Ranking State
  // ---------------------------------------------------------------------------
  const [rankings, setRankings] = React.useState<TeacherRankingItem[]>([]);
  const [rankingSubject, setRankingSubject] = React.useState<string>("all");
  const [isLoadingRankings, setIsLoadingRankings] = React.useState(false);
  const [rankingEdits, setRankingEdits] = React.useState<
    Record<string, { rank: number; remarks: string; isSaving?: boolean; saved?: boolean }>
  >({});

  // ---------------------------------------------------------------------------
  // 4. Analytics State
  // ---------------------------------------------------------------------------
  const [analytics, setAnalytics] = React.useState<TeacherClassAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = React.useState(false);

  // ---------------------------------------------------------------------------
  // 5. Test Scheduler State
  // ---------------------------------------------------------------------------
  const [scheduledTests, setScheduledTests] = React.useState<CalendarEvent[]>([]);
  const [isLoadingTests, setIsLoadingTests] = React.useState(false);
  const [testTitle, setTestTitle] = React.useState("");
  const [testSubject, setTestSubject] = React.useState("Physics");
  const [testDate, setTestDate] = React.useState("2026-10-18T10:00");
  const [testDuration, setTestDuration] = React.useState(45);
  const [testQuestions, setTestQuestions] = React.useState(20);
  const [testSection, setTestSection] = React.useState("10A");
  const [isSubmittingTest, setIsSubmittingTest] = React.useState(false);
  const [testSubmitSuccess, setTestSubmitSuccess] = React.useState(false);

  // ---------------------------------------------------------------------------
  // Data Loaders
  // ---------------------------------------------------------------------------
  const loadStudents = React.useCallback(async () => {
    setIsLoadingStudents(true);
    try {
      const res = await apiClient.teacher.getStudents({
        class: selectedSection !== "all" ? selectedSection : undefined,
        performance: selectedBand !== "all" ? selectedBand : undefined,
        search: searchQuery.trim() || undefined,
      });
      setStudents(res.students || []);
      setStudentStats({
        totalStudents: res.totalStudents,
        classAverageScore: res.classAverageScore,
        activeTodayCount: res.activeTodayCount,
        needsAttentionCount: res.needsAttentionCount,
      });
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setIsLoadingStudents(false);
    }
  }, [selectedSection, selectedBand, searchQuery]);

  const loadUploads = React.useCallback(async () => {
    setIsLoadingUploads(true);
    try {
      const res = await apiClient.teacher.getUploads({
        subject: uploadSubjectFilter !== "all" ? uploadSubjectFilter : undefined,
        type: uploadCategoryFilter !== "all" ? uploadCategoryFilter : undefined,
      });
      setUploads(res.uploads || []);
    } catch (err) {
      console.error("Failed to load uploads:", err);
    } finally {
      setIsLoadingUploads(false);
    }
  }, [uploadSubjectFilter, uploadCategoryFilter]);

  const loadRankings = React.useCallback(async () => {
    setIsLoadingRankings(true);
    try {
      const res = await apiClient.teacher.getRankings(rankingSubject);
      setRankings(res.rankings || []);
      const edits: Record<string, { rank: number; remarks: string }> = {};
      (res.rankings || []).forEach((r) => {
        edits[r.studentId] = {
          rank: r.teacherRankOutOf10,
          remarks: r.teacherRemarks || "",
        };
      });
      setRankingEdits(edits);
    } catch (err) {
      console.error("Failed to load rankings:", err);
    } finally {
      setIsLoadingRankings(false);
    }
  }, [rankingSubject]);

  const loadAnalytics = React.useCallback(async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await apiClient.teacher.getAnalytics();
      setAnalytics(res);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  const loadTests = React.useCallback(async () => {
    setIsLoadingTests(true);
    try {
      const res = await apiClient.teacher.getScheduledTests();
      setScheduledTests(res.events || []);
    } catch (err) {
      console.error("Failed to load tests:", err);
    } finally {
      setIsLoadingTests(false);
    }
  }, []);

  // Initial & Tab-based fetches
  React.useEffect(() => {
    if (activeTab === "students") loadStudents();
    else if (activeTab === "uploads") loadUploads();
    else if (activeTab === "ranking") loadRankings();
    else if (activeTab === "analytics") loadAnalytics();
    else if (activeTab === "schedule") loadTests();
  }, [activeTab, loadStudents, loadUploads, loadRankings, loadAnalytics, loadTests]);

  // Handle Inspecting a Student
  const handleInspectStudent = async (id: string) => {
    setSelectedStudentId(id);
    setIsLoadingDetail(true);
    setRemarksSaveSuccess(false);
    try {
      const detail = await apiClient.teacher.getStudentDetail(id);
      setStudentDetail(detail);
      setDetailRemarks(detail.teacherRemarks || "");
      setDetailRank(detail.teacherRankOutOf10 || 10);
    } catch (err) {
      console.error("Failed to load student detail:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleSaveStudentRemarks = async () => {
    if (!selectedStudentId) return;
    setIsSavingRemarks(true);
    try {
      await apiClient.teacher.updateStudentRemarks(
        selectedStudentId,
        detailRemarks,
        detailRank
      );
      setRemarksSaveSuccess(true);
      loadStudents();
      setTimeout(() => setRemarksSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save remarks:", err);
    } finally {
      setIsSavingRemarks(false);
    }
  };

  // Handle PDF Upload Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    setIsSubmittingUpload(true);
    try {
      await apiClient.teacher.uploadPdf({
        title: newDocTitle.trim(),
        subject: newDocSubject,
        chapterTitle: newDocChapter.trim() || undefined,
        type: newDocType,
        academicYear: newDocYear,
        description: newDocDesc.trim() || undefined,
      });
      setShowUploadModal(false);
      setNewDocTitle("");
      setNewDocChapter("");
      setNewDocDesc("");
      loadUploads();
    } catch (err) {
      console.error("Failed to upload document:", err);
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  // Handle Delete Upload
  const handleDeleteUpload = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource? It will also be removed from the student view.")) return;
    try {
      await apiClient.teacher.deleteUpload(id);
      loadUploads();
    } catch (err) {
      console.error("Failed to delete upload:", err);
    }
  };

  // Handle Save Ranking Row
  const handleSaveRankingRow = async (studentId: string) => {
    const edit = rankingEdits[studentId];
    if (!edit) return;
    setRankingEdits((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], isSaving: true },
    }));
    try {
      await apiClient.teacher.updateRanking(studentId, edit.rank, edit.remarks);
      setRankingEdits((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], isSaving: false, saved: true },
      }));
      setTimeout(() => {
        setRankingEdits((prev) => ({
          ...prev,
          [studentId]: { ...prev[studentId], saved: false },
        }));
      }, 2500);
    } catch (err) {
      console.error("Failed to update ranking:", err);
      setRankingEdits((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], isSaving: false },
      }));
    }
  };

  // Handle Schedule Test Submit
  const handleScheduleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim()) return;
    setIsSubmittingTest(true);
    setTestSubmitSuccess(false);
    try {
      await apiClient.teacher.scheduleTest({
        title: testTitle.trim(),
        subject: testSubject,
        scheduledDate: testDate,
        durationMinutes: Number(testDuration),
        questionsCount: Number(testQuestions),
        section: testSection,
      });
      setTestSubmitSuccess(true);
      setTestTitle("");
      loadTests();
      setTimeout(() => setTestSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to schedule test:", err);
    } finally {
      setIsSubmittingTest(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* =========================================================================
          TOP NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80 px-6 sm:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Return to Student Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Educator Portal
                </span>
                <span className="text-xs text-slate-400 font-medium">CBSE Class 10 Console</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Teacher Admin Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Instructor: Dr. Verma</span>
            </span>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700"
            >
              Exit to App
            </Link>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: "students", label: "Student Tracking", icon: Users },
            { key: "uploads", label: "PDF Resource Hub", icon: FileText },
            { key: "ranking", label: "Student Ranking (1–10)", icon: Award },
            { key: "analytics", label: "Class Analytics", icon: BarChart3 },
            { key: "schedule", label: "Schedule & Tests", icon: Calendar },
            { key: "export", label: "Export Data", icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE BODY
          ========================================================================= */}
      <main className="max-w-7xl mx-auto p-6 sm:p-10">
        {/* =====================================================================
            TAB 1: STUDENT TRACKING DASHBOARD & INSPECTOR
            ===================================================================== */}
        {activeTab === "students" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{studentStats.totalStudents}</span>
                <span className="text-[11px] text-slate-500">Sections 10A & 10B</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-400">Class Average</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">{studentStats.classAverageScore}%</span>
                <span className="text-[11px] text-emerald-500/80">Across all 4 core subjects</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-400">Active Today</span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-400">{studentStats.activeTodayCount}</span>
                <span className="text-[11px] text-slate-500">Logged in last 24h</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-400">Needs Attention</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400">{studentStats.needsAttentionCount}</span>
                <span className="text-[11px] text-amber-500/80">Below 70% threshold</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Section:</span>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Sections</option>
                    <option value="10A">Section 10A</option>
                    <option value="10B">Section 10B</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Band:</span>
                  <select
                    value={selectedBand}
                    onChange={(e) => setSelectedBand(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Bands</option>
                    <option value="high">High Performers (85%+)</option>
                    <option value="average">On Track (70-84%)</option>
                    <option value="lagging">Lagging (&lt;70%)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={loadStudents}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStudents ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-4 py-4">ID</th>
                      <th className="px-4 py-4">Section</th>
                      <th className="px-4 py-4">Overall Score</th>
                      <th className="px-4 py-4">Tasks</th>
                      <th className="px-4 py-4">Booster</th>
                      <th className="px-4 py-4">Attendance</th>
                      <th className="px-4 py-4">Teacher Rank</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {isLoadingStudents ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                          Loading students data...
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                          No students matched your search criteria.
                        </td>
                      </tr>
                    ) : (
                      students.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{st.name}</div>
                            <div className="text-xs text-slate-400">{st.email}</div>
                          </td>
                          <td className="px-4 py-4 font-mono text-xs text-slate-300">{st.id}</td>
                          <td className="px-4 py-4 font-semibold text-slate-300">{st.section}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                st.overallScorePercentage >= 85
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : st.overallScorePercentage >= 70
                                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {st.overallScorePercentage}%
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-300">
                            {st.tasksCompleted} / {st.totalAssignedTasks}
                          </td>
                          <td className="px-4 py-4 text-xs font-mono text-indigo-300">
                            {st.scoreBoosterMarks} / {st.scoreBoosterGoal}
                          </td>
                          <td className="px-4 py-4 text-xs font-semibold text-slate-300">
                            {st.attendancePercentage}%
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-400 text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {st.teacherRankOutOf10}/10
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleInspectStudent(st.id)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: PDF RESOURCE HUB & DATABASE
            ===================================================================== */}
        {activeTab === "uploads" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div>
                <h2 className="text-lg font-bold text-white">Curriculum PDF Hub</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded resources automatically sync to the student library and revision notes.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Resource</span>
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {["all", "Study Material", "Revision Notes", "Sample Paper", "PYQ"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setUploadCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    uploadCategoryFilter === cat
                      ? "bg-slate-200 text-slate-900"
                      : "bg-slate-800/60 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "All Types" : cat}
                </button>
              ))}
            </div>

            {/* Uploads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoadingUploads ? (
                <div className="col-span-full py-12 text-center text-slate-400">
                  Loading PDF catalog...
                </div>
              ) : uploads.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400">
                  No resources uploaded under this filter.
                </div>
              ) : (
                uploads.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {doc.subject}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {doc.academicYear}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-2.5 leading-snug">
                        {doc.title}
                      </h3>
                      {doc.chapterTitle && (
                        <p className="text-xs text-slate-400 mt-1">
                          Chapter: {doc.chapterTitle}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-mono">
                          {doc.type}
                        </span>
                        <span>•</span>
                        <span>{(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{doc.downloadCount} views</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-700/60">
                      <a
                        href={doc.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View / Download</span>
                      </a>
                      <button
                        onClick={() => handleDeleteUpload(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: STUDENT RANKING (1–10 SCALE)
            ===================================================================== */}
        {activeTab === "ranking" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div>
                <h2 className="text-lg font-bold text-white">Student Leaderboard & Ranking</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust student ratings out of 10 and add personalized instructor remarks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Subject Filter:</span>
                <select
                  value={rankingSubject}
                  onChange={(e) => setRankingSubject(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Subjects Aggregate</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>
            </div>

            {/* Ranking Table */}
            <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-4 py-4">Auto Score</th>
                      <th className="px-4 py-4">Accuracy</th>
                      <th className="px-6 py-4">Teacher Rank (/10)</th>
                      <th className="px-6 py-4">Remarks</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {isLoadingRankings ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          Calculating student rankings...
                        </td>
                      </tr>
                    ) : rankings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          No ranking entries available.
                        </td>
                      </tr>
                    ) : (
                      rankings.map((r, idx) => {
                        const edit = rankingEdits[r.studentId] || {
                          rank: r.teacherRankOutOf10,
                          remarks: r.teacherRemarks || "",
                        };
                        return (
                          <tr key={r.studentId} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <span
                                className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                  idx === 0
                                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                                    : idx === 1
                                    ? "bg-slate-300 text-slate-950"
                                    : idx === 2
                                    ? "bg-amber-700 text-white"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {r.autoRank}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-white">{r.studentName}</div>
                              <div className="text-xs text-slate-400">Section {r.section}</div>
                            </td>
                            <td className="px-4 py-4 font-bold text-emerald-400">
                              {r.overallScorePercentage}%
                            </td>
                            <td className="px-4 py-4 font-semibold text-slate-300">
                              {r.quizAccuracy}%
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  step={0.5}
                                  value={edit.rank}
                                  onChange={(e) =>
                                    setRankingEdits((prev) => ({
                                      ...prev,
                                      [r.studentId]: {
                                        ...prev[r.studentId],
                                        rank: parseFloat(e.target.value) || 0,
                                      },
                                    }))
                                  }
                                  className="w-16 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center font-bold text-amber-400 text-sm focus:outline-none focus:border-indigo-500"
                                />
                                <span className="text-xs text-slate-500">/ 10</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={edit.remarks}
                                placeholder="Add teacher remarks..."
                                onChange={(e) =>
                                  setRankingEdits((prev) => ({
                                    ...prev,
                                    [r.studentId]: {
                                      ...prev[r.studentId],
                                      remarks: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full min-w-[200px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleSaveRankingRow(r.studentId)}
                                disabled={edit.isSaving}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                  edit.saved
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                                }`}
                              >
                                {edit.isSaving ? "Saving..." : edit.saved ? "Saved ✓" : "Save"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: CLASS ANALYTICS & WEAK TOPICS
            ===================================================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {isLoadingAnalytics || !analytics ? (
              <div className="py-12 text-center text-slate-400">Loading class analytics...</div>
            ) : (
              <>
                {/* Analytics Overview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-400">Class Avg Score</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                      {analytics.overview.classAverageScore}%
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-400">Chapter Completion</span>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">
                      {analytics.overview.chapterCompletionRate}%
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-400">Task Completion</span>
                    <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">
                      {analytics.overview.taskCompletionRate}%
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-400">Daily Active Rate</span>
                    <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">
                      {analytics.overview.activeStudentsRate}%
                    </div>
                  </div>
                </div>

                {/* Subject Performance Meters */}
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-4">
                  <h3 className="text-base font-bold text-white">Subject Accuracy Velocity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analytics.subjectStats.map((sub) => (
                      <div
                        key={sub.subject}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{sub.subject}</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {sub.averageScorePercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-2 rounded-full transition-all"
                            style={{ width: `${sub.averageScorePercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                          <span>{sub.totalQuizzesTaken} Quizzes</span>
                          <span>{sub.completionRatePercentage}% Done</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Topics Matrix */}
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">
                      Identified Weak Topics (&lt;65% Accuracy)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.weakTopics.map((wt) => (
                      <div
                        key={wt.topicId}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="text-xs font-semibold text-indigo-400">{wt.subject}</div>
                          <div className="text-sm font-bold text-white mt-0.5">{wt.topicTitle}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {wt.studentsStrugglingCount} students struggling
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                          {wt.averageAccuracyPercentage}% Avg
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lagging Students Alert */}
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-4">
                  <h3 className="text-base font-bold text-white">Students Needing Remedial Attention</h3>
                  <div className="space-y-3">
                    {analytics.laggingStudents.map((ls) => (
                      <div
                        key={ls.studentId}
                        className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{ls.studentName}</span>
                            <span className="text-xs text-rose-300 font-semibold">({ls.subject} - {ls.scorePercentage}%)</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            <strong className="text-slate-400">Diagnosis:</strong> {ls.reason}
                          </p>
                          <p className="text-xs text-indigo-300 mt-0.5">
                            <strong className="text-indigo-400">Suggested Action:</strong> {ls.suggestedAction}
                          </p>
                        </div>
                        <button
                          onClick={() => handleInspectStudent(ls.studentId)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-xs"
                        >
                          Remediate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 5: SCHEDULE ASSESSMENTS & TESTS
            ===================================================================== */}
        {activeTab === "schedule" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Schedule Form */}
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white">Schedule New Assessment</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tests scheduled here automatically appear on student academic calendars & blackboard to-dos.
                  </p>
                </div>

                <form onSubmit={handleScheduleTestSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Assessment Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Optics & Light Diagnostic Test"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Subject
                      </label>
                      <select
                        value={testSubject}
                        onChange={(e) => setTestSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Mathematics">Mathematics</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Target Section
                      </label>
                      <select
                        value={testSection}
                        onChange={(e) => setTestSection(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="10A">Class 10A</option>
                        <option value="10B">Class 10B</option>
                        <option value="All">All Class 10</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={180}
                        value={testDuration}
                        onChange={(e) => setTestDuration(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={testQuestions}
                      onChange={(e) => setTestQuestions(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {testSubmitSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Assessment scheduled and synchronized with student calendar!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingTest}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30"
                  >
                    {isSubmittingTest ? "Scheduling Assessment..." : "Schedule Assessment"}
                  </button>
                </form>
              </div>

              {/* Scheduled Tests List */}
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
                <h3 className="text-base font-bold text-white">Active Calendar Assessments</h3>
                <div className="space-y-3">
                  {isLoadingTests ? (
                    <div className="py-8 text-center text-slate-400 text-xs">Loading tests...</div>
                  ) : scheduledTests.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No assessments currently scheduled.
                    </div>
                  ) : (
                    scheduledTests.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                              {t.subject}
                            </span>
                            <span className="text-xs text-slate-400">{t.dateStr}</span>
                          </div>
                          <div className="text-sm font-bold text-white mt-1">{t.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {t.durationMinutes} mins • {t.questionsCount} questions • {t.timeStr}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                          {t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: DATA EXPORT
            ===================================================================== */}
        {activeTab === "export" && (
          <div className="max-w-2xl mx-auto space-y-6 py-8 animate-in fade-in duration-300">
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <Download className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Export Class Records</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Download the complete academic dossier including student performance, task completion,
                weak topics, and instructor ratings for Class 10 cohorts.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/api/teacher/export?format=csv"
                  download="kepler-class-10-student-performance.csv"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download CSV (.csv)</span>
                </a>

                <a
                  href="/api/teacher/export?format=json"
                  download="kepler-class-10-student-performance.json"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm transition-all border border-slate-600 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download JSON (.json)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: STUDENT DEEP INSPECTOR
          ========================================================================= */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#1E293B] border border-slate-700 text-slate-100 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <button
              onClick={() => setSelectedStudentId(null)}
              className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isLoadingDetail || !studentDetail ? (
              <div className="py-16 text-center text-slate-400">Loading student profile...</div>
            ) : (
              <>
                {/* Header Profile */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                      {studentDetail.grade} • Section {studentDetail.section}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {studentDetail.id}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">{studentDetail.name}</h2>
                  <p className="text-xs text-slate-400">{studentDetail.email}</p>
                </div>

                {/* Score & Attendance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Overall Accuracy</span>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">
                      {studentDetail.overallScorePercentage}%
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Chapters Done</span>
                    <div className="text-xl font-bold text-white mt-0.5">
                      {studentDetail.chaptersCompleted} / {studentDetail.totalChapters}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Score Booster</span>
                    <div className="text-xl font-bold text-indigo-400 mt-0.5">
                      {studentDetail.scoreBoosterMarks} pts
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Study Time</span>
                    <div className="text-xl font-bold text-purple-400 mt-0.5">
                      {studentDetail.timeSpentHours} hrs
                    </div>
                  </div>
                </div>

                {/* Subject Accuracy */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Subject Performance Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {studentDetail.subjects.map((s) => (
                      <div
                        key={s.subject}
                        className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex justify-between items-center"
                      >
                        <span className="text-xs font-semibold text-slate-200">{s.subject}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {s.scorePercentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strong & Weak Topics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-400">Strong Topics</span>
                    <div className="flex flex-wrap gap-1.5">
                      {studentDetail.strongTopics.length > 0 ? (
                        studentDetail.strongTopics.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[11px] font-medium"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">None logged yet</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-rose-400">Needs Practice</span>
                    <div className="flex flex-wrap gap-1.5">
                      {studentDetail.weakTopics.length > 0 ? (
                        studentDetail.weakTopics.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-[11px] font-medium"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">All topics on track</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Editable Teacher Remarks & Rank */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                      Teacher Assessment & Remarks
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Rank out of 10:</span>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        step={0.5}
                        value={detailRank}
                        onChange={(e) => setDetailRank(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center text-xs font-bold text-amber-400"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={detailRemarks}
                    onChange={(e) => setDetailRemarks(e.target.value)}
                    placeholder="Provide specific feedback or guidance for this student..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center justify-between pt-1">
                    {remarksSaveSuccess ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Saved successfully
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        Updates save instantly to student profile
                      </span>
                    )}
                    <button
                      onClick={handleSaveStudentRemarks}
                      disabled={isSavingRemarks}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs"
                    >
                      {isSavingRemarks ? "Saving..." : "Save Assessment"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: UPLOAD NEW PDF RESOURCE
          ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#1E293B] border border-slate-700 text-slate-100 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black text-white">Upload Curriculum Material</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                File will be indexed for CBSE Class 10 student study and revision.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE Class 10 Science Practice Paper 2025"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
                  <select
                    value={newDocSubject}
                    onChange={(e) => setNewDocSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">All Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Document Category
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as TeacherPdfCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Study Material">Study Material</option>
                    <option value="Revision Notes">Revision Notes</option>
                    <option value="Sample Paper">Sample Paper</option>
                    <option value="PYQ">Previous Year (PYQ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Chapter / Topic (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Light Reflection"
                    value={newDocChapter}
                    onChange={(e) => setNewDocChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Academic Year
                  </label>
                  <select
                    value={newDocYear}
                    onChange={(e) => setNewDocYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Description / Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes for students..."
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingUpload}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30"
              >
                {isSubmittingUpload ? "Uploading & Syncing..." : "Publish to Student Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * CENTRALIZED KEPLER PLATFORM API CLIENT
 * ============================================================================
 * Strongly-typed service layer connecting all Next.js frontend pages and
 * components with the backend API routes.
 * ============================================================================
 */

import {
  StudentProfile,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ClassroomTodosResponse,
  UpdateTodoRequest,
  ClassroomTodoItem,
  CalendarEvent,
  CalendarResponse,
  ScheduleResponse,
  SubjectsResponse,
  ChaptersResponse,
  ChapterMaterialResponse,
  RevisionNotesResponse,
  FlashcardsResponse,
  QuizzesResponse,
  QuizDetail,
  SubmitQuizRequest,
  SubmitQuizResponse,
  TestResultsHistoryResponse,
  TestResultData,
  CustomPracticeRequest,
  CustomPracticeResponse,
  ScoreBoosterStatusResponse,
  ScoreBoosterTasksResponse,
  CompleteTaskResponse,
  MistakesResponse,
  UpdateMistakeRequest,
  LoggedMistake,
  PapersResponse,
  PastExamPaper,
  DoubtSolveRequest,
  DoubtSolveResponse,
  SendMessageRequest,
  SendMessageResponse,
  ChatHistoryResponse,
  ClearSessionResponse,
  MyDoubtsResponse,
  TeacherStudentsResponse,
  TeacherStudentDetail,
  TeacherUploadsResponse,
  CreatePdfUploadRequest,
  TeacherPdfUpload,
  TeacherRankingsResponse,
  TeacherRankingItem,
  TeacherClassAnalytics,
  TeacherScheduleTestRequest,
  TeacherScheduleTestResponse,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error ||
        errorBody.message ||
        `Request to ${endpoint} failed with status ${response.status}`
    );
  }

  return response.json();
}

export const apiClient = {
  // --------------------------------------------------------------------------
  // Group A: Authentication & Student Profile
  // --------------------------------------------------------------------------
  auth: {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const data = await fetchWithAuth<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (typeof window !== "undefined") {
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
        if (data.student) {
          localStorage.setItem("current_student", JSON.stringify(data.student));
        }
      }
      return data;
    },

    logout: async (): Promise<LogoutResponse> => {
      const data = await fetchWithAuth<LogoutResponse>("/auth/logout", {
        method: "POST",
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("current_student");
      }
      return data;
    },

    getMe: async (): Promise<StudentProfile> => {
      const profile = await fetchWithAuth<StudentProfile>("/auth/me", { method: "GET" });
      if (profile && typeof window !== "undefined") {
        localStorage.setItem("current_student", JSON.stringify(profile));
      }
      return profile;
    },

    getProfile: async (): Promise<StudentProfile> => {
      const profile = await fetchWithAuth<StudentProfile>("/auth/profile", { method: "GET" });
      if (profile && typeof window !== "undefined") {
        localStorage.setItem("current_student", JSON.stringify(profile));
      }
      return profile;
    },

    updateProfile: async (
      data: UpdateProfileRequest
    ): Promise<UpdateProfileResponse> => {
      const res = await fetchWithAuth<UpdateProfileResponse>("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (res.student && typeof window !== "undefined") {
        localStorage.setItem("current_student", JSON.stringify(res.student));
      }
      return res;
    },

    changePassword: async (
      data: ChangePasswordRequest
    ): Promise<ChangePasswordResponse> => {
      return fetchWithAuth<ChangePasswordResponse>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // --------------------------------------------------------------------------
  // Group B: Classroom Dashboard & Tasks
  // --------------------------------------------------------------------------
  classroom: {
    getTodos: async (): Promise<ClassroomTodosResponse> => {
      return fetchWithAuth<ClassroomTodosResponse>("/classroom/todos", {
        method: "GET",
      });
    },

    updateTodo: async (
      id: string,
      updates: UpdateTodoRequest
    ): Promise<{ success: boolean; todo: ClassroomTodoItem }> => {
      return fetchWithAuth<{ success: boolean; todo: ClassroomTodoItem }>(
        `/classroom/todos/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        }
      );
    },

    addTodo: async (
      todo: Partial<ClassroomTodoItem>
    ): Promise<{ success: boolean; todo: ClassroomTodoItem }> => {
      return fetchWithAuth<{ success: boolean; todo: ClassroomTodoItem }>(
        "/classroom/todos",
        {
          method: "POST",
          body: JSON.stringify(todo),
        }
      );
    },

    deleteTodo: async (id: string): Promise<{ success: boolean; id: string }> => {
      return fetchWithAuth<{ success: boolean; id: string }>(
        `/classroom/todos/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );
    },
  },

  // --------------------------------------------------------------------------
  // Group B2: Dashboard Calendar & Schedule
  // --------------------------------------------------------------------------
  dashboard: {
    getCalendarEvents: async (): Promise<CalendarResponse> => {
      return fetchWithAuth<CalendarResponse>("/dashboard/calendar", {
        method: "GET",
      });
    },

    getSchedule: async (): Promise<ScheduleResponse> => {
      return fetchWithAuth<ScheduleResponse>("/dashboard/schedule", {
        method: "GET",
      });
    },
  },

  // --------------------------------------------------------------------------
  // Group C: Learn Module (Subjects, Chapters, Notes, Flashcards)
  // --------------------------------------------------------------------------
  learn: {
    getSubjects: async (): Promise<SubjectsResponse> => {
      return fetchWithAuth<SubjectsResponse>("/learn/subjects", {
        method: "GET",
      });
    },

    getChapters: async (subjectId: string): Promise<ChaptersResponse> => {
      return fetchWithAuth<ChaptersResponse>(
        `/learn/chapters?subjectId=${encodeURIComponent(subjectId)}`,
        { method: "GET" }
      );
    },

    getMaterial: async (
      chapterIdOrTopic: string
    ): Promise<ChapterMaterialResponse> => {
      return fetchWithAuth<ChapterMaterialResponse>(
        `/learn/material?chapterId=${encodeURIComponent(chapterIdOrTopic)}`,
        { method: "GET" }
      );
    },

    getRevisionNotes: async (topicId: string): Promise<RevisionNotesResponse> => {
      return fetchWithAuth<RevisionNotesResponse>(
        `/learn/revision-notes?topicId=${encodeURIComponent(topicId)}`,
        { method: "GET" }
      );
    },

    getFlashcards: async (topicId: string): Promise<FlashcardsResponse> => {
      return fetchWithAuth<FlashcardsResponse>(
        `/learn/flashcards?topicId=${encodeURIComponent(topicId)}`,
        { method: "GET" }
      );
    },
  },

  // --------------------------------------------------------------------------
  // Group D: Quiz & Tests Engine
  // --------------------------------------------------------------------------
  test: {
    getQuizzes: async (subject?: string): Promise<QuizzesResponse> => {
      const q = subject ? `?subject=${encodeURIComponent(subject)}` : "";
      return fetchWithAuth<QuizzesResponse>(`/test/quizzes${q}`, {
        method: "GET",
      });
    },

    startQuiz: async (topicId: string): Promise<QuizDetail> => {
      return fetchWithAuth<QuizDetail>(
        `/test/start?topicId=${encodeURIComponent(topicId)}`,
        { method: "GET" }
      );
    },

    submitQuiz: async (
      payload: SubmitQuizRequest
    ): Promise<SubmitQuizResponse> => {
      return fetchWithAuth<SubmitQuizResponse>("/test/submit", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    getResults: async (
      testId?: string
    ): Promise<TestResultData | TestResultsHistoryResponse> => {
      const q = testId ? `?testId=${encodeURIComponent(testId)}` : "";
      return fetchWithAuth<TestResultData | TestResultsHistoryResponse>(
        `/test/results${q}`,
        { method: "GET" }
      );
    },

    createCustomPractice: async (
      payload: CustomPracticeRequest
    ): Promise<CustomPracticeResponse> => {
      return fetchWithAuth<CustomPracticeResponse>("/test/custom", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  },

  // --------------------------------------------------------------------------
  // Group E: AI Assistant / Doubts
  // --------------------------------------------------------------------------
  ai: {
    doubtSolve: async (req: DoubtSolveRequest): Promise<DoubtSolveResponse> => {
      return fetchWithAuth<DoubtSolveResponse>("/ai/doubt-solve", {
        method: "POST",
        body: JSON.stringify(req),
      });
    },

    chat: async (req: SendMessageRequest): Promise<SendMessageResponse> => {
      return fetchWithAuth<SendMessageResponse>("/ai/chat", {
        method: "POST",
        body: JSON.stringify(req),
      });
    },

    getChatHistory: async (sessionId: string): Promise<ChatHistoryResponse> => {
      return fetchWithAuth<ChatHistoryResponse>(
        `/ai/chat/history?sessionId=${encodeURIComponent(sessionId)}`,
        { method: "GET" }
      );
    },

    clearChatSession: async (sessionId: string): Promise<ClearSessionResponse> => {
      return fetchWithAuth<ClearSessionResponse>(
        `/ai/chat/session/${encodeURIComponent(sessionId)}`,
        { method: "DELETE" }
      );
    },

    getMyDoubts: async (): Promise<MyDoubtsResponse> => {
      return fetchWithAuth<MyDoubtsResponse>("/ai/doubts", {
        method: "GET",
      });
    },
  },

  // --------------------------------------------------------------------------
  // Group F: Score Booster Engine
  // --------------------------------------------------------------------------
  scoreBooster: {
    getStatus: async (): Promise<ScoreBoosterStatusResponse> => {
      return fetchWithAuth<ScoreBoosterStatusResponse>(
        "/score-booster/status",
        { method: "GET" }
      );
    },

    getTasks: async (subject?: string): Promise<ScoreBoosterTasksResponse> => {
      const q = subject ? `?subject=${encodeURIComponent(subject)}` : "";
      return fetchWithAuth<ScoreBoosterTasksResponse>(
        `/score-booster/tasks${q}`,
        { method: "GET" }
      );
    },

    completeTask: async (taskId: string): Promise<CompleteTaskResponse> => {
      return fetchWithAuth<CompleteTaskResponse>(
        `/score-booster/tasks/${encodeURIComponent(taskId)}/complete`,
        { method: "POST" }
      );
    },
  },

  // --------------------------------------------------------------------------
  // Group G: Improvement Book (Mistakes)
  // --------------------------------------------------------------------------
  mistakes: {
    getMistakes: async (studentId?: string): Promise<MistakesResponse> => {
      const q = studentId ? `?studentId=${encodeURIComponent(studentId)}` : "";
      return fetchWithAuth<MistakesResponse>(`/mistakes${q}`, {
        method: "GET",
      });
    },

    updateMistake: async (
      id: string,
      req: UpdateMistakeRequest,
      studentId?: string
    ): Promise<{ success: boolean; mistake: LoggedMistake }> => {
      const q = studentId ? `?studentId=${encodeURIComponent(studentId)}` : "";
      return fetchWithAuth<{ success: boolean; mistake: LoggedMistake }>(
        `/mistakes/${encodeURIComponent(id)}${q}`,
        {
          method: "PATCH",
          body: JSON.stringify(req),
        }
      );
    },
  },

  // --------------------------------------------------------------------------
  // Group H: Papers Archive
  // --------------------------------------------------------------------------
  papers: {
    getPapers: async (params?: {
      type?: "sample" | "pyq";
      subject?: string;
      year?: string;
      exam?: string;
    }): Promise<PapersResponse> => {
      const sp = new URLSearchParams();
      if (params?.type) sp.set("type", params.type);
      if (params?.subject) sp.set("subject", params.subject);
      if (params?.year) sp.set("year", params.year);
      if (params?.exam) sp.set("exam", params.exam);
      const queryStr = sp.toString() ? `?${sp.toString()}` : "";
      return fetchWithAuth<PapersResponse>(`/papers${queryStr}`, {
        method: "GET",
      });
    },
  },

  // --------------------------------------------------------------------------
  // Group J: Teacher Admin Portal
  // --------------------------------------------------------------------------
  teacher: {
    getStudents: async (params?: {
      class?: string;
      subject?: string;
      performance?: string;
      search?: string;
    }): Promise<TeacherStudentsResponse> => {
      const sp = new URLSearchParams();
      if (params?.class) sp.set("class", params.class);
      if (params?.subject) sp.set("subject", params.subject);
      if (params?.performance) sp.set("performance", params.performance);
      if (params?.search) sp.set("search", params.search);
      const queryStr = sp.toString() ? `?${sp.toString()}` : "";
      return fetchWithAuth<TeacherStudentsResponse>(`/teacher/students${queryStr}`, {
        method: "GET",
      });
    },

    getStudentDetail: async (id: string): Promise<TeacherStudentDetail> => {
      return fetchWithAuth<TeacherStudentDetail>(`/teacher/students/${encodeURIComponent(id)}`, {
        method: "GET",
      });
    },

    updateStudentRemarks: async (
      id: string,
      remarks: string,
      rankOutOf10?: number
    ): Promise<{ success: boolean; message: string; student: TeacherStudentDetail }> => {
      return fetchWithAuth<{ success: boolean; message: string; student: TeacherStudentDetail }>(
        `/teacher/students/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ remarks, teacherRankOutOf10: rankOutOf10 }),
        }
      );
    },

    getUploads: async (params?: {
      subject?: string;
      type?: string;
      search?: string;
    }): Promise<TeacherUploadsResponse> => {
      const sp = new URLSearchParams();
      if (params?.subject) sp.set("subject", params.subject);
      if (params?.type) sp.set("type", params.type);
      if (params?.search) sp.set("search", params.search);
      const queryStr = sp.toString() ? `?${sp.toString()}` : "";
      return fetchWithAuth<TeacherUploadsResponse>(`/teacher/uploads${queryStr}`, {
        method: "GET",
      });
    },

    uploadPdf: async (
      data: CreatePdfUploadRequest | FormData
    ): Promise<{ success: boolean; message: string; upload: TeacherPdfUpload }> => {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      if (typeof FormData !== "undefined" && data instanceof FormData) {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/teacher/uploads`, {
          method: "POST",
          headers,
          body: data,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Upload failed");
        }
        return res.json();
      }
      return fetchWithAuth<{ success: boolean; message: string; upload: TeacherPdfUpload }>(
        "/teacher/uploads",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
    },

    deleteUpload: async (id: string): Promise<{ success: boolean; message: string; id: string }> => {
      return fetchWithAuth<{ success: boolean; message: string; id: string }>(
        `/teacher/uploads/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );
    },

    getRankings: async (subject?: string): Promise<TeacherRankingsResponse> => {
      const queryStr = subject && subject !== "all" ? `?subject=${encodeURIComponent(subject)}` : "";
      return fetchWithAuth<TeacherRankingsResponse>(`/teacher/ranking${queryStr}`, {
        method: "GET",
      });
    },

    updateRanking: async (
      studentId: string,
      rankOutOf10: number,
      remarks?: string
    ): Promise<{ success: boolean; message: string; ranking: TeacherRankingItem }> => {
      return fetchWithAuth<{ success: boolean; message: string; ranking: TeacherRankingItem }>(
        `/teacher/ranking/${encodeURIComponent(studentId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ teacherRankOutOf10: rankOutOf10, teacherRemarks: remarks }),
        }
      );
    },

    getAnalytics: async (): Promise<TeacherClassAnalytics> => {
      return fetchWithAuth<TeacherClassAnalytics>("/teacher/analytics", {
        method: "GET",
      });
    },

    scheduleTest: async (
      req: TeacherScheduleTestRequest
    ): Promise<TeacherScheduleTestResponse> => {
      return fetchWithAuth<TeacherScheduleTestResponse>("/teacher/tests", {
        method: "POST",
        body: JSON.stringify(req),
      });
    },

    getScheduledTests: async (): Promise<{ events: CalendarEvent[] }> => {
      return fetchWithAuth<{ events: CalendarEvent[] }>("/teacher/tests", {
        method: "GET",
      });
    },
  },
};

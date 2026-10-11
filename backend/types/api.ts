/**
 * Antigravity Backend Handler Contract & Types
 * Shared data structures between the Next.js frontend and the backend API service.
 */

// ----------------------------------------------------
// 1. Authentication Types
// ----------------------------------------------------

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  targetExam?: string;
  role?: "student" | "instructor" | "admin";
  phone?: string;
  grade?: string;
  school?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  student?: StudentProfile;
  error?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  targetExam?: string;
  phone?: string;
  grade?: string;
  school?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  student?: StudentProfile;
  message?: string;
  error?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  error?: string;
}

// ----------------------------------------------------
// 2. Classroom Tasks & Todos
// ----------------------------------------------------

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface RevisionNotesData {
  summary: string;
  keyPoints: string[];
  formulas?: string[];
}

export interface ClassroomTodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  topicId?: string;
  topicTitle?: string;
  quizId?: string;
  flashcards?: FlashcardItem[];
  revisionNotes?: RevisionNotesData;
}

export interface ClassroomTodosResponse {
  todos: ClassroomTodoItem[];
}

export interface UpdateTodoRequest {
  completed: boolean;
  text?: string;
}

// ----------------------------------------------------
// 3. AI Doubt Solver Types
// ----------------------------------------------------

export type DoubtSolverMode = "socratic" | "detailed" | "exam";
export type SearchChipType = "search" | "deep-research" | "reason" | null;

export interface FileAttachment {
  fileId: string;
  filename: string;
  sizeBytes?: number;
  url?: string;
}

export interface DoubtSolveRequest {
  query: string;
  mode: DoubtSolverMode;
  searchType?: SearchChipType;
  attachments?: FileAttachment[];
}

export interface DoubtSolveResponse {
  id: string;
  mode: DoubtSolverMode;
  text: string;
  latexFormulas?: string[];
  followUpHints?: string[];
  references?: string[];
  timestamp: string;
}

// ----------------------------------------------------
// 4. Allie AI Learning Module Companion
// ----------------------------------------------------

export interface ChatMessage {
  id: string;
  sender: "user" | "allie";
  text: string;
  timestamp: string;
  mode?: DoubtSolverMode;
  latexFormulas?: string[];
  followUpHints?: string[];
  references?: string[];
  attachments?: FileAttachment[];
}

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
  mode?: DoubtSolverMode;
  searchType?: SearchChipType;
  attachments?: Array<{
    fileId: string;
    filename: string;
  }>;
}

export interface SendMessageResponse {
  id: string;
  sessionId: string;
  sender: "allie";
  text: string;
  mode?: DoubtSolverMode;
  latexFormulas?: string[];
  followUpHints?: string[];
  timestamp: string;
}

export interface ChatHistoryResponse {
  sessionId: string;
  messages: ChatMessage[];
  totalMessages: number;
}

export interface ClearSessionResponse {
  success: boolean;
  sessionId: string;
  message: string;
}

export interface ChatRequest extends SendMessageRequest {}
export interface ChatResponse extends SendMessageResponse {}

// ----------------------------------------------------
// 5. Score Booster Engine
// ----------------------------------------------------

export interface ScoreBoosterTask {
  id: string;
  title: string;
  subject?: "Physics" | "Chemistry" | "Mathematics" | "All";
  difficulty?: 1 | 2 | 3;
  actionLabel?: string;
  quizTarget?: string;
  completed?: boolean;
  pointsValue?: number;
}

export interface TasksBreakdown {
  easy: number;
  moderate: number;
  hard: number;
}

export interface ScoreBoosterStatusResponse {
  examName: string;
  currentMarks: number;
  nextGoalMarks: number;
  tasksCompleted: number;
  tasksBreakdown?: TasksBreakdown;
  characterPlatform?: "lower" | "jumping" | "higher";
}

export interface ScoreBoosterTasksResponse {
  tasks: ScoreBoosterTask[];
}

export interface CompleteTaskResponse {
  success: boolean;
  newMarks: number;
  tasksCompletedTotal: number;
  triggerAnimation: "jumping";
}

// ----------------------------------------------------
// 6. Learning Materials (Learn)
// ----------------------------------------------------

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  durationMinutes?: number;
  resourceCount?: number;
  videoUrl?: string;
}

export interface LearningMaterialsResponse {
  materials: LearningMaterial[];
}

// ----------------------------------------------------
// 7. Test Center (Test)
// ----------------------------------------------------

export interface TestAssessment {
  id: string;
  title: string;
  totalMarks: number;
  durationMinutes: number;
  questionCount: number;
  status: "available" | "in_progress" | "completed";
}

export interface SubjectBreakdown {
  id: string;
  name: string;
  partLabel: string;
  maxMarks: number;
  score: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  positiveMarks: number;
  negativeMarks: number;
}

export interface TestResultData {
  testId: string;
  testTitle: string;
  dateAttempted: string;
  attemptType?: "first" | "reattempt";
  roundLabel?: string;
  totalScore: number;
  maxTotalMarks: number;
  accuracyPercentage: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  totalPositiveMarks: number;
  totalNegativeMarks: number;
  subjects: SubjectBreakdown[];
}

export interface TestsResponse {
  tests: TestAssessment[];
}

// ----------------------------------------------------
// 8. Improvement Book (Improve)
// ----------------------------------------------------

export interface LoggedMistake {
  id: string;
  questionSnippet: string;
  subject: string;
  errorCategory: "Conceptual" | "Calculation Error" | "Unattempted" | "Time Pressure";
  correctAnswer: string;
  studentAnswer: string;
  reviewed: boolean;
}

export interface MistakesResponse {
  mistakes: LoggedMistake[];
}

// ----------------------------------------------------
// 9. Previous Papers (Papers)
// ----------------------------------------------------

export interface PastExamPaper {
  id: string;
  title: string;
  year: number;
  exam: string;
  pdfUrl: string;
  solutionUrl?: string;
  subject?: string;
  type?: string;
  academicYear?: string;
}

export interface PapersResponse {
  papers: PastExamPaper[];
}

// ----------------------------------------------------
// 10. Calendar & Schedule Types
// ----------------------------------------------------

export interface CalendarEvent {
  id: string;
  day: number;
  dateStr: string;
  title: string;
  subject: string;
  durationMinutes: number;
  questionsCount: number;
  type: "quiz" | "mock" | "revision";
  timeStr: string;
  status: "scheduled" | "completed" | "open";
  scheduledAt?: string;
  quizTopicId?: string;
}

export interface CalendarResponse {
  events: CalendarEvent[];
}

export interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  timeStr: string;
  dateStr: string;
  instructor?: string;
  room?: string;
  type: "lecture" | "lab" | "test" | "discussion";
}

export interface ScheduleResponse {
  schedule: ScheduleItem[];
  emptyMessage?: string;
}

// ----------------------------------------------------
// 11. Learn Module Types (Subjects & Chapters)
// ----------------------------------------------------

export interface SubjectChapter {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  topicId?: string;
  pdfUrl?: string;
  hasQuiz?: boolean;
}

export interface SubjectItem {
  id: string;
  title: string;
  displayTitle: string;
  code: string;
  category: "Core Science" | "Mathematics" | "Languages" | "Applied Studies";
  themeGradient: string;
  iconType: string;
  chaptersCount: number;
  chapters?: SubjectChapter[];
}

export interface SubjectsResponse {
  subjects: SubjectItem[];
}

export interface ChaptersResponse {
  subjectId: string;
  subjectTitle: string;
  chapters: SubjectChapter[];
}

export interface ChapterMaterialResponse {
  chapterId: string;
  title: string;
  subject: string;
  durationMinutes: number;
  theorySummary: string;
  pdfUrl?: string;
  resourceCount: number;
}

export interface FlashcardsResponse {
  topicId: string;
  chapterTitle: string;
  flashcards: FlashcardItem[];
}

export interface RevisionNotesResponse {
  topicId: string;
  chapterTitle: string;
  revisionNotes: RevisionNotesData;
}

// ----------------------------------------------------
// 12. Quiz & Tests Engine Types
// ----------------------------------------------------

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  explanation?: string;
}

export interface QuizDetail {
  id: string;
  topicTitle: string;
  chapter: string;
  subject: string;
  durationMinutes: number;
  questionCount: number;
  questions: QuizQuestionItem[];
}

export interface QuizzesResponse {
  quizzes: Array<{
    id: string;
    topicTitle: string;
    chapter: string;
    subject: string;
    questionCount: number;
    durationMinutes: number;
  }>;
}

export interface SubmitQuizRequest {
  topicId: string;
  selectedAnswers: Record<string, number>;
  timeSpentSeconds?: number;
}

export interface SubmitQuizResponse {
  success: boolean;
  result: TestResultData;
}

export interface CustomPracticeRequest {
  subjectId: string;
  chapterIds: string[];
  questionCount?: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
}

export interface CustomPracticeResponse {
  quizId: string;
  title: string;
  subject: string;
  questions: QuizQuestionItem[];
}

export interface TestResultsHistoryResponse {
  results: TestResultData[];
}

// ----------------------------------------------------
// 13. Resolved Doubts ("My Doubts")
// ----------------------------------------------------

export interface ResolvedDoubt {
  id: string;
  query: string;
  mode: DoubtSolverMode;
  answerSnippet: string;
  timestamp: string;
  latexFormulas?: string[];
  subject?: string;
}

export interface MyDoubtsResponse {
  doubts: ResolvedDoubt[];
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface UpdateMistakeRequest {
  reviewed: boolean;
}

// ----------------------------------------------------
// 14. Teacher Admin Portal Types
// ----------------------------------------------------

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  role: "instructor" | "admin";
  department?: string;
  designation?: string;
  school?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface StudentSubjectScore {
  subject: string;
  scorePercentage: number;
  quizzesTaken: number;
  averageAccuracy: number;
  status: "ahead" | "on-track" | "needs-attention";
}

export interface StudentTestHistoryRecord {
  testId: string;
  title: string;
  date: string;
  subject: string;
  score: number;
  maxMarks: number;
  accuracyPercentage: number;
}

export interface StudentActivityLog {
  id: string;
  timestamp: string;
  action: string;
  category: "quiz" | "study" | "booster" | "doubt";
  detail: string;
}

export interface TeacherStudentSummary {
  id: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  overallScorePercentage: number;
  tasksCompleted: number;
  totalAssignedTasks: number;
  chaptersCompleted: number;
  totalChapters: number;
  scoreBoosterMarks: number;
  scoreBoosterGoal: number;
  attendancePercentage: number;
  timeSpentHours: number;
  lastActive: string;
  performanceBand: "high" | "average" | "lagging";
  teacherRankOutOf10: number;
  teacherRemarks?: string;
}

export interface TeacherStudentDetail extends TeacherStudentSummary {
  subjects: StudentSubjectScore[];
  testHistory: StudentTestHistoryRecord[];
  recentActivities: StudentActivityLog[];
  completedChapterList: string[];
  weakTopics: string[];
  strongTopics: string[];
  notesHistory?: Array<{ date: string; author: string; note: string }>;
}

export interface TeacherStudentsResponse {
  students: TeacherStudentSummary[];
  totalStudents: number;
  classAverageScore: number;
  activeTodayCount: number;
  needsAttentionCount: number;
}

export interface UpdateStudentRemarksRequest {
  remarks: string;
  teacherRankOutOf10?: number;
}

export type TeacherPdfCategory = "Study Material" | "Revision Notes" | "Sample Paper" | "PYQ";

export interface TeacherPdfUpload {
  id: string;
  title: string;
  filename: string;
  subject: string;
  chapterId?: string;
  chapterTitle?: string;
  type: TeacherPdfCategory;
  academicYear: string;
  fileSizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
  pdfUrl: string;
  description?: string;
  downloadCount: number;
  isStudentVisible: boolean;
}

export interface TeacherUploadsResponse {
  uploads: TeacherPdfUpload[];
  totalUploads: number;
}

export interface CreatePdfUploadRequest {
  title: string;
  subject: string;
  chapterId?: string;
  chapterTitle?: string;
  type: TeacherPdfCategory;
  academicYear: string;
  description?: string;
  pdfUrl?: string;
  fileSizeBytes?: number;
  fileName?: string;
}

export interface TeacherRankingItem {
  studentId: string;
  studentName: string;
  section: string;
  autoRank: number;
  teacherRankOutOf10: number;
  overallScorePercentage: number;
  quizAccuracy: number;
  tasksCompleted: number;
  subjectScores: Record<string, number>;
  teacherRemarks?: string;
  lastUpdated?: string;
}

export interface TeacherRankingsResponse {
  rankings: TeacherRankingItem[];
}

export interface UpdateStudentRankingRequest {
  teacherRankOutOf10: number;
  teacherRemarks?: string;
}

export interface SubjectAnalyticsStat {
  subject: string;
  averageScorePercentage: number;
  totalQuizzesTaken: number;
  completionRatePercentage: number;
  laggingStudentCount: number;
}

export interface WeakTopicAnalytics {
  topicId: string;
  topicTitle: string;
  subject: string;
  averageAccuracyPercentage: number;
  studentsStrugglingCount: number;
}

export interface LaggingStudentAlert {
  studentId: string;
  studentName: string;
  subject: string;
  scorePercentage: number;
  reason: string;
  suggestedAction: string;
}

export interface TeacherClassAnalytics {
  overview: {
    totalStudents: number;
    classAverageScore: number;
    chapterCompletionRate: number;
    taskCompletionRate: number;
    activeStudentsRate: number;
  };
  subjectStats: SubjectAnalyticsStat[];
  weakTopics: WeakTopicAnalytics[];
  laggingStudents: LaggingStudentAlert[];
}

export interface TeacherScheduleTestRequest {
  title: string;
  subject: string;
  scheduledDate: string; // ISO date string e.g. "2026-10-18T10:00:00"
  durationMinutes: number;
  questionsCount: number;
  topicId?: string;
  type?: "quiz" | "mock" | "assessment";
  section?: string;
}

export interface TeacherScheduleTestResponse {
  success: boolean;
  event: CalendarEvent;
  message: string;
}


# Antigravity Backend Handler Specification: Kepler Learning Platform

This document serves as the authoritative specification for any **Antigravity AI Agent** or backend engineer implementing the backend service handlers for the **Kepler Learning Platform / PySustain** application.

---

## 1. System Architecture Overview

- **Frontend Client**: Next.js 14 App Router (React 18, TypeScript, Tailwind CSS) running on `http://localhost:3000` (or `3001`).
- **Backend Service**: REST API server running Next.js App Router API handlers at `/api` matching OpenAPI 3.1.0 specification at `openapi.yaml`.
- **Content-Type**: `application/json` (with `multipart/form-data` for file uploads, `application/pdf` for document streams).
- **Authentication**: Bearer Token (`Authorization: Bearer <JWT>`) with support for Student ID or Email login.

---

## 2. API Endpoints Master Matrix

| # | Route | Method | Purpose | Expected Input | Expected Output | Related Frontend Page |
|---|-------|--------|---------|----------------|-----------------|-----------------------|
| 1 | `/api/auth/login` | POST | Authenticate student credentials | `{ studentId/email, password }` | `{ success, token, student }` | `/` (SignInPage) |
| 2 | `/api/auth/logout` | POST | Invalidate session & logout | None / Bearer Token | `{ success: true, message }` | `/dashboard` (Header Sign Out) |
| 3 | `/api/auth/me` | GET | Retrieve authenticated profile | Bearer Token | `StudentProfile` | `/dashboard`, `/` |
| 4 | `/api/auth/profile` | GET | Retrieve full student profile details | Bearer Token | `StudentProfile` | `/profile` (ProfilePage) |
| 5 | `/api/auth/profile` | PATCH | Update student profile fields | `{ name?, email?, phone?, targetExam? }` | `{ success: true, student }` | `/profile` (ProfilePage) |
| 6 | `/api/auth/change-password` | POST | Update student password securely | `{ currentPassword, newPassword }` | `{ success: true, message }` | `/change-password` |
| 7 | `/api/classroom/todos` | GET | Blackboard to-do tasks list | None | `{ todos: ClassroomTodoItem[] }` | `/dashboard` (ClassroomDashboard) |
| 8 | `/api/classroom/todos` | POST | Create new blackboard task | `{ text, dueDate?, topicId? }` | `{ success: true, todo }` | `/dashboard` (ClassroomDashboard) |
| 9 | `/api/classroom/todos/{id}` | PATCH | Toggle task completion / edit | `{ completed: boolean, text? }` | `{ success: true, todo }` | `/dashboard` (ClassroomDashboard) |
| 10 | `/api/classroom/todos/{id}` | DELETE | Delete blackboard task | Path `id` | `{ success: true, id }` | `/dashboard` (ClassroomDashboard) |
| 11 | `/api/dashboard/calendar` | GET | Scheduled quizzes & mocks | None | `{ events: CalendarEvent[] }` | `/calendar` (CalendarClientView) |
| 12 | `/api/dashboard/schedule` | GET | Class schedule / "All Set" state | None | `{ schedule: ScheduleItem[], emptyMessage? }` | `/dashboard` (ScheduleSection) |
| 13 | `/api/learn/subjects` | GET | Active CBSE Class 10 subjects | None | `{ subjects: SubjectItem[] }` | `/learn` (LearnSubjectView) |
| 14 | `/api/learn/chapters` | GET | Chapters by subject | Query: `?subjectId=physics` | `{ subjectId, subjectTitle, chapters }` | `/learn` (LearnSubjectView) |
| 15 | `/api/learn/material` | GET | Theory summary & PDF link | Query: `?chapterId=phys-1` | `ChapterMaterialResponse` | `/study` (StudyClientView) |
| 16 | `/api/learn/revision-notes` | GET | Topic revision summary & formulas | Query: `?topicId=kepler-laws` | `RevisionNotesResponse` | `/revision` (RevisionClientView) |
| 17 | `/api/learn/flashcards` | GET | Interactive flashcard deck | Query: `?topicId=kepler-laws` | `FlashcardsResponse` | `/revision` (RevisionClientView) |
| 18 | `/api/test/quizzes` | GET | Available quizzes list | Query: `?subject=Physics` (optional) | `{ quizzes: Array<{ id, ... }> }` | `/test` (TestClientView) |
| 19 | `/api/test/start` | GET | Start quiz & fetch questions | Query: `?topicId=kepler-laws` | `QuizDetail` | `/test` (TestClientView) |
| 20 | `/api/test/submit` | POST | Submit answers & calculate score | `{ topicId, selectedAnswers, timeSpentSeconds }` | `{ success: true, result: TestResultData }` | `/test` -> `/test/result` |
| 21 | `/api/test/results` | GET | Test scoring calculations & history | Query: `?testId=...` (optional) | `TestResultData` or `{ results }` | `/test/result` (TestResultView) |
| 22 | `/api/test/custom` | POST | Generate custom practice set | `{ subjectId, chapterIds, questionCount }` | `CustomPracticeResponse` | `/test/custom` |
| 23 | `/api/ai/doubt-solve` | POST | Solve doubt (Socratic/Detailed/Exam) | `{ query, mode, searchType, attachments }` | `DoubtSolveResponse` | `/ask`, `/doubt-solver` |
| 24 | `/api/ai/chat` | POST | Multi-turn chat with Allie | `{ message, sessionId, mode, ... }` | `SendMessageResponse` | `/ask`, `/doubt-solver` |
| 25 | `/api/ai/chat/history` | GET | Retrieve conversation messages | Query: `?sessionId=session_123` | `ChatHistoryResponse` | `/ask`, `/doubt-solver` |
| 26 | `/api/ai/chat/session/{sessionId}` | DELETE | Clear chat memory session | Path `sessionId` | `ClearSessionResponse` | `/ask`, `/doubt-solver` |
| 27 | `/api/ai/doubts` | GET | Retrieve resolved doubts list | None | `{ doubts: ResolvedDoubt[] }` | `/ask` (My Doubts) |
| 28 | `/api/score-booster/status` | GET | Current score, goal & platform | None | `ScoreBoosterStatusResponse` | `/score-booster`, `/dashboard` |
| 29 | `/api/score-booster/tasks` | GET | Recommended high-yield tasks | Query: `?subject=Physics` (optional) | `{ tasks: ScoreBoosterTask[] }` | `/score-booster`, `/dashboard` |
| 30 | `/api/score-booster/tasks/{id}/complete` | POST | Complete task & trigger jump | Path `id` | `CompleteTaskResponse` | `/score-booster`, `/dashboard` |
| 31 | `/api/mistakes` | GET | Logged mistake analytics | None | `{ mistakes: LoggedMistake[] }` | `/improve` (ImprovePage) |
| 32 | `/api/mistakes/{id}` | PATCH | Mark mistake reviewed | `{ reviewed: boolean }` | `{ success: true, mistake }` | `/improve` (ImprovePage) |
| 33 | `/api/papers` | GET | Sample papers and PYQs | Query: `?type=sample&year=2025` | `{ papers: PastExamPaper[] }` | `/papers` (PapersClientView) |
| 34 | `/api/pdf` | GET | Generate dynamic notes PDF | Query: `?subject=Science&title=...` | Stream: `application/pdf` | `/study`, `/papers` |
| 35 | `/api/teacher/students` | GET | List students with tracking & filters | Query: `?class=10A&performance=high` | `TeacherStudentsResponse` | `/teacher` (Student Overview) |
| 36 | `/api/teacher/students/{id}` | GET | Individual student deep tracking | Path `id` | `TeacherStudentDetail` | `/teacher` (Student Inspector) |
| 37 | `/api/teacher/students/{id}` | PATCH | Update teacher remarks & rank (/10) | `{ remarks, teacherRankOutOf10 }` | `{ success: true, student }` | `/teacher` (Student Inspector) |
| 38 | `/api/teacher/uploads` | GET | List uploaded PDF resources | Query: `?type=Sample%20Paper` | `TeacherUploadsResponse` | `/teacher` (PDF Resource Hub) |
| 39 | `/api/teacher/uploads` | POST | Upload PDF & sync to student catalog | `{ title, subject, type, year, file }` | `{ success: true, upload }` | `/teacher` (PDF Resource Hub) |
| 40 | `/api/teacher/uploads/{id}` | DELETE | Remove uploaded PDF resource | Path `id` | `{ success: true, id }` | `/teacher` (PDF Resource Hub) |
| 41 | `/api/teacher/ranking` | GET | Auto & teacher student rankings | Query: `?subject=Physics` (optional) | `TeacherRankingsResponse` | `/teacher` (Student Ranking) |
| 42 | `/api/teacher/ranking/{studentId}` | PATCH | Adjust student rank out of 10 | `{ teacherRankOutOf10, remarks }` | `{ success: true, ranking }` | `/teacher` (Student Ranking) |
| 43 | `/api/teacher/analytics` | GET | Class averages, weak topics, lagging | None | `TeacherClassAnalytics` | `/teacher` (Class Analytics) |
| 44 | `/api/teacher/tests` | POST | Schedule assessment & sync calendar | `{ title, subject, scheduledDate, ... }` | `TeacherScheduleTestResponse` | `/teacher` (Schedule & Tests) |
| 45 | `/api/teacher/export` | GET | Export class data (CSV / JSON) | Query: `?format=csv` | CSV/JSON stream | `/teacher` (Export) |

---

## 3. Detailed Endpoint Handler Specifications

### Group A: Authentication & Student Profile (`/api/auth`)

#### `POST /api/auth/login`
- **Purpose**: Authenticates student credentials using Student ID or Email and password.
- **Expected Input**:
  ```json
  {
    "email": "10034455542",
    "password": "password123"
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "student": {
      "id": "10034455542",
      "name": "Alex Chen",
      "email": "alex.chen@kepler.edu",
      "targetExam": "CBSE Class 10 Board Exam",
      "role": "student"
    }
  }
  ```
- **Related Frontend Page**: `/` (`src/components/SignInPage.tsx`)

#### `POST /api/auth/logout`
- **Purpose**: Invalidates the current student authentication session.
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Successfully signed out of student session"
  }
  ```
- **Related Frontend Page**: `/dashboard` (`src/components/ClassroomDashboard.tsx`)

#### `GET /api/auth/me`
- **Purpose**: Retrieves current student session profile.
- **Expected Input**: None (or `Authorization: Bearer <token>`)
- **Expected Output (`200 OK`)**:
  ```json
  {
    "id": "10034455542",
    "name": "Alex Chen",
    "email": "alex.chen@kepler.edu",
    "targetExam": "CBSE Class 10 Board Exam",
    "role": "student"
  }
  ```
- **Related Frontend Page**: `/dashboard`, `/`

#### `GET /api/auth/profile`
- **Purpose**: Retrieves full student profile including academic information and contact details.
- **Expected Input**: None (or `Authorization: Bearer <token>`)
- **Expected Output (`200 OK`)**:
  ```json
  {
    "id": "10034455542",
    "name": "Alex Chen",
    "email": "alex.chen@kepler.edu",
    "targetExam": "CBSE Class 10 Board Exam",
    "role": "student",
    "phone": "+1 (555) 234-5678",
    "grade": "Grade 10",
    "school": "Kepler International Academy"
  }
  ```
- **Related Frontend Page**: `/profile` (`src/app/profile/page.tsx`)

#### `PATCH /api/auth/profile`
- **Purpose**: Updates student profile fields (name, email, target exam, phone, grade, school).
- **Expected Input**:
  ```json
  {
    "name": "Alex Chen",
    "phone": "+1 (555) 987-6543",
    "targetExam": "CBSE Class 10 Board Exam"
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "student": {
      "id": "10034455542",
      "name": "Alex Chen",
      "email": "alex.chen@kepler.edu",
      "targetExam": "CBSE Class 10 Board Exam",
      "phone": "+1 (555) 987-6543",
      "grade": "Grade 10",
      "school": "Kepler International Academy"
    },
    "message": "Profile updated successfully"
  }
  ```
- **Related Frontend Page**: `/profile` (`src/app/profile/page.tsx`)

#### `POST /api/auth/change-password`
- **Purpose**: Securely updates student account password after verifying current credentials.
- **Expected Input**:
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newSecretPassword456",
    "confirmPassword": "newSecretPassword456"
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```
- **Related Frontend Page**: `/change-password`, `/profile/security`

---

### Group B: Classroom Dashboard & Tasks (`/api/classroom`, `/api/dashboard`)

#### `GET /api/classroom/todos`
- **Purpose**: Retrieves active student to-do tasks displayed on the blackboard.
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "todos": [
      {
        "id": "1",
        "text": "Review Kepler's 3 Laws of Planetary Motion",
        "completed": true,
        "dueDate": "2026-10-12",
        "topicId": "kepler-laws",
        "topicTitle": "Kepler's 3 Laws of Planetary Motion",
        "quizId": "quiz-kepler-laws"
      }
    ]
  }
  ```
- **Related Frontend Page**: `/dashboard` (`src/components/ClassroomDashboard.tsx`)

#### `PATCH /api/classroom/todos/{id}`
- **Purpose**: Toggles completion status or edits task text.
- **Expected Input**:
  ```json
  {
    "completed": true
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "todo": {
      "id": "1",
      "completed": true
    }
  }
  ```
- **Related Frontend Page**: `/dashboard`

#### `GET /api/dashboard/calendar`
- **Purpose**: Retrieves scheduled diagnostic tests and academic milestones for the calendar grid.
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "events": [
      {
        "id": "evt-1",
        "day": 12,
        "dateStr": "Oct 12, 2026",
        "title": "Kepler's 3 Laws & Gravitation Practice Test",
        "subject": "Physics",
        "durationMinutes": 45,
        "questionsCount": 20,
        "type": "quiz",
        "timeStr": "11:30 AM",
        "status": "scheduled"
      }
    ]
  }
  ```
- **Related Frontend Page**: `/calendar` (`src/app/calendar/CalendarClientView.tsx`)

#### `GET /api/dashboard/schedule`
- **Purpose**: Retrieves today's live lecture/lab schedule or triggers the clean "You're All Set!" empty state.
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "schedule": [],
    "emptyMessage": "No more classes scheduled. Check your calendar for what's next!"
  }
  ```
- **Related Frontend Page**: `/dashboard` (`src/components/ScheduleSection.tsx`)

---

### Group C: Learn Module (`/api/learn`)

#### `GET /api/learn/subjects`
- **Purpose**: Retrieves the active curriculum subject catalog (CBSE Class 10: Physics, Chemistry, Biology, Mathematics).
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "subjects": [
      {
        "id": "physics",
        "title": "Physics",
        "displayTitle": "Physics",
        "code": "PHYS-10",
        "category": "Core Science",
        "themeGradient": "from-slate-800 via-slate-900 to-slate-950",
        "iconType": "physics",
        "chaptersCount": 5
      }
    ]
  }
  ```
- **Related Frontend Page**: `/learn` (`src/app/learn/LearnSubjectView.tsx`)

#### `GET /api/learn/chapters`
- **Purpose**: Retrieves all curriculum chapters, summaries, and estimated durations for a given subject.
- **Expected Input**: Query parameter `?subjectId=physics`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "subjectId": "physics",
    "subjectTitle": "Physics",
    "chapters": [
      {
        "id": "phys-1",
        "number": 1,
        "title": "Light – Reflection and Refraction",
        "description": "Spherical mirrors, mirror formula, refraction laws, lenses, and lens formula.",
        "durationMinutes": 45,
        "topicId": "light-reflection",
        "hasQuiz": true
      }
    ]
  }
  ```
- **Related Frontend Page**: `/learn` (`src/app/learn/LearnSubjectView.tsx`)

#### `GET /api/learn/material`
- **Purpose**: Retrieves chapter study theory, resource counts, and direct PDF generation link.
- **Expected Input**: Query parameter `?chapterId=phys-1`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "chapterId": "phys-1",
    "title": "Light – Reflection and Refraction",
    "subject": "Physics",
    "durationMinutes": 45,
    "theorySummary": "Comprehensive syllabus study module for Light...",
    "pdfUrl": "/api/pdf?subject=Physics&chapter=phys-1&title=Light%20–%20Reflection%20and%20Refraction",
    "resourceCount": 4
  }
  ```
- **Related Frontend Page**: `/study` (`src/app/study/StudyClientView.tsx`)

#### `GET /api/learn/revision-notes`
- **Purpose**: Retrieves structured bullet-point revision summaries, key definitions, and LaTeX formulas.
- **Expected Input**: Query parameter `?topicId=kepler-laws`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "topicId": "kepler-laws",
    "chapterTitle": "Kepler's 3 Laws of Planetary Motion",
    "revisionNotes": {
      "summary": "Johannes Kepler established three empirical laws governing orbital motion...",
      "keyPoints": [
        "1st Law: Planar elliptical orbits with Sun at one focus.",
        "2nd Law: A line joining a planet and Sun sweeps equal areas in equal intervals.",
        "3rd Law: The square of orbital period T is directly proportional to a³."
      ],
      "formulas": [
        "T^2 = \\frac{4\\pi^2}{GM} a^3",
        "\\frac{dA}{dt} = \\frac{L}{2m} = \\text{constant}"
      ]
    }
  }
  ```
- **Related Frontend Page**: `/revision` (`src/app/revision/RevisionClientView.tsx`)

#### `GET /api/learn/flashcards`
- **Purpose**: Retrieves interactive flip flashcards (questions, answers, hints).
- **Expected Input**: Query parameter `?topicId=kepler-laws`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "topicId": "kepler-laws",
    "chapterTitle": "Kepler's 3 Laws of Planetary Motion",
    "flashcards": [
      {
        "id": "fc_1",
        "question": "What does Kepler's 1st Law (Law of Ellipses) state?",
        "answer": "All planets move in elliptical orbits with the Sun located at one of the two foci.",
        "hint": "Recall: Not a circle, but an ellipse with eccentricity 0 ≤ e < 1."
      }
    ]
  }
  ```
- **Related Frontend Page**: `/revision` (`src/app/revision/RevisionClientView.tsx`)

---

### Group D: Quiz & Tests Engine (`/api/test`)

#### `GET /api/test/quizzes`
- **Purpose**: Lists available quizzes, chapter diagnostics, and mock tests.
- **Expected Input**: Optional query `?subject=Physics`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "quizzes": [
      {
        "id": "quiz-kepler-laws",
        "topicTitle": "Kepler's 3 Laws of Planetary Motion",
        "chapter": "Gravitation & Celestial Mechanics",
        "subject": "Physics",
        "questionCount": 3,
        "durationMinutes": 5
      }
    ]
  }
  ```
- **Related Frontend Page**: `/test` (`src/app/test/TestClientView.tsx`)

#### `GET /api/test/start`
- **Purpose**: Retrieves questions and options for a quiz without leaking correct answers.
- **Expected Input**: Query `?topicId=kepler-laws`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "id": "quiz-kepler-laws",
    "topicTitle": "Kepler's 3 Laws of Planetary Motion",
    "chapter": "Gravitation & Celestial Mechanics",
    "subject": "Physics",
    "durationMinutes": 5,
    "questionCount": 3,
    "questions": [
      {
        "id": "q1",
        "question": "According to Kepler's 1st Law, what shape do planetary orbits trace?",
        "options": ["Perfect Circle", "Ellipse with Sun at one focus", "Parabola", "Hyperbola"],
        "explanation": "Kepler's First Law states all planets orbit the Sun in ellipses..."
      }
    ]
  }
  ```
- **Related Frontend Page**: `/test` (`src/app/test/TestClientView.tsx`)

#### `POST /api/test/submit`
- **Purpose**: Evaluates student submitted choices against answer key, calculates exact marks, accuracy, subject breakdowns, logs errors into Improvement Book, and stores result in history.
- **Expected Input**:
  ```json
  {
    "topicId": "kepler-laws",
    "selectedAnswers": {
      "q1": 1,
      "q2": 2,
      "q3": 0
    },
    "timeSpentSeconds": 140
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "result": {
      "testId": "quiz-kepler-laws",
      "testTitle": "Kepler's 3 Laws of Planetary Motion",
      "dateAttempted": "Oct 11, 2026",
      "attemptType": "first",
      "totalScore": 2,
      "maxTotalMarks": 3,
      "accuracyPercentage": 67,
      "totalCorrect": 2,
      "totalIncorrect": 1,
      "totalUnattempted": 0,
      "totalPositiveMarks": 2,
      "totalNegativeMarks": 0,
      "subjects": [
        {
          "id": "physics",
          "name": "Physics",
          "partLabel": "Part A",
          "maxMarks": 3,
          "score": 2,
          "correctCount": 2,
          "incorrectCount": 1,
          "unattemptedCount": 0,
          "positiveMarks": 2,
          "negativeMarks": 0
        }
      ]
    }
  }
  ```
- **Related Frontend Page**: `/test` -> `/test/result` (`src/components/TestResultView.tsx`)

#### `GET /api/test/results`
- **Purpose**: Returns test attempt performance data or historical test attempts.
- **Expected Input**: Optional query `?testId=quiz-kepler-laws`
- **Expected Output (`200 OK`)**: `TestResultData` or `{ results: TestResultData[] }`
- **Related Frontend Page**: `/test/result` (`src/components/TestResultView.tsx`)

#### `POST /api/test/custom`
- **Purpose**: Generates an adaptive custom practice set from selected chapters and difficulty level.
- **Expected Input**:
  ```json
  {
    "subjectId": "physics",
    "chapterIds": ["phys-1", "phys-3"],
    "questionCount": 3,
    "difficulty": "medium"
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "quizId": "custom_1728639200",
    "title": "Custom Practice: Physics",
    "subject": "Physics",
    "questions": [...]
  }
  ```
- **Related Frontend Page**: `/test/custom` (`src/components/CustomPracticeSelection.tsx`)

---

### Group E: AI Assistant / Doubts (`/api/ai`)

#### `POST /api/ai/doubt-solve`
- **Purpose**: Submits doubt query with pedagogical mode (**Socratic Method**, **Detailed Explanation**, or **Exam Ready**).
- **Expected Input**:
  ```json
  {
    "query": "Can you explain orbital velocity and why satellites don't fall?",
    "mode": "socratic",
    "searchType": "reason",
    "attachments": []
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "id": "ans_98124",
    "mode": "socratic",
    "text": "💡 **Let's break this down collaboratively!**...",
    "latexFormulas": ["v = \\sqrt{\\frac{GM}{r}}"],
    "followUpHints": [
      "Think about what forces are acting on the system",
      "Consider what stays constant during the process"
    ],
    "timestamp": "10:15 AM"
  }
  ```
- **Related Frontend Page**: `/ask`, `/doubt-solver` (`src/components/DoubtSolvingInterface.tsx`)

#### `POST /api/ai/chat`
- **Purpose**: Multi-turn dialogue with Allie AI Tutor preserving conversational memory.
- **Expected Input**:
  ```json
  {
    "message": "Why does an astronaut float in zero gravity?",
    "sessionId": "session_alex_orbital_01",
    "mode": "detailed"
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "id": "allie_1728639250",
    "sessionId": "session_alex_orbital_01",
    "sender": "allie",
    "text": "Great question! Regarding...",
    "timestamp": "10:15 AM"
  }
  ```
- **Related Frontend Page**: `/ask`, `/doubt-solver`

#### `GET /api/ai/chat/history`
- **Purpose**: Retrieves all prior messages in an active session.
- **Expected Input**: Query `?sessionId=session_alex_orbital_01`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "sessionId": "session_alex_orbital_01",
    "messages": [...],
    "totalMessages": 4
  }
  ```
- **Related Frontend Page**: `/ask`, `/doubt-solver`

#### `DELETE /api/ai/chat/session/{sessionId}`
- **Purpose**: Clears dialogue memory for a given session ID.
- **Expected Input**: Path parameter `sessionId`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "sessionId": "session_alex_orbital_01",
    "message": "Session successfully cleared."
  }
  ```
- **Related Frontend Page**: `/ask`, `/doubt-solver`

#### `GET /api/ai/doubts`
- **Purpose**: Retrieves student's resolved doubts list with formulas and explanations.
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "doubts": [
      {
        "id": "doubt_01",
        "query": "Why do planets move in ellipses instead of perfect circles?",
        "mode": "socratic",
        "answerSnippet": "Under an inverse-square gravitational force...",
        "timestamp": "10:15 AM",
        "latexFormulas": ["\\frac{d^2 u}{d\\theta^2} + u = \\frac{GMm^2}{L^2}"],
        "subject": "Physics"
      }
    ]
  }
  ```
- **Related Frontend Page**: `/ask` (My Doubts section)

---

### Group F: Score Booster Engine (`/api/score-booster`)

#### `GET /api/score-booster/status`
- **Purpose**: Retrieves current marks vs next goal marks and character stage state.
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "examName": "CBSE Class 10 Board Exam",
    "currentMarks": 142,
    "nextGoalMarks": 180,
    "tasksCompleted": 13,
    "tasksBreakdown": { "easy": 9, "moderate": 3, "hard": 1 },
    "characterPlatform": "lower"
  }
  ```
- **Related Frontend Page**: `/score-booster`, `/dashboard` (`src/components/ScoreBoosterSection.tsx`)

#### `GET /api/score-booster/tasks`
- **Purpose**: Returns personalized practice tasks filtered by subject.
- **Expected Input**: Optional query `?subject=Physics`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "tasks": [
      {
        "id": "task_101",
        "title": "Master Mirror & Lens Formula Sign Conventions",
        "subject": "Physics",
        "difficulty": 2,
        "completed": false,
        "pointsValue": 4,
        "actionLabel": "Practice Quiz",
        "quizTarget": "/test?topic=light-reflection"
      }
    ]
  }
  ```
- **Related Frontend Page**: `/score-booster`, `/dashboard`

#### `POST /api/score-booster/tasks/{id}/complete`
- **Purpose**: Marks a task completed, awards points, and returns animation trigger.
- **Expected Input**: Path parameter `id`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "newMarks": 146,
    "tasksCompletedTotal": 14,
    "triggerAnimation": "jumping"
  }
  ```
- **Related Frontend Page**: `/score-booster`, `/dashboard`

---

### Group G: Improvement Book (`/api/mistakes`)

#### `GET /api/mistakes`
- **Purpose**: Retrieves logged incorrect questions with correct vs student answers and error categories.
- **Expected Input**: None
- **Expected Output (`200 OK`)**:
  ```json
  {
    "mistakes": [
      {
        "id": "err_01",
        "questionSnippet": "Find the equivalent resistance of two 6 Ω resistors in parallel.",
        "subject": "Physics",
        "errorCategory": "Calculation Error",
        "correctAnswer": "3 Ω",
        "studentAnswer": "12 Ω",
        "reviewed": false
      }
    ]
  }
  ```
- **Related Frontend Page**: `/improve` (`src/app/improve/page.tsx`)

#### `PATCH /api/mistakes/{id}`
- **Purpose**: Toggles reviewed status for a mistake item.
- **Expected Input**:
  ```json
  {
    "reviewed": true
  }
  ```
- **Expected Output (`200 OK`)**:
  ```json
  {
    "success": true,
    "mistake": {
      "id": "err_01",
      "reviewed": true
    }
  }
  ```
- **Related Frontend Page**: `/improve`

---

### Group H: Previous Papers & PDF Stream (`/api/papers`, `/api/pdf`)

#### `GET /api/papers`
- **Purpose**: Retrieves indexed CBSE Class 10 sample papers and previous year papers.
- **Expected Input**: Optional query parameters: `?type=sample&year=2025&subject=Science`
- **Expected Output (`200 OK`)**:
  ```json
  {
    "papers": [
      {
        "id": "cbse_10_sci_2025_sqp",
        "title": "CBSE Class 10 Science Official Sample Paper 2024-25",
        "year": 2025,
        "exam": "CBSE Class 10",
        "pdfUrl": "/api/pdf?subject=Science&title=CBSE-Class-10-Science-SQP-2025",
        "solutionUrl": "/api/pdf?subject=Science&title=CBSE-Class-10-Science-Marking-Scheme"
      }
    ]
  }
  ```
- **Related Frontend Page**: `/papers` (`src/app/papers/PapersClientView.tsx`)

#### `GET /api/pdf`
- **Purpose**: Dynamically generates and streams high-fidelity PDF documents for chapters and papers.
- **Expected Input**: Query `?subject=Science&chapter=phys-1&title=Light`
- **Expected Output (`200 OK`)**: `application/pdf` binary stream
- **Related Frontend Page**: `/study`, `/papers`, `/learn`

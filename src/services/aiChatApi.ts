/**
 * ============================================================================
 * AI CHAT & DOUBT SOLVER API SERVICE LAYER
 * ============================================================================
 * Authoritative integration endpoints connecting the Kepler Learning frontend
 * with the Antigravity backend service.
 *
 * Backend Directives:
 * - Protocol: REST API JSON
 * - Base URL: process.env.NEXT_PUBLIC_API_URL || "/api"
 * - Authentication: Bearer Token (Authorization: Bearer <JWT>)
 * - Multi-turn memory: Handled via sessionId
 * ============================================================================
 */

import {
  SendMessageRequest,
  SendMessageResponse,
  ChatHistoryResponse,
  ClearSessionResponse,
  DoubtSolveRequest,
  DoubtSolveResponse,
  FileAttachment,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Helper to fetch with standard JSON headers & authorization token
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

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
      errorBody.error || errorBody.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export const aiChatApi = {
  /**
   * --------------------------------------------------------------------------
   * 1. SEND MESSAGE TO AI CHAT (Allie AI Tutor)
   * --------------------------------------------------------------------------
   * @description Sends a user query to Allie with optional session continuity.
   *
   * - Request Method: POST
   * - Endpoint: /api/ai/chat
   * - Headers:
   *     Authorization: Bearer <token>
   *     Content-Type: application/json
   *
   * @param payload.message - The student's text query or question
   * @param payload.sessionId - UUID string to preserve multi-turn conversation memory
   * @param payload.mode - 'socratic' | 'detailed' | 'exam'
   * @param payload.searchType - 'search' | 'deep-research' | 'reason' (optional)
   * @param payload.attachments - Array of previously uploaded { fileId, filename }
   *
   * @expectedRequest
   *   POST /api/ai/chat
   *   {
   *     "message": "Why does an astronaut float in zero gravity?",
   *     "sessionId": "session_student_441",
   *     "mode": "detailed"
   *   }
   *
   * @expectedResponse (200 OK)
   *   {
   *     "id": "msg_89012",
   *     "sessionId": "session_student_441",
   *     "sender": "allie",
   *     "text": "Great question! The astronaut is in continuous free-fall...",
   *     "latexFormulas": ["v = \\sqrt{GM/r}"],
   *     "timestamp": "10:15 AM"
   *   }
   *
   * @frontendCallPoint
   *   Called inside `DoubtSolvingInterface.tsx` -> `handleSubmit()`
   */
  async sendMessage(payload: SendMessageRequest): Promise<SendMessageResponse> {
    return fetchWithAuth<SendMessageResponse>("/ai/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * --------------------------------------------------------------------------
   * 2. GET CHAT HISTORY
   * --------------------------------------------------------------------------
   * @description Fetches prior messages for an active conversation session.
   *
   * - Request Method: GET
   * - Endpoint: /api/ai/chat/history?sessionId={sessionId}
   * - Headers:
   *     Authorization: Bearer <token>
   *
   * @param sessionId - Session ID to fetch history for
   *
   * @expectedRequest
   *   GET /api/ai/chat/history?sessionId=session_student_441
   *
   * @expectedResponse (200 OK)
   *   {
   *     "sessionId": "session_student_441",
   *     "messages": [
   *       { "id": "1", "sender": "user", "text": "What is escape velocity?", "timestamp": "10:14 AM" },
   *       { "id": "2", "sender": "allie", "text": "Escape velocity is...", "timestamp": "10:15 AM" }
   *     ],
   *     "totalMessages": 2
   *   }
   *
   * @frontendCallPoint
   *   Called inside `DoubtSolvingInterface.tsx` -> `useEffect()` when mounting or loading conversation
   */
  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    return fetchWithAuth<ChatHistoryResponse>(
      `/ai/chat/history?sessionId=${encodeURIComponent(sessionId)}`,
      { method: "GET" }
    );
  },

  /**
   * --------------------------------------------------------------------------
   * 3. SOLVE ACADEMIC DOUBT (Pedagogical Modes)
   * --------------------------------------------------------------------------
   * @description Submits an academic question for Socratic, Detailed, or Exam-focused resolution.
   *
   * - Request Method: POST
   * - Endpoint: /api/ai/doubt-solve
   * - Headers:
   *     Authorization: Bearer <token>
   *     Content-Type: application/json
   *
   * @param payload.query - Student question
   * @param payload.mode - 'socratic' | 'detailed' | 'exam'
   * @param payload.searchType - 'search' | 'deep-research' | 'reason'
   * @param payload.attachments - Attached notes/diagrams
   *
   * @expectedRequest
   *   POST /api/ai/doubt-solve
   *   {
   *     "query": "Prove Kepler's third law using universal gravitation",
   *     "mode": "exam",
   *     "searchType": "reason"
   *   }
   *
   * @expectedResponse (200 OK)
   *   {
   *     "id": "ans_98124",
   *     "mode": "exam",
   *     "text": "🎯 **Exam-Ready Derivation**:\n1. Equate gravitational force with centripetal force...",
   *     "latexFormulas": ["T^2 = \\frac{4\\pi^2}{GM} a^3"],
   *     "followUpHints": ["State Newton's Law of Gravitation explicitly for 2 marks."],
   *     "timestamp": "10:15 AM"
   *   }
   *
   * @frontendCallPoint
   *   Called inside `DoubtSolvingInterface.tsx` -> when pedagogical mode is selected
   */
  async solveDoubt(payload: DoubtSolveRequest): Promise<DoubtSolveResponse> {
    return fetchWithAuth<DoubtSolveResponse>("/ai/doubt-solve", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * --------------------------------------------------------------------------
   * 4. UPLOAD DOCUMENT OR SCREENSHOT ATTACHMENT
   * --------------------------------------------------------------------------
   * @description Uploads student notes, diagrams, or formula photos for AI OCR/multimodal analysis.
   *
   * - Request Method: POST
   * - Endpoint: /api/ai/upload
   * - Headers:
   *     Authorization: Bearer <token>
   *     Content-Type: multipart/form-data
   *
   * @param files - File list or Array of Files (PDF, PNG, JPG)
   *
   * @expectedRequest
   *   POST /api/ai/upload
   *   FormData: { files: [notes.pdf, problem_sketch.png] }
   *
   * @expectedResponse (201 Created)
   *   {
   *     "uploaded": [
   *       {
   *         "fileId": "file_8923bc",
   *         "filename": "notes.pdf",
   *         "sizeBytes": 142300,
   *         "url": "/uploads/notes.pdf"
   *       }
   *     ]
   *   }
   *
   * @frontendCallPoint
   *   Called inside `DoubtSolvingInterface.tsx` -> file upload handler on dropzone selection
   */
  async uploadAttachment(files: File[]): Promise<{ uploaded: FileAttachment[] }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/ai/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return response.json();
  },

  /**
   * --------------------------------------------------------------------------
   * 5. CLEAR / RESET CHAT SESSION
   * --------------------------------------------------------------------------
   * @description Clears conversation memory for a session or student reset.
   *
   * - Request Method: DELETE
   * - Endpoint: /api/ai/chat/session/{sessionId}
   * - Headers:
   *     Authorization: Bearer <token>
   *
   * @param sessionId - Session to terminate
   *
   * @expectedResponse (200 OK)
   *   {
   *     "success": true,
   *     "sessionId": "session_student_441",
   *     "message": "Chat session cleared successfully"
   *   }
   *
   * @frontendCallPoint
   *   Called inside `DoubtSolvingInterface.tsx` -> `handleReset()`
   */
  async clearSession(sessionId: string): Promise<ClearSessionResponse> {
    return fetchWithAuth<ClearSessionResponse>(`/ai/chat/session/${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
    });
  },
};

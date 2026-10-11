/**
 * ============================================================================
 * KEPLER PLATFORM: SUPABASE PERSISTENCE & DATA LAYER SERVICE
 * ============================================================================
 * Strongly-typed Supabase service layer for logging chat interactions, scores,
 * teacher feedback, and 4-factor student analytics.
 *
 * Guaranteed never to crash API routes if Supabase is unconfigured or unreachable.
 * ============================================================================
 */

import { PastExamPaper } from "@/types/api";

const PLACEHOLDER_URLS = new Set([
  "",
  "your_supabase_url_here",
  "https://your-project-ref.supabase.co",
]);

const PLACEHOLDER_KEYS = new Set([
  "",
  "your_supabase_service_role_key_here",
  "your_supabase_anon_key_here",
]);

// Fail-safe in-memory store so local testing / offline demos continue seamlessly
interface MemoryChatLog {
  id?: number;
  student_id: string;
  student_name: string;
  question: string;
  ai_response: string;
  created_at: string;
}

const memoryChatLogsStore: MemoryChatLog[] = [];

/**
 * Check if valid Supabase configuration is present
 */
export function isSupabaseConfigured(): boolean {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  return !PLACEHOLDER_URLS.has(url) && !PLACEHOLDER_KEYS.has(key) && url.startsWith("http");
}

function getSupabaseConfig(): { url: string; key: string } | null {
  if (!isSupabaseConfigured()) return null;

  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  return { url: url.replace(/\/+$/, ""), key };
}

/**
 * Log chat interaction to Supabase `chat_logs` table
 * Columns: student_id, student_name, question, ai_response, created_at
 */
export async function logChatInteractionToSupabase(entry: {
  studentId: string;
  studentName: string;
  question: string;
  aiResponse: string;
}): Promise<boolean> {
  const row: MemoryChatLog = {
    student_id: entry.studentId,
    student_name: entry.studentName,
    question: entry.question,
    ai_response: entry.aiResponse,
    created_at: new Date().toISOString(),
  };

  // Always record in local memory store as well
  memoryChatLogsStore.push(row);

  const config = getSupabaseConfig();
  if (!config) {
    // Graceful skip
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${config.url}/rest/v1/chat_logs`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[Supabase Warning] Could not insert into chat_logs: status ${res.status}: ${errText}`);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[Supabase Warning] Network error logging to chat_logs:", err);
    return false;
  }
}

/**
 * Fetch student chat logs from Supabase or fallback memory
 */
export async function getStudentChatLogsFromSupabase(
  studentId: string,
  limit: number = 50
): Promise<MemoryChatLog[]> {
  const config = getSupabaseConfig();
  if (config) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const endpoint = `${config.url}/rest/v1/chat_logs?student_id=eq.${encodeURIComponent(
        studentId
      )}&order=created_at.desc&limit=${limit}`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn("[Supabase Warning] Failed fetching chat_logs from Supabase:", err);
    }
  }

  // Fallback to local memory logs
  return memoryChatLogsStore
    .filter((log) => log.student_id === studentId)
    .slice(-limit)
    .reverse();
}

/**
 * Test connectivity to Supabase
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  url?: string;
}> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      connected: false,
      message: "Supabase credentials are not configured or still contain placeholder values.",
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${config.url}/rest/v1/chat_logs?limit=1`, {
      method: "GET",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok || res.status === 200 || res.status === 206) {
      return {
        connected: true,
        message: "Successfully connected to Supabase and verified `chat_logs` table.",
        url: config.url,
      };
    } else if (res.status === 404 || res.status === 401) {
      return {
        connected: false,
        message: `Connected to Supabase endpoint, but received HTTP ${res.status}. Please verify API key and table permissions.`,
        url: config.url,
      };
    }

    return {
      connected: false,
      message: `Supabase returned status ${res.status}`,
      url: config.url,
    };
  } catch (err) {
    return {
      connected: false,
      message: `Failed to connect to Supabase: ${err instanceof Error ? err.message : String(err)}`,
      url: config.url,
    };
  }
}

export interface SupabasePaperFilters {
  type?: string | null;
  subject?: string | null;
  year?: string | null;
  exam?: string | null;
}

/**
 * Fetch papers from Supabase database tables (e.g. `papers`, `sample_papers`, `teacher_uploads`).
 * Automatically normalizes different schema conventions and filters by subject, session, and type.
 */
export async function getPapersFromSupabase(
  filter?: SupabasePaperFilters
): Promise<{ success: boolean; papers: PastExamPaper[]; source: "supabase" | "fallback"; table?: string; error?: string }> {
  const config = getSupabaseConfig();
  if (!config) {
    return { success: false, papers: [], source: "fallback", error: "Supabase credentials are not configured in environment variables." };
  }

  // Prioritize tables based on the requested paper type
  const isPyqRequest = filter?.type?.toLowerCase() === "pyq";
  const candidateTables = isPyqRequest
    ? ["pyqs", "pyq", "past_papers", "previous_papers", "previous_year_papers", "papers", "sample_papers", "teacher_uploads"]
    : ["sample_papers", "papers", "pyqs", "pyq", "past_papers", "previous_papers", "teacher_uploads"];

  const matchedPapers: PastExamPaper[] = [];
  let foundTable: string | undefined = undefined;

  for (const table of candidateTables) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const endpoint = `${config.url}/rest/v1/${table}?select=*`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const rawData = await res.json();
        if (Array.isArray(rawData) && rawData.length > 0) {
          // Normalize rows to PastExamPaper
          const normalized: PastExamPaper[] = rawData.map((row: any, idx: number) => {
            const rawYear = row.academic_year || row.academicYear || row.session || row.year || row.exam_year;
            let numericYear = 2024;
            if (typeof rawYear === "number") {
              numericYear = rawYear;
            } else if (typeof rawYear === "string") {
              numericYear = parseInt(rawYear.split("-")[0], 10) || 2024;
            }

            const subject = String(row.subject || row.sub || "").trim();
            const title = String(row.title || row.filename || row.name || `Paper ${idx + 1}`).trim();
            const pdfUrl =
              row.pdf_url ||
              row.pdfUrl ||
              row.file_url ||
              row.url ||
              row.drive_link ||
              row.download_url ||
              `/api/pdf?subject=${encodeURIComponent(subject || "Science")}&title=${encodeURIComponent(title)}`;
            const solutionUrl = row.solution_url || row.solutionUrl || row.answer_key_url || row.marking_scheme_url || undefined;
            const exam = row.exam || row.board || "CBSE Class 10";

            // Infer or assign type
            const isTablePyq = /pyq|past|previous/i.test(table);
            const isRowPyq = /pyq|past|previous|board/i.test(String(row.type || row.paper_type || row.category || ""));
            const isTitlePyq = /pyq|board\s*exam|past\s*year|previous\s*year/i.test(title);

            let type: string;
            if (row.type || row.paper_type || row.category) {
              const explicit = String(row.type || row.paper_type || row.category).toLowerCase();
              type = explicit.includes("pyq") || explicit.includes("past") ? "pyq" : explicit.includes("sample") ? "sample" : explicit;
            } else if (isTablePyq || isRowPyq || isTitlePyq) {
              type = "pyq";
            } else {
              type = "sample";
            }

            const academicYear = typeof rawYear === "string" ? rawYear : `${numericYear}-${(numericYear + 1).toString().slice(-2)}`;

            return {
              id: String(row.id || `supa_${table}_${idx}`),
              title,
              year: numericYear,
              exam,
              pdfUrl,
              solutionUrl,
              subject,
              type,
              academicYear,
            };
          });

          // Apply filters
          const filtered = normalized.filter((p) => {
            // 1. Filter by subject
            if (filter?.subject && filter.subject.toLowerCase() !== "all") {
              const reqSubj = filter.subject.toLowerCase();
              const pSubj = (p.subject || "").toLowerCase();
              const pTitle = p.title.toLowerCase();

              const matchesSubj =
                pSubj === reqSubj ||
                pSubj.includes(reqSubj) ||
                reqSubj.includes(pSubj) ||
                pTitle.includes(reqSubj);

              if (!matchesSubj) return false;
            }

            // 2. Filter by year
            if (filter?.year) {
              const reqYear = filter.year.trim().toLowerCase();
              const pYearStr = String(p.year);
              const pAcadYear = (p.academicYear || "").toLowerCase();
              const pTitle = p.title.toLowerCase();

              const matchesYear =
                pAcadYear.includes(reqYear) ||
                pYearStr === reqYear ||
                pTitle.includes(reqYear) ||
                (reqYear.includes("-") && reqYear.startsWith(pYearStr)) ||
                (reqYear.includes("-") && reqYear.endsWith(pYearStr.slice(-2)));

              if (!matchesYear) return false;
            }

            // 3. Filter by type (sample vs pyq)
            if (filter?.type && filter.type !== "all") {
              const reqType = filter.type.toLowerCase();
              const pType = (p.type || "").toLowerCase();
              const pTitle = p.title.toLowerCase();

              if (reqType === "sample") {
                const isSample =
                  pType === "sample" ||
                  pType.includes("sample") ||
                  pTitle.includes("sample") ||
                  pTitle.includes("sqp");
                if (!isSample) return false;
              } else if (reqType === "pyq") {
                const isPyq =
                  pType === "pyq" ||
                  pType.includes("pyq") ||
                  pType.includes("past") ||
                  pType.includes("previous") ||
                  pTitle.includes("pyq") ||
                  pTitle.includes("board exam") ||
                  pTitle.includes("past year");
                if (!isPyq) return false;
              }
            }

            // 4. Filter by exam
            if (filter?.exam) {
              if (p.exam.toLowerCase() !== filter.exam.toLowerCase()) {
                if (!p.exam.toLowerCase().includes("cbse") && !filter.exam.toLowerCase().includes("cbse")) {
                  return false;
                }
              }
            }

            return true;
          });

          if (filtered.length > 0) {
            matchedPapers.push(...filtered);
            if (!foundTable) foundTable = table;
          }
        }
      }
    } catch (err) {
      console.warn(`[Supabase Warning] Could not query table '${table}':`, err);
    }
  }

  if (matchedPapers.length > 0) {
    // Deduplicate papers by title and academicYear
    const seen = new Set<string>();
    const unique = matchedPapers.filter((p) => {
      const key = `${p.title.toLowerCase()}_${p.academicYear || p.year}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { success: true, papers: unique, source: "supabase", table: foundTable };
  }

  return { success: false, papers: [], source: "fallback", error: "No matching records found in Supabase tables." };
}

/**
 * Test connectivity specifically to Supabase papers & PYQ tables
 */
export async function testSupabasePapersConnection(): Promise<{
  connected: boolean;
  tablesFound?: string[];
  totalRecordsFound?: number;
  message: string;
  url?: string;
}> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      connected: false,
      message: "Supabase credentials are not configured in environment variables (SUPABASE_URL and SUPABASE_SERVICE_KEY).",
    };
  }

  const candidateTables = [
    "papers",
    "sample_papers",
    "pyqs",
    "pyq",
    "past_papers",
    "previous_papers",
    "teacher_uploads",
  ];
  const tablesFound: string[] = [];
  let totalRecords = 0;

  for (const table of candidateTables) {
    try {
      const res = await fetch(`${config.url}/rest/v1/${table}?select=*&limit=5`, {
        method: "GET",
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
        },
      });

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows)) {
          tablesFound.push(table);
          totalRecords += rows.length;
        }
      }
    } catch {
      // Continue to next table
    }
  }

  if (tablesFound.length > 0) {
    return {
      connected: true,
      tablesFound,
      totalRecordsFound: totalRecords,
      message: `Successfully connected to Supabase! Found tables: [${tablesFound.join(", ")}].`,
      url: config.url,
    };
  }

  return {
    connected: false,
    message: `Connected to Supabase endpoint ${config.url}, but could not find paper/PYQ tables (${candidateTables.join(", ")}).`,
    url: config.url,
  };
}


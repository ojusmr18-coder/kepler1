import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { PastExamPaper, PapersResponse } from "@/types/api";
import { getPapersFromSupabase, isSupabaseConfigured, testSupabasePapersConnection } from "@/lib/supabaseService";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group I - Previous Papers Archive]        */
/* Protocol: GET /api/papers                                                 */
/* Authoritative Reference: AGENTS.md (Group I: Previous Papers Archive)     */
/*                                                                           */
/* Supported Query Parameters:                                               */
/*   - type: "sample" | "pyq" (Filter by Sample Paper vs PYQ)                */
/*   - subject: e.g. "physics", "chemistry", "science", "maths", "all"       */
/*   - year: academic session e.g. "2024-25", "2023-24", or number (2025)     */
/*   - exam: examination board e.g. "CBSE Class 10", "JEE Mains"             */
/*   - checkConnection: "true" to run a diagnostics check on Supabase papers */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "sample" | "pyq"
  const subject = searchParams.get("subject"); // "science" | "maths" | ...
  const year = searchParams.get("year"); // "2024-25" | ...
  const exam = searchParams.get("exam") || "CBSE Class 10";
  const checkConnection = searchParams.get("checkConnection") === "true";

  // If client requested connection status check
  if (checkConnection) {
    const diag = await testSupabasePapersConnection();
    return NextResponse.json({
      supabaseConfigured: isSupabaseConfigured(),
      diagnostics: diag,
    }, { status: 200 });
  }

  let papers: PastExamPaper[] = [];
  let source: "supabase" | "store" = "store";

  // 1. Try querying Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supaResult = await getPapersFromSupabase({
        type,
        subject,
        year,
        exam,
      });

      if (supaResult.success && supaResult.papers.length > 0) {
        papers = supaResult.papers;
        source = "supabase";
      }
    } catch (err) {
      console.warn("[Papers API] Error fetching from Supabase, falling back to local store:", err);
    }
  }

  // 2. If Supabase returned 0 papers or is unconfigured, fall back to serverStore
  if (papers.length === 0) {
    papers = serverStore.getPapers({
      type,
      subject,
      year,
      exam,
    });
  }

  const responsePayload: PapersResponse & { _source?: string; _supabaseConfigured?: boolean } = {
    papers,
    _source: source,
    _supabaseConfigured: isSupabaseConfigured(),
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "X-Data-Source": source,
      "X-Supabase-Configured": isSupabaseConfigured() ? "true" : "false",
    },
  });
}


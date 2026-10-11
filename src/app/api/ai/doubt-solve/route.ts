import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { generateTutorAnswer } from "@/lib/aiService";
import { logChatInteractionToSupabase } from "@/lib/supabaseService";
import { DoubtSolveRequest, DoubtSolveResponse, ResolvedDoubt } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group E - AI Doubt Solving Engine]        */
/* Protocol: POST /api/ai/doubt-solve                                        */
/* Purpose: Solves doubts using 3 modes: Socratic, Detailed, or Exam Ready   */
/* Expected Input: DoubtSolveRequest { query, mode, searchType, attachments }*/
/* Expected Output: DoubtSolveResponse { id, mode, text, latexFormulas, ... }*/
/* Related Frontend Page: /ask, /doubt-solver (DoubtSolvingInterface.tsx)    */
/* ========================================================================= */

export async function POST(request: NextRequest) {
  try {
    const body: DoubtSolveRequest = await request.json();

    if (!body.query || !body.query.trim()) {
      return NextResponse.json(
        { error: "A query string is required" },
        { status: 400 }
      );
    }

    const mode = body.mode || "detailed";
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const student = serverStore.getCurrentStudent();
    const studentId = student?.id || "10034455542";
    const studentName = student?.name || "Alex Chen";

    // 1. Generate pedagogical solution via AI API
    const aiResult = await generateTutorAnswer({
      message: body.query.trim(),
      mode,
      studentId,
      studentName,
    });

    const solutionId = "ans_" + Date.now();

    // 2. Save into resolved doubts list
    const newResolvedDoubt: ResolvedDoubt = {
      id: "doubt_" + Date.now(),
      query: body.query.trim(),
      mode,
      answerSnippet: aiResult.text.substring(0, 160) + "...",
      timestamp: timeNow,
      latexFormulas: aiResult.latexFormulas,
      subject: "Science",
    };
    serverStore.addResolvedDoubt(newResolvedDoubt);

    // 3. Asynchronously log interaction to Supabase `chat_logs` table
    logChatInteractionToSupabase({
      studentId,
      studentName,
      question: body.query.trim(),
      aiResponse: aiResult.text,
    }).catch((dbErr) => {
      console.warn("[Supabase Log Notice] Non-blocking chat_logs persistence:", dbErr);
    });

    const responsePayload: DoubtSolveResponse = {
      id: solutionId,
      mode,
      text: aiResult.text,
      latexFormulas: aiResult.latexFormulas,
      followUpHints: aiResult.followUpHints,
      timestamp: timeNow,
    };

    return NextResponse.json<DoubtSolveResponse>(responsePayload, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Doubt solver failed";
    console.error("[AI Doubt Solve Error]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

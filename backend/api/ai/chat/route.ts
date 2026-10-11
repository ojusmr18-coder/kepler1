import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "../../lib/serverStore";
import { generateTutorAnswer } from "../../lib/aiService";
import { logChatInteractionToSupabase } from "../../lib/supabaseService";
import { SendMessageRequest, SendMessageResponse, ChatMessage } from "../../types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group E - Allie AI Tutor Chat]            */
/* Protocol: POST /api/ai/chat                                               */
/* Purpose: Multi-turn contextual chat dialogue with Allie AI learning tutor  */
/* Expected Input: SendMessageRequest { message, sessionId?, mode?, ... }    */
/* Expected Output: SendMessageResponse { id, sessionId, sender, text, ... } */
/* Related Frontend Page: /ask, /doubt-solver (DoubtSolvingInterface.tsx)    */
/* ========================================================================= */

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { error: "Message string is required" },
        { status: 400 }
      );
    }

    const sessionId = body.sessionId || "default_session";
    const mode = body.mode || "detailed";
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Retrieve session history for multi-turn context
    const priorHistory = serverStore.getChatHistory(sessionId);
    const historyPayload: Array<{ role: "user" | "assistant"; content: string }> = priorHistory.map((m) => ({
      role: m.sender === "allie" ? "assistant" : "user",
      content: m.text,
    }));

    // Record user message into session store
    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: body.message.trim(),
      timestamp: timeNow,
      mode,
    };
    if (typeof (serverStore as any).appendChatMessage === "function") {
      (serverStore as any).appendChatMessage(sessionId, userMsg);
    }

    const studentId = "10034455542";
    const studentName = "Alex Chen";

    // 2. Generate answer via AI API router (Gemini, OpenCode, NVIDIA, FastAPI proxy)
    const aiResult = await generateTutorAnswer({
      message: body.message.trim(),
      history: historyPayload,
      mode,
      studentId,
      studentName,
    });

    const aiMsgId = "allie_" + Date.now();
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      sender: "allie",
      text: aiResult.text,
      timestamp: timeNow,
      mode,
      latexFormulas: aiResult.latexFormulas,
      followUpHints: aiResult.followUpHints,
    };
    if (typeof (serverStore as any).appendChatMessage === "function") {
      (serverStore as any).appendChatMessage(sessionId, aiMsg);
    }

    // 3. Asynchronously persist interaction to Supabase `chat_logs` table
    logChatInteractionToSupabase({
      studentId,
      studentName,
      question: body.message.trim(),
      aiResponse: aiResult.text,
    }).catch((dbErr) => {
      console.warn("[Supabase Log Notice] Non-blocking chat_logs persistence:", dbErr);
    });

    const responsePayload: SendMessageResponse = {
      id: aiMsgId,
      sessionId,
      sender: "allie",
      text: aiResult.text,
      mode,
      latexFormulas: aiResult.latexFormulas,
      followUpHints: aiResult.followUpHints,
      timestamp: timeNow,
    };

    return NextResponse.json<SendMessageResponse>(responsePayload, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI chat service failed";
    console.error("[AI Chat Route Error]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

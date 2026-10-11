import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ChatHistoryResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group E - Allie Chat History]             */
/* Protocol: GET /api/ai/chat/history                                        */
/* Purpose: Retrieves multi-turn message history for an active session       */
/* Expected Input: Query param: ?sessionId=session_123                       */
/* Expected Output: ChatHistoryResponse { sessionId, messages, totalMessages }*/
/* Related Frontend Page: /ask, /doubt-solver (DoubtSolvingInterface.tsx)    */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || "default_session";

  const messages = serverStore.getChatHistory(sessionId);

  return NextResponse.json<ChatHistoryResponse>(
    {
      sessionId,
      messages,
      totalMessages: messages.length,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

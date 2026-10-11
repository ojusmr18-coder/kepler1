import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ClearSessionResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group E - Clear Chat Session]             */
/* Protocol: DELETE /api/ai/chat/session/[sessionId]                         */
/* Purpose: Clears Allie multi-turn conversational memory for a given session*/
/* Expected Input: Path parameter: sessionId                                 */
/* Expected Output: ClearSessionResponse { success, sessionId, message }     */
/* Related Frontend Page: /ask, /doubt-solver (DoubtSolvingInterface.tsx)    */
/* ========================================================================= */

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = params.sessionId;
  serverStore.clearChatSession(sessionId);

  return NextResponse.json<ClearSessionResponse>(
    {
      success: true,
      sessionId,
      message: `Session "${sessionId}" successfully cleared.`,
    },
    { status: 200 }
  );
}

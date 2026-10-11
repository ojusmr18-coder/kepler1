import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { FlashcardsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group C - Interactive Flashcards]         */
/* Protocol: GET /api/learn/flashcards                                       */
/* Purpose: Retrieves interactive flashcards (front/back/hints) for a topic  */
/* Expected Input: Query param: ?topicId=kepler-laws                         */
/* Expected Output: FlashcardsResponse { topicId, chapterTitle, flashcards } */
/* Related Frontend Page: /revision (RevisionClientView.tsx)                 */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId") || searchParams.get("topic") || "kepler-laws";

  const data = serverStore.getFlashcards(topicId);

  return NextResponse.json<FlashcardsResponse>(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  });
}

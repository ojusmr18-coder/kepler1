import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { RevisionNotesResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group C - Revision Notes]                 */
/* Protocol: GET /api/learn/revision-notes                                   */
/* Purpose: Retrieves structured chapter revision summaries & key formulas   */
/* Expected Input: Query param: ?topicId=kepler-laws                         */
/* Expected Output: RevisionNotesResponse { topicId, chapterTitle, revisionNotes }*/
/* Related Frontend Page: /revision (RevisionClientView.tsx)                 */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId") || searchParams.get("topic") || "kepler-laws";

  const data = serverStore.getRevisionNotes(topicId);

  return NextResponse.json<RevisionNotesResponse>(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ChaptersResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group C - Chapters by Subject]            */
/* Protocol: GET /api/learn/chapters                                         */
/* Purpose: Retrieves chapters, descriptions, and duration by subject        */
/* Expected Input: Query param: ?subjectId=physics (or string ID)            */
/* Expected Output: ChaptersResponse { subjectId, subjectTitle, chapters }  */
/* Related Frontend Page: /learn (LearnSubjectView.tsx)                      */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId") || searchParams.get("subject") || "physics";

  const subject = serverStore.getSubjectById(subjectId);
  const chapters = serverStore.getChaptersBySubject(subjectId);

  return NextResponse.json<ChaptersResponse>(
    {
      subjectId,
      subjectTitle: subject?.title || subjectId,
      chapters,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    }
  );
}

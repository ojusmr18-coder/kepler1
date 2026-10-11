import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ChapterMaterialResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group C - Chapter Material & PDF Link]    */
/* Protocol: GET /api/learn/material                                         */
/* Purpose: Retrieves theory summary, resource count, and direct PDF link   */
/* Expected Input: Query param: ?chapterId=phys-1 (or ?topicId=...)           */
/* Expected Output: ChapterMaterialResponse                                  */
/* Related Frontend Page: /study (StudyClientView.tsx)                       */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chapterId =
    searchParams.get("chapterId") ||
    searchParams.get("chapter") ||
    searchParams.get("topicId") ||
    searchParams.get("topic") ||
    "light-reflection";

  const material = serverStore.getChapterMaterial(chapterId);

  return NextResponse.json<ChapterMaterialResponse>(material, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  });
}

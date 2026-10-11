import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { QuizzesResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group D - Available Quizzes]              */
/* Protocol: GET /api/test/quizzes                                           */
/* Purpose: Retrieves available topic quizzes and mock diagnostics           */
/* Expected Input: Optional query param: ?subject=Physics                    */
/* Expected Output: QuizzesResponse { quizzes: Array<{ id, topicTitle, ... }>} */
/* Related Frontend Page: /test (TestClientView.tsx)                         */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject") || undefined;

  const quizzes = serverStore.getAvailableQuizzes(subject);

  return NextResponse.json<QuizzesResponse>(
    { quizzes },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

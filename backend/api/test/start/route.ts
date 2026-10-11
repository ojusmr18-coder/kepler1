import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { QuizDetail } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group D - Start Quiz & Questions]         */
/* Protocol: GET /api/test/start                                             */
/* Purpose: Retrieves active quiz question items (without showing answers)   */
/* Expected Input: Query param: ?topicId=kepler-laws (or ?quizId=...)        */
/* Expected Output: QuizDetail { id, topicTitle, questions: QuizQuestionItem[] }*/
/* Related Frontend Page: /test (TestClientView.tsx)                         */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topicId =
    searchParams.get("topicId") ||
    searchParams.get("topic") ||
    searchParams.get("quizId") ||
    searchParams.get("id") ||
    "kepler-laws";

  const quiz = serverStore.getQuizDetail(topicId);

  if (!quiz) {
    return NextResponse.json(
      { error: `Quiz for topic "${topicId}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json<QuizDetail>(quiz, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-cache",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { SubmitQuizRequest, SubmitQuizResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group D - Submit Quiz & Calculate Score]  */
/* Protocol: POST /api/test/submit                                           */
/* Purpose: Submits student answers, calculates score, correct/incorrect     */
/*          counts, accuracy, updates Improvement Book, and stores result    */
/* Expected Input: SubmitQuizRequest { topicId, selectedAnswers, timeSpentSeconds }*/
/* Expected Output: SubmitQuizResponse { success: true, result: TestResultData }*/
/* Related Frontend Page: /test (TestClientView.tsx) -> /test/result         */
/* ========================================================================= */

export async function POST(request: NextRequest) {
  try {
    const body: SubmitQuizRequest = await request.json();

    if (!body.topicId || !body.selectedAnswers) {
      return NextResponse.json(
        { success: false, error: "topicId and selectedAnswers are required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    const student = serverStore.getStudentFromToken(authHeader);
    const effectiveStudentId = body.studentId || student?.id;

    const result = serverStore.submitQuiz(
      body.topicId,
      body.selectedAnswers,
      body.timeSpentSeconds || 60,
      effectiveStudentId
    );

    return NextResponse.json<SubmitQuizResponse>(
      {
        success: true,
        result,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to calculate test result";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

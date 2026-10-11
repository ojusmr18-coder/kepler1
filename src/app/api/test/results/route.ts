import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { TestResultsHistoryResponse, TestResultData } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group D - Test Results & History]         */
/* Protocol: GET /api/test/results                                           */
/* Purpose: Retrieves dynamic test result calculation or complete history    */
/* Expected Input: Optional query param: ?testId=quiz-kepler-laws            */
/* Expected Output: TestResultData or TestResultsHistoryResponse             */
/* Related Frontend Page: /test/result, /test                                */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testId = searchParams.get("testId") || searchParams.get("id");

  if (testId) {
    const singleResult = serverStore.getTestResultById(testId);
    if (singleResult) {
      return NextResponse.json<TestResultData>(singleResult, { status: 200 });
    }
  }

  const results = serverStore.getTestResultsHistory();
  return NextResponse.json<TestResultsHistoryResponse>(
    { results },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

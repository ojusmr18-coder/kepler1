import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ScoreBoosterTasksResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group F - Recommended Tasks]              */
/* Protocol: GET /api/score-booster/tasks                                    */
/* Purpose: Retrieves high-yield practice tasks filtered by subject         */
/* Expected Input: Optional query param: ?subject=Physics                    */
/* Expected Output: ScoreBoosterTasksResponse { tasks: ScoreBoosterTask[] }  */
/* Related Frontend Page: /score-booster, /dashboard                         */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject") || undefined;

  const tasks = serverStore.getScoreBoosterTasks(subject);

  return NextResponse.json<ScoreBoosterTasksResponse>(
    { tasks },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

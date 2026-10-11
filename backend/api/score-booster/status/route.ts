import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ScoreBoosterStatusResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group F - Score Booster Status]           */
/* Protocol: GET /api/score-booster/status                                   */
/* Purpose: Retrieves current score vs next goal and platform character state*/
/* Expected Input: None                                                      */
/* Expected Output: ScoreBoosterStatusResponse { currentMarks, nextGoalMarks, ...}*/
/* Related Frontend Page: /score-booster, /dashboard (ScoreBoosterSection)   */
/* ========================================================================= */

export async function GET() {
  const status = serverStore.getScoreBoosterStatus();
  return NextResponse.json<ScoreBoosterStatusResponse>(status, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-cache",
    },
  });
}

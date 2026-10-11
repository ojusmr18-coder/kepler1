import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { CompleteTaskResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group F - Complete Booster Task]          */
/* Protocol: POST /api/score-booster/tasks/[id]/complete                     */
/* Purpose: Marks a task completed, awards points, triggers character jump   */
/* Expected Input: Path parameter: id                                        */
/* Expected Output: CompleteTaskResponse { success, newMarks, triggerAnimation }*/
/* Related Frontend Page: /score-booster, /dashboard                         */
/* ========================================================================= */

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;
  const result = serverStore.completeScoreBoosterTask(taskId);

  return NextResponse.json<CompleteTaskResponse>(result, { status: 200 });
}

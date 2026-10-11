import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { MistakesResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group G - Improvement Book Mistakes List] */
/* Protocol: GET /api/mistakes                                               */
/* Purpose: Retrieves student mistake analytics categorized by error type    */
/* Expected Input: None or ?studentId=...                                    */
/* Expected Output: MistakesResponse { mistakes: LoggedMistake[] }            */
/* Related Frontend Page: /improve (ImprovePage)                             */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const student = serverStore.getStudentFromToken(authHeader);
  const { searchParams } = new URL(request.url);
  const queryStudentId = searchParams.get("studentId");
  const targetStudentId = queryStudentId || student?.id;

  const mistakes = serverStore.getMistakes(targetStudentId);
  return NextResponse.json<MistakesResponse>(
    { mistakes },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

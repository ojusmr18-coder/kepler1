import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { UpdateMistakeRequest, LoggedMistake } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group G - Mark Mistake Reviewed]          */
/* Protocol: PATCH /api/mistakes/[id]                                        */
/* Purpose: Marks a logged mistake as reviewed or unreviewed                 */
/* Expected Input: UpdateMistakeRequest { reviewed: boolean }                */
/* Expected Output: { success: true, mistake: LoggedMistake }                */
/* Related Frontend Page: /improve (ImprovePage)                             */
/* ========================================================================= */

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: UpdateMistakeRequest = await request.json();

    const authHeader = request.headers.get("Authorization");
    const student = serverStore.getStudentFromToken(authHeader);
    const { searchParams } = new URL(request.url);
    const queryStudentId = searchParams.get("studentId");
    const targetStudentId = queryStudentId || student?.id;

    const mistake = serverStore.updateMistakeReviewed(id, body.reviewed, targetStudentId);

    if (!mistake) {
      return NextResponse.json(
        { success: false, error: "Mistake not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<{ success: boolean; mistake: LoggedMistake }>(
      {
        success: true,
        mistake,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update mistake";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

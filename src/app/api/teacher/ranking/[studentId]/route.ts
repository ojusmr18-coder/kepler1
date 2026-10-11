import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Single Student Ranking & Remarks Update]           */
/* Protocol: PATCH /api/teacher/ranking/{studentId}                          */
/* ========================================================================= */

export async function PATCH(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId;
    const body = await request.json().catch(() => ({}));
    const { teacherRankOutOf10, teacherRemarks } = body;

    if (typeof teacherRankOutOf10 !== "number") {
      return NextResponse.json(
        { error: "Numeric teacherRankOutOf10 (between 1 and 10) is required" },
        { status: 400 }
      );
    }

    const updated = serverStore.updateStudentRanking(
      studentId,
      teacherRankOutOf10,
      teacherRemarks
    );

    if (!updated) {
      return NextResponse.json(
        { error: `Student with ID "${studentId}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully set rank ${updated.teacherRankOutOf10}/10 for ${updated.studentName}`,
        ranking: updated,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update student rank";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

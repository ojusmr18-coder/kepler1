import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { TeacherRankingsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Student Ranking Leaderboard Endpoint]              */
/* Protocol: GET /api/teacher/ranking                                        */
/* Query Params: subject (optional)                                          */
/* Protocol: PATCH /api/teacher/ranking                                      */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject") || undefined;

    const rankings = serverStore.getTeacherRankings(subject);

    const responsePayload: TeacherRankingsResponse = {
      rankings,
    };

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch rankings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { studentId, teacherRankOutOf10, teacherRemarks } = body;

    if (!studentId || typeof teacherRankOutOf10 !== "number") {
      return NextResponse.json(
        { error: "studentId and numeric teacherRankOutOf10 (1-10) are required" },
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
        message: `Updated ranking for student ${updated.studentName} to ${updated.teacherRankOutOf10}/10`,
        ranking: updated,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update ranking";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

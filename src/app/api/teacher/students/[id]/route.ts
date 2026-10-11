import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { TeacherStudentDetail } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Individual Student Profile & Remarks Endpoint]     */
/* Protocol: GET /api/teacher/students/{id}                                  */
/* Protocol: PATCH /api/teacher/students/{id}                                */
/* ========================================================================= */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const student = serverStore.getTeacherStudentDetail(studentId);

    if (!student) {
      return NextResponse.json(
        { error: `Student with ID "${studentId}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json<TeacherStudentDetail>(student, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to retrieve student profile";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const body = await request.json().catch(() => ({}));
    const remarks = body.remarks ?? "";
    const rankOutOf10 = typeof body.teacherRankOutOf10 === "number" ? body.teacherRankOutOf10 : undefined;

    const updated = serverStore.updateStudentRemarks(studentId, remarks, rankOutOf10);

    if (!updated) {
      return NextResponse.json(
        { error: `Student with ID "${studentId}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student remarks and teacher rank successfully updated",
        student: updated,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update remarks";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

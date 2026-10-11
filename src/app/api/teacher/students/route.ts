import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { TeacherStudentsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Students List & Filter Endpoint]                   */
/* Protocol: GET /api/teacher/students                                       */
/* Query Params: class, subject, performance, search                         */
/* Expected Output: TeacherStudentsResponse                                  */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get("class") || undefined;
    const subjectFilter = searchParams.get("subject") || undefined;
    const performanceFilter = searchParams.get("performance") || undefined;
    const search = searchParams.get("search") || undefined;

    const data: TeacherStudentsResponse = serverStore.getTeacherStudents({
      class: classFilter,
      subject: subjectFilter,
      performance: performanceFilter,
      search,
    });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch student records";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

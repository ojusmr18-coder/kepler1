import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { TeacherClassAnalytics } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Class & Subject Analytics Endpoint]                */
/* Protocol: GET /api/teacher/analytics                                      */
/* Expected Output: TeacherClassAnalytics                                    */
/* ========================================================================= */

export async function GET() {
  try {
    const analytics: TeacherClassAnalytics = serverStore.getTeacherAnalytics();

    return NextResponse.json(analytics, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load class analytics";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

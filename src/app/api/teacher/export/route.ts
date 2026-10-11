import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Export Student Data Endpoint]                      */
/* Protocol: GET /api/teacher/export                                         */
/* Query Params: format=csv | json                                           */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") || "json").toLowerCase() as "json" | "csv";

    const exportData = serverStore.getTeacherExportData(format);

    if (format === "csv") {
      return new NextResponse(exportData as string, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="kepler-class-10-student-performance.csv"',
          "Cache-Control": "private, no-cache",
        },
      });
    }

    return NextResponse.json(exportData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="kepler-class-10-student-performance.json"',
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to export student data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

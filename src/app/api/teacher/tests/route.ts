import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { TeacherScheduleTestRequest, TeacherScheduleTestResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Test Scheduler & Announcements Endpoint]           */
/* Protocol: GET /api/teacher/tests                                          */
/* Protocol: POST /api/teacher/tests                                         */
/* ========================================================================= */

export async function GET() {
  try {
    const events = serverStore.getCalendarEvents();
    return NextResponse.json({ events }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load tests";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TeacherScheduleTestRequest = await request.json().catch(() => ({}));

    if (!body.title || !body.subject || !body.scheduledDate) {
      return NextResponse.json(
        { error: "Title, Subject, and Scheduled Date are required" },
        { status: 400 }
      );
    }

    const result = serverStore.scheduleTeacherTest({
      title: body.title,
      subject: body.subject,
      scheduledDate: body.scheduledDate,
      durationMinutes: body.durationMinutes || 45,
      questionsCount: body.questionsCount || 20,
      topicId: body.topicId,
      type: body.type || "quiz",
      section: body.section,
    });

    const response: TeacherScheduleTestResponse = {
      success: true,
      event: result.event,
      message: result.message,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to schedule test";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

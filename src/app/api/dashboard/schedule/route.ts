import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ScheduleResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group B - Student Schedule & Live Classes]*/
/* Protocol: GET /api/dashboard/schedule                                     */
/* Purpose: Retrieves upcoming class schedule or triggers "All Set" state   */
/* Expected Input: None                                                      */
/* Expected Output: ScheduleResponse { schedule: ScheduleItem[], emptyMessage? }*/
/* Related Frontend Page: /dashboard (ScheduleSection.tsx)                   */
/* ========================================================================= */

export async function GET() {
  const schedule = serverStore.getSchedule();
  return NextResponse.json<ScheduleResponse>(
    {
      schedule,
      emptyMessage:
        schedule.length === 0
          ? "No more classes scheduled. Check your calendar for what's next!"
          : undefined,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

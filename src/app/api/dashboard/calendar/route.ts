import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { CalendarResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group B - Academic Calendar Events]       */
/* Protocol: GET /api/dashboard/calendar                                     */
/* Purpose: Retrieves scheduled diagnostic quizzes, tests & revision items   */
/* Expected Input: None                                                      */
/* Expected Output: CalendarResponse { events: CalendarEvent[] }             */
/* Related Frontend Page: /calendar (CalendarClientView.tsx)                 */
/* ========================================================================= */

export async function GET() {
  const events = serverStore.getCalendarEvents();
  return NextResponse.json<CalendarResponse>(
    { events },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

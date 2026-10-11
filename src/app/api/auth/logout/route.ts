import { NextResponse } from "next/server";
import { LogoutResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group A - Student Logout]                 */
/* Protocol: POST /api/auth/logout                                           */
/* Purpose: Invalidate student session and clear authentication token         */
/* Expected Input: None (or Authorization Bearer Token)                      */
/* Expected Output: LogoutResponse { success: true, message: string }        */
/* Related Frontend Page: /dashboard (ClassroomDashboard sign out)           */
/* ========================================================================= */

export async function POST() {
  return NextResponse.json<LogoutResponse>(
    {
      success: true,
      message: "Successfully signed out of student session",
    },
    { status: 200 }
  );
}

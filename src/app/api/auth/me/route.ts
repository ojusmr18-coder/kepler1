import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { StudentProfile } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group A - Current Student Profile]        */
/* Protocol: GET /api/auth/me                                                */
/* Purpose: Retrieve current authenticated student profile                   */
/* Expected Input: Optional Bearer Token (`Authorization: Bearer <token>`)   */
/* Expected Output: StudentProfile { id, name, email, targetExam, role }     */
/* Related Frontend Page: /dashboard, / (User profile greeting & header)     */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const student = serverStore.getStudentFromToken(authHeader);
  return NextResponse.json<StudentProfile>(student, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-cache",
    },
  });
}

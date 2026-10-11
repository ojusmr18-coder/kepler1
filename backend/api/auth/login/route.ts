import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { LoginResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group A - Student Login]                  */
/* Protocol: POST /api/auth/login                                            */
/* Purpose: Authenticate student credentials (Student ID or Email + Password)*/
/* Expected Input: { email/studentId: string, password: string }             */
/* Expected Output: LoginResponse { success, token, student }                */
/* Related Frontend Page: / (SignInPage.tsx)                                 */
/* ========================================================================= */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const credential = body.email || body.studentId || "";
    const password = body.password || "";

    if (!credential || !password) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: "Student ID / Email and password are required" },
        { status: 400 }
      );
    }

    // Authenticate student against serverStore
    const authResult = serverStore.authenticateStudent(credential);

    return NextResponse.json<LoginResponse>(
      {
        success: true,
        token: authResult.token,
        student: authResult.student,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    return NextResponse.json<LoginResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

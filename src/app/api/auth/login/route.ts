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
    const credential = (body.email || body.studentId || "").trim();
    // If password provided, validate it; otherwise authenticateStudent defaults to user ID
    const password =
      body.password !== undefined && body.password !== null && String(body.password).trim() !== ""
        ? String(body.password).trim()
        : undefined;

    if (!credential) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: "Student ID or Email is required" },
        { status: 400 }
      );
    }

    // Check if credential belongs to a teacher/educator
    const isTeacher =
      credential.toUpperCase().startsWith("TEACH") ||
      credential.toUpperCase().startsWith("T-") ||
      credential.toUpperCase().startsWith("INS-") ||
      credential.toLowerCase().includes("teacher") ||
      credential.toLowerCase().includes("jenkins") ||
      credential.toLowerCase().includes("verma") ||
      body.role === "instructor" ||
      body.role === "teacher";

    if (isTeacher) {
      const authResult = serverStore.authenticateTeacher(credential);
      return NextResponse.json<LoginResponse>(
        {
          success: true,
          token: authResult.token,
          student: {
            id: authResult.teacher.id,
            name: authResult.teacher.name,
            email: authResult.teacher.email,
            role: authResult.teacher.role,
            school: authResult.teacher.school,
            phone: authResult.teacher.phone,
          },
        },
        { status: 200 }
      );
    }

    // Authenticate student against serverStore
    const authResult = serverStore.authenticateStudent(credential, password);

    if (!authResult.success) {
      return NextResponse.json<LoginResponse>(
        {
          success: false,
          error: authResult.error || "Invalid credentials",
        },
        { status: 401 }
      );
    }

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

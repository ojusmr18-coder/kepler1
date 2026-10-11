import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { StudentProfile, UpdateProfileRequest, UpdateProfileResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Authentication - Profile Management]      */
/* Protocol: GET /api/auth/profile                                           */
/*           PATCH /api/auth/profile                                         */
/* Purpose:                                                                  */
/*   GET: Retrieve detailed profile for the authenticated student            */
/*   PATCH: Update editable profile fields (name, email, targetExam, etc.)   */
/* Expected Input:                                                           */
/*   GET: Bearer Token (`Authorization: Bearer <token>`)                     */
/*   PATCH: UpdateProfileRequest { name?, email?, targetExam?, phone?, ... }  */
/* Expected Output:                                                          */
/*   GET: StudentProfile { id, name, email, targetExam, role, phone, ... }   */
/*   PATCH: UpdateProfileResponse { success, student, message }              */
/* Related Frontend Page: /profile (ProfilePage)                             */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const profile = serverStore.getStudentFromToken(authHeader);
  return NextResponse.json<StudentProfile>(profile, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-cache",
    },
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateProfileRequest = await request.json();

    // Basic email validation if email update provided
    if (body.email && !body.email.includes("@")) {
      return NextResponse.json<UpdateProfileResponse>(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const updated = serverStore.updateStudentProfile({
      name: body.name?.trim(),
      email: body.email?.trim(),
      targetExam: body.targetExam?.trim(),
      phone: body.phone?.trim(),
      grade: body.grade?.trim(),
      school: body.school?.trim(),
    });

    return NextResponse.json<UpdateProfileResponse>(
      {
        success: true,
        student: updated,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json<UpdateProfileResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

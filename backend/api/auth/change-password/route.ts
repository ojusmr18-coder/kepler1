import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ChangePasswordRequest, ChangePasswordResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Authentication - Change Password]         */
/* Protocol: POST /api/auth/change-password                                  */
/* Purpose: Verifies current password and updates to new student credentials */
/* Expected Input: ChangePasswordRequest { currentPassword, newPassword, confirmPassword? }*/
/* Expected Output: ChangePasswordResponse { success, message, error? }      */
/* Related Frontend Page: /change-password, /profile/security                */
/* ========================================================================= */

export async function POST(request: NextRequest) {
  try {
    const body: ChangePasswordRequest = await request.json();

    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json<ChangePasswordResponse>(
        {
          success: false,
          message: "Current password and new password are required",
          error: "Missing credentials",
        },
        { status: 400 }
      );
    }

    if (body.confirmPassword && body.newPassword !== body.confirmPassword) {
      return NextResponse.json<ChangePasswordResponse>(
        {
          success: false,
          message: "New password and confirm password do not match",
          error: "Password mismatch",
        },
        { status: 400 }
      );
    }

    if (body.newPassword.length < 6) {
      return NextResponse.json<ChangePasswordResponse>(
        {
          success: false,
          message: "New password must be at least 6 characters in length",
          error: "Password too short",
        },
        { status: 400 }
      );
    }

    const result = serverStore.changeStudentPassword(
      body.currentPassword,
      body.newPassword
    );

    if (!result.success) {
      return NextResponse.json<ChangePasswordResponse>(
        {
          success: false,
          message: result.message,
          error: result.error,
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ChangePasswordResponse>(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Password update failed";
    return NextResponse.json<ChangePasswordResponse>(
      { success: false, message: msg, error: msg },
      { status: 500 }
    );
  }
}

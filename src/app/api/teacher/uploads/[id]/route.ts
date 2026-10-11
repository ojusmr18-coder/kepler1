import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Delete Uploaded Document Endpoint]                 */
/* Protocol: DELETE /api/teacher/uploads/{id}                                */
/* ========================================================================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uploadId = params.id;
    const deleted = serverStore.deleteTeacherUpload(uploadId);

    if (!deleted) {
      return NextResponse.json(
        { error: `Upload with ID "${uploadId}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document successfully removed from repository and student views",
        id: uploadId,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete document";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

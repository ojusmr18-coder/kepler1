import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { CreatePdfUploadRequest, TeacherUploadsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [TEACHER ADMIN PORTAL: Uploaded PDFs Management Endpoint]                  */
/* Protocol: GET /api/teacher/uploads                                        */
/* Protocol: POST /api/teacher/uploads                                       */
/* ========================================================================= */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject") || undefined;
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;

    const uploads = serverStore.getTeacherUploads({ subject, type, search });

    const response: TeacherUploadsResponse = {
      uploads,
      totalUploads: uploads.length,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to retrieve uploads";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let payload: CreatePdfUploadRequest;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const title = (formData.get("title") as string) || (file?.name ? file.name.replace(/\.[^/.]+$/, "") : "Untitled Document");
      const subject = (formData.get("subject") as string) || "Physics";
      const chapterId = (formData.get("chapterId") as string) || undefined;
      const chapterTitle = (formData.get("chapterTitle") as string) || undefined;
      const type = (formData.get("type") as any) || "Study Material";
      const academicYear = (formData.get("academicYear") as string) || "2024-25";
      const description = (formData.get("description") as string) || undefined;

      payload = {
        title,
        subject,
        chapterId,
        chapterTitle,
        type,
        academicYear,
        description,
        fileSizeBytes: file?.size || 2048000,
        fileName: file?.name || `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
        pdfUrl: `/api/pdf?subject=${encodeURIComponent(subject)}&title=${encodeURIComponent(title)}`,
      };
    } else {
      payload = await request.json().catch(() => ({}));
    }

    if (!payload.title || !payload.subject || !payload.type) {
      return NextResponse.json(
        { error: "Title, Subject, and Document Type are required fields" },
        { status: 400 }
      );
    }

    const createdUpload = serverStore.addTeacherUpload(payload);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully published "${createdUpload.title}" to database and synchronized with student catalog`,
        upload: createdUpload,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to upload document";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

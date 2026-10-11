import { NextRequest, NextResponse } from "next/server";
import { generateChapterPdfBuffer } from "@/lib/pdfGenerator";
import { getStudyTopic } from "@/data/studyTopics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject") || "Physics";
  const chapterId = searchParams.get("chapter") || "chap-1";
  const title = searchParams.get("title") || "Chapter Study Material";
  const desc = searchParams.get("desc") || undefined;

  // Retrieve study topic notes if available
  const topicData = getStudyTopic(chapterId, title);

  const pdfBuffer = generateChapterPdfBuffer({
    title,
    subject,
    chapterId,
    description: desc || topicData?.revisionNotes?.summary,
    keyPoints: topicData?.revisionNotes?.keyPoints,
    formulas: topicData?.revisionNotes?.formulas
  });

  const safeFilename = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safeFilename || "chapter-notes"}.pdf"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}

import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { CustomPracticeRequest, CustomPracticeResponse, QuizQuestionItem } from "@/types/api";
import { buildCustomPracticeQuiz, getChaptersForSubject } from "@/data/quizCatalog";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group D - Custom Practice Generator]      */
/* Protocol: POST /api/test/custom                                           */
/* Purpose: Generates personalized adaptive question set based on selected   */
/*          chapters and difficulty level from master quiz pool              */
/* Expected Input: CustomPracticeRequest { subjectId, chapterIds, ... }       */
/* Expected Output: CustomPracticeResponse { quizId, title, questions }       */
/* Related Frontend Page: /test/custom (CustomPracticeSelection.tsx)         */
/* ========================================================================= */

export async function POST(request: NextRequest) {
  try {
    const body: CustomPracticeRequest = await request.json();
    const subjectId = body.subjectId || "physics";
    const requestedCount = body.questionCount || 5;

    let targetChapterIds = body.chapterIds || [];
    if (targetChapterIds.length === 0) {
      // Default to chapters of this subject
      const subjectChapters = getChaptersForSubject(subjectId);
      targetChapterIds = subjectChapters.slice(0, 3).map((c) => c.code);
    }

    // Build custom practice quiz from master catalog
    const customQuiz = buildCustomPracticeQuiz(targetChapterIds, requestedCount);

    const questions: QuizQuestionItem[] = customQuiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
    }));

    // Register into serverStore so it can be evaluated on submit
    serverStore.registerCustomQuiz({
      id: customQuiz.quizId,
      topicTitle: customQuiz.title,
      chapter: customQuiz.title,
      subject: customQuiz.subject,
      durationMinutes: Math.max(5, Math.round(questions.length * 1.5)),
      questionCount: questions.length,
      questions,
      correctAnswers: customQuiz.correctAnswers,
    });

    return NextResponse.json<CustomPracticeResponse>(
      {
        quizId: customQuiz.quizId,
        title: customQuiz.title,
        subject: customQuiz.subject,
        questions,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate custom practice";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

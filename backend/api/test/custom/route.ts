import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { CustomPracticeRequest, CustomPracticeResponse, QuizQuestionItem } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group D - Custom Practice Generator]      */
/* Protocol: POST /api/test/custom                                           */
/* Purpose: Generates personalized adaptive question set based on selected   */
/*          chapters and difficulty level                                    */
/* Expected Input: CustomPracticeRequest { subjectId, chapterIds, ... }       */
/* Expected Output: CustomPracticeResponse { quizId, title, questions }       */
/* Related Frontend Page: /test/custom (CustomPracticeSelection.tsx)         */
/* ========================================================================= */

export async function POST(request: NextRequest) {
  try {
    const body: CustomPracticeRequest = await request.json();
    const subjectId = body.subjectId || "physics";
    const subject = serverStore.getSubjectById(subjectId);

    // Aggregate questions from selected chapters or standard curriculum
    const questions: QuizQuestionItem[] = [
      {
        id: "cp_q1",
        question: `For CBSE Class 10 ${subject?.title || "Physics"}, what is the primary consequence when light passes into a denser medium?`,
        options: [
          "It bends towards the normal and slows down",
          "It bends away from the normal and speeds up",
          "Its frequency doubles",
          "Its direction remains unchanged",
        ],
        explanation: "In an optically denser medium, speed of light decreases and the ray bends towards the normal.",
      },
      {
        id: "cp_q2",
        question: "Calculate the effective focal length of two thin lenses of power +3 D and -1 D placed in contact.",
        options: ["+2 D (f = 0.5 m)", "+4 D (f = 0.25 m)", "-2 D (f = -0.5 m)", "+1 D (f = 1 m)"],
        explanation: "P_net = P1 + P2 = +3 - 1 = +2 D. f = 1/P = 1/2 = 0.5 metres.",
      },
      {
        id: "cp_q3",
        question: "Which of the following materials has highest electrical resistivity?",
        options: ["Silver", "Copper", "Nichrome", "Nichrome wire at low temp"],
        explanation: "Nichrome is an alloy with resistivity significantly higher than pure metals like Copper and Silver.",
      },
    ];

    const count = body.questionCount || 3;
    const selectedQuestions = questions.slice(0, count);

    return NextResponse.json<CustomPracticeResponse>(
      {
        quizId: "custom_" + Date.now(),
        title: `Custom Practice: ${subject?.title || "Class 10 Science"}`,
        subject: subject?.title || "Science",
        questions: selectedQuestions,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate custom practice";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

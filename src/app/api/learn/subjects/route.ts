import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { SubjectsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group C - Subjects List]                  */
/* Protocol: GET /api/learn/subjects                                         */
/* Purpose: Retrieves active curriculum subjects (CBSE Class 10 subjects)    */
/* Expected Input: None                                                      */
/* Expected Output: SubjectsResponse { subjects: SubjectItem[] }             */
/* Related Frontend Page: /learn (LearnSubjectView.tsx)                      */
/* ========================================================================= */

export async function GET() {
  const subjects = serverStore.getSubjects();
  return NextResponse.json<SubjectsResponse>(
    { subjects },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    }
  );
}

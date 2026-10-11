import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { MyDoubtsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group E - My Doubts List]                 */
/* Protocol: GET /api/ai/doubts                                              */
/* Purpose: Retrieves resolved doubt queries with formulas and explanations  */
/* Expected Input: None                                                      */
/* Expected Output: MyDoubtsResponse { doubts: ResolvedDoubt[] }             */
/* Related Frontend Page: /ask (My Doubts section)                           */
/* ========================================================================= */

export async function GET() {
  const doubts = serverStore.getMyDoubts();
  return NextResponse.json<MyDoubtsResponse>(
    { doubts },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

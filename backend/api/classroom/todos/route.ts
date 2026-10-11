import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { ClassroomTodosResponse, ClassroomTodoItem } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group B - Classroom Blackboard To-Dos]    */
/* Protocol: GET /api/classroom/todos                                        */
/*           POST /api/classroom/todos                                       */
/* Purpose: Retrieve or add active student tasks displayed on blackboard     */
/* Expected Input:                                                           */
/*   GET: None                                                               */
/*   POST: { text: string, topicId?: string, topicTitle?: string, ... }      */
/* Expected Output:                                                          */
/*   GET: ClassroomTodosResponse { todos: ClassroomTodoItem[] }              */
/*   POST: { success: true, todo: ClassroomTodoItem }                        */
/* Related Frontend Page: /dashboard (ClassroomDashboard.tsx)                */
/* ========================================================================= */

export async function GET() {
  const todos = serverStore.getTodos();
  return NextResponse.json<ClassroomTodosResponse>(
    { todos },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-cache",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.text) {
      return NextResponse.json(
        { success: false, error: "Task text is required" },
        { status: 400 }
      );
    }

    const newTodo = serverStore.addTodo({
      text: body.text,
      completed: false,
      dueDate: body.dueDate,
      topicId: body.topicId,
      topicTitle: body.topicTitle,
      quizId: body.quizId,
    });

    return NextResponse.json(
      { success: true, todo: newTodo },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create task";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

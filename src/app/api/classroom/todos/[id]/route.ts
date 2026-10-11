import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";
import { UpdateTodoRequest } from "@/types/api";

export const dynamic = "force-dynamic";

/* ========================================================================= */
/* [BACKEND HANDLER SPECIFICATION: Group B - Toggle / Update / Delete To-Do] */
/* Protocol: PATCH /api/classroom/todos/[id]                                 */
/*           DELETE /api/classroom/todos/[id]                                */
/* Purpose: Toggles completion status or deletes to-do task                  */
/* Expected Input:                                                           */
/*   PATCH: { completed?: boolean, text?: string }                           */
/*   DELETE: None                                                            */
/* Expected Output:                                                          */
/*   PATCH: { success: true, todo: ClassroomTodoItem }                       */
/*   DELETE: { success: true, id: string }                                   */
/* Related Frontend Page: /dashboard (ClassroomDashboard.tsx)                */
/* ========================================================================= */

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: UpdateTodoRequest = await request.json();

    const updatedTodo = serverStore.updateTodo(id, {
      completed: body.completed,
      text: body.text,
    });

    if (!updatedTodo) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        todo: updatedTodo,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update task";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const deleted = serverStore.deleteTodo(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, id },
    { status: 200 }
  );
}

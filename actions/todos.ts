"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { todos } from "@/database/schema"

type CreateTodoState = { error: string } | { success: boolean }

export async function createTodo(prevState: CreateTodoState, formData: FormData): Promise<CreateTodoState> {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { error: "Not authenticated" }
    }
  
    const title = formData.get("title")?.toString() || ""
    if (title.length === 0) return { error: "Title is required" }
    await new Promise((res) => setTimeout(res, 1000))
    await db.insert(todos).values({
        title: title,
        userId: session.user.id
      })
      
    revalidatePath("/todos")
    return { success: true }
}

export async function toggleTodo(todo_id: string, completed: boolean) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { error: "Not authenticated" }
    }

    await db
    .update(todos)
    .set({ completed: !completed })
    .where(eq(todos.id, todo_id))

    revalidatePath("/todos")

  return { success: true }
}

export async function deleteTodo(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== "admin") {
        return;
      }

    const id = formData.get("id") as string;
    await db.delete(todos)
        .where(eq(todos.id, id));

    revalidatePath("/admin");
}

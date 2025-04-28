"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { blogs } from "@/database/schema"

type CreateBlogState = { error: string } | { success: boolean }


export async function createBlog(prevState: CreateBlogState, formData: FormData): Promise<CreateBlogState> {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { error: "Not authenticated" }
    }
  
    const title = formData.get("title")?.toString() || ""
    const content = formData.get("content")?.toString() || ""
    if (title.length === 0) return { error: "Title is required" }
    await new Promise((res) => setTimeout(res, 1000))
    await db.insert(blogs).values({
        title: title,
        content: content,
        userId: session.user.id
      })
      
    revalidatePath("/blogs")
    return { success: true }
}



export async function deleteBlog(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user.id) {
        return;
      }

    const id = formData.get("id") as string;
    await db.delete(blogs)
        .where(eq(blogs.id, id));

    revalidatePath("/admin");
}

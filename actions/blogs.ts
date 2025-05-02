"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { blogs } from "@/database/schema"
import { statusEnum } from "@/database/schema/blog"

import { STATUS_OPTIONS, type StatusOption } from "@/lib/statuses"
import { TAG_OPTIONS, type TagOption }       from "@/lib/tags"

import { sql } from "drizzle-orm"

type CreateBlogState = { error: string } | { success: boolean }


export async function createBlog(prevState: CreateBlogState, formData: FormData): Promise<CreateBlogState> {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return { error: "Not authenticated" }
    }
  
    const title = formData.get("title")?.toString() || ""
    const content = formData.get("content")?.toString() || ""

    const rawMood = formData.get("mood")?.toString().trim() || ""
    const parsedMood = Number(rawMood)
    const mood = !isNaN(parsedMood) ? parsedMood : 0

    const rawTags = formData.getAll("tags");
    const tags: TagOption[] = rawTags
      .filter((t): t is string => typeof t === "string")
      .filter((t): t is TagOption => TAG_OPTIONS.includes(t as TagOption))

    const rawStatus = formData.get("status")?.toString().trim() || "";
    const status: StatusOption = STATUS_OPTIONS.includes(rawStatus as StatusOption)
      ? (rawStatus as StatusOption)
      : "private"

    if (title.length === 0) return { error: "Title is required" }

    await new Promise((res) => setTimeout(res, 1000))

    await db.insert(blogs).values({
        title: title,
        content: content,
        mood,
        tags,
        status,
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


export async function likeBlog(blogId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return

  await db
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, blogId))

  revalidatePath("/blogs")
  revalidatePath("/discover")
}

export async function unlikeBlog(blogId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return

  await db
    .update(blogs)
    .set({ likes: sql`${blogs.likes} - 1` })
    .where(eq(blogs.id, blogId))

  revalidatePath("/blogs")
  revalidatePath("/discover")
}

export async function toggleBlogStatus(id: string, currentStatus: string, path: string ) {
  const newStatus = currentStatus === "public" ? "private" : "public"
  await db
    .update(blogs)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(blogs.id, id))

  revalidatePath(path)
}
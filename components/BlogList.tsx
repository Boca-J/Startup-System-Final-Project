"use client"

import { useState } from "react"

import { useActionState, useOptimistic } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Blog } from "@/database/schema"
import {createBlog} from "@/actions/blogs"

import { BlogItem } from "./BlogItem"

type CreateBlogState = { error: string } | { success: boolean }
export function BlogList({ blogs, display }: { blogs: Blog[], display: boolean }) {

    const [optimisticBlogs, addOptimisticBlogs] = useOptimistic(blogs, (state: Blog[], newBlog: Blog) => [
        ...state,
        newBlog
      ])
   
    
    const [state, formAction, isPending] = useActionState<CreateBlogState, FormData>(
        createBlog,
        { error: "" }
      )


    
    const handleSubmit = async (formData: FormData) => {
        const title = formData.get("title")?.toString() || ""
        const content = formData.get("content")?.toString() || ""
        if (!title) return
    
        addOptimisticBlogs({
          id: crypto.randomUUID(),
          title,
          content,
          userId: "optimistic", // temp
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [""],
          likes:0
        })
    
        formAction(formData)
      }




    return (
        <div className="space-y-4">
            {display && <form className="flex flex-col gap-2 items-stretch" action={handleSubmit} >
                <Input
                    name="title"
                    placeholder={"Add a new blog..."}
                    className="h-10"

                />
                <Input
                    name="content"
                    placeholder={"content here..."}
                    className="h-30"

                />
                <div className="flex justify-center">
                    <Button type="submit" disabled={isPending} className="w-50">
                        {isPending ? "Adding..." : "Add"}
                    </Button>
                </div>
            </form>}
            
            {/* {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )} */}
            <ul className="space-y-2 mt-20">
                {optimisticBlogs.map((blog) => (
                    <BlogItem key={blog.id} blog={blog} />
                ))}
            </ul>
        </div>
    )
} 
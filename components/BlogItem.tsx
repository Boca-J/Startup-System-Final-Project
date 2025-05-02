"use client"

import { useTransition, useState, useEffect } from "react"
import { Blog } from "@/database/schema"
import { authClient } from "@/lib/auth-client"
import { deleteBlog, likeBlog, unlikeBlog } from "@/actions/blogs"
import { Button } from "@/components/ui/button"
import {  toggleBlogStatus } from "@/actions/blogs";
import { usePathname } from 'next/navigation'


function moodToEmoji(mood: number): string {
  switch (mood) {
    case 1: return "😞"
    case 2: return "😕"
    case 3: return "😐"
    case 4: return "🙂"
    case 5: return "😄"
    default: return ''
  }
}

export function BlogItem({ blog }: { blog: Blog & { likesByMe?: boolean };}) {
  const { data: session } = authClient.useSession()
  const [isPending, startTransition] = useTransition()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(blog.likes ?? 0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathName = usePathname()

  useEffect(() => {
    const saved = window.localStorage.getItem(`liked-${blog.id}`)
    if (saved === "true") setLiked(true)
  }, [blog.id])

  useEffect(() => {
    window.localStorage.setItem(`liked-${blog.id}`, liked ? "true" : "false")
  }, [liked, blog.id])

  const handleToggle = () => {
    const next = !liked
    startTransition(() => {
      setLiked(next)
      setCount((c) => c + (next ? 1 : -1))
      if (liked) {
        unlikeBlog(blog.id)
      } else {
        likeBlog(blog.id)
      }
    })
  }

  const created = new Date(blog.createdAt)
  const formattedDate = created.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const formattedTime = created.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <li className="relative border rounded-xl p-6 shadow-md bg-white space-y-4">
      {/* Dropdown menu */}
      {session?.user.id === blog.userId && (
        <div className="absolute top-3 right-3">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="hover:bg-gray-100 rounded-full p-1">
            <svg width="20" height="20" fill="currentColor" className="text-gray-500" viewBox="0 0 20 20">
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                <form action={deleteBlog}>
                <input type="hidden" name="id" value={blog.id} />
                <button
                    type="submit"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                >
                    Delete
                </button>
                </form>
                <form
                action={() => toggleBlogStatus(blog.id, blog.status, pathName)}
                >
                <button
                    type="submit"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                >
                    {blog.status === "public" ? "Set to Private" : "Set to Public"}
                </button>
                </form>
            </div>
)}

        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold ">{blog.title}</h2>
      </div>

      {/* Content with divider */}
      <div className="rounded-md bg-gray-50 px-4 py-3 text-left text-gray-800 whitespace-pre-wrap">
        {blog.content}
    </div>

      {/* Mood + Time + Tags (one line) */}
      <div className="mt-4 flex items-center justify-between">
  {/* Like Button on the Left */}
  
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="text-red-500 hover:text-red-600 flex items-center gap-1"
    >
      {liked ? "❤️" : "🤍"} {count}
    </button>
  
  {/* Mood, Tags, Time on the Right (from right to left) */}
  <div className="flex gap-[30px] items-center text-sm text-gray-500">
    {/* Mood */}
   {moodToEmoji(blog.mood ?? 0) !== '' && <span>
      
      Mood: <span className="text-base">{moodToEmoji(blog.mood ?? 0)}</span>
    </span>
}
   
    {/* Tags */}
    {Array.isArray(blog.tags) && blog.tags.length > 0 && (
      <span className="flex gap-1">
        {blog.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </span>
    )}

    {/* Time */}
    <time dateTime={created.toISOString()}>
      {formattedDate} — {formattedTime}
    </time>
  </div>
</div>
    </li>
  )
}

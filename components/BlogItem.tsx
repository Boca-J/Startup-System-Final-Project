import { Blog } from "@/database/schema";
import { Checkbox } from "@/components/ui/checkbox";

import { authClient } from "@/lib/auth-client"
import { deleteBlog, likeBlog, unlikeBlog } from "@/actions/blogs"
import { Button } from "@/components/ui/button"

import { useTransition, useState, useEffect } from "react"

function moodToEmoji(mood: number): string {
    switch (mood) {
      case 1: return "😞";
      case 2: return "😕";
      case 3: return "😐";
      case 4: return "🙂";
      case 5: return "😄";
      default: return "❓";
    }
  }

export function BlogItem({ blog }: { blog: Blog & { likesByMe?: boolean } }) {
    const { data: session } = authClient.useSession()
    const [isPending, startTransition] = useTransition()
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(blog.likes ?? 0) 

    useEffect(() => {
        const saved = window.localStorage.getItem(`liked-${blog.id}`)
        if (saved === "true") {
            setLiked(true)
        }
    }, [blog.id])

    useEffect(() => {
    window.localStorage.setItem(`liked-${blog.id}`, liked ? "true" : "false")
    }, [liked, blog.id])

    const handleToggle = () => {
        const next = !liked
        startTransition(() => {
          // flip & adjust count
            setLiked(next)
            setCount((c) => c + (next ? 1 : -1))

            // fire the right server action
            if (liked) {
                unlikeBlog(blog.id)
            } else {
                likeBlog(blog.id)
            }
        })
    }

    useEffect(() => {
        if (localStorage.getItem(`liked-${blog.id}`) === "true") {
          setLiked(true)
        }
    }, [blog.id])

    const created = new Date(blog.createdAt);
    const formattedDate = created.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const formattedTime = created.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <li className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-center font-bold text-lg mb-2">{blog.title}</h2>
            <p className="text-center text-white-700">{blog.content}</p>

            <p className="text-sm text-gray-600 text-center">
                Mood: <span className="text-xl">{moodToEmoji(blog.mood ?? 0)}</span>
            </p>

            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {blog.tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                        {tag}
                    </span>
                    ))}
                </div>
            )}

            <div className="mt-2 text-center text-xs text-gray-500 flex justify-center items-center space-x-1">
                <time dateTime={created.toISOString()}>{formattedDate}</time>
                <span> --- </span>
                <time dateTime={created.toISOString()}>{formattedTime}</time>
            </div>

            <div className="flex justify-between items-center mt-2">
                {blog.status === "public" && (
                    <button
                        onClick={handleToggle}
                        disabled={isPending}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                        {liked ? "❤️" : "🤍"} {count}
                    </button>
                )}
                {session?.user.id === blog.userId && (
                <form action={deleteBlog}>
                    <input type="hidden" name="id" value={blog.id} />
                    <Button variant="destructive" size="sm" type="submit">
                    Delete
                    </Button>
                </form>
                )}
            </div>
        </li>  
        
    )
}
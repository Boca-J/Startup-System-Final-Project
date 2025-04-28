import { Blog } from "@/database/schema";
import { Checkbox } from "@/components/ui/checkbox";

import { authClient } from "@/lib/auth-client"
import { deleteBlog } from "@/actions/blogs"
import { Button } from "@/components/ui/button"
export function BlogItem({ blog }: { blog: Blog }) {
    const { data: session } = authClient.useSession()

    return (
        <>
        <li className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-center font-bold text-lg mb-2">{blog.title}</h2>
            <p className="text-center text-white-700">{blog.content}</p>
            <form action={deleteBlog}>
            <input type="hidden" name="id" value={blog.id} />
            { session?.user.id === blog.userId && <Button
                variant="destructive"
                size="sm"
                type="submit"
            >
                Delete
            </Button>}
            
        </form>
        </li>
        
        </>
        
        
    )
}
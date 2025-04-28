import { blogs as blogsTable, Blog } from "@/database/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import { db } from "@/database/db"
import { BlogList } from "@/components/BlogList"



export default async function DiscoverPage() {
   
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        
        return (
          <main className="py-8 px-4">
            <section className="container mx-auto">
              <h1 className="text-2xl font-bold mb-6">Unauthorized</h1>
              <p>You must log in to view this page.</p>
            </section>
          </main>
        )
      }

    const blogs = await db
      .select()
      .from(blogsTable)
  

    return (
        <main className="py-8 px-4">
            <section className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Blogs</h1>
                <BlogList blogs={blogs} />
            </section>
        </main>
    )
} 
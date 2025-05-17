import { blogs as blogsTable, Blog } from "@/database/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, desc } from "drizzle-orm"

import { db } from "@/database/db"
import { BlogList } from "@/components/BlogList"
import ChatWidget from "@/components/ChatWidget"

export default async function BlogsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    return (
      <main className="py-16 px-6 bg-[#f0f4f8] min-h-screen">
        <section className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600">You must log in to view this page.</p>
        </section>
      </main>
    )
  }


  const blogs = await db
    .select()
    .from(blogsTable)
    .where(eq(blogsTable.userId, session.user.id))
    .orderBy(desc(blogsTable.createdAt))

  return (
    <main className="py-16 px-6 bg-[#f0f8ff] min-h-screen">
      <section className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-400 mb-8">
          My Personal Universe
        </h1>
        <p className="text-center text-gray-400 mb-12">
          A space for your thoughts, emotions, and reflections.
        </p>
        <BlogList blogs={blogs} display={true} />
        <ChatWidget />
      </section>
    </main>
  )
}

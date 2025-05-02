"use client";

import { useSearchParams } from "next/navigation";
import { BlogList } from "@/components/BlogList";
import { TAG_OPTIONS, type TagOption } from "@/lib/tags";
import { Blog } from "@/database/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo } from "react";

export default function DiscoverClient({ blogs }: { blogs: Blog[] }) {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");

  const filterTag: TagOption | undefined = TAG_OPTIONS.includes(tagParam as TagOption)
    ? (tagParam as TagOption)
    : undefined;

  const filteredBlogs = useMemo(() => {
    if (!filterTag) return blogs;
    return blogs.filter((blog) => blog.tags?.includes(filterTag));
  }, [blogs, filterTag]);

  return (
    <>
      <form method="GET" className="mb-6 flex gap-2">
        <select
          name="tag"
          defaultValue={filterTag ?? ""}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {TAG_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <Button type="submit">Filter</Button>
        <Link href="/discover">
          <Button variant="secondary">Clear Filter</Button>
        </Link>
      </form>

      <BlogList blogs={filteredBlogs} display={false} />
    </>
  );
}
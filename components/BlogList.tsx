"use client";

import { startTransition, useState } from "react";
import { useActionState, useOptimistic } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Blog } from "@/database/schema";
import { createBlog, toggleBlogStatus } from "@/actions/blogs";

import { TAG_OPTIONS, type TagOption } from "@/lib/tags";
import { STATUS_OPTIONS, type StatusOption } from "@/lib/statuses";

import { BlogItem } from "./BlogItem";

type CreateBlogState = { error: string } | { success: boolean };

export function BlogList({
  blogs,
  display,
}: {
  blogs: Blog[];
  display: boolean;
}) {
  const [optimisticBlogs, addOptimisticBlogs] = useOptimistic(
    blogs,
    (state: Blog[], newBlog: Blog) => [...state, newBlog]
  );

  const [state, formAction, isPending] = useActionState<CreateBlogState, FormData>(
    createBlog,
    { error: "" }
  );

  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const toggleTag = (tag: TagOption) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const [selectedStatus, setSelectedStatus] = useState<StatusOption>("private");
  const toggleStatus = (status: StatusOption) => setSelectedStatus(status);

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";

    const raw = formData.get("mood")?.toString().trim() || "";
    const parsed = Number(raw);
    const mood = !isNaN(parsed) ? parsed : 0;

    const tags = selectedTags;

    if (!title) return;

    startTransition(() => {
      addOptimisticBlogs({
        id: crypto.randomUUID(),
        title,
        content,
        userId: "optimistic",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags,
        status: selectedStatus,
        likes: 0,
        mood,
      });
    });

    selectedTags.forEach((tag) => formData.append("tags", tag));
    formData.append("status", selectedStatus);

    startTransition(() => {
      formAction(formData);
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleSubmit(formData);
  };

  return (
    <div className="space-y-10">
      {display && (
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-blue-100"
        >
          <h2 className="text-xl font-semibold text-blue-400 text-center">Share Your Thoughts</h2>

          <Input name="title" placeholder="Blog title..." className="h-10" />
          <Input name="content" placeholder="Your story or reflections..." className="h-24" />
          <Input
            type="number"
            name="mood"
            min={1}
            max={5}
            placeholder="Mood (1–5)"
            className="h-10"
          />

          {/* Tag buttons */}
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => {
              const selected = selectedTags.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selected
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  #{t}
                </button>
              );
            })}
          </div>

          {/* Status buttons */}
          <div className="flex gap-4">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleStatus(status)}
                className={`px-3 py-1 rounded-md text-sm border transition ${
                  selectedStatus === status
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-green-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Button type="submit" disabled={isPending} className="w-40">
              {isPending ? "Posting..." : "Post Blog"}
            </Button>
          </div>
        </form>
      )}

      <ul className="space-y-4">
        {optimisticBlogs.map((blog) => (
          <BlogItem key={blog.id} blog={blog} />
        ))}
      </ul>
    </div>
  );
}

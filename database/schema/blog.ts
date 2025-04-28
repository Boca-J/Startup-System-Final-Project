import { integer, boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { users } from "./auth"
import { relations } from "drizzle-orm"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const blogs = pgTable("blogs", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(), // optional but recommended for display
    content: text("content").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tags: text("tags").array(), // assuming you're storing tags as string[]
    likes: integer("likes").default(0), // optional
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  })

export const usersBlogRelations = relations(users, ({ many }) => ({
    blogs: many(blogs),
}))

export const blogsRelations = relations(blogs, ({ one }) => ({
    user: one(users, {
        fields: [blogs.userId],
        references: [users.id],
    }),
}))

export const selectBlogSchema = createSelectSchema(blogs);
export type Blog = z.infer<typeof selectBlogSchema>;

export const insertBlogSchema = createInsertSchema(blogs, {
  title: (schema) => schema.nonempty("Title is required"),
  content: (schema) => schema.nonempty("Content is required"),
});
export type NewBlog = z.infer<typeof insertBlogSchema>;


export default {
    users,
    blogs
  };
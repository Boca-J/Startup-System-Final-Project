import { integer, boolean, pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core"

import { users } from "./auth"
import { relations } from "drizzle-orm"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod"

// enum for tags
export const tagEnum = pgEnum("tag_enum", [
  "Work",
  "Personal",
  "Health",
  "Study",
  "Hobby",
])

export const statusEnum = pgEnum("status_enum", ["public", "private"])

export const blogs = pgTable("blogs", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(), 
    content: text("content").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tags: tagEnum("tags").array().default([]),
    mood: integer("mood").default(0),
    status:    statusEnum("status").default("private"),
    likes: integer("likes").default(0), 
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
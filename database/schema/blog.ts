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
    status:    statusEnum("status").default("private").notNull(),
    likes: integer("likes").default(0), 
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  })



export const usersBlogRelations = relations(users, ({ many }) => ({
    blogs: many(blogs),
}))

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
  comments: many(comments), // ✅ Add this line
}));


  export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  
    blogId: uuid("blog_id")
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
  
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
  })
  

export const commentsRelations = relations(comments, ({ one }) => ({
  blog: one(blogs, {
    fields: [comments.blogId],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}))

export const usersCommentsRelations = relations(users, ({ many }) => ({
  comments: many(comments),
}));

export const selectBlogSchema = createSelectSchema(blogs);
export type Blog = z.infer<typeof selectBlogSchema>;

export const insertBlogSchema = createInsertSchema(blogs, {
  title: (schema) => schema.nonempty("Title is required"),
  content: (schema) => schema.nonempty("Content is required"),
});
export type NewBlog = z.infer<typeof insertBlogSchema>;


export default {
    users,
    blogs,
    comments
  };
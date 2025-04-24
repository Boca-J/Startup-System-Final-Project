import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { users } from "./auth"
import { relations } from "drizzle-orm"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod"


export const todos = pgTable("todos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" })
})

export const usersRelations = relations(users, ({ many }) => ({
    todos: many(todos),
}))

export const todosRelations = relations(todos, ({ one }) => ({
    user: one(users, {
        fields: [todos.userId],
        references: [users.id],
    }),
}))


export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;

export const selectTodoSchema = createSelectSchema(todos);
export type Todo = z.infer<typeof selectTodoSchema>;

export const insertTodoSchema = createInsertSchema(todos, {
  title: (schema: z.ZodString) => schema.nonempty("Title cannot be empty"),
})
export type NewTodo = z.infer<typeof insertTodoSchema>;

export default {
  users,
  todos
};
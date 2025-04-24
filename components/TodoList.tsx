"use client"

import { useState } from "react"
import { useActionState, useOptimistic } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Todo } from "@/database/schema"

import { TodoItem } from "./TodoItem"
import {createTodo} from "@/actions/todos"

type CreateTodoState = { error: string } | { success: boolean }

export function TodoList({ todos }: { todos: Todo[] }) {
    const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (state: Todo[], newTodo: Todo) => [
        ...state,
        newTodo
      ])

    
    // const [errorMessage, formAction, isPending] = useActionState(
    //     (prevState: any, formData: FormData) => createTodo(prevState, formData),
    //     { error: null }
    //   )

    const [state, formAction, isPending] = useActionState<CreateTodoState, FormData>(
        createTodo,
        { error: "" }
      )

    const handleSubmit = async (formData: FormData) => {
        const title = formData.get("title")?.toString() || ""
        if (!title) return
    
        addOptimisticTodo({
          id: crypto.randomUUID(),
          title,
          completed: false,
          userId: "optimistic", // temp
          createdAt: new Date(),
          updatedAt: new Date()
        })
    
        formAction(formData)
      }



    return (
        <div className="space-y-4">
            <form className="flex gap-2 items-stretch" action={handleSubmit}>
                <Input
                    name="title"
                    placeholder={"Add a new todo..."}

                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add"}
                </Button>
            </form>
            {/* {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )} */}
            <ul className="space-y-2">
                {optimisticTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </div>
    )
} 
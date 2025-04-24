import { Todo } from "@/database/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleTodo } from "@/actions/todos"
import { authClient } from "@/lib/auth-client"


export function TodoItem({ todo }: { todo: Todo }) {
    const { data: session } = authClient.useSession()
    return (
        <li
            key={todo.id}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2`}
        >
            <Checkbox
                defaultChecked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
            disabled={todo.userId !== session?.user.id}
            />
            <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
            </span>
        </li>
    )
}
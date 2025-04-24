"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { authClient } from "@/lib/auth-client"

export function AdminNavEntry() {
    const { data: session } = authClient.useSession()

    if (session?.user?.role !== "admin") return null
    return (
        <Link href="/admin">
            <Button variant="ghost">Admin</Button>
        </Link>
    )
}
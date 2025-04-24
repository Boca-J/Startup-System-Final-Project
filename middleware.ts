import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers })

    const pathname = request.nextUrl.pathname

    if (pathname.startsWith("/todos") && !session?.user) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }
    if (
        pathname.startsWith("/admin") &&
        (!session?.user || session.user.role !== "admin")
      ) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    
      return NextResponse.next()
}

export const config = {
    runtime: "nodejs",
    matcher: ["/todos", "/admin"]
}

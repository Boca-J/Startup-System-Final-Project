import type { Metadata } from "next"
import "@/styles/globals.css"
import { Header } from "@/components/header"
import type { ReactNode } from "react"
import { Providers } from "./providers"

export const metadata: Metadata = {
    title: "Mindful Journals",
    description: "A safe space to share thoughts, emotions, and mental health journeys"
}

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-gradient-to-b from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans antialiased min-h-screen">
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
                            {children}
                        </main>
                        <footer className="text-center text-sm text-gray-500 py-4">
                            You're not alone. 💛 Share your voice with compassion.
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    )
}

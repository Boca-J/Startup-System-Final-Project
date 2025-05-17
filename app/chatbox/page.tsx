"use client"

import { useState, useRef } from "react"

export default function ChatboxPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: input }])
    setLoading(true)
    const userMessage = input
    setInput("")

    // Fetch AI response
    const res = await fetch("/api/chatbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    })

    const data = await res.json()
    setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    setLoading(false)

    // Scroll to bottom
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-xl px-4 py-2 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400">Assistant is typing...</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={sendMessage} className="flex p-4 border-t bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 border rounded-l-md px-4 py-2 outline-none"
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">
          Send
        </button>
      </form>
    </main>
  )
}

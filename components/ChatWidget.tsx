"use client"

import { useEffect } from "react"



declare global {
  interface Window {
    chtlConfig?: {
      chatbotId: string
    }
  }
}


export default function ChatWidget() {
  useEffect(() => {
    window.chtlConfig = { chatbotId: "4873585729" }

    const script = document.createElement("script")
    script.id = "chtl-script"
    script.setAttribute("data-id", "4873585729")
    script.src = "https://chatling.ai/js/embed.js"
    script.async = true
    script.type = "text/javascript"
    document.body.appendChild(script)

    return () => {
      document.getElementById("chtl-script")?.remove()
    }
  }, [])

  return null // nothing visual here
}
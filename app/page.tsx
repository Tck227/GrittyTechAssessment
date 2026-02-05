"use client";

import React, { useState } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API request failed");

      const aiMessage: Message = { id: crypto.randomUUID(), role: "ai", content: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f5f5" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <MessageList messages={messages} />
      </div>
      <ChatInput onSend={sendMessage} disabled={loading} />
    </main>
  );
}

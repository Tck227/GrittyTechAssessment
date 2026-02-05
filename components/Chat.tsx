"use client";

import { useState, FormEvent } from "react";
import axios from "axios";

type Message = {
  text: string;
  sender: "user" | "ai";
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { prompt: input });
      const aiMessage: Message = { text: res.data.response || "", sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="border rounded p-4 h-[400px] overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="italic text-gray-500">AI is typing...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

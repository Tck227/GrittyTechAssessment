// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

interface OpenAIResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    // Check for API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error("Missing OpenAI API key");
      return NextResponse.json(
        { error: "Server misconfiguration: missing API key" },
        { status: 500 }
      );
    }

    // Call OpenAI API
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or "gpt-4o-mini"
        messages: [{ role: "user", content: prompt }],
      }),
    });

    // Parse OpenAI response
    const raw = await openaiRes.text();
    let result: OpenAIResponse;

    try {
      result = JSON.parse(raw);
    } catch {
      console.error("OpenAI returned invalid JSON:", raw);
      return NextResponse.json(
        { error: "Invalid response from OpenAI" },
        { status: 500 }
      );
    }

    // Handle API errors
    if (!openaiRes.ok) {
      console.error("OpenAI API error:", result);
      return NextResponse.json(
        { error: result.error?.message || "OpenAI request failed" },
        { status: openaiRes.status }
      );
    }

    // Extract AI message
    const responseText = result.choices?.[0]?.message?.content ?? "No response";

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

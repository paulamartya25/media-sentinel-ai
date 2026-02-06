import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    // 1. Check Key
    if (!apiKey) {
      return NextResponse.json({ error: "Key missing in .env.local" }, { status: 500 });
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "No image received" }, { status: 400 });
    }

    // 2. Use the most stable 2026 alias to avoid 404
    // gemini-1.5-flash is GONE for many accounts. Use this one.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent([
      "Is this a meme? If so, explain it.",
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
    ]);

    // 3. Return with manual CORS headers to stop that warning
    return new NextResponse(JSON.stringify({ text: result.response.text() }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

  } catch (error: any) {
    console.error("API Error Detail:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
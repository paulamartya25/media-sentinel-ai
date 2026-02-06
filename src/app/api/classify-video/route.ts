import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bytes = await file.arrayBuffer();
    const base64Video = Buffer.from(bytes).toString("base64");

    // gemini-1.5-flash is GONE for many accounts. Use this one.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = "Watch this video carefully. Is it AI-generated/Deepfake or real? Identify the main subjects and the video's intent.";

    const result = await model.generateContent([
      { inlineData: { data: base64Video, mimeType: file.type } },
      { text: prompt },
    ]);

    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Video analysis failed" }, { status: 500 });
  }
}
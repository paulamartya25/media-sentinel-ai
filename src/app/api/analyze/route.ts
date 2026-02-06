import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Analyze this media carefully. 
    1. If it is a meme, identify the joke or irony. 
    2. If it is a real photo or video (non-meme), describe the scene accurately and state that it is authentic, real-world content.
    3. Do not default to calling everything AI-generated unless you see clear visual glitches. 
    Be concise and professional.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: file.type } },
    ]);

    return NextResponse.json({ analysis: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

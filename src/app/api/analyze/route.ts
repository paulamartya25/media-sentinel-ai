import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Sabse important line: Vercel ko 60 seconds tak wait karne pe majboor karega
export const maxDuration = 60; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Timeout se bachne ke liye direct result handle kar rahe hain
    const result = await model.generateContent([
      "Analyze this. Be brief.",
      { inlineData: { data: base64Data, mimeType: file.type } },
    ]);

    const response = await result.response;
    return NextResponse.json({ analysis: response.text() });

  } catch (error: any) {
    console.error("DEBUG ERROR:", error);
    // Taki screen pe asli error dikhe, "Analysis failed" nahi
    return NextResponse.json({ 
      error: error.message || "Unknown error",
      details: "Check Vercel Logs for full trace"
    }, { status: 500 });
  }
}
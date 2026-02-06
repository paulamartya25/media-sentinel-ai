import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Model configuration with MAX safety bypass
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Calling Gemini API
    const result = await model.generateContent([
      "Analyze this media. If it is a meme, explain the joke. If it is a real photo, confirm its authenticity. Be very brief.",
      { inlineData: { data: base64Data, mimeType: file.type } },
    ]);

    const response = await result.response;
    return NextResponse.json({ analysis: response.text() });

  } catch (error: any) {
    // Detailed error logging for Vercel
    console.error("DEBUG ERROR:", error);
    
    return NextResponse.json({ 
      error: "Analysis failed", 
      message: error.message || "Unknown error",
      code: error.status || "500" 
    }, { status: 500 });
  }
}
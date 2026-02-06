"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'meme' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === 'meme') {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(",")[1];
          const res = await fetch("/api/classify-meme", {
            method: "POST",
            body: JSON.stringify({ imageBase64: base64 }),
          });
          const data = await res.json();
          setResult(data.text);
          setLoading(false);
        };
      } else {
        const res = await fetch("/api/classify-video", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setResult(data.text);
        setLoading(false);
      }
    } catch (err) {
      setResult("Error processing file.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        AI Media Classifier
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Meme Section */}
        <div className="p-6 border border-gray-700 rounded-xl bg-gray-800">
          <h2 className="text-xl mb-4 font-bold">Meme Classifier</h2>
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'meme')} />
        </div>

        {/* Video Section */}
        <div className="p-6 border border-gray-700 rounded-xl bg-gray-800">
          <h2 className="text-xl mb-4 font-bold">AI Video Identifier</h2>
          <input type="file" accept="video/*" onChange={(e) => handleUpload(e, 'video')} />
        </div>
      </div>

      {loading && <p className="mt-8 animate-pulse">AI is thinking...</p>}

      {result && (
        <div className="mt-10 p-6 bg-gray-800 border border-blue-500 rounded-lg max-w-4xl w-full">
          <h3 className="text-blue-400 font-bold mb-2">Analysis Result:</h3>
          <p className="leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
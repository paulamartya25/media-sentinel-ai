"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Shield, Zap, FileSearch, Loader2, CheckCircle2, PlayCircle, AlertCircle } from "lucide-react";

export default function MediaSentinel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        setResult(data.error || "Analysis failed");
        setError(true);
      } else {
        setResult(data.analysis);
        setError(false);
      }
    } catch (err) {
      setResult("Connection error. Check your internet or API setup.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <nav className="relative z-20 flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Shield className="text-purple-500 w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter uppercase text-white">Media Sentinel</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Verify Media Authenticity <br /> with Neural Precision.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Professional-grade forensic detection for images and high-fidelity video content. 
            Analyze memes and real-world media with AI.
          </p>
        </motion.div>

        <section className="max-w-3xl mx-auto">
          <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
            <div className="bg-[#0c0c0c] rounded-[22px] p-8 md:p-12 border border-white/5">
              <div 
                className="border-2 border-dashed border-white/10 rounded-2xl p-10 group hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  accept="image/*,video/*" 
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-purple-400">
                  {file?.type.startsWith('video') ? <PlayCircle /> : <Upload />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{file ? file.name : "Select Media File"}</h3>
                <p className="text-gray-500 text-sm italic">Video and Image support enabled</p>
              </div>

              <button
                disabled={!file || loading}
                onClick={handleUpload}
                className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Analyzing Neural Signals...</> : <><Zap className="w-5 h-5 fill-current" /> Run Deep Analysis</>}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-left">
                <div className={`rounded-2xl p-6 flex gap-4 border ${error ? 'bg-red-500/5 border-red-500/20' : 'bg-purple-500/5 border-purple-500/20'}`}>
                  {error ? <AlertCircle className="text-red-500 w-6 h-6 shrink-0" /> : <CheckCircle2 className="text-purple-500 w-6 h-6 shrink-0" />}
                  <div>
                    <h4 className={`${error ? 'text-red-400' : 'text-purple-400'} font-bold uppercase tracking-widest text-xs mb-2`}>
                      {error ? 'System Alert' : 'Forensic Report'}
                    </h4>
                    <p className="text-gray-200 leading-relaxed">"{result}"</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
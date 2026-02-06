"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Shield, Zap, FileSearch, Loader2, CheckCircle2, PlayCircle } from "lucide-react";

export default function MediaSentinel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Asli Backend API ko call kar raha hai
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult(data.analysis);
      }
    } catch (err) {
      setResult("System error. Ensure GEMINI_API_KEY is set in Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <nav className="relative z-20 flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Shield className="text-purple-500 w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter uppercase">Media Sentinel</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Verify Media Authenticity <br /> with Neural Precision.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Professional-grade forensic detection for images and high-fidelity video content. 
            Protect your assets from synthetic misinformation.
          </p>
        </motion.div>

        <section className="max-w-3xl mx-auto">
          <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
            <div className="bg-[#0c0c0c] rounded-[22px] p-8 md:p-12 border border-white/5">
              <div 
                className="border-2 border-dashed border-white/10 rounded-2xl p-10 group hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                }}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  accept="image/*,video/*" 
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {file?.type.startsWith('video') ? (
                      <PlayCircle className="text-purple-400 w-10 h-10" />
                    ) : (
                      <Upload className="text-gray-400 group-hover:text-purple-400 w-10 h-10" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {file ? file.name : "Select Media File"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Supports Video and Image (Max 50MB)
                  </p>
                </label>
              </div>

              <button
                disabled={!file || loading}
                onClick={handleUpload}
                className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Analyzing Neural Signatures...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Run Deep Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Forensic Result Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 text-left"
              >
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 flex gap-4">
                  <CheckCircle2 className="text-purple-500 w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2">Forensic Report</h4>
                    <p className="text-gray-200 leading-relaxed italic">
                      "{result}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 text-left">
          {[
            { icon: <PlayCircle />, title: "Video Forensic", desc: "Scan frames for temporal inconsistencies." },
            { icon: <Shield />, title: "Privacy First", desc: "Data is processed in secure sandbox environments." },
            { icon: <FileSearch />, title: "Neural Audit", desc: "Detection of GAN and diffusion-based artifacts." }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors">
              <div className="text-purple-500 mb-4">{feature.icon}</div>
              <h4 className="font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Shield, Zap, FileSearch, Loader2, CheckCircle2 } from "lucide-react";

export default function MediaSentinel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    
    // Simulate AI Processing (Replace with your actual API call)
    setTimeout(() => {
      setResult("Analysis Complete: This media appears to be AI-generated with 87% confidence. Metadata suggests a synthesis origin.");
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <nav className="relative z-20 flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Shield className="text-purple-500 w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter">MEDIA SENTINEL</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-medium inline-block mb-6">
            Powered by Gemini 1.5 Flash
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Verify Media Authenticity <br /> with Neural Precision.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Professional-grade AI detection for images, memes, and videos. 
            Protect your platform from synthetic misinformation.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <section className="max-w-3xl mx-auto">
          <div className={`relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl`}>
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
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-gray-400 group-hover:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {file ? file.name : "Drop media here"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Supports MP4, PNG, JPG, and GIF (Max 50MB)
                  </p>
                </label>
              </div>

              <button
                disabled={!file || loading}
                onClick={handleUpload}
                className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 overflow-hidden relative"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Analyzing Neural Patterns...
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

          {/* Results Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 text-left"
              >
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="text-purple-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2">AI Inspection Report</h4>
                    <p className="text-gray-200 leading-relaxed text-lg italic">
                      "{result}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 text-left">
          {[
            { icon: <FileSearch />, title: "Metadata Audit", desc: "Checks for synthesis signatures and software traces." },
            { icon: <Shield />, title: "Secure Processing", desc: "Files are encrypted and wiped after 24 hours." },
            { icon: <Zap />, title: "Instant Response", desc: "High-speed analysis powered by Gemini 1.5 Flash." }
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
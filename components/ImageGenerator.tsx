
import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageSize } from '../types';

interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    const aistudio = (window as any).aistudio as AIStudio | undefined;
    if (aistudio) {
      const selected = await aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio as AIStudio | undefined;
    if (aistudio) {
      await aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    if (!hasKey) {
        await handleSelectKey();
    }

    try {
      const imageData = await generateImage(prompt, size);
      setGeneratedImage(imageData);
    } catch (err: any) {
      let msg = "Generation sequence failed.";
      if (err.message && err.message.includes("Requested entity was not found")) {
         msg = "Authentication Token Invalid. Re-authorization required.";
         setHasKey(false);
      } else if (err.message) {
         msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
     return (
        <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-[#0a0a0a] border border-white/10 p-12 rounded-3xl text-center max-w-lg shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none"></div>
                <div className="w-16 h-16 rounded-full bg-primary-900/20 text-primary-500 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Access Restricted</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    This module requires a verified API key to access the Gemini 3 Pro neural engine.
                </p>
                <button
                    onClick={handleSelectKey}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                >
                    Authenticate Session
                </button>
           </div>
        </div>
     );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Manifest Your <span className="text-primary-500">Reality</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          High-fidelity 4K rendering powered by the Gemini 3 Pro neural architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Synthesizer Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the visual parameters..."
                    className="w-full h-40 bg-[#121212] border border-white/5 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none outline-none mb-6 font-mono text-sm"
                />

                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Output Resolution</label>
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {Object.values(ImageSize).map((s) => (
                        <button
                            key={s}
                            onClick={() => setSize(s as ImageSize)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border font-mono ${
                                size === s 
                                ? 'bg-primary-600 border-primary-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                                : 'bg-[#121212] border-white/5 text-gray-400 hover:bg-[#1a1a1a]'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all uppercase tracking-wide"
                >
                    {loading ? 'Synthesizing...' : 'Execute Render'}
                </button>
                
                {error && <p className="text-red-400 text-sm mt-4 border-l-2 border-red-500 pl-3">{error}</p>}
            </div>
            
            <div className="p-4 rounded-2xl bg-primary-900/10 border border-primary-500/20">
                <div className="flex items-center gap-3 text-primary-400 text-sm font-medium mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>Optimization Hint</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                    For photorealistic results, include keywords like "8k resolution", "octane render", and specific lighting conditions in your parameters.
                </p>
            </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
            <div className={`aspect-square rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] relative flex items-center justify-center group ${generatedImage ? '' : 'border-dashed'}`}>
                {generatedImage ? (
                    <>
                        <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <a href={generatedImage} download="streamflow-render.png" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Save to Disk
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-600">
                        {loading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="font-mono text-xs tracking-widest uppercase">Rendering Pixels...</p>
                            </div>
                        ) : (
                            <>
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="font-mono text-sm opacity-50">WAITING FOR INPUT</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { VideoInfo, DownloadHistoryItem, VpsResponse } from '../types';

// --- SERVER CONFIGURATION ---
// 🚨 REPLACE THIS with your actual VPS IP address/Domain
const VPS_API_URL = 'http://localhost:5000'; 

export const YouTubeDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloadReadyUrl, setDownloadReadyUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [serverStatus, setServerStatus] = useState<'IDLE' | 'CONNECTING' | 'ONLINE' | 'ERROR'>('IDLE');

  // Persistence
  useEffect(() => {
    const savedHistory = localStorage.getItem('sf_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    addLog(`System initialized. Target Endpoint: ${VPS_API_URL}`);
  }, []);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const saveToHistory = (info: VideoInfo) => {
    const newItem: DownloadHistoryItem = {
      id: Date.now().toString(),
      youtubeId: info.id,
      title: info.title,
      thumbnail: info.thumbnail,
      timestamp: Date.now()
    };
    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('sf_history', JSON.stringify(newHistory));
  };

  const getVideoID = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setVideoInfo(null);
    setDownloadReadyUrl(null);
    setServerStatus('CONNECTING');
    setLogs([]);
    addLog(`Establishing secure handshake: ${VPS_API_URL}...`);

    const videoId = getVideoID(url);

    if (!videoId) {
      setError('Invalid YouTube URL format.');
      setLoading(false);
      setServerStatus('ERROR');
      return;
    }

    // Step 1: Get Metadata
    try {
      addLog(`Resolving Metadata for ID: ${videoId}`);
      const metaRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const metaData = await metaRes.json();

      if (metaData.error) throw new Error("Video is private or geographically restricted.");

      const info: VideoInfo = {
        id: videoId as string,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: metaData.title || "Unknown Title",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: "HQ", 
        author: metaData.author_name || "Unknown Creator"
      };
      
      setVideoInfo(info);
      
      // Step 2: Call VPS
      await connectToVps(info);

    } catch (err: any) {
      setError(err.message || 'Connection negotiation failed.');
      addLog(`FATAL: ${err.message}`);
      setServerStatus('ERROR');
      setLoading(false);
    }
  };

  const connectToVps = async (info: VideoInfo) => {
    try {
      addLog(`POST /api/download { secure: true }`);
      
      const response = await fetch(`${VPS_API_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: info.url }),
      });

      if (!response.ok) {
        throw new Error(`Upstream Error ${response.status}`);
      }

      const data: VpsResponse = await response.json();

      if (data.success && data.download_url) {
        addLog(`Response: 200 OK. Stream ready.`);
        setServerStatus('ONLINE');
        
        // Handle relative URLs
        const fullUrl = data.download_url.startsWith('http') 
          ? data.download_url 
          : `${VPS_API_URL}${data.download_url.startsWith('/') ? '' : '/'}${data.download_url}`;

        setDownloadReadyUrl(fullUrl);
        saveToHistory(info);
      } else {
        throw new Error(data.error || 'Server rejected the request.');
      }

    } catch (err: any) {
      setError(`Infrastructure Error: ${err.message}. Ensure VPS is active.`);
      addLog(`API ERROR: ${err.message}`);
      setServerStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  const executeDownload = () => {
    if (downloadReadyUrl) {
      addLog(`Initiating transfer: ${downloadReadyUrl}`);
      window.open(downloadReadyUrl, '_blank');
    }
  };

  return (
    <div className="space-y-20 animate-fade-in pt-12 pb-24">
      {/* Hero */}
      <div className="relative text-center space-y-8 max-w-5xl mx-auto px-4">
         {/* Background Visual Effects */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-emerald-500/10 rounded-full animate-[pulse_4s_ease-in-out_infinite] -z-10"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-500/5 rounded-full animate-[pulse_4s_ease-in-out_infinite_1s] -z-10"></div>
         
         {/* Server Status Badge */}
         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold mb-4 backdrop-blur-md ${
             serverStatus === 'ONLINE' ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' : 
             serverStatus === 'ERROR' ? 'bg-red-900/30 border-red-500/30 text-red-400' : 
             'bg-gray-800/50 border-gray-700 text-gray-400'
         }`}>
            <span className={`w-2 h-2 rounded-full ${serverStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : serverStatus === 'ERROR' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
            {serverStatus === 'IDLE' ? 'NODE READY' : serverStatus === 'ONLINE' ? 'UPLINK ESTABLISHED' : serverStatus === 'CONNECTING' ? 'HANDSHAKE...' : 'UPLINK FAILED'}
         </div>

         {/* Headlines */}
         <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-2xl">
              Premium YouTube <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary-600">Extraction Engine</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Transform streams into permanent assets. <br/>
              <span className="text-gray-500">Supports 4K Video • 320kbps Audio • 60FPS</span>
            </p>
         </div>

         {/* Value Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left md:text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm flex flex-col items-center">
                <div className="text-emerald-400 mb-2">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="text-emerald-400 font-bold mb-1">Lightning Fast</div>
                <div className="text-xs text-gray-500">Direct VPS-to-Client transfer speeds. No queueing.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm flex flex-col items-center">
                 <div className="text-emerald-400 mb-2">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 </div>
                 <div className="text-emerald-400 font-bold mb-1">Private & Secure</div>
                 <div className="text-xs text-gray-500">End-to-end encryption. No logs stored.</div>
            </div>
             <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm flex flex-col items-center">
                 <div className="text-emerald-400 mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                 </div>
                 <div className="text-emerald-400 font-bold mb-1">Uncompressed</div>
                 <div className="text-xs text-gray-500">Original source quality preserved. No re-encoding.</div>
            </div>
         </div>
      </div>

      {/* Main Input */}
      <div className="max-w-4xl mx-auto px-4">
        {!videoInfo ? (
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl">
                    <form onSubmit={handleFetch} className="flex flex-col md:flex-row gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube Video URL..."
                            className="flex-1 bg-transparent text-white px-6 py-4 outline-none placeholder-gray-600 font-mono text-sm"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            {loading ? 'ANALYZING...' : 'CONVERT NOW'}
                        </button>
                    </form>
                </div>
            </div>
        ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Thumbnail & Logs */}
                    <div className="w-full md:w-80 shrink-0">
                        <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl relative mb-4 group">
                             <img src={videoInfo.thumbnail} alt="" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                             </div>
                        </div>
                        
                        <div className="bg-black rounded-lg p-3 border border-white/5 font-mono text-[10px] text-emerald-500/80 h-40 overflow-y-auto custom-scrollbar">
                           <div className="text-white/50 border-b border-white/5 pb-1 mb-1">TERMINAL // {VPS_API_URL}</div>
                           {logs.map((log, i) => <div key={i}>{log}</div>)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white line-clamp-2">{videoInfo.title}</h2>
                                <button onClick={() => setVideoInfo(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400" title="Clear Session">✕</button>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold">READY</span>
                                <span>{videoInfo.author}</span>
                            </div>
                        </div>

                        <div>
                            {loading ? (
                                <div className="h-16 flex items-center justify-center bg-[#121212] rounded-lg border border-primary-500/30 text-primary-400 font-mono animate-pulse">
                                    [ VPS ] PROCESSING STREAM...
                                </div>
                            ) : downloadReadyUrl ? (
                                <button
                                    onClick={executeDownload}
                                    className="w-full h-16 flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-[1.02]"
                                >
                                    DOWNLOAD FILE
                                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </button>
                            ) : error ? (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-red-200 text-sm flex items-center gap-3">
                                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    {error}
                                </div>
                            ) : null}
                            
                            {/* Ad Placeholder / Server Sponsor */}
                            <div className="mt-6 border border-white/5 bg-[#0f0f0f] rounded-lg p-3 flex items-center gap-3">
                                <div className="bg-emerald-900/20 w-10 h-10 rounded flex items-center justify-center text-emerald-500">
                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="text-xs text-gray-500">
                                    <span className="text-gray-300 font-bold block">Priority Node Access</span>
                                    Dedicated 1Gbps link allocated for this session.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* History */}
        {history.length > 0 && !videoInfo && (
            <div className="mt-24">
               <h3 className="text-xs font-mono text-gray-500 mb-6 border-b border-white/10 pb-2 uppercase tracking-wider">Session Archives</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map(item => (
                    <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default group hover:border-white/10">
                       <div className="relative w-12 h-12 rounded overflow-hidden">
                          <img src={item.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                       </div>
                       <div className="min-w-0">
                          <div className="text-white text-sm font-medium truncate group-hover:text-primary-500 transition-colors">{item.title}</div>
                          <div className="text-xs text-gray-500 font-mono">{new Date(item.timestamp).toLocaleDateString()}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
        )}
      </div>
    </div>
  );
};

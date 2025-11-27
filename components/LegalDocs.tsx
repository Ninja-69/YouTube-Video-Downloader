
import React from 'react';
import { AppView } from '../types';

interface LegalDocsProps {
  view: AppView;
  onBack: () => void;
}

export const LegalDocs: React.FC<LegalDocsProps> = ({ view, onBack }) => {
  const isTerms = view === AppView.TERMS;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Downloader
        </button>
        <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                {isTerms ? (
                    <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                ) : (
                    <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                )}
            </div>
            <h1 className="text-4xl font-bold text-white">
              {isTerms ? 'Terms of Service' : 'Privacy Policy'}
            </h1>
        </div>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest pl-1">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content Card */}
      <div className="glass-card rounded-2xl p-8 md:p-12 text-gray-300 leading-relaxed space-y-12 border border-white/10 bg-[#0a0a0a]">
        {isTerms ? (
          <>
            <section>
              <div className="flex items-center gap-3 mb-4">
                 <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                 <h3 className="text-xl font-bold text-white">1. Service Access & Infrastructure</h3>
              </div>
              <p className="pl-9 text-sm text-gray-400">
                StreamFlow operates on a private, dedicated Virtual Private Server (VPS) infrastructure. Access to the download pipeline is granted on a strictly personal, non-commercial basis. We reserve the right to throttle, terminate, or restrict connection attempts that threaten the integrity of our bandwidth processing nodes or violate fair use policies.
              </p>
            </section>
            
            <section>
              <div className="flex items-center gap-3 mb-4">
                 <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                 <h3 className="text-xl font-bold text-white">2. Intellectual Property Rights</h3>
              </div>
              <p className="pl-9 text-sm text-gray-400">
                By using this tool, you acknowledge that you are strictly fetching a copy of content for offline personal archiving (Time-Shifting) as permitted under fair use guidelines in applicable jurisdictions. You agree not to redistribute, sell, or broadcast downloaded content. StreamFlow claims no ownership over processed media and acts solely as a technical conduit.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                 <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <h3 className="text-xl font-bold text-white">3. Acceptable Use</h3>
              </div>
              <p className="pl-9 text-sm text-gray-400">
                Automated scraping of our endpoints, including <code>/api/download</code>, via headless browsers, botnets, or unauthorized scripts is strictly prohibited. Users found circumventing rate limits will have their IP addresses permanently blacklisted from our edge nodes.
              </p>
            </section>
          </>
        ) : (
          <>
            <section>
              <div className="flex items-center gap-3 mb-4">
                 <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 <h3 className="text-xl font-bold text-white">1. Data Minimization</h3>
              </div>
              <p className="pl-9 text-sm text-gray-400">
                StreamFlow is architected with privacy as a core tenet ("Privacy by Design"). We do not store logs of processed URLs, user IP addresses, or file metadata beyond the strictly necessary duration of the active download session (typically milliseconds). Once your file is transferred, all temporary cache data is purged from our VPS immediately.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                 <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                 <h3 className="text-xl font-bold text-white">2. Local Storage Usage</h3>
              </div>
              <p className="pl-9 text-sm text-gray-400">
                Your "Session Archives" (history) are stored exclusively on your local device via the browser's <code>localStorage</code> API. This data never leaves your browser and is never transmitted to our servers. You retain full control and can clear this history at any time by clearing your browser cache.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                 <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 <h3 className="text-xl font-bold text-white">3. Third Party Processors</h3>
              </div>
              <p className="pl-9 text-sm text-gray-400">
                We utilize minimal third-party APIs solely for the purpose of resolving video metadata (titles and thumbnails). These requests are proxied securely and do not contain personally identifiable information (PII).
              </p>
            </section>
          </>
        )}

        <div className="pt-8 border-t border-white/5 mt-12">
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            By continuing to use StreamFlow, you acknowledge that you have read and understood these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

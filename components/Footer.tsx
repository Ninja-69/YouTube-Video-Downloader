
import React from 'react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-primary-600 shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                <span className="text-white font-bold text-lg">StreamFlow</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Premium grade video extraction infrastructure. Convert YouTube content to high-fidelity local assets securely and instantly.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Core Network</span>
                <span className="text-primary-500 flex items-center gap-2">
                    <svg className="w-2 h-2 text-primary-500" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg> 
                    Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Protocol</span>
                <span className="text-primary-500 flex items-center gap-2">
                    <svg className="w-2 h-2 text-primary-500" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg> 
                    Secure POST
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Speed</span>
                <span className="text-primary-500">1Gbps+</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Usage</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <button 
                  onClick={() => onNavigate(AppView.PRIVACY)} 
                  className="hover:text-primary-500 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate(AppView.TERMS)} 
                  className="hover:text-primary-500 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono">
          <p>&copy; {new Date().getFullYear()} StreamFlow Systems. v4.5.1</p>
          <p className="mt-2 md:mt-0 flex items-center gap-2">
            <svg className="w-2 h-2 text-emerald-500" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
            All Systems Operational
          </p>
        </div>
      </div>
    </footer>
  );
};

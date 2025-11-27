
import React, { useState } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.DOWNLOADER)}>
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">StreamFlow</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate(AppView.DOWNLOADER)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.DOWNLOADER ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Downloader
            </button>
            <button 
              onClick={() => onNavigate(AppView.TERMS)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.TERMS ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Terms
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-b border-white/5 absolute w-full backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-4">
             <button 
              onClick={() => { onNavigate(AppView.DOWNLOADER); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === AppView.DOWNLOADER ? 'bg-white/5 text-white' : 'text-gray-400'}`}
            >
              Downloader
            </button>
            <button 
              onClick={() => { onNavigate(AppView.TERMS); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === AppView.TERMS ? 'bg-white/5 text-white' : 'text-gray-400'}`}
            >
              Terms of Service
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

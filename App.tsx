
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { YouTubeDownloader } from './components/YouTubeDownloader';
import { LegalDocs } from './components/LegalDocs';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DOWNLOADER);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DOWNLOADER:
        return <YouTubeDownloader />;
      case AppView.TERMS:
      case AppView.PRIVACY:
        return <LegalDocs view={currentView} onBack={() => setCurrentView(AppView.DOWNLOADER)} />;
      default:
        return <YouTubeDownloader />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary-500/30 selection:text-white flex flex-col">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-grow pt-20">
        {renderContent()}
      </main>

      <Footer onNavigate={setCurrentView} />
    </div>
  );
};

export default App;

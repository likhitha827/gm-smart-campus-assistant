import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import SmartSearch from './components/SmartSearch';
import StudentServices from './components/StudentServices';
import EventsNotices from './components/EventsNotices';
import ForYou from './components/ForYou';

const CONTRAST_KEY = 'gm-high-contrast';

export default function App() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONTRAST_KEY) === 'true';
    const prefers = window.matchMedia('(prefers-contrast: more)').matches;
    const on = saved || prefers;
    setHighContrast(on);
    document.documentElement.classList.toggle('high-contrast', on);
  }, []);

  function toggleContrast() {
    setHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem(CONTRAST_KEY, String(next));
      document.documentElement.classList.toggle('high-contrast', next);
      return next;
    });
  }

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100">
      <div className="campus-aurora" aria-hidden="true" />
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        highContrast={highContrast}
        toggleContrast={toggleContrast}
      />
      <main id="main" className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'assistant' && <AIAssistant />}
        {activeTab === 'search' && <SmartSearch />}
        {activeTab === 'services' && <StudentServices />}
        {activeTab === 'events' && <EventsNotices />}
        {activeTab === 'foryou' && <ForYou />}
      </main>
      <footer className="relative z-10 glass border-t border-white/10 py-4 text-center text-xs text-slate-300">
        GM Smart Campus Assistant &copy; 2026 GM University · Voice, RAG &amp; campus discovery
      </footer>
    </div>
  );
}

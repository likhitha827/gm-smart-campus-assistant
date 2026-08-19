import React, { useEffect, useState } from 'react';
import { Bot, Search, FileText, Calendar, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, highContrast, toggleContrast }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'search', label: 'Smart Search', icon: Search },
    { id: 'services', label: 'Student Help', icon: FileText },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'foryou', label: 'For You', icon: Sparkles }
  ];

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function go(id) {
    setActiveTab(id);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 glass backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="morph-hover glass-blur-hover w-10 h-10 rounded-xl bg-gradient-to-br from-teal-300 to-violet-400 text-slate-900 flex items-center justify-center font-black text-xs shadow-lg">
            GMU
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white">GM Smart Campus Assistant</h1>
            <p className="text-xs text-teal-200">AI concierge · glass campus hub</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-1" aria-label="Primary">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => go(tab.id)}
                className={`btn-glow flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  active
                    ? 'bg-teal-300/90 text-slate-900'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="contrast-switch text-teal-200"
            aria-pressed={highContrast}
            aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
            title="High contrast"
            onClick={toggleContrast}
          />
          <button
            type="button"
            className={`hamburger text-white lg:hidden ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`lg:hidden mobile-drawer overflow-hidden transition-[max-height,opacity] duration-300 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 pb-4 flex flex-col gap-1" aria-label="Mobile">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => go(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                  active ? 'bg-teal-300 text-slate-900' : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

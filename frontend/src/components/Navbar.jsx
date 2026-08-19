import React from 'react';
import { Bot, Search, FileText, Calendar } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'search', label: 'Directory Search', icon: Search },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'events', label: 'Events & Notices', icon: Calendar },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">GMU</div>
          <div>
            <h1 className="font-bold text-base leading-tight">GM Smart Campus Assistant</h1>
            <p className="text-xs text-blue-300">AI Concierge & Knowledge Hub</p>
          </div>
        </div>
        <nav className="flex space-x-1 sm:space-x-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

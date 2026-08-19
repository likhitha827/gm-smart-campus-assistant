import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import SmartSearch from './components/SmartSearch';
import StudentServices from './components/StudentServices';
import EventsNotices from './components/EventsNotices';

export default function App() {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'assistant' && <AIAssistant />}
        {activeTab === 'search' && <SmartSearch />}
        {activeTab === 'services' && <StudentServices />}
        {activeTab === 'events' && <EventsNotices />}
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        GM Smart Campus Assistant &copy; 2026 GM University.
      </footer>
    </div>
  );
}

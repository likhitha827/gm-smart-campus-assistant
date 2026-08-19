import React, { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your GM University AI Assistant. Ask me anything about departments, faculty, library timings, exam cells, or events!', sources: [] }
  ]);
  const [loading, setLoading] = useState(false);

  const prompts = [
    'Where is the CSE HOD office?',
    'What are the timings for the Central Library?',
    'How do I apply for a Bonafide Certificate?'
  ];

  async function handleSend(txt) {
    const q = txt || query;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer || 'No response received.', sources: data.sources || [] }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to backend on port 5000.', sources: [] }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-600" /> Campus Intelligence Concierge
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {prompts.map((p, idx) => (
            <button key={idx} onClick={() => handleSend(p)} className="text-xs bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" /> {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
              <div className="whitespace-pre-line">{msg.text}</div>
              {msg.sources?.length > 0 && <div className="mt-2 pt-1 border-t border-slate-200 text-xs text-slate-500">Sources: {msg.sources.join(', ')}</div>}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-slate-400 italic">Searching GM database...</div>}
      </div>
      <div className="p-3 border-t border-slate-200 flex gap-2">
        <input
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask a question about GM University..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={() => handleSend()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 font-medium">
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
}

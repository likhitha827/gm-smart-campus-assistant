import React, { useEffect, useRef, useState } from 'react';
import { Send, Bot, Sparkles, Mic, Volume2 } from 'lucide-react';
import { getProfile } from '../profile';

export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your GM University AI Assistant. Ask about departments, faculty, library timings, certificates, or events. You can also use the microphone.',
      sources: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [recs, setRecs] = useState([]);
  const listRef = useRef(null);

  const prompts = [
    'Where is the CSE HOD office?',
    'What are the timings for the Central Library?',
    'How do I apply for a Bonafide Certificate?'
  ];

  useEffect(() => {
    const p = getProfile();
    fetch(`/api/recommendations?department=${encodeURIComponent(p.department || '')}&interest=${encodeURIComponent(p.interest || '')}`)
      .then((r) => r.json())
      .then((data) => {
        const chips = (data.events || []).slice(0, 3).map((e) => e.title);
        setRecs(chips);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(txt) {
    const q = txt || query;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, profile: getProfile() })
      });
      const data = await res.json();
      const answer = data.answer || 'No response received.';
      setMessages((prev) => [...prev, { sender: 'bot', text: answer, sources: data.sources || [] }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error connecting to backend on port 5000.', sources: [] }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function speakLast() {
    const last = [...messages].reverse().find((m) => m.sender === 'bot');
    if (!last || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(last.text.replace(/\*/g, ''));
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Voice input is not supported in this browser. Try Chrome.', sources: [] }
      ]);
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setQuery(spoken);
      handleSend(spoken);
    };
    rec.start();
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] glass morph-hover glass-blur-hover overflow-hidden">
      <div className="border-b border-white/10 p-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-teal-300" /> Conversational campus Q&amp;A
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="btn-glow text-xs glass px-2.5 py-1 rounded-full flex items-center gap-1 text-slate-100"
            >
              <Sparkles className="w-3 h-3 text-teal-300" /> {p}
            </button>
          ))}
        </div>
        {recs.length > 0 && (
          <p className="mt-3 text-[11px] text-teal-200">
            AI picks for you: {recs.join(' · ')}
          </p>
        )}
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                msg.sender === 'user'
                  ? 'bg-teal-300 text-slate-900'
                  : 'bg-white/10 text-slate-50 border border-white/10'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              {msg.sources?.length > 0 && (
                <div className="mt-2 pt-1 border-t border-white/10 text-xs text-teal-200">
                  Sources: {msg.sources.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-slate-400 italic">Searching GM knowledge base…</div>}
      </div>
      <div className="p-3 border-t border-white/10 flex gap-2">
        <button
          type="button"
          onClick={startVoice}
          className={`btn-glow p-2 rounded-xl glass ${listening ? 'ring-2 ring-teal-300' : ''}`}
          aria-label="Voice input"
          title="Voice input"
        >
          <Mic className={`w-4 h-4 ${listening ? 'text-teal-300' : 'text-white'}`} />
        </button>
        <button
          type="button"
          onClick={speakLast}
          className="btn-glow p-2 rounded-xl glass"
          aria-label="Read last answer aloud"
          title="Read aloud"
        >
          <Volume2 className="w-4 h-4 text-white" />
        </button>
        <input
          className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
          placeholder="Ask GM University…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          className="btn-glow bg-teal-300 hover:bg-teal-200 text-slate-900 px-4 py-2 rounded-xl text-sm flex items-center gap-1 font-semibold"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
}

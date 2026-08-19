import React, { useEffect, useMemo, useState } from 'react';

export default function EventsNotices() {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
    fetch('/api/notices')
      .then((r) => r.json())
      .then(setNotices)
      .catch(() => {});
  }, []);

  const filteredEvents = useMemo(() => {
    const s = q.toLowerCase();
    return events.filter((e) => JSON.stringify(e).toLowerCase().includes(s));
  }, [events, q]);

  const filteredNotices = useMemo(() => {
    const s = q.toLowerCase();
    return notices.filter((n) => JSON.stringify(n).toLowerCase().includes(s));
  }, [notices, q]);

  return (
    <div className="space-y-4">
      <input
        className="w-full glass px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
        placeholder="Discover events and circulars…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Campus events</h2>
          {filteredEvents.map((e) => (
            <article key={e.id} className="glass morph-hover glass-blur-hover p-4">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-white text-sm">{e.title}</h3>
                <span className="text-xs bg-violet-400/20 text-violet-200 px-2 py-0.5 rounded-full font-semibold">
                  {e.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                📅 {e.date} | 📍 {e.venue}
              </p>
              <p className="text-xs text-slate-200 mt-2">{e.description}</p>
            </article>
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Official notices</h2>
          {filteredNotices.map((n) => (
            <article key={n.id} className="glass morph-hover glass-blur-hover p-4 border-l-4 border-l-amber-300">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-white text-sm">{n.title}</h3>
                <span className="text-xs bg-amber-300/20 text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  {n.priority}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                📅 {n.date} | 🏢 {n.department}
              </p>
              <p className="text-xs text-slate-200 mt-2">{n.content}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

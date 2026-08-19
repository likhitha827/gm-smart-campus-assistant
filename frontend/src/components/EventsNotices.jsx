import React, { useEffect, useState } from 'react';

export default function EventsNotices() {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events').then(r => r.json()).then(setEvents).catch(() => {});
    fetch('http://localhost:5000/api/notices').then(r => r.json()).then(setNotices).catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Campus Events</h2>
        {events.map(e => (
          <div key={e.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 text-sm">{e.title}</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">{e.category}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">📅 {e.date} | 📍 {e.venue}</p>
            <p className="text-xs text-slate-700 mt-2">{e.description}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Official Notices</h2>
        {notices.map(n => (
          <div key={n.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">{n.priority}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">📅 {n.date} | 🏢 {n.department}</p>
            <p className="text-xs text-slate-700 mt-2">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

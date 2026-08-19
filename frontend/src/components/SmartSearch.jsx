import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results || []))
        .catch(() => setResults([]));
    }, 200);
    return () => clearTimeout(t);
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="glass morph-hover glass-blur-hover p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-teal-300" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-300 focus:outline-none"
            placeholder="Search departments, faculty, events, rooms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900/70 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-300 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="department">Departments</option>
          <option value="faculty">Faculty</option>
          <option value="facility">Facilities</option>
          <option value="event">Events</option>
          <option value="notice">Notices</option>
        </select>
      </div>
      <p className="text-xs text-slate-300">{results.length} matches in the campus directory</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, idx) => (
          <article key={idx} className="glass morph-hover glass-blur-hover p-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-300/20 text-teal-200 mb-2 inline-block">
              {item.type}
            </span>
            <h3 className="font-bold text-white text-sm">{item.name || item.title}</h3>
            {item.hod && <p className="text-xs text-slate-300 mt-1">HOD: {item.hod}</p>}
            {item.location && <p className="text-xs text-slate-300 mt-1">📍 {item.location}</p>}
            {item.office && <p className="text-xs text-slate-300 mt-1">🏢 {item.office}</p>}
            {item.contactEmail && <p className="text-xs text-teal-200 mt-1">{item.contactEmail}</p>}
            {item.email && <p className="text-xs text-teal-200 mt-1">{item.email}</p>}
            {item.date && <p className="text-xs text-slate-300 mt-1">📅 {item.date}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

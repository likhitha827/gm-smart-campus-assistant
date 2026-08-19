import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/search?q=${query}&category=${category}`)
      .then(res => res.json())
      .then(data => setResults(data.results || []))
      .catch(() => setResults([]));
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search departments, faculty, events, rooms..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="department">Departments</option>
          <option value="faculty">Faculty</option>
          <option value="facility">Facilities</option>
          <option value="event">Events</option>
          <option value="notice">Notices</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600 mb-2 inline-block">{item.type}</span>
            <h3 className="font-bold text-slate-900 text-sm">{item.name || item.title}</h3>
            {item.hod && <p className="text-xs text-slate-600 mt-1">HOD: {item.hod}</p>}
            {item.location && <p className="text-xs text-slate-600 mt-1">📍 {item.location}</p>}
            {item.office && <p className="text-xs text-slate-600 mt-1">🏢 {item.office}</p>}
            {item.contactEmail && <p className="text-xs text-blue-600 mt-1">{item.contactEmail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getProfile, saveProfile } from '../profile';

export default function ForYou() {
  const [profile, setProfile] = useState(getProfile);
  const [recs, setRecs] = useState({ events: [], notices: [], academic: [], faculty: [], services: [] });

  useEffect(() => {
    fetch(
      `/api/recommendations?department=${encodeURIComponent(profile.department)}&interest=${encodeURIComponent(profile.interest)}`
    )
      .then((r) => r.json())
      .then(setRecs)
      .catch(() => {});
  }, [profile.department, profile.interest]);

  function onChange(e) {
    const next = { ...profile, [e.target.name]: e.target.value };
    setProfile(next);
    saveProfile(next);
  }

  return (
    <div className="space-y-6">
      <section className="glass morph-hover glass-blur-hover p-5">
        <h2 className="font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-300" /> Personalized student assistance
        </h2>
        <p className="text-xs text-slate-300 mt-1">Saved on this device. Used to tailor AI answers and recommendations.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <input name="name" value={profile.name} onChange={onChange} placeholder="Your name" className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white" />
          <input name="department" value={profile.department} onChange={onChange} placeholder="Department (e.g. Computer)" className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white" />
          <input name="year" value={profile.year} onChange={onChange} placeholder="Year" className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white" />
          <input name="interest" value={profile.interest} onChange={onChange} placeholder="Interest (hackathon, library…)" className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white" />
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <RecBlock title="Recommended events" items={recs.events} label={(i) => i.title} />
        <RecBlock title="Notices to watch" items={recs.notices} label={(i) => i.title} />
        <RecBlock title="Academic picks" items={recs.academic} label={(i) => i.title || i.name} />
        <RecBlock title="Faculty near you" items={recs.faculty} label={(i) => `${i.name} · ${i.office}`} />
      </div>
    </div>
  );
}

function RecBlock({ title, items, label }) {
  return (
    <section className="glass morph-hover glass-blur-hover p-4 space-y-2">
      <h3 className="text-sm font-semibold text-teal-200">{title}</h3>
      {(items || []).map((item, idx) => (
        <p key={idx} className="text-xs text-slate-200 border-t border-white/10 pt-2">
          {label(item)}
        </p>
      ))}
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { getProfile } from '../profile';

export default function StudentServices() {
  const [services, setServices] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ name: '', usn: '', note: '' });
  const [done, setDone] = useState('');

  useEffect(() => {
    const p = getProfile();
    setForm((f) => ({ ...f, name: p.name || f.name }));
    fetch('/api/student-services')
      .then((r) => r.json())
      .then(setServices)
      .catch(() => {});
  }, []);

  function submit(e) {
    e.preventDefault();
    setDone(`Application recorded locally for ${active?.name}. Visit ${active?.office} with USN ${form.usn}.`);
    setTimeout(() => {
      setDone('');
      setActive(null);
    }, 2800);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Student assistance &amp; admin counters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <article key={s.id} className="glass morph-hover glass-blur-hover p-4">
            <h3 className="font-bold text-sm text-teal-200">{s.name}</h3>
            <p className="text-xs font-medium text-slate-300 mt-1">📍 {s.office}</p>
            <div className="mt-2 text-xs space-y-1 text-slate-200">
              <p>
                <span className="font-semibold">Procedure:</span> {s.procedure}
              </p>
              <p>
                <span className="font-semibold">Processing Time:</span> {s.processingTime}
              </p>
              <p>
                <span className="font-semibold">Fee:</span> {s.fee}
              </p>
            </div>
            <button
              onClick={() => setActive(s)}
              className="btn-glow mt-3 text-xs font-semibold bg-teal-300 text-slate-900 px-3 py-1.5 rounded-full"
            >
              Apply / Get help
            </button>
          </article>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={submit} className="glass max-w-md w-full p-6 space-y-3">
            <h3 className="font-bold text-white">Apply — {active.name}</h3>
            <label className="block text-xs text-slate-300">
              Name
              <input
                required
                className="mt-1 w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="block text-xs text-slate-300">
              USN
              <input
                required
                className="mt-1 w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
                value={form.usn}
                onChange={(e) => setForm({ ...form, usn: e.target.value })}
              />
            </label>
            <label className="block text-xs text-slate-300">
              Note
              <textarea
                className="mt-1 w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </label>
            {done && <p className="text-xs text-teal-200">{done}</p>}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setActive(null)} className="text-xs px-3 py-1.5 rounded-lg glass">
                Cancel
              </button>
              <button type="submit" className="btn-glow text-xs font-semibold bg-teal-300 text-slate-900 px-3 py-1.5 rounded-lg">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [department, setDepartment] = useState('all');
  const [semester, setSemester] = useState('all');

  useEffect(() => {
    fetch('/api/subjects')
      .then((r) => r.json())
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]));
  }, []);

  const departments = useMemo(
    () => [...new Set(subjects.map((s) => s.department))].sort(),
    [subjects]
  );
  const semesters = useMemo(
    () => [...new Set(subjects.map((s) => s.semester))].sort((a, b) => a - b),
    [subjects]
  );

  const filtered = subjects.filter((s) => {
    const dOk = department === 'all' || s.department === department;
    const sOk = semester === 'all' || String(s.semester) === String(semester);
    return dOk && sOk;
  });

  const creditTotal = filtered.reduce((sum, s) => sum + Number(s.credits || 0), 0);

  return (
    <div className="space-y-5">
      <div className="glass morph-hover glass-blur-hover p-5">
        <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-800" /> Subjects
        </h2>
        <p className="text-xs text-stone-600 mt-1">Filter by department and semester. Each card lists instructor and credits.</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-stone-600">
            Department
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="field mt-1 w-full rounded-xl px-3 py-2 text-sm"
            >
              <option value="all">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-600">
            Semester
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="field mt-1 w-full rounded-xl px-3 py-2 text-sm"
            >
              <option value="all">All semesters</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-amber-900 font-medium">
          {filtered.length} subjects · {creditTotal} total credits
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <article key={s.id} className="glass morph-hover glass-blur-hover p-4">
            <div className="flex justify-between items-start gap-2">
              <span className="accent-chip text-[10px] font-bold px-2 py-0.5 rounded-full">
                {s.department} · Sem {s.semester}
              </span>
              <span className="text-xs font-black text-amber-900">{s.credits} cr</span>
            </div>
            <h3 className="font-bold text-stone-800 text-sm mt-2">{s.name}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{s.code}</p>
            <p className="text-xs text-stone-700 mt-2">Instructor: {s.instructor}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

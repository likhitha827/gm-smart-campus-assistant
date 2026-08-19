import React, { useEffect, useState } from 'react';

export default function StudentServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/student-services').then(r => r.json()).then(setServices).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Student Services & Administrative Counters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(s => (
          <div key={s.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-sm text-blue-700">{s.name}</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">📍 {s.office}</p>
            <div className="mt-2 text-xs space-y-1 text-slate-700">
              <p><span className="font-semibold">Procedure:</span> {s.procedure}</p>
              <p><span className="font-semibold">Processing Time:</span> {s.processingTime}</p>
              <p><span className="font-semibold">Fee:</span> {s.fee}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { Box, RotateCcw } from 'lucide-react';

const BUILDINGS = [
  {
    id: 'admin',
    name: 'Admin Block',
    blurb: 'Student welfare, CoE office, and admissions counters.',
    x: -70,
    y: 40,
    w: 90,
    d: 70,
    h: 78,
    face: '#c4a574',
    roof: '#7a5a32'
  },
  {
    id: 'cse',
    name: 'Block C · CSE',
    blurb: 'CSE HOD cabin C-301, labs, and faculty offices.',
    x: 90,
    y: -50,
    w: 80,
    d: 64,
    h: 110,
    face: '#b08968',
    roof: '#5c4033'
  },
  {
    id: 'ece',
    name: 'Block B · ECE',
    blurb: 'ECE department, Room B-205, and communication labs.',
    x: -120,
    y: -90,
    w: 74,
    d: 58,
    h: 96,
    face: '#c9a227',
    roof: '#6b5310'
  },
  {
    id: 'library',
    name: 'Central Library',
    blurb: 'Knowledge Hub · Mon–Sat 8:00 AM – 10:00 PM.',
    x: 30,
    y: 110,
    w: 100,
    d: 78,
    h: 62,
    face: '#d6c2a3',
    roof: '#8b6914'
  },
  {
    id: 'thub',
    name: 'T-Hub Arena',
    blurb: 'HackSphere venue and innovation floor, Tech Block A.',
    x: 130,
    y: 70,
    w: 70,
    d: 70,
    h: 54,
    face: '#a67c52',
    roof: '#4a3728'
  }
];

export default function CampusTour() {
  const [rx, setRx] = useState(62);
  const [rz, setRz] = useState(-28);
  const [active, setActive] = useState(BUILDINGS[0]);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ x: 0, y: 0, rx: 62, rz: -28 });

  function onPointerDown(e) {
    setDragging(true);
    drag.current = { x: e.clientX, y: e.clientY, rx, rz };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setRz(drag.current.rz + dx * 0.35);
    setRx(Math.min(80, Math.max(38, drag.current.rx - dy * 0.25)));
  }

  function onPointerUp() {
    setDragging(false);
  }

  function reset() {
    setRx(62);
    setRz(-28);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <section className="glass morph-hover overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-800" /> 3D campus tour
          </h2>
          <button type="button" onClick={reset} className="btn-glow text-xs glass px-3 py-1.5 rounded-full flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reset view
          </button>
        </div>
        <p className="px-4 pb-2 text-xs text-stone-600">Drag to orbit. Click a building for details.</p>
        <div
          className={`tour-stage ${dragging ? 'is-dragging' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="tour-world">
            <div className="tour-rig" style={{ '--rx': `${rx}deg`, '--rz': `${rz}deg` }}>
              <div className="campus-ground" />
              {BUILDINGS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`bldg ${active?.id === b.id ? 'is-active' : ''}`}
                  style={{
                    left: b.x,
                    top: b.y,
                    '--w': `${b.w}px`,
                    '--d': `${b.d}px`,
                    '--h': `${b.h}px`,
                    '--face': b.face,
                    '--roof': b.roof
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(b);
                  }}
                  aria-label={b.name}
                >
                  <span className="side front" />
                  <span className="side back" />
                  <span className="side left" />
                  <span className="side right" />
                  <span className="roof" />
                  <span className="bldg-label">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <aside className="glass morph-hover glass-blur-hover p-5 float-soft h-fit">
        <p className="text-[10px] uppercase tracking-[0.2em] text-amber-800 font-semibold">Landmark</p>
        <h3 className="text-xl font-bold text-stone-800 mt-1">{active.name}</h3>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">{active.blurb}</p>
        <ul className="mt-4 text-xs text-stone-600 space-y-1">
          <li>Drag horizontally to spin the quad</li>
          <li>Drag vertically to tilt altitude</li>
          <li>Use Reset view to return to the aerial</li>
        </ul>
      </aside>
    </div>
  );
}

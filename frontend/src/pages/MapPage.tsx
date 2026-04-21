import { useState } from 'react';
import { Map as MapIcon, AlertTriangle } from 'lucide-react';

const DISTRICTS_GEO = [
  { id: 'demo-1', name: 'Metro-Rural Periphery', x: 52, y: 38, band: 'High', pop: '1.2M' },
  { id: 'rural-1', name: 'Rural Sector Alpha', x: 25, y: 22, band: 'Critical', pop: '150k' },
  { id: 'urban-1', name: 'Tech City Central', x: 68, y: 55, band: 'Moderate', pop: '2M' },
  { id: 'fraud-1', name: 'Border Trade Zone', x: 85, y: 18, band: 'Fraud', pop: '500k' },
  { id: 'hard-1', name: 'Mountain Valley', x: 15, y: 60, band: 'Critical', pop: '80k' },
  { id: 'dist-6', name: 'Delta Flats', x: 40, y: 72, band: 'Critical', pop: '300k' },
  { id: 'dist-7', name: 'Northern Suburbs', x: 55, y: 15, band: 'Low', pop: '600k' },
  { id: 'dist-8', name: 'Industrial Port', x: 78, y: 65, band: 'High', pop: '900k' },
  { id: 'dist-9', name: 'Agri-Belt West', x: 18, y: 42, band: 'Moderate', pop: '400k' },
  { id: 'dist-10', name: 'Urban Slum Cluster', x: 62, y: 42, band: 'Critical', pop: '1.5M' },
  { id: 'dist-13', name: 'Capital City', x: 50, y: 50, band: 'Low', pop: '3M' },
  { id: 'dist-14', name: 'Coastal Villages', x: 35, y: 85, band: 'High', pop: '120k' },
  { id: 'dist-15', name: 'Refugee Settlement', x: 30, y: 35, band: 'Critical', pop: '90k' },
];

function getBandStyle(band: string) {
  if (band === 'Critical') return { dot: 'bg-rose-500', ring: 'ring-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/40' };
  if (band === 'High') return { dot: 'bg-amber-500', ring: 'ring-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/40' };
  if (band === 'Fraud') return { dot: 'bg-purple-500', ring: 'ring-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/40' };
  if (band === 'Moderate') return { dot: 'bg-cyan-500', ring: 'ring-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/40' };
  return { dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/40' };
}

export default function MapPage() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="p-6 border-b border-cyan-500/10 flex-shrink-0 flex items-center justify-between bg-[#040810]/80 backdrop-blur-md z-20">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight uppercase flex items-center gap-3">
            <MapIcon className="text-cyan-400 w-5 h-5" />
            Crisis Threat Map
          </h1>
          <p className="text-slate-600 mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]">Real-time sector priority visualization — CrisisGrid AI</p>
        </div>
        <div className="flex gap-5 text-[9px] font-black uppercase tracking-[0.2em]">
          <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50 animate-pulse" /> Critical</span>
          <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" /> High</span>
          <span className="flex items-center gap-1.5 text-cyan-400"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30" /> Moderate</span>
          <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe</span>
          <span className="flex items-center gap-1.5 text-purple-400"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Flagged</span>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Map Canvas */}
        <div className="absolute inset-0 bg-[#030812]">
          {/* Moving grid */}
          <div className="absolute inset-0 animated-grid opacity-40" />

          {/* Region boundary SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(6,182,212,0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="40" ry="35" fill="url(#mapGlow)" />
            <path d="M10,10 L35,5 L60,12 L90,8 L95,30 L88,55 L92,80 L75,90 L50,95 L25,88 L8,70 L5,40 Z" fill="none" stroke="rgba(6,182,212,0.08)" strokeWidth="0.3" />
            <path d="M20,20 L45,18 L70,22 L80,40 L75,60 L65,75 L45,80 L25,72 L15,50 Z" fill="rgba(6,182,212,0.02)" stroke="rgba(6,182,212,0.06)" strokeWidth="0.2" />
            {/* Connecting lines between nodes */}
            {DISTRICTS_GEO.slice(0, 8).map((d, i) => {
              const next = DISTRICTS_GEO[(i + 3) % DISTRICTS_GEO.length];
              return <line key={i} x1={d.x} y1={d.y} x2={next.x} y2={next.y} stroke="rgba(6,182,212,0.04)" strokeWidth="0.15" strokeDasharray="1 2" />;
            })}
          </svg>

          {/* District markers */}
          {DISTRICTS_GEO.map(d => {
            const s = getBandStyle(d.band);
            const isSelected = selected?.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 ${isSelected ? 'scale-150' : 'hover:scale-125'}`}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
              >
                <div className="relative">
                  {/* Signal pulse ring for critical */}
                  {d.band === 'Critical' && (
                    <div className={`absolute inset-[-8px] rounded-full border ${s.ring.replace('ring-', 'border-')} signal-pulse`} />
                  )}
                  <div className={`w-3.5 h-3.5 rounded-full ${s.dot} ring-4 ${s.ring} shadow-lg ${s.glow} transition-all`} />
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-wider ${s.text} opacity-0 group-hover:opacity-100 transition-opacity bg-[#0a1020]/95 px-2 py-1 rounded-md border border-white/10 backdrop-blur-sm`}>
                    {d.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Sector Detail Card */}
        {selected && (
          <div className="absolute bottom-6 right-6 w-80 glass-card rounded-xl p-5 z-20 glow-ring">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-white text-xs uppercase tracking-wider">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-white text-xs font-bold w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/3 rounded-lg p-2.5 border border-white/5">
                <p className="text-[9px] text-slate-600 uppercase tracking-[0.15em] font-black">Status</p>
                <p className={`text-xs font-black mt-0.5 uppercase ${getBandStyle(selected.band).text}`}>{selected.band} Priority</p>
              </div>
              <div className="bg-white/3 rounded-lg p-2.5 border border-white/5">
                <p className="text-[9px] text-slate-600 uppercase tracking-[0.15em] font-black">Population</p>
                <p className="text-xs font-black text-white mt-0.5">{selected.pop}</p>
              </div>
            </div>
            <a href={`/district/${selected.id}`} className="block w-full text-center bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2.5 rounded-lg transition-colors shadow-lg shadow-cyan-600/20">
              Run Full Assessment →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

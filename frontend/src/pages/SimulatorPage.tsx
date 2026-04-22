import { useState } from 'react';
import { ShieldAlert, Loader2, AlertTriangle, Droplets, TrendingDown, Skull, Heart, Truck, Globe2, CheckCircle2, RefreshCw, WifiOff } from 'lucide-react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SCENARIOS = [
  { id: 'flood', name: 'Flood Disruption', icon: Droplets, color: '#06b6d4', desc: 'Road access collapses by 40%. Infrastructure hazard flag activated across rural sectors.', multiplier: 1.5 },
  { id: 'supply', name: 'Supply Chain Shock', icon: AlertTriangle, color: '#ef4444', desc: 'Resource stock drops dramatically. Expected demand surges across all monitored sectors.', multiplier: 2.0 },
  { id: 'demand', name: 'Demand Shift', icon: TrendingDown, color: '#f59e0b', desc: 'Urban population migrates to alternative sources. Rural dependency intensifies.', multiplier: 1.2 },
  { id: 'leakage', name: 'Diversion Spike', icon: Skull, color: '#a855f7', desc: 'Black market activity and subsidy diversion risk surges in commercial border zones.', multiplier: 1.8 },
];

const RESOURCE_FILTERS = [
  { label: 'LPG & Fuel', icon: Droplets, active: true },
  { label: 'Food', icon: Truck, active: false },
  { label: 'Medical', icon: Heart, active: false },
  { label: 'Disaster', icon: ShieldAlert, active: false },
  { label: 'Multi', icon: Globe2, active: false },
];

export default function SimulatorPage() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runScenario = async (scenario: typeof SCENARIOS[0]) => {
    setActiveScenario(scenario.id);
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const res = await axios.post('https://crisisgrid-backend.onrender.com/simulate-scenario', {
        scenario_type: scenario.id,
        severity_multiplier: scenario.multiplier
      });
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || err?.message || "Backend unreachable. Ensure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const bandCounts = result?.results?.reduce((acc: any, curr: any) => {
    const band = curr.scores.priority_band;
    acc[band] = (acc[band] || 0) + 1;
    return acc;
  }, {});

  const pieData = bandCounts ? [
    { name: 'Critical', value: bandCounts['Critical Priority'] || 0, color: '#ef4444' },
    { name: 'High', value: bandCounts['High Priority'] || 0, color: '#f59e0b' },
    { name: 'Moderate', value: bandCounts['Moderate Monitoring'] || 0, color: '#06b6d4' },
    { name: 'Low/Safe', value: (bandCounts['Low Priority / Manual Review'] || 0), color: '#10b981' },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="p-8 pb-20 max-w-[1600px] mx-auto font-sans">
      <header className="mb-6 border-b border-cyan-500/10 pb-6">
        <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" /> War Room — Global Simulation
        </h1>
        <p className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wider">Inject global crisis events and observe multi-district impact & AI executive summary.</p>
      </header>

      <div className="flex gap-2 mb-6 flex-wrap">
        {RESOURCE_FILTERS.map((f, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border cursor-pointer transition-all
            ${f.active ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25' : 'bg-white/2 text-slate-600 border-white/5 hover:border-white/10'}`}>
            <f.icon className="w-3 h-3" /> {f.label}
            {f.active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-1" />}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {SCENARIOS.map(s => (
           <button key={s.id} onClick={() => runScenario(s)}
             className={`p-5 rounded-xl text-left transition-all group border relative overflow-hidden ${activeScenario === s.id ? 'border-white/15 bg-white/5 glow-ring' : 'border-white/5 glass-card hover:border-white/10'}`}>
             {activeScenario === s.id && <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20" style={{backgroundColor: s.color}} />}
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center border group-hover:scale-110 transition-transform" style={{backgroundColor: s.color + '12', borderColor: s.color + '25'}}>
                   <s.icon className="w-5 h-5" style={{color: s.color}} />
                </div>
                {activeScenario === s.id && <span className="w-2.5 h-2.5 rounded-full animate-pulse shadow-lg" style={{backgroundColor: s.color, boxShadow: `0 0 12px ${s.color}`}} />}
             </div>
             <h3 className="font-black text-white text-xs uppercase tracking-wider mb-1 relative z-10">{s.name}</h3>
             <p className="text-[10px] text-slate-500 leading-relaxed relative z-10">{s.desc}</p>
           </button>
         ))}
      </div>

      {loading && (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center glow-ring min-h-[350px]">
           <div className="relative mb-6">
             <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full rotate-slow" />
             <div className="absolute inset-2 border-2 border-cyan-400/30 rounded-full rotate-slow" style={{animationDirection:'reverse', animationDuration:'15s'}} />
             <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
           </div>
           <p className="font-black text-[10px] tracking-[0.25em] uppercase text-cyan-500/80">Simulating global crisis impacts...</p>
           <p className="text-[9px] text-slate-500 mt-2 font-medium">Gemini AI is drafting an executive briefing.</p>
        </div>
      )}

      {error && !loading && (
        <div className="glass-card rounded-xl p-8 border border-rose-500/20 bg-rose-500/5 min-h-[200px]">
           <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <WifiOff className="w-6 h-6 text-rose-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider mb-2">Simulation Failed</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">{error}</p>
                {activeScenario && (
                  <button onClick={() => { const s = SCENARIOS.find(x => x.id === activeScenario); if(s) runScenario(s); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                     <RefreshCw className="w-3.5 h-3.5" /> Retry Simulation
                  </button>
                )}
              </div>
           </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center border-dashed border-cyan-500/10 min-h-[350px]">
           <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center mb-4 bg-white/3">
             <Globe2 className="w-6 h-6 text-slate-700" />
           </div>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Select a global shock scenario</p>
           <p className="text-[10px] text-slate-700 mt-1 font-medium text-center max-w-sm">The AI Council will simulate the impact across all sectors and provide a strategic commander briefing.</p>
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 glass-card rounded-xl overflow-hidden glow-ring flex flex-col">
            <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-400" />
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Gemini AI • Commander Briefing</h2>
                  <p className="text-white font-bold text-sm uppercase tracking-wider">{activeScenario} Protocol Initiated</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Sectors Affected</p>
                <p className="text-2xl font-black text-white">{result.districts_affected}</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">Strategic Overview</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-slate-300 text-sm leading-relaxed italic font-medium flex-1">
                "{result.ai_summary}"
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 flex flex-col items-center glow-ring">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 self-start flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-600" /> Sector Threat Levels
            </h3>
            <div className="w-48 h-48 relative mb-6">
              <div className="absolute inset-[-4px] border border-cyan-500/10 rounded-full rotate-slow" />
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none" animationDuration={900}>
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0a1020', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-black text-white">{result.districts_affected}</span>
                 <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Total</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/3 rounded-lg p-2.5 border border-white/5">
                  <div className="w-2.5 h-2.5 rounded shadow-lg" style={{backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}60`}} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{d.name}</p>
                    <p className="text-sm font-black text-white">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-3 glass-card rounded-xl p-6 glow-ring">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Critical Sector Rollcall</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
               {result.results
                 .sort((a: any, b: any) => b.scores.priority_score - a.scores.priority_score)
                 .slice(0, 9)
                 .map((dist: any, idx: number) => (
                   <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                     <div>
                       <p className="text-xs font-bold text-white flex items-center gap-2">
                         {dist.scores.priority_score >= 80 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                         {dist.district_name}
                       </p>
                       <p className={`text-[9px] font-black mt-1 uppercase tracking-wider ${dist.scores.priority_score >= 80 ? 'text-rose-400' : dist.scores.priority_score >= 65 ? 'text-amber-400' : 'text-cyan-400'}`}>
                         {dist.scores.priority_band}
                       </p>
                     </div>
                     <div className="text-right">
                       <span className="text-lg font-black text-white">{dist.scores.priority_score.toFixed(0)}</span>
                       <span className="text-[9px] text-slate-500 font-bold ml-0.5">/100</span>
                     </div>
                   </div>
               ))}
             </div>
             {result.results.length > 9 && (
               <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">+ {result.results.length - 9} More Sectors</p>
             )}
          </div>
        </div>
      )}
    </div>
  )
}

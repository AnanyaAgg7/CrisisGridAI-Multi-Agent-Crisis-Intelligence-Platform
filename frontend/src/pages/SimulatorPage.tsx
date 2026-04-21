import { useState } from 'react';
import { ShieldAlert, Loader2, AlertTriangle, Droplets, TrendingDown, Skull, ChevronRight, Heart, Truck, Globe2 } from 'lucide-react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SCENARIOS = [
  { 
    id: 'flood', name: 'Flood Disruption', icon: Droplets, color: '#06b6d4',
    desc: 'Road access collapses by 40%. Infrastructure hazard flag activated across rural sectors.',
    overrides: { road_access_score: 15, flood_or_disruption_flag: true, last_mile_feasibility_score: 10 }
  },
  { 
    id: 'supply', name: 'Supply Chain Shock', icon: AlertTriangle, color: '#ef4444',
    desc: 'Resource stock drops dramatically. Expected demand surges across all monitored sectors.',
    overrides: { current_lpg_stock: 15, expected_refill_demand: 95, recent_supply_drop_percent: 55 }
  },
  { 
    id: 'demand', name: 'Demand Shift', icon: TrendingDown, color: '#f59e0b',
    desc: 'Urban population migrates to alternative sources. Rural dependency intensifies.',
    overrides: { urban_induction_shift_percent: 70, rural_lpg_dependency_percent: 95 }
  },
  { 
    id: 'leakage', name: 'Diversion Spike', icon: Skull, color: '#a855f7',
    desc: 'Black market activity and subsidy diversion risk surges in commercial border zones.',
    overrides: { black_market_risk_score: 90, diversion_risk_score: 85 }
  },
];

const RESOURCE_FILTERS = [
  { label: 'LPG & Fuel', icon: Droplets, active: true },
  { label: 'Food', icon: Truck, active: false },
  { label: 'Medical', icon: Heart, active: false },
  { label: 'Disaster', icon: ShieldAlert, active: false },
  { label: 'Multi', icon: Globe2, active: false },
];

const BASE_DISTRICT = {
  district_name: 'Simulated Sector',
  population: 500000,
  bpl_ratio: 55,
  vulnerable_household_ratio: 45,
  hospital_demand_index: 60,
  current_lpg_stock: 50,
  expected_refill_demand: 60,
  road_access_score: 70,
  flood_or_disruption_flag: false,
  black_market_risk_score: 20,
  diversion_risk_score: 15,
  urban_induction_shift_percent: 20,
  rural_lpg_dependency_percent: 75,
  recent_supply_drop_percent: 10,
  last_mile_feasibility_score: 65
};

export default function SimulatorPage() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runScenario = async (scenario: typeof SCENARIOS[0]) => {
    setActiveScenario(scenario.id);
    setLoading(true);
    setResult(null);
    const payload = { ...BASE_DISTRICT, ...scenario.overrides, district_name: `Sim: ${scenario.name}` };
    try {
      const res = await axios.post('http://localhost:8000/analyze-district', payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = result ? [
    { name: 'Equity', value: result.scores.E, color: '#818cf8' },
    { name: 'Logistics', value: result.scores.L, color: '#06b6d4' },
    { name: 'Risk (inv)', value: 100 - result.scores.R, color: '#ef4444' },
    { name: 'Demand', value: result.scores.D, color: '#f59e0b' },
  ] : [];

  return (
    <div className="p-8 pb-20 max-w-[1600px] mx-auto">
      <header className="mb-6 border-b border-cyan-500/10 pb-6">
        <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" /> War Room — Scenario Simulator
        </h1>
        <p className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wider">Inject synthetic crisis events and observe real-time multi-agent recalculations.</p>
      </header>

      {/* Resource filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {RESOURCE_FILTERS.map((f, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border cursor-pointer transition-all
            ${f.active ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25' : 'bg-white/2 text-slate-600 border-white/5 hover:border-white/10'}`}>
            <f.icon className="w-3 h-3" /> {f.label}
            {f.active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-1" />}
          </div>
        ))}
      </div>
      
      {/* Scenario Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {SCENARIOS.map(s => (
           <button 
             key={s.id} 
             onClick={() => runScenario(s)}
             className={`p-5 rounded-xl text-left transition-all group border relative overflow-hidden ${activeScenario === s.id ? 'border-white/15 bg-white/5 glow-ring' : 'border-white/5 glass-card hover:border-white/10'}`}
           >
             {/* Subtle glow */}
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

      {/* Results */}
      {loading && (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center glow-ring">
           <div className="relative mb-6">
             <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full rotate-slow" />
             <div className="absolute inset-2 border-2 border-cyan-400/30 rounded-full rotate-slow" style={{animationDirection:'reverse', animationDuration:'15s'}} />
             <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
           </div>
           <p className="font-black text-[10px] tracking-[0.25em] uppercase text-cyan-500/80">Simulating crisis parameters...</p>
        </div>
      )}

      {!result && !loading && (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center border-dashed border-cyan-500/10 min-h-[280px]">
           <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center mb-4 bg-white/3">
             <ShieldAlert className="w-6 h-6 text-slate-700" />
           </div>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Select a scenario above</p>
           <p className="text-[10px] text-slate-700 mt-1 font-medium">The AI Council will recalculate allocation priorities in real-time.</p>
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Summary */}
          <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden glow-ring">
            <div className={`px-6 py-4 border-b flex justify-between items-center ${result.scores.priority_score >= 80 ? 'bg-rose-500/8 border-rose-500/15' : result.scores.priority_score >= 65 ? 'bg-amber-500/8 border-amber-500/15' : 'bg-cyan-500/5 border-cyan-500/10'}`}>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Simulation Result</p>
                <p className={`font-black text-sm mt-0.5 uppercase ${result.scores.priority_score >= 80 ? 'text-rose-400' : result.scores.priority_score >= 65 ? 'text-amber-400' : 'text-cyan-400'}`}>{result.scores.priority_band}</p>
              </div>
              <div className="text-right">
                <span className={`text-4xl font-black tracking-tighter ${result.scores.priority_score >= 80 ? 'text-rose-400' : result.scores.priority_score >= 65 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {result.scores.priority_score.toFixed(0)}
                </span>
                <span className="text-slate-600 font-semibold ml-1 text-sm">/ 100</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Recommended Action</p>
              <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold px-4 py-3 text-xs rounded-lg mb-4 uppercase tracking-wider">
                {result.scores.recommendation}
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Moderator Analysis</p>
              <p className="text-sm text-slate-400 font-medium leading-relaxed bg-white/3 p-4 rounded-lg border border-white/5 italic">
                "{result.agents.moderator_agent}"
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-card rounded-xl p-6 flex flex-col items-center glow-ring">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 self-start">Agent Distribution</h3>
            <div className="w-48 h-48 relative">
              <div className="absolute inset-[-4px] border border-cyan-500/10 rounded-full rotate-slow" />
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none" animationDuration={900}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0a1020', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/3 rounded-lg p-2 border border-white/5">
                  <div className="w-2.5 h-2.5 rounded" style={{backgroundColor: d.color}} />
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{d.name}</p>
                    <p className="text-sm font-black text-white">{d.value.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

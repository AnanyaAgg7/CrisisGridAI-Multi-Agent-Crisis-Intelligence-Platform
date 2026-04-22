import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, ShieldAlert, FileText, Loader2, ListChecks, ChevronRight, TrendingUp, AlertTriangle, Truck, Users, Activity, RefreshCw, WifiOff } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DistrictPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    district_name: 'Custom Sector', population: 100000, bpl_ratio: 50,
    vulnerable_household_ratio: 40, hospital_demand_index: 50, current_lpg_stock: 50,
    expected_refill_demand: 50, road_access_score: 50, flood_or_disruption_flag: false,
    black_market_risk_score: 10, diversion_risk_score: 10, urban_induction_shift_percent: 20,
    rural_lpg_dependency_percent: 80, recent_supply_drop_percent: 10, last_mile_feasibility_score: 50
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
       axios.get('https://crisisgrid-backend.onrender.com/districts').then(res => {
          const matched = res.data.data.find((d: any) => d.id === id);
          if (matched) { setFormData(matched); if (id === 'demo-1') triggerAnalysis(matched); }
       }).catch(() => {});
    }
  }, [id]);

  const triggerAnalysis = async (data: any) => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await axios.post('http://localhost:8000/analyze-district', data);
      setResult(res.data);
    } catch(err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || err?.message || "Backend unreachable. Ensure it's running on port 8000.");
    } finally { setLoading(false); }
  }

  const handleAnalyze = (e: any) => { e.preventDefault(); triggerAnalysis(formData); }
  const handleChange = (e: any) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : Number(value) || value }));
  };

  const AGENTS = [
    { title: 'Equity', key: 'equity_agent', scoreKey: 'E', weight: '0.35', icon: Users, color: '#818cf8', reason: 'BPL ratio, vulnerability index, healthcare demand' },
    { title: 'Logistics', key: 'logistics_agent', scoreKey: 'L', weight: '0.25', icon: Truck, color: '#06b6d4', reason: 'Road access, last-mile feasibility, disruption' },
    { title: 'Risk', key: 'risk_agent', scoreKey: 'R', weight: '0.20', icon: AlertTriangle, color: '#ef4444', reason: 'Black market score, diversion risk, leakage' },
    { title: 'Demand', key: 'demand_agent', scoreKey: 'D', weight: '0.20', icon: TrendingUp, color: '#f59e0b', reason: 'Refill demand, rural dependency, shift rates' },
  ];

  const pieData = result ? [
    { name: 'Equity (E)', value: result.scores.E, color: '#818cf8' },
    { name: 'Logistics (L)', value: result.scores.L, color: '#06b6d4' },
    { name: 'Risk (inv)', value: 100 - result.scores.R, color: '#ef4444' },
    { name: 'Demand (D)', value: result.scores.D, color: '#f59e0b' },
  ] : [];

  return (
    <div className="p-8 pb-20 max-w-[1600px] mx-auto font-sans">
       <header className="mb-8 flex items-center justify-between border-b border-cyan-500/10 pb-6">
         <div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <Activity className="w-5 h-5 text-cyan-400" /> Sector Priority Assessment
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-xs uppercase tracking-wider">Configure sector telemetry → execute multi-agent council evaluation</p>
         </div>
         <button onClick={() => navigate('/district/demo-1')} className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors uppercase tracking-[0.15em]">
            Load Demo Scenario
         </button>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Telemetry Panel */}
          <div className="lg:col-span-3 glass-card rounded-xl self-start overflow-hidden glow-ring">
             <div className="bg-gradient-to-r from-cyan-600/15 to-blue-600/10 px-5 py-3.5 border-b border-cyan-500/10 flex justify-between items-center">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Telemetry</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></span>
                  <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-wider">Live</span>
                </div>
             </div>
             <form onSubmit={handleAnalyze} className="p-4 space-y-3">
                <div>
                   <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1.5">Target Sector</label>
                   <input type="text" name="district_name" required value={formData.district_name} onChange={(e) => setFormData(prev => ({...prev, district_name: e.target.value}))} className="w-full text-sm font-semibold text-white bg-white/5 rounded-lg border border-white/10 p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none focus:border-cyan-500/30" />
                </div>
                <div className="border-t border-white/5 pt-3 space-y-2.5">
                   <SliderField label="BPL Demographics" name="bpl_ratio" val={formData.bpl_ratio} onChange={handleChange} />
                   <SliderField label="Hospital Demand" name="hospital_demand_index" val={formData.hospital_demand_index} onChange={handleChange} />
                   <SliderField label="Rural Dependency" name="rural_lpg_dependency_percent" val={formData.rural_lpg_dependency_percent} onChange={handleChange} />
                   <SliderField label="Alt-Source Shift" name="urban_induction_shift_percent" val={formData.urban_induction_shift_percent} onChange={handleChange} />
                </div>
                <div className="border-t border-white/5 pt-3 space-y-2.5">
                   <SliderField label="Road Access" name="road_access_score" val={formData.road_access_score} onChange={handleChange} />
                   <SliderField label="Diversion Risk" name="black_market_risk_score" val={formData.black_market_risk_score} onChange={handleChange} />
                </div>
                <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-center justify-between">
                   <div>
                       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-400 cursor-pointer block" htmlFor="flood_flag">Hazard Active</label>
                       <p className="text-[9px] text-rose-600 font-semibold mt-0.5">Flood / Disaster</p>
                   </div>
                   <input id="flood_flag" type="checkbox" name="flood_or_disruption_flag" checked={formData.flood_or_disruption_flag} onChange={handleChange} className="w-4 h-4 rounded border-rose-500/30 accent-rose-500 cursor-pointer" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 glow-ring">
                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                   {loading ? 'Computing...' : 'Execute Assessment'}
                </button>
             </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-9 flex flex-col gap-6">
             {error && !loading && (
                <div className="glass-card rounded-xl p-8 border border-rose-500/20 bg-rose-500/5">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                        <WifiOff className="w-6 h-6 text-rose-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider mb-2">Connection Issue</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">{error}</p>
                        <button onClick={() => triggerAnalysis(formData)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                           <RefreshCw className="w-3.5 h-3.5" /> Retry Assessment
                        </button>
                      </div>
                   </div>
                </div>
             )}
             {!result && !loading && !error && (
                <div className="h-full min-h-[500px] border border-dashed border-cyan-500/10 rounded-xl flex flex-col items-center justify-center glass-card">
                    <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center mb-4 bg-white/3"><FileText className="w-7 h-7 text-slate-700" /></div>
                    <p className="text-xs font-black tracking-[0.2em] text-slate-600 uppercase">System Standby</p>
                    <p className="text-[10px] font-medium text-slate-700 mt-1">Configure parameters and execute council assessment.</p>
                </div>
             )}
             {loading && (
                <div className="h-full min-h-[500px] border border-cyan-500/10 rounded-xl flex flex-col items-center justify-center glass-card space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full rotate-slow" />
                      <div className="absolute inset-2 border-2 border-cyan-400/40 rounded-full rotate-slow" style={{animationDirection: 'reverse', animationDuration: '15s'}} />
                      <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
                    </div>
                    <p className="font-black text-[10px] tracking-[0.25em] uppercase text-cyan-500/80">Council processing telemetry...</p>
                    <p className="text-[9px] text-slate-600 font-medium">Gemini AI agents are deliberating. This may take a moment.</p>
                </div>
             )}
             {result && !loading && (
                <div className="flex flex-col gap-6">
                   <div className="glass-card rounded-xl overflow-hidden glow-ring">
                      <div className={`px-8 py-5 border-b flex justify-between items-center ${result.scores.priority_score >= 80 ? 'bg-rose-500/8 border-rose-500/15' : result.scores.priority_score >= 65 ? 'bg-amber-500/8 border-amber-500/15' : 'bg-cyan-500/5 border-cyan-500/10'}`}>
                          <div>
                              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                 <CheckCircle2 className={`w-4 h-4 ${result.scores.priority_score >= 80 ? 'text-rose-400' : result.scores.priority_score >= 65 ? 'text-amber-400' : 'text-cyan-400'}`} /> Operational Directive
                              </h2>
                              <p className="text-lg font-bold mt-1 text-white">{formData.district_name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">Crisis Priority Index</p>
                             <div className="flex items-baseline gap-2 justify-end">
                                <span className={`text-5xl font-black tracking-tighter ${result.scores.priority_score >= 80 ? 'text-rose-400' : result.scores.priority_score >= 65 ? 'text-amber-400' : 'text-cyan-400'}`}>{result.scores.priority_score.toFixed(0)}</span>
                                <span className="font-semibold text-slate-600">/ 100</span>
                             </div>
                          </div>
                      </div>
                      <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-2/3 p-6 border-r border-white/5">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">Moderator Synthesis</p>
                             <div className="text-slate-300 text-sm font-medium leading-relaxed bg-white/3 p-5 rounded-lg border border-white/5">{result.agents.moderator_agent || result.agents.moderator}</div>
                          </div>
                          <div className="w-full md:w-1/3 p-6 flex flex-col justify-center gap-4">
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1.5">Classification</p>
                                <div className={`font-black text-sm uppercase tracking-wider ${result.scores.priority_score >= 80 ? 'text-rose-400' : result.scores.priority_score >= 65 ? 'text-amber-400' : 'text-cyan-400'}`}>{result.scores.priority_band}</div>
                             </div>
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1.5">Recommended Action</p>
                                <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold px-3 py-2 text-xs rounded-lg flex items-center gap-2 uppercase tracking-wider">
                                   <ListChecks className="w-4 h-4" /> {result.scores.recommendation}
                                </div>
                             </div>
                          </div>
                      </div>
                   </div>
                   <div>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 px-1 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-slate-700" /> Agent Reasoning Audit Trail</h3>
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {AGENTS.map((agent, i) => (
                            <div key={i} className="glass-card rounded-xl p-4 flex flex-col transition-all hover:border-white/10 hover:shadow-lg group relative overflow-hidden">
                               <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[40px] opacity-10" style={{backgroundColor: agent.color}} />
                               <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5 relative z-10">
                                  <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-lg flex items-center justify-center border group-hover:scale-110 transition-transform" style={{backgroundColor: agent.color + '12', borderColor: agent.color + '25'}}>
                                        <agent.icon className="w-4 h-4" style={{color: agent.color}} />
                                     </div>
                                     <span className="font-black text-[10px] text-white uppercase tracking-[0.15em]">{agent.title}</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-700 tracking-wider">w:{agent.weight}</span>
                               </div>
                               <div className="text-3xl font-black mb-1 tracking-tight relative z-10" style={{color: agent.color}}>{result.scores[agent.scoreKey].toFixed(0)}</div>
                               <p className="text-[9px] text-slate-600 font-bold mb-3 uppercase tracking-wider">{agent.reason}</p>
                               <p className="text-[11px] text-slate-400 font-medium leading-relaxed flex-1 italic">"{result.agents[agent.key]}"</p>
                            </div>
                          ))}
                       </div>
                   </div>
                   <div className="glass-card rounded-xl p-6 glow-ring">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Agent Score Distribution</h3>
                      <div className="flex items-center gap-8">
                         <div className="w-52 h-52 relative">
                            <div className="absolute inset-[-4px] border border-cyan-500/10 rounded-full rotate-slow" />
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={pieData} innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value" stroke="none" animationDuration={900}>
                                  {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0a1020', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                              </PieChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="flex-1 grid grid-cols-2 gap-3">
                            {pieData.map((d, i) => (
                               <div key={i} className="flex items-center gap-3 bg-white/3 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
                                  <div className="w-3 h-3 rounded" style={{backgroundColor: d.color}} />
                                  <div>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{d.name}</p>
                                     <p className="text-lg font-black text-white">{d.value.toFixed(0)}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function SliderField({ label, name, val, onChange }: any) {
    return (
       <div>
          <div className="flex justify-between items-end mb-1">
             <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</label>
             <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">{val}</span>
          </div>
          <input type="range" min="0" max="100" name={name} value={val} onChange={onChange} className="w-full accent-cyan-500 h-1 bg-white/5 rounded appearance-none focus:outline-none cursor-pointer" />
       </div>
    )
}

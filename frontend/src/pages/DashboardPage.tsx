import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, FileText, ChevronRight, BarChart3, PieChart as PieChartIcon, Users, Activity, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [districts, setDistricts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [distRes, sumRes] = await Promise.all([
          axios.get('https://crisisgrid-backend.onrender.com/districts'),
          axios.get('https://crisisgrid-backend.onrender.com/dashboard-summary'),
        ]);
        setDistricts(distRes.data.data);
        setSummary(sumRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(load, 600);
  }, []);

  const barData = [
    { name: 'Rural Alpha', gap: 85 },
    { name: 'Slum Cluster', gap: 75 },
    { name: 'Refugee Sett.', gap: 90 },
    { name: 'Mountain Vly', gap: 65 },
    { name: 'Delta Flats', gap: 55 },
  ];

  const donutData = [
    { name: 'Maintain', value: 3, color: '#06b6d4' },
    { name: 'Emergency', value: 4, color: '#ef4444' },
    { name: 'Shift Subsidy', value: 1, color: '#f59e0b' },
    { name: 'Route Support', value: 3, color: '#818cf8' },
    { name: 'Audit', value: 2, color: '#64748b' }
  ];

  const critCount = summary?.critical_count ?? '-';
  const popStr = summary?.affected_population ?? '-';
  const divFlags = summary?.diversion_flags ?? '-';

  return (
    <div className="p-8 pb-20 max-w-[1600px] mx-auto font-sans">
      <header className="mb-8 border-b border-cyan-500/10 pb-6 flex justify-between items-end">
        <div>
           <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
             <Activity className="w-5 h-5 text-cyan-400" /> Command Center
           </h1>
           <p className="text-slate-500 mt-1 font-medium text-xs uppercase tracking-wider">Multi-sector crisis telemetry and threat assessment</p>
        </div>
        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" /> Live Feed
        </span>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Active Sectors', val: loading ? '-' : (summary?.total_districts ?? districts.length), icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/15' },
          { title: 'Critical Alerts', val: loading ? '-' : critCount, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/15' },
          { title: 'Affected Population', val: loading ? '-' : popStr, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/15' },
          { title: 'Diversion Flags', val: loading ? '-' : divFlags, icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
        ].map((m, i) => (
          <div key={i} className="glass-card p-5 rounded-xl flex items-center justify-between group hover:border-white/10 transition-all">
             <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{m.title}</p>
                {loading ? (
                    <div className="h-8 w-16 bg-white/5 animate-pulse rounded mt-2"></div>
                ) : (
                    <p className="text-3xl font-black text-white mt-1 tracking-tighter">{m.val}</p>
                )}
             </div>
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.bg} border ${m.border} group-hover:scale-110 transition-transform`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Bar Chart */}
         <div className="glass-card rounded-xl p-6 flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
               <BarChart3 className="w-4 h-4 text-slate-700" />
               Critical Shortage Index
            </h3>
            <div className="flex-1 h-64">
               {loading ? <SkeletonChart /> : (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(6,182,212,0.04)" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} width={100} />
                     <RechartsTooltip cursor={{fill: 'rgba(6,182,212,0.03)'}} contentStyle={{ background: '#0a1020', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                     <Bar dataKey="gap" fill="#ef4444" radius={[0, 4, 4, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               )}
            </div>
         </div>

         {/* Donut Chart */}
         <div className="glass-card rounded-xl p-6 flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
               <PieChartIcon className="w-4 h-4 text-slate-700" />
               Strategy Distribution
            </h3>
            <div className="flex-1 h-64 flex justify-center">
               {loading ? <SkeletonChart /> : (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={donutData} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                       {donutData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <RechartsTooltip contentStyle={{ background: '#0a1020', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                   </PieChart>
                 </ResponsiveContainer>
               )}
            </div>
            {!loading && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4">
                 {donutData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px] uppercase font-black text-slate-600 tracking-[0.15em]">
                       <span className="w-2 h-2 rounded" style={{backgroundColor: d.color}}></span>
                       {d.name}
                    </div>
                 ))}
              </div>
            )}
         </div>

         {/* Priority Queue */}
         <div className="glass-card rounded-xl p-6 flex flex-col h-[420px]">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                   Priority Queue
                </h3>
                <span className="px-2 py-0.5 bg-cyan-500/10 rounded-full text-[9px] font-black tracking-[0.15em] text-cyan-600 border border-cyan-500/20">TOP 5</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2">
               {loading ? (
                   Array(5).fill(0).map((_, idx) => <SkeletonListItem key={idx} />)
               ) : (
                  districts.slice(0, 5).map(d => (
                     <Link key={d.id} to={`/district/${d.id}`} className="block group">
                        <div className="p-3 rounded-lg border border-white/5 bg-white/2 hover:bg-cyan-500/5 hover:border-cyan-500/15 transition-all flex items-center justify-between">
                           <div>
                              <div className="flex items-center gap-2">
                                 {d.expected_band?.includes('Critical') && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/50" />}
                                 <p className="text-[11px] font-bold text-slate-300">{d.district_name}</p>
                              </div>
                              <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-[0.15em]">{d.type} • Pop {(d.population/1000).toFixed(0)}k</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                        </div>
                     </Link>
                  ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

function SkeletonChart() {
    return <div className="w-full h-full bg-white/3 rounded-lg animate-pulse"></div>;
}
function SkeletonListItem() {
    return <div className="w-full h-[54px] bg-white/3 rounded-lg animate-pulse"></div>;
}

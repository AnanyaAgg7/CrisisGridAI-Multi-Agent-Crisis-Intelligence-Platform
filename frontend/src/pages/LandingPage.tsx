import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileCheck, Network, ChevronRight, Shield, BarChart3, Zap, Radio, Activity, Truck, Droplets, Heart, Globe2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#040810] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Animated background layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 animated-grid opacity-60" />
        <div className="absolute top-[-20%] left-[15%] w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[150px] float-slow" />
        <div className="absolute bottom-[-15%] right-[10%] w-[500px] h-[500px] bg-blue-600/4 rounded-full blur-[120px] float-medium" />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-amber-500/3 rounded-full blur-[100px]" />
        {/* Rotating ring element */}
        <div className="absolute top-[20%] right-[15%] w-40 h-40 border border-cyan-500/10 rounded-full rotate-slow" />
        <div className="absolute top-[22%] right-[16%] w-36 h-36 border border-cyan-500/5 rounded-full rotate-slow" style={{animationDirection: 'reverse', animationDuration: '45s'}} />
      </div>

      {/* Top Navbar */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-cyan-500/10 backdrop-blur-xl bg-[#040810]/70 z-10 relative">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-ring">
              <Radio className="w-4 h-4 text-white" />
           </div>
           <div>
              <h1 className="text-sm font-black tracking-tight uppercase">CrisisGrid AI</h1>
              <p className="text-[9px] text-cyan-600 uppercase tracking-[0.25em] font-bold">Intelligence Platform</p>
           </div>
           <span className="text-[9px] font-bold bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-500/20 uppercase tracking-[0.15em] ml-2 flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Active
           </span>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/map')} className="text-xs font-semibold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-wider">Threat Map</button>
           <button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all text-xs flex items-center gap-2 uppercase tracking-wider shadow-lg shadow-cyan-600/20 glow-ring">
             Command Center <ArrowRight className="w-3.5 h-3.5" />
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-6xl mx-auto w-full z-10 relative">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/8 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          <Zap className="w-3.5 h-3.5" /> Multi-Agent Crisis Intelligence Platform
        </div>

        <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          Real-time resource<br/>
          <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent gradient-animate">allocation</span> for crisis response.
        </h2>
        
        <p className="text-base text-slate-500 max-w-3xl mb-10 font-medium leading-relaxed">
          CrisisGrid AI deploys autonomous multi-agent councils to allocate essential resources — fuel, food, medical supplies, and disaster relief — fairly across affected districts during emergencies. Each agent specializes in a policy lens; a moderator synthesizes the final directive.
        </p>

        {/* Scenario Category Chips */}
        <div className="flex gap-2 mb-10 flex-wrap justify-center">
          {[
            { label: 'LPG & Fuel', icon: Droplets, active: true },
            { label: 'Food Grain', icon: Truck, active: false },
            { label: 'Medical Supplies', icon: Heart, active: false },
            { label: 'Disaster Relief', icon: Shield, active: false },
            { label: 'Multi-Resource', icon: Globe2, active: false },
          ].map((c, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer
              ${c.active ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'bg-white/3 text-slate-600 border-white/5 hover:border-white/10 hover:text-slate-400'}`}>
              <c.icon className="w-3 h-3" /> {c.label}
              {c.active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-1" />}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-16">
           <button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2 text-sm uppercase tracking-wider glow-ring">
             Enter Command Center <ArrowRight className="w-4 h-4" />
           </button>
           <button onClick={() => navigate('/district/new')} className="bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 px-8 py-3.5 rounded-lg font-bold transition-all flex items-center gap-2 text-sm uppercase tracking-wider">
             Run Sector Assessment
           </button>
        </div>

        {/* Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-16">
          {[
            { icon: Shield, title: 'Deterministic Bounds', desc: 'Math-driven baselines prevent LLM hallucinations. Every score is computed within rigid numerical limits before AI reasoning begins.', color: 'text-emerald-400', border: 'border-emerald-500/15', bg: 'bg-emerald-500/5' },
            { icon: Network, title: 'Multi-Agent Council', desc: 'Six independent agents — Equity, Logistics, Risk, Demand, Resilience, and Moderator — analyze every sector through specialized lenses.', color: 'text-cyan-400', border: 'border-cyan-500/15', bg: 'bg-cyan-500/5' },
            { icon: BarChart3, title: 'Resource Agnostic', desc: 'Deployable across LPG, food grain, medical supply, water, and disaster relief allocation. One framework, any essential resource.', color: 'text-amber-400', border: 'border-amber-500/15', bg: 'bg-amber-500/5' },
          ].map((f, i) => (
            <div key={i} className={`p-6 rounded-xl border ${f.border} ${f.bg} backdrop-blur-sm text-left transition-all hover:scale-[1.02] hover:shadow-lg group`}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 mb-4 group-hover:scale-110 transition-transform">
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Crisis Spotlight */}
        <div className="w-full text-left rounded-xl overflow-hidden border border-cyan-500/10 flex flex-col md:flex-row group glow-ring">
           <div className="p-8 md:w-1/2 bg-gradient-to-br from-[#0a1628] to-[#060d18] relative overflow-hidden">
               <div className="absolute top-4 right-4 opacity-5"><Activity className="w-48 h-48" /></div>
               <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-6 border border-rose-500/20">
                 Live Scenario Demo
               </div>
               <h3 className="text-xl font-bold mb-3 tracking-tight text-white">LPG Supply Shock: Metro-Rural Disparity</h3>
               <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                  A traditional single-model AI blindly provisions resources by falling stock levels. CrisisGrid AI detects urban users migrating to induction while rural BPL households face critical dependence — issuing a targeted subsidy reallocation directive.
               </p>
               <button onClick={() => navigate('/district/demo-1')} className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:gap-3 transition-all uppercase tracking-wider">
                  Simulate This Case <ChevronRight className="w-4 h-4" />
               </button>
           </div>
           <div className="p-8 md:w-1/2 bg-[#060d18] grid grid-cols-1 gap-5 border-l border-cyan-500/10">
              <div className="border-l-2 border-cyan-500 pl-4">
                 <h4 className="font-bold text-white text-sm flex items-center gap-2"><Network className="w-4 h-4 text-cyan-400" /> Multi-Agent Council Debate</h4>
                 <p className="text-sm text-slate-500 mt-1">Six parallel agents process hyper-local telemetry via Google Gemini — conflict resolution by Moderator.</p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4">
                 <h4 className="font-bold text-white text-sm flex items-center gap-2"><FileCheck className="w-4 h-4 text-emerald-400" /> Auditable Directives</h4>
                 <p className="text-sm text-slate-500 mt-1">Every recommendation includes full agent reasoning trail, numerical bounds, and policy-grade justification.</p>
              </div>
           </div>
        </div>
      </main>

      {/* Floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-cyan-400/30 rounded-full" style={{
            left: `${15 + i * 15}%`,
            bottom: '-2%',
            animation: `particleDrift ${12 + i * 3}s linear infinite`,
            animationDelay: `${i * 2}s`
          }} />
        ))}
      </div>
    </div>
  );
}

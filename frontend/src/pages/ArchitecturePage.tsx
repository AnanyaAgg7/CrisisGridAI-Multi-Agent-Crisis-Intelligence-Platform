import { Database, Zap, Cpu, Network, FileCheck, Activity } from 'lucide-react';

const STEPS = [
  { icon: Database, title: '1. Input Data Processing', desc: 'Ingests district-level parameters (BPL ratio, hospital demand, flood status, stock levels). Validates via FastAPI Pydantic schema.', color: 'text-slate-400', bg: 'bg-white/3', border: 'border-white/8', iconBg: 'bg-white/5' },
  { icon: Cpu, title: '2. Deterministic Scoring Engine', desc: 'Calculates normalized scores (0-100) for Equity (E), Logistics (L), Risk (R), and Demand (D) using rigid mathematical bounds to prevent LLM hallucinations.', color: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/15', iconBg: 'bg-cyan-500/10' },
  { icon: Network, title: '3. Multi-Agent AI Debate', desc: 'Triggers a unified Gemini prompt simulating 4 independent agents. Each agent (Equity, Logistics, Risk, Demand) analyzes the localized data through their specialized policy lens.', color: 'text-indigo-400', bg: 'bg-indigo-500/5', border: 'border-indigo-500/15', iconBg: 'bg-indigo-500/10' },
  { icon: Zap, title: '4. Moderator Decision Synthesis', desc: 'A Magistrate Agent reviews the 4 conflicting outputs alongside the deterministic bounds, synthesizing a final, accountable recommendation.', color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/15', iconBg: 'bg-amber-500/10' },
  { icon: FileCheck, title: '5. District Priority Output', desc: 'Generates structured JSON containing Priority Band, Delivery Recommendation, and the audit trail of agent reasoning, rendered directly to the dashboard.', color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/15', iconBg: 'bg-emerald-500/10' },
];

export default function ArchitecturePage() {
  return (
    <div className="p-8 pb-20 max-w-4xl mx-auto font-sans">
      <header className="mb-10 border-b border-cyan-500/10 pb-6">
        <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-400" /> System Architecture
        </h1>
        <p className="text-slate-500 mt-1 text-xs font-semibold uppercase tracking-wider">Explainable AI pipeline separating mathematical priority bounds from LLM reasoning.</p>
      </header>

      <div className="flex flex-col items-center gap-5 relative">
        {/* Vertical connector line */}
        <div className="absolute top-[40px] bottom-[40px] left-1/2 w-px bg-gradient-to-b from-cyan-500/20 via-indigo-500/15 to-emerald-500/20 -translate-x-1/2 z-0" />

        {STEPS.map((step, i) => (
          <div key={i} className={`${step.bg} p-6 rounded-xl border ${step.border} w-full z-10 flex items-start gap-4 hover:border-white/15 transition-all backdrop-blur-sm group`}>
             <div className={`${step.iconBg} p-3 rounded-xl ${step.color} border border-white/5 group-hover:scale-110 transition-transform`}>
               <step.icon className="w-6 h-6" />
             </div>
             <div>
                <h3 className="font-black text-white text-sm uppercase tracking-wider mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{step.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}

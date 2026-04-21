import { Database, Zap, Cpu, Network, FileCheck } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Architecture</h1>
        <p className="text-slate-500 mt-1">Explainable AI pipeline separating mathematical priority bounds from LLM reasoning.</p>
      </header>

      <div className="flex flex-col items-center gap-8 relative">
        <div className="absolute top-[10%] bottom-[10%] left-1/2 w-1 bg-slate-200 -translate-x-1/2 z-0" />

        {/* Step 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-2xl z-10 flex items-start gap-4 hover:border-blue-300 transition-colors">
           <div className="bg-slate-100 p-3 rounded-full text-slate-600"><Database className="w-6 h-6" /></div>
           <div>
              <h3 className="font-bold text-slate-900 text-lg">1. Input Data Processing</h3>
              <p className="text-sm text-slate-600 mt-1">Ingests district-level parameters (BPL ratio, hospital demand, flood status, stock levels). Validates via FastAPI Pydantic schema.</p>
           </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-2xl z-10 flex items-start gap-4 hover:border-blue-300 transition-colors">
           <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Cpu className="w-6 h-6" /></div>
           <div>
              <h3 className="font-bold text-slate-900 text-lg">2. Deterministic Scoring Engine</h3>
              <p className="text-sm text-slate-600 mt-1">Calculates normalized scores (0-100) for Equity (E), Logistics (L), Risk (R), and Demand (D) using rigid mathematical bounds to prevent LLM hallucinations.</p>
           </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-2xl z-10 flex items-start gap-4 hover:border-indigo-300 transition-colors">
           <div className="bg-indigo-50 p-3 rounded-full text-indigo-600"><Network className="w-6 h-6" /></div>
           <div>
              <h3 className="font-bold text-slate-900 text-lg">3. Multi-Agent AI Debate</h3>
              <p className="text-sm text-slate-600 mt-1">Triggers 4 independent Gemini prompts concurrently. Each agent (Equity, Logistics, Risk, Demand) analyzes the localized data exclusively through their specialized policy lens.</p>
           </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-6 rounded-xl border border-blue-300 shadow-md w-full max-w-2xl z-10 flex items-start gap-4 relative overflow-hidden">
           <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 focus:blur-3xl rounded-full opacity-50 -z-10" />
           <div className="bg-blue-600 p-3 rounded-full text-white"><Zap className="w-6 h-6" /></div>
           <div>
              <h3 className="font-bold text-slate-900 text-lg">4. Moderator Decision Synthesis</h3>
              <p className="text-sm text-slate-600 mt-1">A final Magistrate Agent reviews the 4 conflicting outputs alongside the deterministic bounds, synthesizing a final, accountable recommendation.</p>
           </div>
        </div>

        {/* Step 5 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-2xl z-10 flex items-start gap-4 hover:border-emerald-300 transition-colors">
           <div className="bg-emerald-50 p-3 rounded-full text-emerald-600"><FileCheck className="w-6 h-6" /></div>
           <div>
              <h3 className="font-bold text-slate-900 text-lg">5. District Priority Output</h3>
              <p className="text-sm text-slate-600 mt-1">Generates the structured JSON containing Priority Band, Delivery Recommendation, and the audit trail of agent reasoning, rendering it directly to the dashboard.</p>
           </div>
        </div>

      </div>
    </div>
  )
}

import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Map as MapIcon, ShieldAlert, Crosshair, Radio } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DistrictPage from './pages/DistrictPage';
import MapPage from './pages/MapPage';
import SimulatorPage from './pages/SimulatorPage';

function Sidebar() {
  const location = useLocation();
  const navItems = [
    { name: 'Overview', path: '/', icon: Activity },
    { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Threat Map', path: '/map', icon: MapIcon },
    { name: 'Assess Sector', path: '/district/new', icon: Crosshair },
    { name: 'War Room', path: '/simulator', icon: ShieldAlert },
  ];

  return (
    <div className="w-64 bg-[#060d18] h-screen text-slate-400 flex flex-col border-r border-cyan-500/10 fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="p-5 border-b border-cyan-500/10">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-ring relative">
              <Radio className="w-4 h-4 text-white" />
           </div>
           <div>
              <h1 className="text-sm font-black tracking-tight text-white uppercase">CrisisGrid AI</h1>
              <p className="text-[9px] text-cyan-600 uppercase tracking-[0.25em] font-bold">Multi-Agent Intelligence</p>
           </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200 uppercase tracking-wider",
              (location.pathname === item.path || (item.path === '/district/new' && location.pathname.startsWith('/district')))
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 glow-ring" 
                : "hover:bg-white/5 hover:text-slate-200 border border-transparent"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      {/* Status */}
      <div className="p-4 border-t border-cyan-500/10 flex items-center gap-2">
         <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></span>
         <span className="text-[9px] font-bold text-cyan-700 uppercase tracking-[0.2em]">Gemini 2.0 Flash • Live</span>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (location.pathname === '/') {
     return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen bg-[#040810]">
      <Sidebar />
      <main className="ml-64 flex-1 relative">
        {/* Animated grid behind all pages */}
        <div className="absolute inset-0 animated-grid pointer-events-none z-0" />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/district/:id" element={<DistrictPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

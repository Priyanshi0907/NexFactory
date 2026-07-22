import React, { useState } from 'react';
import { 
  Activity, 
  Bot, 
  Sliders, 
  Zap, 
  BarChart3, 
  Radio, 
  AlertTriangle,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode, onOpenInjector, activeAlertCount }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Fleet Overview', icon: Layers },
    { id: 'telemetry', label: 'Real-Time Telemetry', icon: Activity },
    { id: 'copilot', label: 'AI Copilot (FactoryGPT)', icon: Bot, badge: 'AI' },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'energy', label: 'Energy Insights', icon: Zap },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'iot', label: 'IoT Ingestion API', icon: Radio },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3" onClick={() => handleSelectTab('overview')}>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                NexFactory <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Predictive Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 lg:w-72 bg-white dark:bg-[#0b0f19] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top Header & Branding */}
        <div>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelectTab('overview')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                    NexFactory <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md">
                    MSME Platform
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsMobileOpen(false)} 
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-4 py-5 space-y-1">
            <div className="px-3.5 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans">
              Main Operations
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs transition-all duration-200 group font-sans ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-500/25 glow-indigo' 
                        : 'text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-black rounded-md ${
                          isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Status & Control Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
          
          {/* Live Sensors Status Pill */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Telemetry Stream</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">6/6 Sensors Online</div>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>

          {/* Inject Fault Trigger Button */}
          <button 
            onClick={() => {
              onOpenInjector();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Inject Anomaly</span>
            </div>
            {activeAlertCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black bg-white text-rose-600 rounded-full">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}

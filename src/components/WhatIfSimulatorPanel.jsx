import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  TrendingDown, 
  PackageX, 
  IndianRupee, 
  GitFork,
  RefreshCw,
  Play,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  Sliders
} from 'lucide-react';

export default function WhatIfSimulatorPanel({ machines }) {
  // Pending dropdown selections
  const [selectedScenario, setSelectedScenario] = useState('machine_down');
  const [selectedMachineId, setSelectedMachineId] = useState('CM-03');
  const [downtimeDuration, setDowntimeDuration] = useState('4 Hours');

  // Executed simulation state
  const [activeSimParams, setActiveSimParams] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRunSimulation, setHasRunSimulation] = useState(false);

  // Helper to parse hours from string
  const parseHours = (str) => {
    if (str.includes('1')) return 1;
    if (str.includes('2')) return 2;
    if (str.includes('4')) return 4;
    if (str.includes('8')) return 8;
    if (str.includes('24')) return 24;
    return 4;
  };

  // Derive results ONLY from executed parameters (or initial values if not yet run)
  const currentParams = activeSimParams || {
    scenario: selectedScenario,
    machineId: selectedMachineId,
    duration: downtimeDuration
  };

  const selectedMachine = machines.find((m) => m.id === currentParams.machineId) || machines[0];
  const hours = parseHours(currentParams.duration);

  // Scenario Multipliers
  let scenarioMultiplier = 1.0;
  let scenarioLabel = 'Unscheduled Breakdown';
  if (currentParams.scenario === 'power_outage') {
    scenarioMultiplier = 1.45;
    scenarioLabel = 'Grid Power Trip (Bay-wide Impact)';
  } else if (currentParams.scenario === 'spares_delay') {
    scenarioMultiplier = 0.85;
    scenarioLabel = 'Spares Delivery Lead Time Delay';
  }

  // Calculations based on executed simulation parameters
  const hourlyCost = selectedMachine.hourlyDowntimeCostRupees || 42000;
  const totalLossRupees = Math.round(hours * hourlyCost * scenarioMultiplier);
  const revenueLakhs = (totalLossRupees / 100000).toFixed(2);
  
  const unitsLost = Math.round(hours * 460 * scenarioMultiplier);
  const dropPercent = (hours * 4.65 * scenarioMultiplier).toFixed(1);
  const ordersDelayed = Math.max(1, Math.round(hours * 0.75 * scenarioMultiplier));
  const bottlenecksCount = Math.min(5, Math.max(1, Math.round(hours * 0.5 * scenarioMultiplier)));

  // Check if dropdown selections differ from active executed simulation
  const isDirty = activeSimParams && (
    activeSimParams.scenario !== selectedScenario ||
    activeSimParams.machineId !== selectedMachineId ||
    activeSimParams.duration !== downtimeDuration
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setActiveSimParams({
        scenario: selectedScenario,
        machineId: selectedMachineId,
        duration: downtimeDuration
      });
      setHasRunSimulation(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans flex items-center gap-2 flex-wrap">
            <span>What-If Scenario Simulator</span>
            <span className="text-[10px] font-extrabold tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 uppercase">
              Digital Twin AI
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Simulate production line disruption parameters to accurately forecast financial loss, order delays, and operational bottlenecks.</p>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Inputs Control Panel (4 cols) */}
        <div className="lg:col-span-4 saas-card p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <GitFork className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
                Simulation Parameters
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-sans">
                Select Scenario Type
              </label>
              <select 
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="saas-input w-full font-medium"
              >
                <option value="machine_down">Machine Down (Unscheduled Breakdown)</option>
                <option value="power_outage">Grid Power Trip (Total Bay Outage)</option>
                <option value="spares_delay">Spares Delivery Lead Time Delay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-sans">
                Target Machinery
              </label>
              <select 
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="saas-input w-full font-medium"
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.name} (₹{(m.hourlyDowntimeCostRupees/1000).toFixed(0)}k/hr)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-sans">
                Expected Downtime Duration
              </label>
              <select 
                value={downtimeDuration}
                onChange={(e) => setDowntimeDuration(e.target.value)}
                className="saas-input w-full font-medium"
              >
                <option value="1 Hour">1 Hour (Minor Stall)</option>
                <option value="2 Hours">2 Hours (Short Outage)</option>
                <option value="4 Hours">4 Hours (Half Shift)</option>
                <option value="8 Hours">8 Hours (Full Shift Stop)</option>
                <option value="24 Hours">24 Hours (Major Breakdown)</option>
              </select>
            </div>

          </div>

          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Simulating Digital Twin...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Real-Time Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Right Area: Pre-run Placeholder OR Simulation Results */}
        {!hasRunSimulation ? (
          <div className="lg:col-span-8 saas-card p-8 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border-dashed border-2 border-indigo-200 dark:border-indigo-800/80 min-h-[320px]">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10 animate-bounce">
              <Sliders className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-sans">
                Digital Twin Simulation Ready
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Configure your scenario parameters on the left and click <strong className="text-indigo-600 dark:text-indigo-400">"Run Real-Time Simulation"</strong> to compute production loss, financial risk, and mitigation recommendations.
              </p>
            </div>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 mt-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Simulation Engine</span>
            </button>
          </div>
        ) : (
          <>
            {/* Middle Container: Simulation Results Cards (4 cols) */}
            <div className="lg:col-span-4 saas-card p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-sans">
                  Forecasted Impact Results
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                  Live Calculated
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                
                {/* 1. Production Loss */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/80 to-indigo-50/30 dark:from-slate-900/80 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 font-sans">Production Loss</span>
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <TrendingDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans flex items-baseline gap-1.5 my-0.5">
                    <span>{unitsLost.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">units</span>
                  </div>
                  <div className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1 font-sans whitespace-nowrap">
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                    <span>↓ {dropPercent}% Capacity Drop</span>
                  </div>
                </div>

                {/* 2. Delayed Orders */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/80 to-rose-50/30 dark:from-slate-900/80 dark:to-rose-950/20 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 font-sans">Delayed Orders</span>
                    <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <PackageX className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans flex items-baseline gap-1.5 my-0.5">
                    <span>{ordersDelayed}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">orders</span>
                  </div>
                  <div className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1 font-sans whitespace-nowrap">
                    <PackageX className="w-3.5 h-3.5 shrink-0" />
                    <span>↑ {ordersDelayed} Shipments Risk</span>
                  </div>
                </div>

                {/* 3. Revenue Impact */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/80 to-indigo-50/40 dark:from-slate-900/80 dark:to-indigo-950/30 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 font-sans">Financial Exposure</span>
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <IndianRupee className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight font-sans flex items-baseline gap-1.5 my-0.5">
                    <span>₹{revenueLakhs}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">Lakhs</span>
                  </div>
                  <div className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1 font-sans whitespace-nowrap">
                    <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                    <span>Estimated Loss Impact</span>
                  </div>
                </div>

                {/* 4. Bottlenecks */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/80 to-amber-50/30 dark:from-slate-900/80 dark:to-amber-950/20 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 font-sans">Downstream Risk</span>
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight font-sans flex items-baseline gap-1.5 my-0.5">
                    <span>{bottlenecksCount}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">lines</span>
                  </div>
                  <div className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-sans whitespace-nowrap">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Cascading Delay</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Container: Prescribed Action Recommendations (4 cols) */}
            <div className="lg:col-span-4 saas-card p-5 space-y-4 flex flex-col justify-between animate-fade-in">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-sans flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Prescribed AI Mitigations</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-indigo-500/10 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 shadow-xs">
                    Recommended
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200 font-sans">
                      <span>Reroute Load to Parallel Line</span>
                      <span className="text-[10px] font-extrabold bg-indigo-200/80 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">SOP #104</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      Automatically shift 65% of production quota from {selectedMachine.id} to Line B auxiliary press to prevent {revenueLakhs} Lakhs revenue loss.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200 font-sans">
                      <span>Expedite Maintenance Crew</span>
                      <span className="text-[10px] font-extrabold bg-amber-200/80 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">High Priority</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      Dispatch Shift B technician with SKF 6208-2Z bearing replacement kit immediately. Target MTTR &lt; 90 mins.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Simulated Mitigation Saves ~₹{(revenueLakhs * 0.72).toFixed(2)} Lakhs</span>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}

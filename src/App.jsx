import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FleetOverviewCard from './components/FleetOverviewCard';
import TelemetryLiveChart from './components/TelemetryLiveChart';
import FactoryGPTChat from './components/FactoryGPTChat';
import WhatIfSimulatorPanel from './components/WhatIfSimulatorPanel';
import EnergyWasteWidget from './components/EnergyWasteWidget';
import ReportsAnalyticsView from './components/ReportsAnalyticsView';
import IoTIngestionInspector from './components/IoTIngestionInspector';
import AnomalyInjectorModal from './components/AnomalyInjectorModal';

import { INITIAL_MACHINES, INITIAL_ANOMALY_ALERTS } from './data/factoryData';
import { 
  ShieldAlert, 
  IndianRupee, 
  Zap, 
  Activity, 
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, telemetry, copilot, simulator, energy, analytics, iot
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [alerts, setAlerts] = useState(INITIAL_ANOMALY_ALERTS);
  const [selectedMachineId, setSelectedMachineId] = useState('CM-03');
  const [isInjectorOpen, setIsInjectorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync Dark mode HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];
  const criticalCount = machines.filter((m) => m.status === 'Critical').length;
  const watchCount = machines.filter((m) => m.status === 'Watch').length;
  const healthyCount = machines.filter((m) => m.status === 'Healthy').length;
  const avgHealth = Math.round(machines.reduce((acc, m) => acc + m.healthScore, 0) / machines.length);
  const totalAvoidedSavingsRupees = machines.reduce((acc, m) => acc + m.estDowntimeAvoidedRupees, 0);

  // Apply Synthetic Anomaly
  const handleApplyAnomaly = (targetMachineId, faultType) => {
    setMachines((prevMachines) => 
      prevMachines.map((m) => {
        if (m.id !== targetMachineId) return m;

        let updated = { ...m };
        if (faultType === 'bearing_wear') {
          updated.status = 'Critical';
          updated.healthScore = 31;
          updated.riskScore = 91;
          updated.rulDays = 2.4;
          updated.failureProbability = 81;
          updated.metrics.vibration = 7.8;
          updated.metrics.temperature = 74.2;
          updated.estDowntimeAvoidedRupees = 184000;
          updated.primaryReason = 'Vibration 3.4x baseline. Spindle motor bearing fatigue pattern detected.';
          updated.recommendation = 'Schedule maintenance within 24 hours.';
        } else if (faultType === 'thermal_overheat') {
          updated.status = 'Critical';
          updated.healthScore = 35;
          updated.riskScore = 88;
          updated.rulDays = 2.8;
          updated.failureProbability = 82;
          updated.metrics.temperature = 84.5;
          updated.metrics.vibration = 5.2;
          updated.estDowntimeAvoidedRupees = 142000;
          updated.primaryReason = 'Rotor thermal runaway (+32.5°C above baseline). Friction detected.';
          updated.recommendation = 'Check coolant pump flow rate and motor shroud.';
        } else if (faultType === 'current_surge') {
          updated.status = 'Watch';
          updated.healthScore = 62;
          updated.riskScore = 65;
          updated.rulDays = 6.4;
          updated.metrics.current = 28.5;
          updated.excessPowerKW = 4.8;
          updated.estDowntimeAvoidedRupees = 88000;
          updated.primaryReason = 'Current draw surge (24.5 A). Excess power draw detected.';
          updated.recommendation = 'Inspect phase voltage and motor winding insulation.';
        } else if (faultType === 'rpm_flutter') {
          updated.status = 'Watch';
          updated.healthScore = 68;
          updated.riskScore = 58;
          updated.rulDays = 9.2;
          updated.metrics.rpm = 1210;
          updated.primaryReason = 'Resonant RPM oscillation detected. Potential belt slippage.';
          updated.recommendation = 'Adjust drive belt tensioner.';
        }

        return updated;
      })
    );

    const targetName = machines.find((m) => m.id === targetMachineId)?.name || targetMachineId;
    setToastMessage(`Synthetic Anomaly Injected into ${targetName}! Risk score updated to Critical.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetAllBaselines = () => {
    setMachines(INITIAL_MACHINES);
    setToastMessage("All equipment baselines restored to optimal nominal states!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row font-sans transition-colors">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenInjector={() => setIsInjectorOpen(true)}
        activeAlertCount={criticalCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

        {/* Floating Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-2xl flex items-center justify-between gap-3 animate-bounce">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 shrink-0 text-amber-300" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white opacity-80 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Main Dashboard Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Executive KPI Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Avoided Loss */}
            <div className="saas-card p-5 flex items-center justify-between bg-gradient-to-br from-white via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border-indigo-100/80 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Total Downtime Avoided</span>
                <div className="flex items-baseline gap-1 my-1.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-indigo-600 dark:text-indigo-400">
                    ₹{totalAvoidedSavingsRupees.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Direct ROI to Factory Owner
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            {/* KPI 2: Fleet Health */}
            <div className="saas-card p-5 flex items-center justify-between bg-gradient-to-br from-white via-white to-emerald-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border-emerald-100/80 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Fleet Health Index</span>
                <div className="flex items-baseline gap-2 my-1.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-slate-900 dark:text-white">{avgHealth}%</span>
                  <span className="text-xs font-bold text-slate-500 font-sans">({healthyCount}/6 Optimal)</span>
                </div>
                <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${avgHealth}%` }} />
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            {/* KPI 3: Active Flags */}
            <div className="saas-card p-5 flex items-center justify-between bg-gradient-to-br from-white via-white to-rose-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 border-rose-100/80 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Active Alert Flags</span>
                <div className="flex items-baseline gap-2 my-1.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-rose-600 dark:text-rose-400">{criticalCount} Critical</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-sans">({watchCount} Watch)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold font-sans">Isolation Forest ML</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-soft-pulse" />
              </div>
            </div>

            {/* KPI 4: Energy Waste Guard */}
            <div className="saas-card p-5 flex items-center justify-between bg-gradient-to-br from-white via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border-amber-100/80 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Energy Waste Guard</span>
                <div className="flex items-baseline gap-1 my-1.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-amber-600 dark:text-amber-400">142.5 kWh</span>
                </div>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold font-sans">
                  Est. ~₹1,280 leakage/shift
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Tab Router Views */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Factory Floor Equipment Grid</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real-time condition monitoring, RUL estimation, and explainable risk scores.</p>
                </div>
                <button 
                  onClick={() => setIsInjectorOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inject Fault Vector</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map((machine) => (
                  <FleetOverviewCard 
                    key={machine.id}
                    machine={machine}
                    onSelectMachine={(id) => {
                      setSelectedMachineId(id);
                      setActiveTab('telemetry');
                    }}
                    onSimulateAnomaly={(id) => {
                      setSelectedMachineId(id);
                      setIsInjectorOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <TelemetryLiveChart 
                machine={selectedMachine}
                machines={machines}
                onSelectMachineId={setSelectedMachineId}
                onInjectAnomaly={(id) => {
                  setSelectedMachineId(id);
                  setIsInjectorOpen(true);
                }}
                onResetBaselines={handleResetAllBaselines}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {activeTab === 'copilot' && (
            <div className="space-y-6">
              <FactoryGPTChat 
                machines={machines}
                alerts={alerts}
              />
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <WhatIfSimulatorPanel 
                machines={machines}
              />
            </div>
          )}

          {activeTab === 'energy' && (
            <div className="space-y-6">
              <EnergyWasteWidget 
                machines={machines}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <ReportsAnalyticsView 
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {activeTab === 'iot' && (
            <div className="space-y-6">
              <IoTIngestionInspector />
            </div>
          )}

        </main>

        {/* Hardware Anomaly Injector Modal */}
        <AnomalyInjectorModal 
          isOpen={isInjectorOpen}
          onClose={() => setIsInjectorOpen(false)}
          machines={machines}
          onApplyAnomaly={handleApplyAnomaly}
          onResetAll={handleResetAllBaselines}
        />

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 bg-white dark:bg-[#070b13] transition-colors mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white">NexFactory AI</span>
              <span>— Industrial Predictive Maintenance & Intelligence Platform</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
              <span>Isolation Forest ML</span>
              <span>•</span>
              <span>ESP32 Hardware Ready</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

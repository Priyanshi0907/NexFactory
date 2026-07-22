import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Activity, 
  Zap, 
  Gauge, 
  RefreshCw, 
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AnomalyInjectorModal({ isOpen, onClose, machines, onApplyAnomaly, onResetAll }) {
  const [selectedMachineId, setSelectedMachineId] = useState(machines[0]?.id || 'CM-03');
  const [selectedFaultType, setSelectedFaultType] = useState('bearing_wear');

  if (!isOpen) return null;

  const faultTypes = [
    {
      id: 'bearing_wear',
      title: 'Spindle Bearing Failure Spike',
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      description: 'Simulates inner-race bearing fatigue. Spikes vibration to 3.8x baseline (7.8 mm/s) and triggers immediate critical alert.',
      impact: 'RUL drops to 1.8 days • Failure Risk 94%'
    },
    {
      id: 'thermal_overheat',
      title: 'Thermal Overheat / Runaway',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400',
      description: 'Simulates coolant breakdown or rotor friction. Temperature rises rapidly to 84.5°C.',
      impact: 'RUL drops to 2.1 days • Failure Risk 89%'
    },
    {
      id: 'current_surge',
      title: 'Power Surge & Motor Overload',
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      description: 'Simulates winding insulation degradation. Current draw surges from 15A to 28.5A.',
      impact: 'Power waste +4.8 kW • Loss: ₹18,400/shift'
    },
    {
      id: 'rpm_flutter',
      title: 'Resonant Speed Instability',
      icon: Gauge,
      color: 'text-cyan-600 dark:text-cyan-400',
      description: 'Simulates belt slippage and coupling misalignments. RPM drops and oscillates by ±250 rpm.',
      impact: 'Quality defect probability jumps to 18%'
    }
  ];

  const handleInject = () => {
    onApplyAnomaly(selectedMachineId, selectedFaultType);
    
    // Trigger subtle confetti burst to celebrate anomaly simulation launch
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.6 }
    });

    onClose();
  };

  const handleReset = () => {
    onResetAll();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xl animate-fade-in">
      
      {/* Glassmorphism Container with Light Blue Hue Accent */}
      <div className="bg-gradient-to-br from-white/95 via-sky-50/70 to-indigo-50/80 dark:from-[#0b0f19]/95 dark:via-[#0f172a]/95 dark:to-sky-950/50 backdrop-blur-2xl text-slate-900 dark:text-slate-100 w-full max-w-4xl rounded-3xl border border-sky-200/90 dark:border-sky-900/50 shadow-2xl shadow-sky-500/10 overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-sky-100/80 dark:border-sky-900/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm shrink-0">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 dark:text-white font-sans">
                  Hardware Anomaly Injector
                </h2>
                <span className="text-[10px] font-sans font-extrabold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                  Demo Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Inject synthetic hardware fault vectors to test AI scoring in real time.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-sky-100/50 dark:hover:bg-slate-800 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Target Machine Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 font-sans">
              Select Target Machine Equipment:
            </label>
            <select 
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="saas-input w-full font-bold text-sm bg-white/90 dark:bg-slate-900/90 border-sky-200/80 dark:border-sky-800/80 shadow-sm py-3"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
                  {m.name} ({m.id}) — Current Status: {m.status} ({m.healthScore}% Health)
                </option>
              ))}
            </select>
          </div>

          {/* Fault Vector Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3 font-sans">
              Select Synthetic Anomaly Vector:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {faultTypes.map((fault) => {
                const Icon = fault.icon;
                const isSelected = selectedFaultType === fault.id;
                return (
                  <div
                    key={fault.id}
                    onClick={() => setSelectedFaultType(fault.id)}
                    className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between backdrop-blur-md ${
                      isSelected 
                        ? 'bg-gradient-to-br from-white via-rose-50/80 to-rose-100/60 dark:from-slate-900 dark:via-rose-950/70 dark:to-rose-900/40 border-2 border-rose-500 dark:border-rose-500 shadow-xl shadow-rose-500/20 ring-4 ring-rose-500/20' 
                        : 'bg-white/70 dark:bg-slate-900/40 border-sky-200/60 dark:border-sky-900/40 hover:bg-white/95 dark:hover:bg-slate-900/70 hover:border-sky-300 dark:hover:border-sky-700'
                    }`}
                  >
                    <div>
                      {/* Clean Icon Box strictly inside container */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-100/90 dark:bg-sky-950/90 border border-sky-200/80 dark:border-sky-800/80 flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className={`w-4 h-4 ${fault.color}`} />
                        </div>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-sans tracking-tight leading-snug">
                          {fault.title}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                        {fault.description}
                      </p>
                    </div>

                    {/* Glassmorphism Impact Pill */}
                    <div className="text-xs font-sans font-black text-indigo-900 dark:text-sky-200 bg-gradient-to-r from-sky-100/90 via-indigo-50/80 to-blue-100/80 dark:from-sky-950/80 dark:via-indigo-950/70 dark:to-blue-950/70 px-3.5 py-2.5 rounded-xl border border-sky-200/80 dark:border-sky-800/60 shadow-xs mt-2">
                      {fault.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:p-7 border-t border-sky-100/80 dark:border-sky-900/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-sky-200/80 dark:border-sky-800/60 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Telemetry Baselines</span>
          </button>

          <div className="w-full sm:w-auto flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleInject}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Inject Anomaly Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

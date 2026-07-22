import React from 'react';
import { 
  Activity, 
  Thermometer, 
  Zap, 
  Gauge, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function FleetOverviewCard({ machine, onSelectMachine, onSimulateAnomaly }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm animate-soft-pulse whitespace-nowrap shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Critical Risk
          </span>
        );
      case 'Watch':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-sm whitespace-nowrap shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Watchlist
          </span>
        );
      case 'Healthy':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Optimal
          </span>
        );
    }
  };

  const isCritical = machine.status === 'Critical';
  const isWatch = machine.status === 'Watch';
  const hasAnomaly = isCritical || isWatch || machine.healthScore < 80 || machine.riskScore > 50;

  return (
    <div className={`saas-card p-6 flex flex-col justify-between space-y-5 transition-all duration-300 ${
      isCritical 
        ? 'bg-gradient-to-b from-rose-50/40 via-white to-slate-50/50 dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900/60 border-2 border-rose-500 dark:border-rose-500 shadow-xl shadow-rose-500/15 ring-4 ring-rose-500/10' 
        : isWatch 
          ? 'bg-gradient-to-b from-rose-50/20 via-white to-slate-50/50 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900/60 border-2 border-rose-400 dark:border-rose-500/80 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/15'
          : 'bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800/80'
    }`}>
      
      <div>
        {/* Header info */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 truncate">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/80 font-sans shrink-0">
                {machine.id}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">{machine.location}</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight font-sans truncate whitespace-nowrap" title={machine.name}>
              {machine.name}
            </h3>
          </div>
          {getStatusBadge(machine.status)}
        </div>

        {/* Key Metrics Dashboard Row */}
        <div className="grid grid-cols-3 gap-2.5 my-4 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
          
          {/* Health Score */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 font-sans">Health</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className={`text-xl sm:text-2xl font-black font-sans tracking-tight ${
                machine.healthScore < 50 ? 'text-rose-600 dark:text-rose-400' : machine.healthScore < 80 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {machine.healthScore}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  machine.healthScore < 50 ? 'bg-rose-500' : machine.healthScore < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${machine.healthScore}%` }}
              />
            </div>
          </div>

          {/* Remaining Useful Life */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 font-sans">RUL</span>
            <div className="flex items-center gap-1 my-1">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-xl sm:text-2xl font-black font-sans tracking-tight text-slate-900 dark:text-white">
                {machine.rulDays}d
              </span>
            </div>
            <span className="text-[9px] font-semibold text-slate-400 font-sans">Failure Horizon</span>
          </div>

          {/* Failure Risk */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 font-sans">Risk Score</span>
            <div className="flex items-center gap-1 my-1">
              <TrendingUp className={`w-4 h-4 ${machine.riskScore > 60 ? 'text-rose-500' : 'text-slate-400'}`} />
              <span className={`text-xl sm:text-2xl font-black font-sans tracking-tight ${
                machine.riskScore > 60 ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {machine.riskScore}%
              </span>
            </div>
            <span className="text-[9px] font-semibold text-slate-400 font-sans">ML Model</span>
          </div>

        </div>

        {/* Live Telemetry Sensors Snippet */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              <span>Vibration</span>
            </div>
            <span className={`font-black font-sans ${
              machine.metrics.vibration > machine.metrics.vibrationBaseline * 1.8 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-200'
            }`}>
              {machine.metrics.vibration} <span className="text-[10px] font-normal text-slate-400">mm/s</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" />
              <span>Temp</span>
            </div>
            <span className={`font-black font-sans ${
              machine.metrics.temperature > machine.metrics.tempBaseline * 1.3 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-200'
            }`}>
              {machine.metrics.temperature} <span className="text-[10px] font-normal text-slate-400">°C</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Current</span>
            </div>
            <span className="font-black font-sans text-slate-900 dark:text-slate-200">
              {machine.metrics.current} <span className="text-[10px] font-normal text-slate-400">A</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
              <Gauge className="w-3.5 h-3.5 text-cyan-500" />
              <span>RPM</span>
            </div>
            <span className="font-black font-sans text-slate-900 dark:text-slate-200">
              {machine.metrics.rpm} <span className="text-[10px] font-normal text-slate-400">rpm</span>
            </span>
          </div>

        </div>

        {/* Explainable AI Diagnosis Box */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>EXPLAINABLE AI DIAGNOSTIC</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
            {machine.primaryReason}
          </p>
          {machine.estDowntimeAvoidedRupees > 0 && (
            <div className="mt-2.5 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Avoidable Loss:</span>
              <span className="font-black font-sans text-emerald-600 dark:text-emerald-400 text-sm">
                ₹{machine.estDowntimeAvoidedRupees.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => onSelectMachine(machine.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
        >
          <span>Inspect Telemetry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onSimulateAnomaly(machine.id)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all"
          title="Inject Synthetic Sensor Anomaly"
        >
          Fault Test
        </button>
      </div>

    </div>
  );
}

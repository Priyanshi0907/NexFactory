import React from 'react';
import { 
  Zap, 
  IndianRupee, 
  Leaf, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function EnergyWasteWidget({ machines }) {
  const totalPowerKW = machines.reduce((acc, m) => acc + m.powerKW, 0);
  const totalExcessKW = machines.reduce((acc, m) => acc + m.excessPowerKW, 0);
  const shiftWasteKWh = parseFloat((totalExcessKW * 8).toFixed(1));
  const shiftLossRupees = Math.round(shiftWasteKWh * 9.5);
  const monthlyLossRupees = shiftLossRupees * 30 * 3;
  const carbonOffsetTons = parseFloat((shiftWasteKWh * 0.85 * 90 / 1000).toFixed(2));

  return (
    <div className="saas-card p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Energy & Carbon Intelligence</span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full">
                Financial Waste Guard
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Detect machines drawing abnormal power and calculate electricity bill waste in Rupees.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Industrial Rate: ₹9.50 / kWh</span>
        </div>
      </div>

      {/* Aggregate Energy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Excess Power Draw</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">+{totalExcessKW.toFixed(1)}</span>
            <span className="text-xs font-semibold text-slate-500">kW</span>
          </div>
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Abnormal load above baseline
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Energy Wasted / Shift</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">{shiftWasteKWh}</span>
            <span className="text-xs font-semibold text-slate-500">kWh</span>
          </div>
          <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
            ₹{shiftLossRupees.toLocaleString('en-IN')} wasted per shift
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Est. Monthly Leakage</span>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">₹{monthlyLossRupees.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Recoverable via servicing
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Carbon Offset Potential</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">{carbonOffsetTons}</span>
            <span className="text-xs font-semibold text-slate-500">Tons CO₂e</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-indigo-500" />
            Green Factory Certificate
          </span>
        </div>

      </div>

      {/* Machine Table */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Machine Power Efficiency & Financial Leakage
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Operating Power</th>
                <th className="px-4 py-3">Excess Draw</th>
                <th className="px-4 py-3">Efficiency</th>
                <th className="px-4 py-3 text-right">Monthly Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
              {machines.map((m) => {
                const machineMonthlyWaste = Math.round(m.excessPowerKW * 8 * 9.5 * 30 * 3);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3.5 flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{m.id}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      {m.powerKW} kW
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      {m.excessPowerKW > 1.0 ? (
                        <span className="text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                          +{m.excessPowerKW} kW
                        </span>
                      ) : (
                        <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          +{m.excessPowerKW} kW
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${m.efficiencyScore < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${m.efficiencyScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">{m.efficiencyScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{machineMonthlyWaste.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

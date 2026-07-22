import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { 
  Activity, 
  Thermometer, 
  Zap, 
  Gauge, 
  AlertTriangle, 
  RefreshCw, 
  Flame,
  Play,
  Pause
} from 'lucide-react';

export default function TelemetryLiveChart({ machine, machines, onSelectMachineId, onInjectAnomaly, onResetBaselines, isDarkMode }) {
  const [activeMetric, setActiveMetric] = useState('vibration');
  const [chartData, setChartData] = useState([]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  useEffect(() => {
    const now = new Date();
    const initialPoints = [];
    
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const noise = (Math.random() - 0.5) * 0.3;
      
      initialPoints.push({
        time: timeStr,
        vibration: parseFloat((machine.metrics.vibration + noise).toFixed(2)),
        vibrationBaseline: machine.metrics.vibrationBaseline,
        temperature: parseFloat((machine.metrics.temperature + (Math.random() - 0.5) * 0.8).toFixed(1)),
        tempBaseline: machine.metrics.tempBaseline,
        current: parseFloat((machine.metrics.current + (Math.random() - 0.5) * 0.4).toFixed(2)),
        currentBaseline: machine.metrics.currentBaseline,
        rpm: Math.round(machine.metrics.rpm + (Math.random() - 0.5) * 15),
        rpmBaseline: machine.metrics.rpmBaseline,
      });
    }

    setChartData(initialPoints);
  }, [machine.id]);

  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const noiseVib = (Math.random() - 0.5) * 0.4;
        const noiseTemp = (Math.random() - 0.5) * 0.3;
        const noiseCurr = (Math.random() - 0.5) * 0.3;
        const noiseRpm = (Math.random() - 0.5) * 10;

        const newPoint = {
          time: newTime,
          vibration: Math.max(0.2, parseFloat((machine.metrics.vibration + noiseVib).toFixed(2))),
          vibrationBaseline: machine.metrics.vibrationBaseline,
          temperature: Math.max(20, parseFloat((machine.metrics.temperature + noiseTemp).toFixed(1))),
          tempBaseline: machine.metrics.tempBaseline,
          current: Math.max(1, parseFloat((machine.metrics.current + noiseCurr).toFixed(2))),
          currentBaseline: machine.metrics.currentBaseline,
          rpm: Math.max(100, Math.round(machine.metrics.rpm + noiseRpm)),
          rpmBaseline: machine.metrics.rpmBaseline,
        };

        return [...prevData.slice(1), newPoint];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, machine]);

  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'temperature':
        return {
          key: 'temperature',
          baselineKey: 'tempBaseline',
          unit: '°C',
          label: 'Temperature (°C)',
          color: '#EF4444',
          gradientId: 'tempGradient',
          threshold: machine.metrics.tempBaseline * 1.25,
          icon: Thermometer,
          currentVal: machine.metrics.temperature,
          baselineVal: machine.metrics.tempBaseline
        };
      case 'current':
        return {
          key: 'current',
          baselineKey: 'currentBaseline',
          unit: 'A',
          label: 'Current Draw (Amps)',
          color: '#F59E0B',
          gradientId: 'currentGradient',
          threshold: machine.metrics.currentBaseline * 1.3,
          icon: Zap,
          currentVal: machine.metrics.current,
          baselineVal: machine.metrics.currentBaseline
        };
      case 'rpm':
        return {
          key: 'rpm',
          baselineKey: 'rpmBaseline',
          unit: 'RPM',
          label: 'Rotational Speed (RPM)',
          color: '#06B6D4',
          gradientId: 'rpmGradient',
          threshold: machine.metrics.rpmBaseline * 0.85,
          icon: Gauge,
          currentVal: machine.metrics.rpm,
          baselineVal: machine.metrics.rpmBaseline
        };
      case 'vibration':
      default:
        return {
          key: 'vibration',
          baselineKey: 'vibrationBaseline',
          unit: 'mm/s',
          label: 'Vibration RMS (mm/s)',
          color: '#6366F1',
          gradientId: 'vibrationGradient',
          threshold: machine.metrics.vibrationBaseline * 1.8,
          icon: Activity,
          currentVal: machine.metrics.vibration,
          baselineVal: machine.metrics.vibrationBaseline
        };
    }
  };

  const config = getMetricConfig();
  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#334155' : '#cbd5e1';

  const hasAnomaly = machine.status === 'Critical' || machine.status === 'Watch' || machine.healthScore < 80 || machine.riskScore > 50;

  return (
    <div className={`saas-card p-6 space-y-6 transition-all duration-300 ${
      hasAnomaly 
        ? 'border-2 border-rose-500 dark:border-rose-500 shadow-xl shadow-rose-500/15 ring-4 ring-rose-500/10 bg-gradient-to-b from-rose-50/20 via-white to-slate-50/50 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900/60' 
        : ''
    }`}>
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
              hasAnomaly ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
            }`}>
              {machine.id}
            </span>
            <span className="text-xs font-medium text-slate-500">{machine.type}</span>
            <span className="text-xs text-slate-400">• {machine.location}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <span>{machine.name}</span>
            {hasAnomaly ? (
              <span className="text-xs font-sans font-extrabold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/90 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-800 flex items-center gap-1.5 animate-soft-pulse">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                ANOMALY DETECTED [{machine.status.toUpperCase()}]
              </span>
            ) : (
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                LIVE SENSOR STREAM
              </span>
            )}
          </h2>
        </div>

        {/* Live Controls & Machine Switcher Dropdown */}
        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          
          {/* Equipment Dropdown Selector */}
          {machines && onSelectMachineId && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
              hasAnomaly ? 'bg-rose-50/80 dark:bg-rose-950/80 border-2 border-rose-500 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
            }`}>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">Machinery:</span>
              <select
                value={machine.id}
                onChange={(e) => onSelectMachineId(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-slate-900 dark:text-white outline-none cursor-pointer pr-1 font-sans"
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
                    {m.id} — {m.name} [{m.status}]
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isLiveStreaming 
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveStreaming ? 'Streaming' : 'Paused'}</span>
            </button>

            <button
              onClick={() => onInjectAnomaly(machine.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20"
            >
              <Flame className="w-3.5 h-3.5 text-white" />
              <span>Inject Fault</span>
            </button>

            <button
              onClick={onResetBaselines}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Metric Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'vibration', label: 'Vibration', icon: Activity, val: `${machine.metrics.vibration} mm/s`, color: 'text-indigo-500' },
          { id: 'temperature', label: 'Temperature', icon: Thermometer, val: `${machine.metrics.temperature} °C`, color: 'text-rose-500' },
          { id: 'current', label: 'Current Draw', icon: Zap, val: `${machine.metrics.current} A`, color: 'text-amber-500' },
          { id: 'rpm', label: 'Speed RPM', icon: Gauge, val: `${machine.metrics.rpm} rpm`, color: 'text-cyan-500' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeMetric === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-sm ring-1 ring-indigo-500/50' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                  {tab.label}
                </span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>}
              </div>
              <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                {tab.val}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="time" stroke={textColor} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg, 
                borderColor: tooltipBorder, 
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }} 
            />
            <ReferenceLine 
              y={config.threshold} 
              stroke="#EF4444" 
              strokeDasharray="4 4" 
              label={{ value: `Threshold (${config.threshold.toFixed(1)} ${config.unit})`, fill: '#EF4444', fontSize: 10 }} 
            />
            <ReferenceLine 
              y={config.baselineVal} 
              stroke="#10B981" 
              strokeDasharray="2 2" 
              label={{ value: `Baseline (${config.baselineVal} ${config.unit})`, fill: '#10B981', fontSize: 10 }} 
            />
            <Area 
              type="monotone" 
              dataKey={config.key} 
              stroke={config.color} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill={`url(#${config.gradientId})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

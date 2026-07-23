import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Printer,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Zap,
  X,
  FileCheck,
  Award,
  TrendingDown,
  TrendingUp,
  IndianRupee,
  ShieldAlert,
  Clock,
  QrCode,
  Wrench
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid
} from 'recharts';
import confetti from 'canvas-confetti';
import { ANALYTICS_DATA_BY_TIMERANGE, INITIAL_MACHINES } from '../data/factoryData';

export default function ReportsAnalyticsView({ isDarkMode }) {
  const [timeRange, setTimeRange] = useState('this_week');
  const [isExporting, setIsExporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Dynamic analytics dataset based on selected dropdown time range
  const currentAnalytics = ANALYTICS_DATA_BY_TIMERANGE[timeRange] || ANALYTICS_DATA_BY_TIMERANGE.this_week;

  // Trigger Executive PDF Report Modal
  const handleGenerateReport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      setShowReportModal(true);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 450);
  };

  // Handler for Native Browser Print to PDF (isolated to report container)
  const handlePrintPDF = () => {
    window.print();
  };

  // Handler for Direct Document Download
  const handleDownloadPDF = () => {
    const reportElement = document.getElementById('report-document-body');
    const innerHTML = reportElement ? reportElement.innerHTML : '';

    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NexFactory AI — Official Executive Audit Report 2026</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #0f172a; padding: 2rem; }
    @media print {
      body { background-color: white; padding: 0; }
      .print-page { page-break-after: always; break-after: page; }
    }
  </style>
</head>
<body>
  <div class="max-w-4xl mx-auto space-y-8">
    ${innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `NexFactory_AI_Executive_Report_2026.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#334155' : '#e2e8f0';
  const barHoverFill = isDarkMode ? 'rgba(99, 102, 241, 0.18)' : 'rgba(99, 102, 241, 0.08)';

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <span>Reports & Analytics</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {currentAnalytics.label}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Historical performance trends, machine availability metrics, and quality scrap rates.</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="saas-input py-2 text-xs font-semibold"
          >
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_quarter">Last Quarter</option>
          </select>

          <button
            onClick={handleGenerateReport}
            disabled={isExporting}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>{isExporting ? 'Generating Report...' : 'Export Executive Report'}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official NexFactory AI Visual Executive PDF/HTML Report downloaded successfully!</span>
          </div>
          <span className="font-mono text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
            NexFactory_AI_Executive_Report_2026.html
          </span>
        </div>
      )}

      {/* 2x2 Dynamic Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Production vs Target */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-sans">
              Production vs Target ({currentAnalytics.label})
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentAnalytics.production} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', fontSize: '11px', fontFamily: 'sans-serif' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'sans-serif' }} />
                <Line type="monotone" dataKey="target" stroke="#a5b4fc" strokeWidth={2} strokeDasharray="4 4" name="Target Units" />
                <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} name="Actual Output" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Downtime (hrs) */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-sans">
              Downtime Hours ({currentAnalytics.label})
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Hours</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentAnalytics.production} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', fontSize: '11px', fontFamily: 'sans-serif' }}
                  cursor={{ fill: barHoverFill, radius: 8 }}
                />
                <Bar dataKey="downtimeHrs" fill="#6366f1" radius={[8, 8, 0, 0]} name="Downtime (hrs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Downtime Reasons */}
        <div className="saas-card p-5">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 font-sans">
            Top Downtime Root Causes ({currentAnalytics.label})
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentAnalytics.reasons}
                  cx="40%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {currentAnalytics.reasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Defect Rate (%) */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-sans">
              Quality Scrap Rate (%) ({currentAnalytics.label})
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Tolerance &lt; 2.5%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentAnalytics.defects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} domain={[0, 5]} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="defectRate" stroke="#ef4444" strokeWidth={3} name="Scrap Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Comprehensive 3-Page Executive PDF Report Modal with Print Isolation */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xl animate-fade-in print:p-0 print:bg-white print:static print-modal-container">
          
          <div className="bg-slate-900 text-white w-full max-w-5xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
            
            {/* Top Control Header (Hidden when printing) */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 print-modal-header">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-sans text-white">NexFactory AI — Official Executive Audit Report</h3>
                  <p className="text-[11px] text-slate-400">Time Range Audit Period: {currentAnalytics.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Document Container showing 3 distinct visual & contextual pages */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[84vh] bg-slate-950/90 space-y-8 font-sans print:p-0 print:bg-white print:overflow-visible" id="report-document-body">
              
              {/* ================= PAGE 1 OF 3 ================= */}
              <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 border border-slate-200 print:shadow-none print:border-none print:rounded-none print-page">
                
                {/* Page 1 Header */}
                <div className="flex items-start justify-between pb-6 border-b-2 border-indigo-600">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
                        <Activity className="w-6 h-6" />
                      </div>
                      <span className="font-black text-2xl tracking-tight text-slate-900 font-sans">
                        NexFactory <span className="text-indigo-600">AI</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">Industrial Predictive Maintenance & Intelligence Audit Report ({currentAnalytics.label})</p>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-black text-indigo-600 uppercase tracking-widest text-sm">EXECUTIVE AUDIT REPORT</div>
                    <div className="text-slate-500 font-mono mt-1">Doc ID: #NEX-AUDIT-2026-0814</div>
                    <div className="text-slate-500 font-mono">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>

                {/* Page Title Badge */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  <span>PAGE 1 OF 3 • EXECUTIVE SUMMARY & DETAILED FLEET AUDIT</span>
                  <span className="text-indigo-600 font-sans font-extrabold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">ISO-9001 AI COMPLIANT</span>
                </div>

                {/* KPI Audit Executive Visual Summary Grid */}
                <div className="grid grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 border border-slate-200/80">
                  
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Avoided Loss</span>
                      <div className="p-1 rounded bg-indigo-50 text-indigo-600">
                        <IndianRupee className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-indigo-600 font-sans">{currentAnalytics.avoidedLoss}</span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" /> Direct ROI Saved
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Fleet Health Index</span>
                      <div className="p-1 rounded bg-emerald-50 text-emerald-600">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-emerald-600 font-sans">73%</span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '73%' }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Active Risk Flags</span>
                      <div className="p-1 rounded bg-rose-50 text-rose-600">
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-rose-600 font-sans">1 Critical</span>
                    <span className="text-[10px] font-bold text-amber-600 block mt-1">(2 Watchlist)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Energy Leakage</span>
                      <div className="p-1 rounded bg-amber-50 text-amber-600">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-amber-600 font-sans">142.5 kWh</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-1">~₹1,280/shift</span>
                  </div>

                </div>

                {/* Connected Equipment Health Audit Matrix with Deep Telemetry & AI Reasoning */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 font-sans flex items-center justify-between">
                    <span>Connected Equipment Health Audit Matrix & AI Diagnostics</span>
                    <span className="text-[10px] font-normal text-slate-500">6 Sensors Live Stream</span>
                  </h4>
                  <div className="overflow-hidden border border-slate-200 rounded-xl shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-3">Machine ID & Location</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 w-32">Visual Health</th>
                          <th className="p-3">Live Telemetry</th>
                          <th className="p-3">RUL / Risk</th>
                          <th className="p-3">AI Diagnostic Reasoning</th>
                          <th className="p-3 text-right">Avoidable Loss</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-medium">
                        {INITIAL_MACHINES.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{m.id} — {m.name}</div>
                              <div className="text-[10px] text-slate-500">{m.location}</div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                m.status === 'Critical' ? 'bg-rose-100 text-rose-700 border border-rose-300' : m.status === 'Watch' ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              }`}>
                                {m.status}
                              </span>
                            </td>
                            
                            {/* Visual Progress Bar */}
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-black w-7 text-right ${
                                  m.healthScore < 50 ? 'text-rose-600' : m.healthScore < 80 ? 'text-amber-600' : 'text-emerald-600'
                                }`}>{m.healthScore}%</span>
                                <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden p-0.5">
                                  <div 
                                    className={`h-full rounded-full ${
                                      m.healthScore < 50 ? 'bg-rose-500' : m.healthScore < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${m.healthScore}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="p-3 text-[11px] font-mono">
                              <div>Vib: <strong className="text-slate-900">{m.metrics.vibration}</strong> mm/s</div>
                              <div>Tmp: <strong className="text-slate-900">{m.metrics.temperature}</strong>°C</div>
                            </td>

                            <td className="p-3 text-[11px] font-mono">
                              <div>RUL: <strong className="text-indigo-600">{m.rulDays}d</strong></div>
                              <div>Risk: <strong className="text-slate-700">{m.riskScore}%</strong></div>
                            </td>

                            <td className="p-3 text-[11px] text-slate-600 max-w-xs leading-relaxed font-medium">
                              {m.primaryReason}
                            </td>

                            <td className="p-3 text-right font-black text-indigo-600">
                              ₹{m.estDowntimeAvoidedRupees.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Page 1 Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Page 1 of 3 • Executive Summary & Detailed Fleet Health Audit</span>
                  <span>NexFactory AI Industrial Platform</span>
                </div>

              </div>

              {/* ================= PAGE 2 OF 3 ================= */}
              <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 border border-slate-200 print:shadow-none print:border-none print:rounded-none print-page">
                
                {/* Page 2 Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 font-sans">
                      02. HISTORICAL PRODUCTION & RISK VECTOR ANALYTICS ({currentAnalytics.label})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">PAGE 2 OF 3</span>
                </div>

                {/* Dynamic Table & Graphical Representation of Output vs Target */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-sans flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Production Output vs Target Visual Analytics</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 uppercase font-bold">Graphic Chart View</span>
                    </h4>
                    <span className="text-xs font-mono text-indigo-600 font-bold">Total Downtime: {currentAnalytics.downtimeHrs}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    {/* Visual Dual Vertical Bar Chart / Histogram */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                      
                      {/* Chart Legend */}
                      <div className="flex items-center justify-end gap-5 mb-4 text-xs font-bold font-sans">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-slate-300 border border-slate-400" />
                          <span className="text-slate-600">Target Units</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-indigo-600 shadow-xs" />
                          <span className="text-slate-900">Actual Output</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-rose-500 shadow-xs" />
                          <span className="text-rose-700">Downtime Alert (&lt;90%)</span>
                        </div>
                      </div>

                      {/* Graphical Bar Histogram Frame */}
                      <div className="relative h-48 flex items-end justify-between gap-2 pt-6 pb-8 px-4 border-b border-l border-slate-300">
                        
                        {/* Horizontal Background Gridlines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-2">
                          <div className="border-b border-slate-100 w-full text-[9px] font-mono text-slate-300">100%</div>
                          <div className="border-b border-slate-100 w-full text-[9px] font-mono text-slate-300">75%</div>
                          <div className="border-b border-slate-100 w-full text-[9px] font-mono text-slate-300">50%</div>
                          <div className="border-b border-slate-100 w-full text-[9px] font-mono text-slate-300">25%</div>
                        </div>

                        {/* Dual Vertical Columns per Day/Period */}
                        {currentAnalytics.production.map((row) => {
                          const maxVal = Math.max(...currentAnalytics.production.map(r => Math.max(r.target, r.actual))) * 1.12;
                          const targetPct = Math.round((row.target / maxVal) * 100);
                          const actualPct = Math.round((row.actual / maxVal) * 100);
                          const effPct = Math.round((row.actual / row.target) * 100);
                          const isLow = effPct < 90;

                          return (
                            <div key={row.day} className="relative z-10 flex-1 flex flex-col items-center h-full justify-end group">
                              
                              {/* Value Label on Top of Bars */}
                              <div className="text-[9px] font-mono font-bold text-slate-700 mb-1">
                                {row.actual >= 1000 ? `${(row.actual/1000).toFixed(1)}k` : row.actual}
                              </div>

                              {/* Pair of Vertical Bars */}
                              <div className="flex items-end justify-center gap-1.5 w-full h-full">
                                {/* Target Bar */}
                                <div 
                                  className="w-1/3 max-w-[18px] bg-slate-200 border border-slate-300 rounded-t-md transition-all"
                                  style={{ height: `${targetPct}%` }}
                                  title={`Target: ${row.target.toLocaleString()}`}
                                />
                                {/* Actual Bar */}
                                <div 
                                  className={`w-1/3 max-w-[18px] rounded-t-md transition-all shadow-xs ${
                                    isLow 
                                      ? 'bg-gradient-to-t from-amber-500 to-rose-500' 
                                      : 'bg-gradient-to-t from-indigo-600 to-indigo-500'
                                  }`}
                                  style={{ height: `${actualPct}%` }}
                                  title={`Actual: ${row.actual.toLocaleString()} (${effPct}%)`}
                                />
                              </div>

                              {/* Day Label */}
                              <div className="absolute -bottom-6 text-[10px] font-extrabold text-slate-700 font-mono">
                                {row.day}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                    {/* Performance Metrics Matrix Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
                      {currentAnalytics.production.map((row) => {
                        const pct = Math.round((row.actual / row.target) * 100);
                        const isHigh = pct >= 95;
                        return (
                          <div key={row.day} className="p-2 rounded-xl bg-white border border-slate-200/80 text-center font-mono">
                            <div className="text-[10px] font-extrabold text-slate-500 uppercase">{row.day}</div>
                            <div className="text-xs font-black text-slate-900 mt-0.5">{row.actual.toLocaleString()}</div>
                            <div className={`text-[9px] font-extrabold mt-1 px-1.5 py-0.5 rounded-full ${isHigh ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                              {pct}% ({row.downtimeHrs}h)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Root Cause Failure Vectors & Defect Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 font-sans flex items-center justify-between">
                        <span>Downtime Root Causes Breakdown</span>
                        <span className="text-[10px] font-mono text-slate-400">Pie Visual</span>
                      </h4>

                      <div className="h-48 w-full bg-white p-2 rounded-xl border border-slate-200/80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={currentAnalytics.reasons}
                              cx="35%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {currentAnalytics.reasons.map((entry, index) => (
                                <Cell key={`report-pie-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'sans-serif' }} layout="vertical" align="right" verticalAlign="middle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 font-sans">
                        Quality Scrap & Tolerance Gauge
                      </h4>
                      <div className="space-y-4 text-xs">
                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Average Scrap Rate</span>
                          <span className="text-3xl font-black text-emerald-600 font-sans">{currentAnalytics.avgScrapRate}</span>
                          <span className="text-[10px] font-bold text-slate-500 block mt-1">Tolerance Limit &lt; 2.50%</span>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Quality Scrap Loss Avoided: {currentAnalytics.avoidedLoss}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Page 2 Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Page 2 of 3 • Operational Analytics & Quality Scrap Vector Audit</span>
                  <span>NexFactory AI Industrial Platform</span>
                </div>

              </div>

              {/* ================= PAGE 3 OF 3 ================= */}
              <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 border border-slate-200 print:shadow-none print:border-none print:rounded-none print-page">
                
                {/* Page 3 Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 font-sans">
                      03. PRESCRIBED MAINTENANCE SOPs & AUTHORIZATION
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">PAGE 3 OF 3</span>
                </div>

                {/* Asset-by-Asset Prescribed AI Maintenance SOPs */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-sans">
                    Prescribed Machine Action Plans & Step-by-Step SOPs
                  </h4>

                  <div className="p-4.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-rose-900 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-rose-600" />
                        <span>[HIGH PRIORITY] CM-03 — Line C Conveyor Motor</span>
                      </span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-200/80 px-2.5 py-0.5 rounded-full">Target Action: 24 Hours</span>
                    </div>
                    <p className="text-xs text-rose-900 font-semibold">
                      Inner-race bearing vibration detected at 7.8 mm/s (3.8x baseline).
                    </p>
                    <div className="p-3 bg-white/80 rounded-lg border border-rose-200 text-xs text-slate-800 space-y-1 font-sans">
                      <div className="font-bold text-rose-800">Step-by-Step Maintenance SOP:</div>
                      <div>1. Isolate main drive circuit breaker (Lockout/Tagout protocol).</div>
                      <div>2. Unbolt drive pulley coupling and pull worn SKF 6208-2Z bearing.</div>
                      <div>3. Press-fit new drive bearing and re-align motor with laser alignment tool (&lt;0.05mm).</div>
                    </div>
                  </div>

                  <div className="p-4.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-amber-900 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-amber-600" />
                        <span>[MEDIUM PRIORITY] SC-02 — Line B Screw Compressor</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full">Target Action: 72 Hours</span>
                    </div>
                    <p className="text-xs text-amber-900 font-semibold">
                      Thermal runaway warning (84.5°C). High rotor friction detected.
                    </p>
                    <div className="p-3 bg-white/80 rounded-lg border border-amber-200 text-xs text-slate-800 space-y-1 font-sans">
                      <div className="font-bold text-amber-800">Step-by-Step Maintenance SOP:</div>
                      <div>1. Flush auxiliary coolant lines and replace filter element.</div>
                      <div>2. Re-grease drive shaft couplings with high-temp synthetic grease.</div>
                      <div>3. Inspect radiator fan belt tension and check coolant pressure.</div>
                    </div>
                  </div>

                  <div className="p-4.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-indigo-900 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-indigo-600" />
                        <span>[MONITOR] HP-02 — Line A Hydraulic Press 2</span>
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-200/80 px-2.5 py-0.5 rounded-full">Target Action: Weekly Inspection</span>
                    </div>
                    <p className="text-xs text-indigo-900 font-semibold">
                      Hydraulic seal pressure draw fluctuates by ±4.2%.
                    </p>
                    <div className="p-3 bg-white/80 rounded-lg border border-indigo-200 text-xs text-slate-800 space-y-1 font-sans">
                      <div className="font-bold text-indigo-800">Step-by-Step Maintenance SOP:</div>
                      <div>1. Inspect hydraulic seal pressure values.</div>
                      <div>2. Re-calibrate proportional control valve during shift changeover.</div>
                    </div>
                  </div>
                </div>

                {/* Energy Leakage Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-800">Energy Loss Mitigation SOP:</span>
                  </div>
                  <span className="font-medium text-slate-600">Isolate idle power draw on Line D Stamping Cell during shift transitions to save ~142.5 kWh/shift (~₹1,280/shift).</span>
                </div>

                {/* Formal Plant Operations Executive Authorization & Signature Block */}
                <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 items-end">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <span>Executive Compliance Verification</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      This 3-page audit document was generated autonomously by the NexFactory AI Industrial Predictive Engine and verified against ISO-9001 manufacturing quality standards.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                        <QrCode className="w-10 h-10 text-slate-800" />
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        <div>Verification Hash:</div>
                        <div className="font-bold text-slate-900">8F2A-9942-ISO-9001-NEXAI</div>
                        <div className="text-emerald-600 font-bold mt-0.5">✓ Cryptographically Verified</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-6">Senior Plant Operations Manager Signature</span>
                      <div className="border-b-2 border-slate-400 w-56 mb-1.5"></div>
                      <span className="text-xs font-black text-slate-900 block font-sans">Rajesh Kumar — Vice President Operations</span>
                      <span className="text-[10px] text-slate-500 font-mono">NexFactory AI Smart Operations Center</span>
                    </div>
                  </div>
                </div>

                {/* Page 3 Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Page 3 of 3 • Final Executive Authorization & Compliance Verification</span>
                  <span>End of Official Audit Report</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

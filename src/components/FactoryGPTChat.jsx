import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  TrendingDown, 
  Zap, 
  CheckCircle2,
  RefreshCw,
  User,
  ArrowRight
} from 'lucide-react';

export default function FactoryGPTChat({ machines, alerts, onGenerateReport }) {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Why did production decrease yesterday?',
      timestamp: '10:14 AM'
    },
    {
      id: 2,
      sender: 'bot',
      text: `Here is the AI diagnostic analysis for the drop in production on 19 May 2025:`,
      timestamp: '10:14 AM',
      analysis: {
        downtime: 'Machine Downtime: Line C — Conveyor Motor (CM-03) was down for 1h 48m due to spindle motor failure.',
        inventory: 'Inventory Shortage: Raw Material RM-12 was below the required level.',
        operator: 'Operator Absence: 2 operators were absent in Line 1 during the second shift.',
        impact: 'Estimated production loss of 1,250 units (~₹1.8L loss).',
        actionNeeded: true
      }
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sampleQueries = [
    "Why did production decrease yesterday?",
    "Which machine has highest failure risk in next 48 hours?",
    "Show energy waste & electricity bill leakages",
    "Generate shift maintenance handover report"
  ];

  const handleSend = (textToSend = inputQuery) => {
    const query = textToSend.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = generateAIResponse(query, machines, alerts);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const generateAIResponse = (query, machines = [], alerts = []) => {
    const qLower = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Specific Machine Lookup (by ID or Name keywords)
    const matchedMachine = machines.find((m) => 
      qLower.includes(m.id.toLowerCase()) || 
      qLower.includes(m.name.toLowerCase()) ||
      (qLower.includes('conveyor') && m.id === 'CM-03') ||
      (qLower.includes('cnc') && m.id === 'CNC-01') ||
      (qLower.includes('press') && m.id === 'HP-02') ||
      (qLower.includes('compressor') && m.id === 'SC-02') ||
      (qLower.includes('air') && m.id === 'AS-01')
    );

    if (matchedMachine) {
      return {
        id: Date.now(),
        sender: 'bot',
        timestamp,
        text: `Diagnostic Telemetry Report for **${matchedMachine.name} (${matchedMachine.id})**: Equipment status is currently **${matchedMachine.status}** with a Health Index of **${matchedMachine.healthScore}%** (Failure Risk: ${matchedMachine.riskScore}%).`,
        analysis: {
          downtime: `RUL Estimate: ${matchedMachine.rulDays} days remaining before estimated breakdown under current load.`,
          inventory: `Sensor Telemetry: Vibration: ${matchedMachine.metrics.vibration} mm/s (Base: ${matchedMachine.metrics.vibrationBaseline}), Temp: ${matchedMachine.metrics.temperature}°C (Base: ${matchedMachine.metrics.tempBaseline}°C), Current: ${matchedMachine.metrics.current}A.`,
          operator: `Root Cause: ${matchedMachine.primaryReason}`,
          impact: `Prescribed Action: ${matchedMachine.recommendation}`,
          actionNeeded: matchedMachine.status !== 'Healthy'
        }
      };
    }

    // 2. Vibration & Bearing Failure Queries
    if (qLower.includes('vibration') || qLower.includes('bearing') || qLower.includes('fatigue') || qLower.includes('shake')) {
      const vibratingMachines = machines.filter(m => m.metrics.vibration > m.metrics.vibrationBaseline * 1.5);
      const topVib = vibratingMachines[0] || machines[0];

      return {
        id: Date.now(),
        sender: 'bot',
        timestamp,
        text: `FFT Spectral Vibration Analysis detected **${vibratingMachines.length || 1} equipment** operating with abnormal mechanical oscillation:`,
        analysis: {
          downtime: `Primary Anomaly: ${topVib.name} (${topVib.id}) — Vibration at ${topVib.metrics.vibration} mm/s RMS (3.4x nominal baseline).`,
          inventory: `Failure Signature: Characteristic 120 Hz inner-race bearing spalling pattern detected.`,
          operator: `Location & Operator Note: ${topVib.location}. Lubrication re-greasing recommended immediately.`,
          impact: `Risk Exposure: Unmanaged vibration will reduce bearing fatigue life by ~82% over next 48h.`,
          actionNeeded: true
        }
      };
    }

    // 3. Temperature & Thermal Overheat Queries
    if (qLower.includes('temperature') || qLower.includes('temp') || qLower.includes('heat') || qLower.includes('overheat') || qLower.includes('thermal') || qLower.includes('coolant')) {
      const hotMachine = machines.find(m => m.metrics.temperature > m.metrics.tempBaseline * 1.2) || machines[0];

      return {
        id: Date.now(),
        sender: 'bot',
        timestamp,
        text: `Thermal Inspection Telemetry Scan for plant floor:`,
        analysis: {
          downtime: `Thermal Hotspot: ${hotMachine.name} (${hotMachine.id}) operating at ${hotMachine.metrics.temperature}°C (Baseline: ${hotMachine.metrics.tempBaseline}°C).`,
          inventory: `Rotor Friction: Thermal runaway gradient detected (+${(hotMachine.metrics.temperature - hotMachine.metrics.tempBaseline).toFixed(1)}°C rise).`,
          operator: `Root Cause: Coolant fluid circulation restriction / shroud airflow blockage.`,
          impact: `Mitigation Action: Clean motor shroud intake filter screen and inspect coolant pump pressure.`,
          actionNeeded: true
        }
      };
    }

    // 4. Energy & Electricity Leakage Queries
    if (qLower.includes('energy') || qLower.includes('electricity') || qLower.includes('power') || qLower.includes('bill') || qLower.includes('kw') || qLower.includes('leak')) {
      const totalExcessPower = machines.reduce((acc, m) => acc + (m.excessPowerKW || 0), 0).toFixed(1);
      const totalMonthlyLoss = Math.round(totalExcessPower * 24 * 30 * 8.5);

      return {
        id: Date.now(),
        sender: 'bot',
        timestamp,
        text: `PredictIQ Energy Intelligence Scan: Plant equipment is currently drawing **+${totalExcessPower} kW excess power** above baseline:`,
        analysis: {
          downtime: `Line C Conveyor Motor (CM-03): Drawing +4.8 kW excess power due to mechanical bearing drag (Loss: ~₹1,280/shift).`,
          inventory: `Hydraulic Press 2 (HP-02): Drawing +3.1 kW excess power from pump fluid cavitation (Loss: ~₹850/shift).`,
          operator: `Financial Leakage: ~₹${totalMonthlyLoss.toLocaleString('en-IN')} wasted monthly on utility bills.`,
          impact: `Environmental Impact: ~1.8 Tons CO2 emissions recoverable upon servicing.`,
          actionNeeded: false
        }
      };
    }

    // 5. Production Loss / Downtime Decrease Queries
    if (qLower.includes('decrease') || qLower.includes('production') || qLower.includes('downtime') || qLower.includes('yesterday') || qLower.includes('drop')) {
      return {
        id: Date.now(),
        sender: 'bot',
        timestamp,
        text: `Diagnostic Root Cause Analysis for production output drop:`,
        analysis: {
          downtime: `Equipment Stall: Line C Conveyor Motor (CM-03) had 1h 48m unscheduled downtime due to bearing thermal trip.`,
          inventory: `Capacity Loss: 1,250 units unproduced (~₹1.84 Lakhs revenue impact).`,
          operator: `Upstream Shift Note: Raw Material RM-12 batch delivery delayed by 40 minutes during Shift 2.`,
          impact: `Recommendation: Execute preventive bearing replacement on CM-03 to prevent recurrences.`,
          actionNeeded: true
        }
      };
    }

    // 6. Maintenance & Work Order Queries
    if (qLower.includes('maintenance') || qLower.includes('schedule') || qLower.includes('handover') || qLower.includes('fix') || qLower.includes('repair') || qLower.includes('action') || qLower.includes('sop')) {
      const criticals = machines.filter(m => m.status === 'Critical');

      return {
        id: Date.now(),
        sender: 'bot',
        timestamp,
        text: `Shift Handover & Prioritized Maintenance Task Queue:`,
        analysis: {
          downtime: `Priority 1 (Urgent): ${criticals[0]?.name || 'Line C Conveyor Motor'} — ${criticals[0]?.recommendation || 'Schedule bearing replacement within 24h'}.`,
          inventory: `Spare Parts Checklist: Bearing SKU #SKF-6208-2RS in stock (Bay 3 Storeroom).`,
          operator: `Priority 2 (Watchlist): Inspect drive belt tensioner on Line B Assembly Conveyor.`,
          impact: `Safety Protocol: Lockout/Tagout (LOTO) procedure mandatory prior to opening motor shroud.`,
          actionNeeded: true
        }
      };
    }

    // 7. Highest Risk / Critical Equipment Queries
    if (qLower.includes('highest failure risk') || qLower.includes('risk') || qLower.includes('critical') || qLower.includes('fail')) {
      const topMachine = [...machines].sort((a, b) => b.riskScore - a.riskScore)[0];
      return {
        id: Date.now(),
        sender: 'bot',
        timestamp,
        text: `Based on Isolation Forest anomaly detection, **${topMachine.name} (${topMachine.id})** presents the highest immediate breakdown probability (${topMachine.riskScore}% risk score).`,
        analysis: {
          downtime: `RUL Forecast: ${topMachine.rulDays} days remaining before operational failure.`,
          inventory: `Primary Root Cause: ${topMachine.primaryReason}`,
          operator: `Location: ${topMachine.location}. Vibration: ${topMachine.metrics.vibration} mm/s (Base: ${topMachine.metrics.vibrationBaseline} mm/s).`,
          impact: `Financial Exposure: Estimated downtime loss of ₹${topMachine.estDowntimeAvoidedRupees.toLocaleString('en-IN')}.`,
          actionNeeded: true
        }
      };
    }

    // 8. General AI Executive Summary Fallback
    const totalAvoided = machines.reduce((acc, m) => acc + m.estDowntimeAvoidedRupees, 0);
    const avgHealth = Math.round(machines.reduce((acc, m) => acc + m.healthScore, 0) / machines.length);

    return {
      id: Date.now(),
      sender: 'bot',
      timestamp,
      text: `NexFactory AI Copilot Scan Complete for query: "${query}":`,
      analysis: {
        downtime: `Fleet Operational Health: ${avgHealth}% average health across 6 connected plant assets.`,
        inventory: `Active Risk Flags: ${machines.filter(m => m.status === 'Critical').length} Critical, ${machines.filter(m => m.status === 'Watch').length} Watchlist.`,
        operator: `Preventive Impact: ₹${totalAvoided.toLocaleString('en-IN')} downtime loss prevented by ML early warnings.`,
        impact: `Suggested Action: Select any machinery card from Fleet Overview to inspect high-frequency telemetry.`,
        actionNeeded: false
      }
    };
  };

  return (
    <div className="saas-card flex flex-col h-[620px] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI Copilot (FactoryGPT)</span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full">
                LLM + Sensor RAG
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask natural language questions about downtime, root causes, or energy loss.</p>
          </div>
        </div>

        <button 
          onClick={() => setMessages([messages[0], messages[1]])}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-semibold flex items-center gap-1"
          title="Reset Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white dark:bg-slate-950">
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 shadow-sm ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
            }`}>
              
              <div className="text-xs sm:text-sm leading-relaxed font-medium">
                {msg.text}
              </div>

              {/* Structed Analysis Card for Bot Responses */}
              {msg.analysis && (
                <div className="mt-3 space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <span>{msg.analysis.downtime}</span>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300">
                    <TrendingDown className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span>{msg.analysis.inventory}</span>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-300">
                    <User className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <span>{msg.analysis.operator}</span>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300 font-bold font-mono">
                    <Zap className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <span>{msg.analysis.impact}</span>
                  </div>

                </div>
              )}

              <span className="text-[10px] text-slate-400 block text-right mt-2 font-mono">
                {msg.timestamp}
              </span>

            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}

          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-mono animate-pulse p-2">
            <Bot className="w-4 h-4" />
            <span>FactoryGPT is analyzing telemetry & ML logs...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {sampleQueries.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium whitespace-nowrap hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{chip}</span>
            </button>
          ))}
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about your factory..."
            className="saas-input flex-1"
          />
          <button
            type="submit"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}

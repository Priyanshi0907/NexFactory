import React, { useState } from 'react';
import { 
  AlertTriangle, 
  PackageX, 
  UserX, 
  TrendingDown, 
  Send, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';

export default function PredictiveMaintenanceDashboard({ machines, onSelectMachine, onNavigateToReports, onNavigateToSimulator }) {
  const [selectedMachineId, setSelectedMachineId] = useState('CM-03'); // CNC Machine 3 / Conveyor Motor
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Why did production decrease yesterday?'
    },
    {
      id: 2,
      sender: 'bot',
      text: 'Here is the analysis for the drop in production on 19 May 2025:',
      breakdown: [
        {
          type: 'downtime',
          title: 'Machine Downtime',
          desc: 'CNC Machine 3 was down for 1h 48m due to spindle motor failure.',
          icon: AlertTriangle,
          color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900'
        },
        {
          type: 'inventory',
          title: 'Inventory Shortage',
          desc: 'Raw Material RM-12 was below the required level.',
          icon: AlertCircle,
          color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900'
        },
        {
          type: 'operator',
          title: 'Operator Absence',
          desc: '2 operators were absent in Line 1 during the second shift.',
          icon: UserX,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900'
        },
        {
          type: 'impact',
          title: 'Impact',
          desc: 'Estimated production loss of 1,250 units (~₹1.8L loss).',
          icon: CheckCircle2,
          color: 'text-emerald-700 bg-emerald-100/70 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
        }
      ],
      promptFollowup: 'Would you like me to generate a detailed report?'
    }
  ]);

  const activeMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');

    const newMsgUser = { id: Date.now(), sender: 'user', text: userText };
    setChatMessages((prev) => [...prev, newMsgUser]);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `AI Diagnostic Response for "${userText}":`,
        breakdown: [
          {
            type: 'downtime',
            title: 'Equipment Health Risk',
            desc: `${activeMachine.name} currently displays a failure risk score of ${activeMachine.riskScore}%.`,
            icon: AlertTriangle,
            color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900'
          },
          {
            type: 'impact',
            title: 'Financial Exposure',
            desc: `Estimated downtime cost impact: ₹${activeMachine.estDowntimeAvoidedRupees.toLocaleString('en-IN')}.`,
            icon: CheckCircle2,
            color: 'text-emerald-700 bg-emerald-100/70 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
          }
        ],
        promptFollowup: 'Recommended action: Schedule maintenance within 24 hours.'
      };
      setChatMessages((prev) => [...prev, botResponse]);
    }, 700);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical':
        return <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Critical</span>;
      case 'Watch':
        return <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Warning</span>;
      case 'Healthy':
      default:
        return <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Good</span>;
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Critical':
        return <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs">!</div>;
      case 'Watch':
        return <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">!</div>;
      default:
        return <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">✓</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: AI COPILOT (FACTORYGPT) */}
      <div className="lg:col-span-5 saas-card p-6 flex flex-col justify-between min-h-[580px]">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
              AI COPILOT (FACTORYGPT)
            </h2>
          </div>

          {/* Messages Container */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                
                {/* User Message Bubble */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]">
                      {msg.text}
                    </div>
                  </div>
                )}

                {/* Bot Message Card */}
                {msg.sender === 'bot' && (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-3 text-xs sm:text-sm">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {msg.text}
                    </p>

                    {/* Diagnostic Bullet Items */}
                    {msg.breakdown && (
                      <div className="space-y-2 pt-1">
                        {msg.breakdown.map((item, idx) => {
                          const IconComponent = item.icon;
                          return (
                            <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                              <div className="p-1 rounded-lg shrink-0 mt-0.5">
                                <IconComponent className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white mr-1.5">{item.title}:</span>
                                <span className="text-slate-600 dark:text-slate-300">{item.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {msg.promptFollowup && (
                      <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                        {msg.promptFollowup}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask anything about your factory..."
            className="saas-input flex-1"
          />
          <button 
            type="submit"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* RIGHT COLUMN: PREDICTIVE MAINTENANCE */}
      <div className="lg:col-span-7 saas-card p-6 flex flex-col justify-between min-h-[580px]">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
              PREDICTIVE MAINTENANCE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Machine Health Overview List (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Machine Health Overview
              </h3>

              <div className="space-y-2">
                {machines.map((m) => {
                  const isSelected = m.id === selectedMachineId;
                  return (
                    <div 
                      key={m.id}
                      onClick={() => {
                        setSelectedMachineId(m.id);
                        onSelectMachine(m.id);
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-slate-50 dark:bg-slate-900 border-indigo-500/80 shadow-sm ring-1 ring-indigo-500/50' 
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusDot(m.status)}
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{m.name}</div>
                          <div className="text-[11px] text-slate-400 font-medium">Health Score</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">{m.healthScore}%</div>
                        {getStatusBadge(m.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Machine Focused Deep Detail Card (5 cols) */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl flex flex-col justify-between space-y-4">
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{activeMachine.name}</h4>
                  <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    {activeMachine.id}
                  </span>
                </div>

                {/* Remaining Useful Life */}
                <div className="mb-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Remaining Useful Life</span>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {activeMachine.rulDays} <span className="text-sm font-medium text-slate-500">days</span>
                  </div>

                  {/* Sparkline curve visualization */}
                  <div className="h-12 w-full mt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path 
                        d="M 0 5 Q 25 8, 50 15 T 100 28" 
                        fill="none" 
                        stroke="#6366F1" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Failure Probability */}
                <div className="mb-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Failure Probability</span>
                  <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mb-1.5">
                    {activeMachine.failureProbability}%
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        activeMachine.failureProbability > 70 ? 'bg-rose-500' : activeMachine.failureProbability > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${activeMachine.failureProbability}%` }}
                    />
                  </div>
                </div>

                {/* Recommended Action Box */}
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs">
                  <span className="font-bold block mb-1">Recommended Action</span>
                  <p className="font-medium text-[11px] leading-relaxed">
                    {activeMachine.recommendation}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* View Full Report Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={onNavigateToReports}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
          >
            <span>View Full Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

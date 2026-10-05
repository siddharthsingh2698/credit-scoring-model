import React, { useState } from 'react';
import { 
  BarChart3, 
  Bell, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles
} from 'lucide-react';
import { ActiveView } from '../types/riskEngine';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenPresets: () => void;
  onOpenAudit: () => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setActiveView,
  onOpenPresets,
  onOpenAudit,
  onOpenDocs,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Fair Lending Audit Verified',
      desc: 'Disparate Impact ratio 0.94 within ECOA 0.80-1.20 safe harbor.',
      time: '12m ago',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      id: '2',
      title: 'Model V2.4 Ensemble Deployed',
      desc: 'XGBoost-1200 + LightGBM calibrated against 2024 Q3 loan defaults.',
      time: '1h ago',
      icon: CheckCircle2,
      color: 'text-teal-400',
    },
    {
      id: '3',
      title: 'Stress Threshold Alert',
      desc: 'Consumer durables portfolio monitored under +150bps scenario.',
      time: '3h ago',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
  ];

  return (
    <header className="h-14 border-b border-[#1b2636] bg-[#0c131d] px-4 md:px-6 flex items-center justify-between z-30 select-none">
      {/* Brand & Active Model Badge */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveView('scoring')} 
          className="flex items-center gap-2.5 group text-left transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <BarChart3 className="w-4 h-4 text-[#062419]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-base tracking-wider text-white">
                VECTURA<span className="text-emerald-400">.AI</span>
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-emerald-400/80 font-mono mt-0.5">
              CREDIT RISK ENGINE
            </span>
          </div>
        </button>

        {/* Model status tag */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#122224] border border-emerald-500/30 text-emerald-400 text-[11px] font-mono tracking-wide font-medium shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>MODEL V2.4 ACTIVE</span>
        </div>
      </div>

      {/* Navigation Actions & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        <nav className="hidden lg:flex items-center gap-5 text-xs text-slate-300 font-medium">
          <button 
            onClick={onOpenAudit}
            className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
          >
            Audit Log
          </button>
          <button 
            onClick={onOpenPresets}
            className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
          >
            Preset Profiles
          </button>
          <button 
            onClick={onOpenDocs}
            className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
          >
            Documentation
          </button>
        </nav>

        <div className="h-4 w-px bg-slate-800 hidden lg:block" />

        {/* Bell / Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0c131d]" />
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0f1824] border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Engine Notifications
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 rounded px-1.5 py-0.5">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-1">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="py-2.5 px-1.5 hover:bg-slate-800/40 rounded-lg transition-colors">
                      <div className="flex items-start gap-2.5">
                        <Icon className={`w-4 h-4 mt-0.5 ${n.color} shrink-0`} />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-200 leading-snug">{n.title}</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 hover:bg-slate-800/40 rounded-lg transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-slate-200">E. Vance</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Sr. Underwriter</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f1824] border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-300">
              <div className="p-2 border-b border-slate-800">
                <p className="font-semibold text-white">Elena Vance, CFA</p>
                <p className="text-[11px] text-slate-400">elena.vance@vectura.risk</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <Sparkles className="w-3 h-3" /> Level 4 Authority ($250k)
                </div>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { setActiveView('auditLog'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" /> Underwriting Preferences
                </button>
                <button 
                  onClick={() => { setActiveView('docs'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Compliance Protocols
                </button>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Lock Workstation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  SlidersHorizontal, 
  Activity, 
  TrendingUp, 
  GitBranch, 
  FileText, 
  FolderKanban, 
  BookOpen, 
  ChevronsUpDown
} from 'lucide-react';
import { ActiveView } from '../types/riskEngine';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onOpenPresets: () => void;
  onOpenAudit: () => void;
  onOpenDocs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  onOpenPresets,
  onOpenAudit,
  onOpenDocs,
}) => {
  return (
    <aside 
      className={`bg-[#0a0f16] border-r border-[#192433] flex flex-col justify-between transition-all duration-200 z-20 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col">
        {/* Sidebar Header: Parameter Controls */}
        <div className="h-12 border-b border-[#172332] px-4 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isCollapsed && (
              <span className="text-[11px] font-bold tracking-wider uppercase font-mono text-slate-200 truncate">
                PARAMETER CONTROLS
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section 1: ANALYSIS CANVAS */}
        <div className="p-3">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-500">
              ANALYSIS CANVAS
            </div>
          )}

          <div className="space-y-1">
            {/* Scoring Predictor */}
            <button
              onClick={() => setActiveView('scoring')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'scoring'
                  ? 'bg-[#132223] text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Activity className={`w-4 h-4 shrink-0 ${activeView === 'scoring' ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">Scoring Predictor</span>}
            </button>

            {/* Simulations & Stress */}
            <button
              onClick={() => setActiveView('simulations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'simulations'
                  ? 'bg-[#132223] text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className={`w-4 h-4 shrink-0 ${activeView === 'simulations' ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">Simulations & Stress</span>}
            </button>

            {/* SHAP Factor Map */}
            <button
              onClick={() => setActiveView('shapMap')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'shapMap'
                  ? 'bg-[#132223] text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <GitBranch className={`w-4 h-4 shrink-0 ${activeView === 'shapMap' ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">SHAP Factor Map</span>}
            </button>
          </div>
        </div>

        {/* Section 2: UNDERWRITING OPERATIONS */}
        <div className="p-3 pt-1">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-500">
              UNDERWRITING OPERATIONS
            </div>
          )}

          <div className="space-y-1">
            {/* Audit Log */}
            <button
              onClick={onOpenAudit}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'auditLog'
                  ? 'bg-[#132223] text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${activeView === 'auditLog' ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">Audit Log</span>}
            </button>

            {/* Preset Profiles */}
            <button
              onClick={onOpenPresets}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'presets'
                  ? 'bg-[#132223] text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FolderKanban className={`w-4 h-4 shrink-0 ${activeView === 'presets' ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">Preset Profiles</span>}
            </button>

            {/* Documentation */}
            <button
              onClick={onOpenDocs}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'docs'
                  ? 'bg-[#132223] text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className={`w-4 h-4 shrink-0 ${activeView === 'docs' ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">Documentation</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Inference Node footer info */}
      <div className="p-3 border-t border-[#172332] bg-[#090d13]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px]">Inference Node</span>
              <span className="text-emerald-400 font-semibold">us-east-quants-09</span>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="Inference Node: us-east-quants-09 (Active)">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

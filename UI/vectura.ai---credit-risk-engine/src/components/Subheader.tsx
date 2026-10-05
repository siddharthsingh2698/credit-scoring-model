import React from 'react';
import { RotateCcw, Printer, ShieldCheck } from 'lucide-react';

interface SubheaderProps {
  dossierId: string;
  onRevertDefaults: () => void;
  onExportMemo: () => void;
  lastInferredText: string;
}

export const Subheader: React.FC<SubheaderProps> = ({
  dossierId,
  onRevertDefaults,
  onExportMemo,
  lastInferredText,
}) => {
  return (
    <div className="border-b border-[#182333] bg-[#0c131e]/90 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Target Dossier Info */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          INFERENCE TARGET / DOSSIER
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-mono font-bold text-white tracking-wide">
            {dossierId}
          </h1>

          <span className="px-2 py-0.5 rounded bg-[#132223] border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            XGBoost-Ensemble v2.4
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111f27] border border-teal-500/30 text-teal-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Fair Lending Compliance Check: Cleared</span>
          </div>
        </div>
      </div>

      {/* Actions and Timestamp */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onRevertDefaults}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141d28] hover:bg-[#1b2737] border border-slate-700/80 text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Revert Defaults</span>
          </button>

          <button
            onClick={onExportMemo}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141d28] hover:bg-[#1b2737] border border-slate-700/80 text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Risk Memo</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono pl-2 border-l border-slate-800">
          Last inferred: <span className="text-slate-200">{lastInferredText}</span>
        </div>
      </div>
    </div>
  );
};

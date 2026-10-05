import React from 'react';
import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { ShapFactor } from '../types/riskEngine';

interface ShapAttributionProps {
  factors: ShapFactor[];
  counterfactual: {
    title: string;
    actionableText: string;
    potentialScore: number;
    potentialLimit: number;
  };
  onApplyCounterfactual?: () => void;
}

export const ShapAttribution: React.FC<ShapAttributionProps> = ({
  factors,
  counterfactual,
  onApplyCounterfactual,
}) => {
  // Max absolute percentage to normalize bar widths
  const maxImpact = Math.max(...factors.map(f => Math.abs(f.impactPercent)), 16);

  return (
    <div className="bg-[#101722] border border-[#1b2737] rounded-2xl p-6 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Explainable AI (SHAP) Factor Attribution
            </h3>
            <p className="text-[11px] text-slate-400">
              Why did the model reach this specific decision threshold?
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
            <span>Positive Driver</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
            <span>Risk Penalty</span>
          </div>
        </div>
      </div>

      {/* SHAP Factor Bars */}
      <div className="flex flex-col gap-3.5">
        {factors.map((factor) => {
          const barWidthPercent = Math.min(100, Math.max(12, (Math.abs(factor.impactPercent) / maxImpact) * 100));

          return (
            <div key={factor.id} className="flex flex-col gap-1.5 group">
              {/* Factor Title and Value */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                  {factor.name}
                </span>
                <span 
                  className={`font-mono font-bold ${
                    factor.isPositive ? 'text-[#34d399]' : 'text-[#f87171]'
                  }`}
                >
                  {factor.impactPercent > 0 ? `+${factor.impactPercent}%` : `${factor.impactPercent}%`}
                </span>
              </div>

              {/* Bar Visualization */}
              <div className="w-full bg-[#090e15] h-3 rounded-full overflow-hidden flex items-center p-0.5 border border-slate-800/60">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    factor.isPositive 
                      ? 'bg-gradient-to-r from-emerald-500 to-[#34d399] shadow-[0_0_12px_rgba(52,211,153,0.3)]' 
                      : 'bg-gradient-to-r from-red-500 to-[#f87171] shadow-[0_0_12px_rgba(248,113,113,0.3)]'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Counterfactual Optimization Box */}
      <div className="mt-2 bg-[#0a121c] border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl p-4 flex items-start gap-3.5 transition-all">
        <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider">
              {counterfactual.title}
            </h4>
            {onApplyCounterfactual && (
              <button
                type="button"
                onClick={onApplyCounterfactual}
                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                <span>Simulate Fix</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            {counterfactual.actionableText}
          </p>
        </div>
      </div>
    </div>
  );
};

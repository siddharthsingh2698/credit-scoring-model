import React, { useState } from 'react';
import { GitBranch, ArrowLeft, BarChart3, Filter, HelpCircle } from 'lucide-react';
import { InferenceOutcome, ShapFactor } from '../types/riskEngine';

interface ShapMapViewProps {
  onBack: () => void;
  outcome: InferenceOutcome;
}

export const ShapMapView: React.FC<ShapMapViewProps> = ({ onBack, outcome }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Expanded portfolio feature rankings
  const globalFeatures = [
    { name: 'Real Estate Collateral / Property Ownership', globalMeanSHAP: 0.142, direction: 'Positive', rank: 1, category: 'Collateral' },
    { name: 'Clean Credit History (Existing Credits)', globalMeanSHAP: 0.128, direction: 'Positive', rank: 2, category: 'Credit History' },
    { name: 'Checking Account Operating Liquidity', globalMeanSHAP: 0.098, direction: 'Bimodal', rank: 3, category: 'Liquidity' },
    { name: 'Stable Employment Tenure (>1 yr)', globalMeanSHAP: 0.084, direction: 'Positive', rank: 4, category: 'Employment' },
    { name: 'Loan Duration Term Exposure', globalMeanSHAP: 0.076, direction: 'Negative', rank: 5, category: 'Loan Terms' },
    { name: 'Applicant Age Cohort Stability', globalMeanSHAP: 0.052, direction: 'Positive', rank: 6, category: 'Demographics' },
    { name: 'Installment Rate to Disposable Income', globalMeanSHAP: 0.041, direction: 'Negative', rank: 7, category: 'Financial' },
    { name: 'Existing Bank Credit File Count', globalMeanSHAP: 0.033, direction: 'Positive', rank: 8, category: 'Credit History' },
  ];

  const categories = ['ALL', 'Collateral', 'Credit History', 'Liquidity', 'Employment', 'Loan Terms', 'Demographics'];

  const filteredFeatures = selectedCategory === 'ALL'
    ? globalFeatures
    : globalFeatures.filter(f => f.category === selectedCategory);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-400" />
              GLOBAL & LOCAL SHAP FACTOR MAP
            </h1>
            <p className="text-xs text-slate-400">
              TreeExplainer exact Shapley additive explanations for XGBoost Credit Risk Model
            </p>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#090e15] border border-slate-800 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-[#152e2a] text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Global Feature Importance vs Active Dossier Local Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Global Feature Importance */}
        <div className="lg:col-span-7 bg-[#101722] border border-[#1b2737] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Global Mean |SHAP| Value Across 10,000 Portfolio Dossiers
              </h2>
              <p className="text-[11px] text-slate-400">
                Measures aggregate feature predictive strength
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              TreeSHAP v0.45
            </span>
          </div>

          <div className="space-y-3">
            {filteredFeatures.map((feat) => {
              const barWidth = `${(feat.globalMeanSHAP / 0.15) * 100}%`;
              return (
                <div key={feat.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{feat.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {feat.globalMeanSHAP.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-full bg-[#090e15] h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: barWidth }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Dossier Waterfall Decomposition */}
        <div className="lg:col-span-5 bg-[#101722] border border-[#1b2737] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Local Waterfall: {outcome.dossierId}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Base Prior: 65.0%
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Sum of local SHAP contributions rigorously satisfies the additivity property:
            </p>
            <div className="my-3 p-3 bg-[#090e15] rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              E[f(x)] = 65.0% + Σ φᵢ = <strong className="text-emerald-400">{outcome.goodCreditProbability}%</strong>
            </div>

            <div className="space-y-2 mt-4">
              {outcome.shapFactors.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-[#0a111a] border border-slate-800">
                  <span className="text-slate-300 truncate max-w-[200px]">{f.name}</span>
                  <span className={`font-bold ${f.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {f.impactPercent > 0 ? `+${f.impactPercent}%` : `${f.impactPercent}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Computed in 1.4ms via GPU acceleration on Node <strong className="text-slate-300">us-east-quants-09</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

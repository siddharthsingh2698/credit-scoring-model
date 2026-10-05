import React from 'react';
import { X, BookOpen, ShieldCheck, Cpu, Code2, Scale } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1722] border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1017] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                ENGINE ARCHITECTURE & METHODOLOGY MANUAL
              </h2>
              <p className="text-xs text-slate-400">
                Basel III Internal Ratings-Based (IRB) & Explainable TreeSHAP Specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 text-slate-300 text-xs leading-relaxed overflow-y-auto">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              1. Algorithmic Architecture: XGBoost-Ensemble v2.4
            </h3>
            <p>
              VECTURA.AI deploys an ensemble of gradient-boosted decision trees (XGBoost 2.0.3 + LightGBM 4.2) calibrated on 250,000 retail and SME credit dossiers across the European Banking Authority benchmark. Objective function optimizes logistic loss with weighted positive class balance:
            </p>
            <div className="p-3 bg-[#090e15] border border-slate-800 rounded-xl font-mono text-slate-300 text-[11px]">
              min Σ [ yᵢ log(pᵢ) + (1 - yᵢ) log(1 - pᵢ) ] + γ T + ½ λ ||w||²
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              2. Explainable AI: Fast Exact TreeSHAP
            </h3>
            <p>
              Under Basel Committee on Banking Supervision (BCBS) principles for algorithmic risk systems, black-box determinations are prohibited. Every prediction is decomposed into additive Shapley contributions:
            </p>
            <div className="p-3 bg-[#090e15] border border-slate-800 rounded-xl font-mono text-slate-300 text-[11px]">
              f(x) = φ₀ + Σᵢ₌₁ᴹ φᵢ(x)
            </div>
            <p>
              where φ₀ is the expected baseline probability over the background training cohort (65.0%), and each φᵢ denotes the isolated percentage contribution of feature i.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              3. Regulatory Capital & Loss Estimation (Basel III IRB)
            </h3>
            <p>
              Capital requirement (K) is formulated under the asymptotic single risk factor model:
            </p>
            <div className="p-3 bg-[#090e15] border border-slate-800 rounded-xl font-mono text-slate-300 text-[11px]">
              K = [ LGD · N( (G(PD) + √R · G(0.999)) / √(1 - R) ) - PD · LGD ] · (1 + (M - 2.5)·b) / (1 - 1.5·b)
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              4. Fair Lending & Statutory Adverse Action
            </h3>
            <p>
              In full compliance with 12 CFR Part 1002 (Equal Credit Opportunity Act / Regulation B), the model strictly segregates protected demographic categories. For any adverse outcome (score &lt; 65.0%), the system automatically outputs the top 4 primary denial reasons generated directly from the highest-magnitude negative SHAP values.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0a1017] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

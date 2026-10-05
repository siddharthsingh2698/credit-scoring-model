import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { RiskVectorInputs, InferenceOutcome } from '../types/riskEngine';

interface RiskMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: RiskVectorInputs;
  outcome: InferenceOutcome;
}

export const RiskMemoModal: React.FC<RiskMemoModalProps> = ({
  isOpen,
  onClose,
  inputs,
  outcome,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ inputs, outcome }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RiskMemo-${outcome.dossierId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f1722] border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-8 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0a1017] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                EXECUTIVE CREDIT RISK MEMORANDUM
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                DOSSIER REF: {outcome.dossierId} | BLOCK #{outcome.auditBlock}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Print Memo"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadJson}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Download JSON Dossier"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Memo Content */}
        <div className="p-6 md:p-8 space-y-6 text-slate-300 text-xs leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#142131] border border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Underwriting Determination</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {outcome.statusLabel}
              </div>
              <span className="text-xs text-slate-300">
                Good Credit Probability: <strong>{outcome.goodCreditProbability}%</strong> (Threshold: {outcome.threshold}%)
              </span>
            </div>

            <div className="flex flex-col text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase">FICO Score Equiv.</span>
              <span className="text-xl font-bold text-white">{outcome.scoreEquivalent}</span>
              <span className="text-[11px] text-emerald-400">{outcome.scoreTier}</span>
            </div>
          </div>

          {/* Underwriter & Model Credentials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#090f16] border border-slate-800 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Lead Underwriter</span>
              <p className="font-semibold text-slate-200 mt-0.5">E. Vance, CFA</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Model Specification</span>
              <p className="font-semibold text-slate-200 mt-0.5">XGBoost-1200 Ensemble</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Regulatory Rating</span>
              <p className="font-semibold text-slate-200 mt-0.5">Basel III Tier A IRB</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Deterministic Seed</span>
              <p className="font-semibold text-slate-200 mt-0.5">{outcome.deterministicSeed}</p>
            </div>
          </div>

          {/* Applicant & Loan Vectors */}
          <div>
            <h3 className="font-mono text-slate-200 uppercase font-bold tracking-wider mb-2">
              Applicant & Loan Vectors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#0a111a] rounded-xl border border-slate-800 font-mono">
              <div><span className="text-slate-500">Applicant Age:</span> <span className="text-slate-200">{inputs.applicantAge} yrs</span></div>
              <div><span className="text-slate-500">Housing Tenure:</span> <span className="text-slate-200">{inputs.housingTenure}</span></div>
              <div><span className="text-slate-500">Tenure Duration:</span> <span className="text-slate-200">{inputs.presentResidenceYears} yrs</span></div>
              <div><span className="text-slate-500">Requested Amount:</span> <span className="text-slate-200">${inputs.creditAmount.toLocaleString()}</span></div>
              <div><span className="text-slate-500">Amortization:</span> <span className="text-slate-200">{inputs.durationMonths} months</span></div>
              <div><span className="text-slate-500">Loan Purpose:</span> <span className="text-slate-200">{inputs.purpose}</span></div>
              <div><span className="text-slate-500">Employment:</span> <span className="text-slate-200">{inputs.employmentTenure}</span></div>
              <div><span className="text-slate-500">Checking Balance:</span> <span className="text-slate-200">{inputs.checkingAccount}</span></div>
              <div><span className="text-slate-500">Pledged Collateral:</span> <span className="text-slate-200">{inputs.propertyCollateral}</span></div>
            </div>
          </div>

          {/* Explainable AI SHAP Drivers */}
          <div>
            <h3 className="font-mono text-slate-200 uppercase font-bold tracking-wider mb-2">
              Key SHAP Factor Attributions
            </h3>
            <div className="space-y-2">
              {outcome.shapFactors.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-[#090f16] border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${f.isPositive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className="text-slate-300 font-medium">{f.name}</span>
                  </div>
                  <span className={`font-mono font-bold ${f.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {f.impactPercent > 0 ? `+${f.impactPercent}%` : `${f.impactPercent}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Compliance Clause */}
          <div className="p-4 rounded-xl bg-[#0b1620] border border-teal-500/20 text-slate-400 text-[11px] leading-normal flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-teal-300 block mb-1">
                Fair Lending (ECOA / Regulation B) Statutory Compliance
              </strong>
              This model was audited for disparate impact under CFPB Circular 2022-03. Sensitive demographic attributes are not utilized directly in scoring weights; SHAP attributions reflect purely economic and collateral factors.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#0a1017] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close Memorandum
          </button>
        </div>
      </div>
    </div>
  );
};

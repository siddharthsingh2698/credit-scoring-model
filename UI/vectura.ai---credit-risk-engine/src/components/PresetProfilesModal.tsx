import React from 'react';
import { X, FolderKanban, Check, Sparkles, ArrowRight } from 'lucide-react';
import { PRESET_PROFILES } from '../utils/creditModel';
import { RiskVectorInputs } from '../types/riskEngine';

interface PresetProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (inputs: RiskVectorInputs, id: string) => void;
  currentDossierId: string;
}

export const PresetProfilesModal: React.FC<PresetProfilesModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
  currentDossierId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1722] border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1017] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                BENCHMARK PRESET PROFILES
              </h2>
              <p className="text-xs text-slate-400">
                Calibrated against German Credit Dataset & EBA Risk Tiers
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

        {/* Profiles List */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {PRESET_PROFILES.map((profile) => {
            const isSelected = profile.id === currentDossierId;
            return (
              <div
                key={profile.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#14232c] border-emerald-500/50 shadow-md'
                    : 'bg-[#090f16] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-white text-sm">
                      {profile.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102221] text-emerald-400 border border-emerald-500/30">
                      {profile.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {profile.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono text-slate-500">
                    <span>Age: {profile.inputs.applicantAge} yrs</span>
                    <span>·</span>
                    <span>Amount: ${profile.inputs.creditAmount.toLocaleString()}</span>
                    <span>·</span>
                    <span>Duration: {profile.inputs.durationMonths}m</span>
                    <span>·</span>
                    <span>Tenure: {profile.inputs.employmentTenure}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectProfile(profile.inputs, profile.id);
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-500 text-[#062419] hover:bg-emerald-400 shadow-md'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Loaded</span>
                    </>
                  ) : (
                    <>
                      <span>Load Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

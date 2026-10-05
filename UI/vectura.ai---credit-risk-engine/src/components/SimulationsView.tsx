import React, { useState } from 'react';
import { TrendingUp, ArrowLeft, AlertTriangle, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';
import { RiskVectorInputs, InferenceOutcome } from '../types/riskEngine';

interface SimulationsViewProps {
  onBack: () => void;
  inputs: RiskVectorInputs;
  outcome: InferenceOutcome;
}

export const SimulationsView: React.FC<SimulationsViewProps> = ({
  onBack,
  inputs,
  outcome,
}) => {
  const [interestShockBps, setInterestShockBps] = useState(150);
  const [unemploymentShockPercent, setUnemploymentShockPercent] = useState(2.0);
  const [collateralHaircutPercent, setCollateralHaircutPercent] = useState(15);

  // Compute stressed outcome based on current dossier
  const stressedProbability = Math.max(
    12.0,
    Number(
      (
        outcome.goodCreditProbability -
        (interestShockBps / 100) * 4.2 -
        unemploymentShockPercent * 3.1 -
        (collateralHaircutPercent / 10) * 1.8
      ).toFixed(2)
    )
  );

  const stressedLGD = Number(
    (outcome.lgdEstimate + (collateralHaircutPercent / 10) * 4.5).toFixed(1)
  );

  const stressedExpectedLoss = Number(
    (((100 - stressedProbability) / 100) * (stressedLGD / 100) * 100 * 0.15).toFixed(2)
  );

  const isResilient = stressedProbability >= 60.0;

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
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              MACROECONOMIC STRESS & MONTE CARLO SIMULATOR
            </h1>
            <p className="text-xs text-slate-400">
              Assessing Dossier {outcome.dossierId} under severe EBA / Basel III adverse scenarios
            </p>
          </div>
        </div>
      </div>

      {/* Stress Controls & Stressed Outcome Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stress Scenarios */}
        <div className="lg:col-span-5 bg-[#101722] border border-[#1b2737] rounded-2xl p-5 shadow-xl flex flex-col gap-5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Adverse Macro Shock Variables
          </h2>

          {/* Interest Rate Shock */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">ECB Rate Hike Shock</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                +{interestShockBps} bps
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="25"
              value={interestShockBps}
              onChange={(e) => setInterestShockBps(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 bps (Baseline)</span>
              <span>+200 bps</span>
              <span>+400 bps (Severe)</span>
            </div>
          </div>

          {/* Unemployment Rate Shock */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Regional Unemployment Delta</span>
              <span className="text-xs font-mono font-bold text-rose-400">
                +{unemploymentShockPercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6.0"
              step="0.5"
              value={unemploymentShockPercent}
              onChange={(e) => setUnemploymentShockPercent(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>+0.0%</span>
              <span>+3.0%</span>
              <span>+6.0%</span>
            </div>
          </div>

          {/* Collateral Haircut */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Real Estate Asset Haircut</span>
              <span className="text-xs font-mono font-bold text-teal-400">
                -{collateralHaircutPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={collateralHaircutPercent}
              onChange={(e) => setCollateralHaircutPercent(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Mark-to-market)</span>
              <span>-20%</span>
              <span>-40% (Crushed)</span>
            </div>
          </div>

          {/* Quick Scenario Presets */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">
              Standardized Stress Packages
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setInterestShockBps(100);
                  setUnemploymentShockPercent(1.5);
                  setCollateralHaircutPercent(10);
                }}
                className="p-2 rounded-lg bg-[#090e15] hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 text-left transition-colors"
              >
                EBA Baseline (+100bps)
              </button>
              <button
                type="button"
                onClick={() => {
                  setInterestShockBps(300);
                  setUnemploymentShockPercent(4.5);
                  setCollateralHaircutPercent(25);
                }}
                className="p-2 rounded-lg bg-[#090e15] hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-rose-300 text-left transition-colors"
              >
                Severe Stagflation (+300bps)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Results */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Stressed Outcome Card */}
          <div className="bg-[#101722] border border-[#1b2737] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Dossier Stress Response
              </span>
              <div
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  isResilient
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
                }`}
              >
                {isResilient ? 'RESILIENT / PASSES STRESS GATE' : 'STRESSED CAPITAL DEFICIT / FAIL'}
              </div>
            </div>

            {/* Before vs After comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Baseline */}
              <div className="p-4 rounded-xl bg-[#090e15] border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400">Baseline Assessment</span>
                <div className="text-3xl font-extrabold font-mono text-white mt-1">
                  {outcome.goodCreditProbability}%
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-400 font-mono">
                  <div>LGD: {outcome.lgdEstimate}%</div>
                  <div>Exp. Loss: {outcome.expectedLossRate}%</div>
                </div>
              </div>

              {/* Under Stress */}
              <div className="p-4 rounded-xl bg-[#141d28] border border-slate-700">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Stressed Probability</span>
                <div className="text-3xl font-extrabold font-mono text-amber-300 mt-1">
                  {stressedProbability}%
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-300 font-mono">
                  <div>Stressed LGD: <span className="text-rose-400 font-bold">{stressedLGD}%</span></div>
                  <div>Stressed Loss: <span className="text-rose-400 font-bold">{stressedExpectedLoss}%</span></div>
                </div>
              </div>
            </div>

            {/* Regulatory Capital Impact */}
            <div className="p-4 rounded-xl bg-[#090e15] border border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Required CET1 Capital Allocation:</span>
                <span className="font-mono font-bold text-white">
                  ${Math.round((inputs.creditAmount * (stressedExpectedLoss / 100) * 1.5)).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, stressedExpectedLoss * 20)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Risk-Weighted Asset (RWA) expansion factor: 1.{Math.round(interestShockBps / 30)}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

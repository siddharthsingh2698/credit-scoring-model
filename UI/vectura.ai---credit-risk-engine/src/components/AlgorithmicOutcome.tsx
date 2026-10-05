import React from 'react';
import { CheckCircle2, Lock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { InferenceOutcome } from '../types/riskEngine';

interface AlgorithmicOutcomeProps {
  outcome: InferenceOutcome;
}

export const AlgorithmicOutcome: React.FC<AlgorithmicOutcomeProps> = ({ outcome }) => {
  // Compute needle rotation angle:
  // 0% -> -90 deg (left), 50% -> 0 deg (top), 100% -> 90 deg (right)
  // or using standard 180-deg arc:
  // mapped from 0 -> 100 to angle: -180 + (prob / 100) * 180
  const prob = outcome.goodCreditProbability;
  const needleAngle = -180 + (prob / 100) * 180;

  const isApproved = outcome.decisionStatus === 'APPROVED';
  const isReview = outcome.decisionStatus === 'MANUAL_REVIEW';

  const statusBg = isApproved 
    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
    : isReview
    ? 'text-amber-400 bg-amber-950/40 border-amber-500/30'
    : 'text-rose-400 bg-rose-950/40 border-rose-500/30';

  const statusDot = isApproved
    ? 'bg-emerald-400'
    : isReview
    ? 'bg-amber-400'
    : 'bg-rose-400';

  return (
    <div className="bg-[#101722] border border-[#1b2737] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          ALGORITHMIC OUTCOME
        </span>

        {/* Outcome Tag */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wide ${statusBg}`}>
          <span className={`w-2 h-2 rounded-full ${statusDot} animate-pulse`} />
          <span>{outcome.statusLabel}</span>
        </div>

        {/* Seed */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Deterministic Seed: <strong className="text-slate-300">{outcome.deterministicSeed}</strong></span>
        </div>
      </div>

      {/* Main Gauge and Decision Logic Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Gauge Display */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative select-none">
          <div className="w-full max-w-[340px] aspect-[1.75/1] relative flex items-end justify-center">
            {/* SVG Semi-Circle Gauge */}
            <svg 
              viewBox="0 0 320 180" 
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Arc Gradient: Red -> Orange -> Yellow -> Green -> Mint */}
                <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>

                {/* Subtle outer glow filter */}
                <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Background Track */}
              <path
                d="M 35 150 A 125 125 0 0 1 285 150"
                fill="none"
                stroke="#1b2533"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Colored Gauge Track */}
              <path
                d="M 35 150 A 125 125 0 0 1 285 150"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                filter="url(#gaugeGlow)"
              />

              {/* 50% Center Tick */}
              <line
                x1="160"
                y1="18"
                x2="160"
                y2="32"
                stroke="#090e15"
                strokeWidth="3"
              />

              {/* Labels on SVG */}
              <text x="32" y="172" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                0% HIGH
              </text>
              <text x="160" y="12" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">
                50% MOD
              </text>
              <text x="288" y="172" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="end">
                100% LOW
              </text>

              {/* Pivot and Needle Group */}
              <g 
                transform={`translate(160, 150) rotate(${needleAngle})`}
                className="transition-transform duration-700 ease-out"
              >
                {/* Needle pointer */}
                <polygon
                  points="-4,-5 0,-115 4,-5"
                  fill="#ffffff"
                  className="drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
                />
                {/* Center Pivot Ring */}
                <circle cx="0" cy="0" r="10" fill="#ffffff" />
                <circle cx="0" cy="0" r="4" fill="#0c131d" />
              </g>
            </svg>
          </div>

          {/* Probability readout */}
          <div className="flex flex-col items-center mt-[-10px]">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-mono">
                {prob.toFixed(2)}
              </span>
              <span className="text-2xl md:text-3xl font-bold text-emerald-400 font-mono">
                %
              </span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-semibold">
              GOOD CREDIT PROBABILITY ($P_{'{GOOD}'}$)
            </span>
          </div>
        </div>

        {/* Right: Decision Logic */}
        <div className="lg:col-span-5 bg-[#090e15] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-full min-h-[190px]">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-300">
                DECISION LOGIC
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-mono font-semibold">
                Threshold &gt; {outcome.threshold.toFixed(1)}%
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isApproved ? (
                'Applicant satisfies primary credit tier gates. Model suggests immediate programmatic approval with standard interest tiering.'
              ) : isReview ? (
                'Applicant is within the borderline variance buffer. Requires senior underwriter discretionary override or secondary guarantor pledge.'
              ) : (
                'Applicant breaches key credit risk ceiling. Expected default probability exceeds regulatory capital tolerance.'
              )}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/60 mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Loss Given Default (LGD) Est.</span>
              <span className="font-mono font-bold text-slate-200">{outcome.lgdEstimate.toFixed(1)}%</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Audit trail committed to block #{outcome.auditBlock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Bottom Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: SCORE EQUIV. */}
        <div className="bg-[#090e15] border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            SCORE EQUIV.
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">
              {outcome.scoreEquivalent}
            </span>
            <span className="flex items-center text-xs font-mono font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{Math.abs(outcome.scoreDelta)} pts</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 font-medium">
            {outcome.scoreTier}
          </span>
        </div>

        {/* Metric 2: REC. MAX LIMIT */}
        <div className="bg-[#090e15] border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            REC. MAX LIMIT
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">
              ${outcome.recommendedMaxLimit.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 font-mono font-semibold">
            +${outcome.limitBuffer.toLocaleString()} Buffer
          </span>
        </div>

        {/* Metric 3: EXP. LOSS RATE */}
        <div className="bg-[#090e15] border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            EXP. LOSS RATE
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">
              {outcome.expectedLossRate.toFixed(2)}%
            </span>
            <span className="flex items-center text-xs font-mono font-bold text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-0.8%</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 font-medium">
            Below {outcome.lossRateCap.toFixed(1)}% Cap
          </span>
        </div>

        {/* Metric 4: INFERENCE CONF. */}
        <div className="bg-[#090e15] border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            INFERENCE CONF.
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">
              {outcome.inferenceConfidence.toFixed(1)}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 font-mono">
            σ = {outcome.varianceSigma.toFixed(3)} variance
          </span>
        </div>
      </div>
    </div>
  );
};

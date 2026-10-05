import React, { useState } from 'react';
import { 
  UserCheck, 
  Landmark, 
  FileText, 
  Sparkles, 
  RotateCw, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ChevronDown 
} from 'lucide-react';
import { 
  RiskVectorInputs as InputsType, 
  HousingTenure, 
  MaritalStatus, 
  CheckingTier, 
  SavingsTier, 
  EmploymentTenure,
  LoanPurpose
} from '../types/riskEngine';
import { PRESET_PROFILES } from '../utils/creditModel';

interface RiskVectorInputsProps {
  inputs: InputsType;
  onChange: (inputs: InputsType) => void;
  onRecalculate: () => void;
  isRecalculating: boolean;
}

export const RiskVectorInputs: React.FC<RiskVectorInputsProps> = ({
  inputs,
  onChange,
  onRecalculate,
  isRecalculating,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const updateInput = <K extends keyof InputsType>(key: K, value: InputsType[K]) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Vector Box */}
      <div className="bg-[#101722] border border-[#1b2737] rounded-2xl p-5 shadow-xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            RISK VECTOR INPUTS
          </span>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Step {currentStep} of 4
          </span>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#090e15] border border-slate-800/80 rounded-xl">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              currentStep === 1
                ? 'bg-[#152e2a] text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-1" />
            <span className="text-[11px]">Personal</span>
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              currentStep === 2
                ? 'bg-[#152e2a] text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Landmark className="w-4 h-4 mb-1" />
            <span className="text-[11px]">Financial</span>
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              currentStep === 3
                ? 'bg-[#152e2a] text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 mb-1" />
            <span className="text-[11px]">Loan</span>
          </button>

          <button
            onClick={() => setCurrentStep(4)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              currentStep === 4
                ? 'bg-[#152e2a] text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-1" />
            <span className="text-[11px]">Presets</span>
          </button>
        </div>

        {/* STEP 1: PERSONAL INPUTS */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Applicant Age */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                  APPLICANT AGE
                </label>
                <span className="px-2.5 py-0.5 rounded-md bg-[#132824] border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                  {inputs.applicantAge} yrs
                </span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={inputs.applicantAge}
                  onChange={(e) => updateInput('applicantAge', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                  <span>18</span>
                  <span className="text-slate-400">Stat. Mean: 38.2</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Housing Tenure */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                HOUSING TENURE
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#090e15] border border-slate-800/80 rounded-xl">
                {(['Own', 'Rent', 'For Free'] as HousingTenure[]).map((tenure) => (
                  <button
                    key={tenure}
                    type="button"
                    onClick={() => updateInput('housingTenure', tenure)}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputs.housingTenure === tenure
                        ? 'bg-[#182635] text-white border border-slate-600 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tenure}
                  </button>
                ))}
              </div>
            </div>

            {/* Dependents & Present Res. Counters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Dependents */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                  DEPENDENTS
                </label>
                <div className="flex items-center justify-between bg-[#090e15] border border-slate-800/80 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateInput('dependents', Math.max(1, inputs.dependents - 1))}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {inputs.dependents}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateInput('dependents', Math.min(8, inputs.dependents + 1))}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Present Res. */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                  PRESENT RES.
                </label>
                <div className="flex items-center justify-between bg-[#090e15] border border-slate-800/80 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateInput('presentResidenceYears', Math.max(1, inputs.presentResidenceYears - 1))}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {inputs.presentResidenceYears} yrs
                  </span>
                  <button
                    type="button"
                    onClick={() => updateInput('presentResidenceYears', Math.min(10, inputs.presentResidenceYears + 1))}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Foreign Worker Status */}
            <div className="flex items-center justify-between p-2.5 bg-[#090e15] border border-slate-800/80 rounded-xl">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200">Foreign Worker Status</span>
                <span className="text-[10px] text-slate-500">Statutory reporting category</span>
              </div>
              <button
                type="button"
                onClick={() => updateInput('foreignWorker', inputs.foreignWorker === 'NO' ? 'YES' : 'NO')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  inputs.foreignWorker === 'NO'
                    ? 'bg-[#152331] text-slate-300 border border-slate-700'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                }`}
              >
                {inputs.foreignWorker}
              </button>
            </div>

            {/* Marital & Legal Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                MARITAL & LEGAL STATUS
              </label>
              <div className="relative">
                <select
                  value={inputs.maritalStatus}
                  onChange={(e) => updateInput('maritalStatus', e.target.value as MaritalStatus)}
                  className="w-full appearance-none bg-[#090e15] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500/60 transition-colors"
                >
                  <option value="Male: Single / Unmarried">Male: Single / Unmarried</option>
                  <option value="Female: Single / Unmarried">Female: Single / Unmarried</option>
                  <option value="Male: Married / Widowed">Male: Married / Widowed</option>
                  <option value="Female: Married / Widowed">Female: Married / Widowed</option>
                  <option value="Male: Divorced / Separated">Male: Divorced / Separated</option>
                  <option value="Female: Divorced / Separated">Female: Divorced / Separated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL INPUTS */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Checking Account Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                CHECKING ACCOUNT LIQUIDITY
              </label>
              <div className="relative">
                <select
                  value={inputs.checkingAccount}
                  onChange={(e) => updateInput('checkingAccount', e.target.value as CheckingTier)}
                  className="w-full appearance-none bg-[#090e15] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="No Checking Account">No Checking Account (0 Liquidity)</option>
                  <option value="< 0 DM (Overdraft / Negative)">&lt; 0 DM (Overdraft / Negative)</option>
                  <option value="0 - 200 DM (Low Balance)">0 - 200 DM (Low Balance)</option>
                  <option value=">= 200 DM (Healthy Liquidity)">&gt;= 200 DM (Healthy Liquidity)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Savings Account Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                SAVINGS TIER
              </label>
              <div className="relative">
                <select
                  value={inputs.savingsAccount}
                  onChange={(e) => updateInput('savingsAccount', e.target.value as SavingsTier)}
                  className="w-full appearance-none bg-[#090e15] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="< 100 DM">&lt; 100 DM</option>
                  <option value="100 - 500 DM">100 - 500 DM</option>
                  <option value="500 - 1000 DM">500 - 1000 DM</option>
                  <option value=">= 1000 DM">&gt;= 1000 DM (Qualified Buffer)</option>
                  <option value="Unknown / No Savings">Unknown / No Savings</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Employment Tenure */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                EMPLOYMENT TENURE
              </label>
              <div className="relative">
                <select
                  value={inputs.employmentTenure}
                  onChange={(e) => updateInput('employmentTenure', e.target.value as EmploymentTenure)}
                  className="w-full appearance-none bg-[#090e15] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="Unemployed">Unemployed</option>
                  <option value="< 1 yr">&lt; 1 yr (Probationary)</option>
                  <option value="1 - 4 yrs">1 - 4 yrs (Stable)</option>
                  <option value="4 - 7 yrs">4 - 7 yrs (Established)</option>
                  <option value=">= 7 yrs">&gt;= 7 yrs (Senior Tenure)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Installment Rate % */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                  INSTALLMENT RATE % OF DISPOSABLE INCOME
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {inputs.installmentRatePercent}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#090e15] border border-slate-800/80 rounded-xl">
                {[1, 2, 3, 4].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => updateInput('installmentRatePercent', rate)}
                    className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                      inputs.installmentRatePercent === rate
                        ? 'bg-[#182635] text-white border border-slate-600'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOAN INPUTS */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Credit Amount */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                  REQUESTED CREDIT AMOUNT
                </label>
                <span className="px-2.5 py-0.5 rounded-md bg-[#132824] border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                  ${inputs.creditAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="250"
                value={inputs.creditAmount}
                onChange={(e) => updateInput('creditAmount', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$500</span>
                <span>$10,000</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Loan Duration in Months */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                  DURATION (MONTHS)
                </label>
                <span className="px-2.5 py-0.5 rounded-md bg-[#132824] border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                  {inputs.durationMonths} mos
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="72"
                step="6"
                value={inputs.durationMonths}
                onChange={(e) => updateInput('durationMonths', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>6 mos</span>
                <span>24 mos</span>
                <span>72 mos</span>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                LOAN PURPOSE
              </label>
              <div className="relative">
                <select
                  value={inputs.purpose}
                  onChange={(e) => updateInput('purpose', e.target.value as LoanPurpose)}
                  className="w-full appearance-none bg-[#090e15] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="Radio/Television">Radio / Television / Electronics</option>
                  <option value="Car (New)">Car (New)</option>
                  <option value="Car (Used)">Car (Used)</option>
                  <option value="Furniture / Equipment">Furniture / Equipment</option>
                  <option value="Domestic Appliances">Domestic Appliances</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                  <option value="Retraining">Retraining</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Property / Collateral */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                PLEDGED COLLATERAL
              </label>
              <div className="relative">
                <select
                  value={inputs.propertyCollateral}
                  onChange={(e) => updateInput('propertyCollateral', e.target.value as any)}
                  className="w-full appearance-none bg-[#090e15] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="Real Estate / Property Ownership">Real Estate / Property Ownership</option>
                  <option value="Building Society / Savings">Building Society / Qualified Collateral</option>
                  <option value="Car / Other">Car / Other Depreciating Asset</option>
                  <option value="Unknown / No Property">Unknown / No Property (Unsecured)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PRESETS */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
            {PRESET_PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange({ ...p.inputs });
                }}
                className="text-left p-2.5 rounded-xl bg-[#090e15] hover:bg-[#121c27] border border-slate-800/80 transition-all flex flex-col gap-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-emerald-300">
                    {p.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Big Recalculate Risk Score CTA */}
        <button
          type="button"
          onClick={onRecalculate}
          disabled={isRecalculating}
          className="mt-1 w-full py-3 px-4 rounded-xl bg-[#34d399] hover:bg-[#22c55e] active:scale-[0.99] text-[#062419] font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <RotateCw className={`w-4 h-4 text-[#062419] ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Computing Vectors...' : 'Recalculate Risk Score'}</span>
        </button>
      </div>

      {/* Model Governance Tier A Badge Card */}
      <div className="bg-[#101722] border border-[#1b2737] rounded-2xl p-4 flex items-center gap-3 shadow-md">
        <div className="w-9 h-9 rounded-xl bg-[#142629] border border-emerald-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-200">
            Model Governance Tier A
          </span>
          <span className="text-[11px] text-slate-400">
            Calibration: Basel III / EBA Internal Ratings
          </span>
        </div>
      </div>
    </div>
  );
};

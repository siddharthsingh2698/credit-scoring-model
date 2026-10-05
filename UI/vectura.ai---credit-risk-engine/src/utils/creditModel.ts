import { RiskVectorInputs, InferenceOutcome, ShapFactor } from '../types/riskEngine';

export const DEFAULT_RISK_INPUTS: RiskVectorInputs = {
  applicantAge: 35,
  housingTenure: 'Own',
  dependents: 1,
  presentResidenceYears: 3,
  foreignWorker: 'NO',
  maritalStatus: 'Male: Single / Unmarried',

  checkingAccount: 'No Checking Account',
  savingsAccount: '100 - 500 DM',
  employmentTenure: '1 - 4 yrs',
  installmentRatePercent: 2,
  otherInstallmentPlans: 'None',

  creditAmount: 4500,
  durationMonths: 24,
  purpose: 'Radio/Television',
  existingCreditsCount: 1,
  creditHistory: 'Clean / Existing Credits Serviced',
  propertyCollateral: 'Real Estate / Property Ownership',
};

// Generates pseudo-hash seed
export function generateDeterministicSeed(inputs: RiskVectorInputs): string {
  let hash = 0x9fc2b;
  const str = `${inputs.applicantAge}-${inputs.housingTenure}-${inputs.durationMonths}-${inputs.creditAmount}-${inputs.checkingAccount}-${inputs.employmentTenure}-${inputs.creditHistory}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffff;
  }
  return `#0x${Math.abs(hash).toString(16).toUpperCase().padStart(5, '0').slice(0, 5)}`;
}

export async function computeInference(inputs: RiskVectorInputs, customDossierId: string): Promise<InferenceOutcome> {
  try {
    const response = await fetch('https://credit-scoring-model-m7xn.onrender.com/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputs)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ...data,
      dossierId: customDossierId
    };
  } catch (error) {
    console.error("Failed to fetch inference from backend:", error);
    return {
      dossierId: customDossierId,
      goodCreditProbability: 0,
      decisionStatus: 'REJECTED',
      statusLabel: 'ERROR: BACKEND OFFLINE',
      threshold: 65.0,
      deterministicSeed: 'ERROR',
      lgdEstimate: 0,
      auditBlock: 0,
      scoreEquivalent: 0,
      scoreDelta: 0,
      scoreTier: 'ERROR',
      recommendedMaxLimit: 0,
      limitBuffer: 0,
      expectedLossRate: 0,
      lossRateDelta: 0,
      lossRateCap: 2.5,
      inferenceConfidence: 0,
      varianceSigma: 0,
      shapFactors: [],
      counterfactualAdvice: { title: 'Error', actionableText: 'Backend offline', potentialScore: 0, potentialLimit: 0 },
      inferredAt: 'Error'
    };
  }
}

export const PRESET_PROFILES: {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: RiskVectorInputs;
}[] = [
  {
    id: 'APP-2024-8849-DE',
    name: 'APP-2024-8849-DE (Baseline Dossier)',
    badge: 'Approved (79.7%)',
    description: '35yo Homeowner, Clean credit file, 24-month consumer financing, No liquid checking.',
    inputs: { ...DEFAULT_RISK_INPUTS },
  },
  {
    id: 'APP-2024-9102-FR',
    name: 'APP-2024-9102-FR (Prime Wealth Borrower)',
    badge: 'Tier 1 Ultra-Prime (94.8%)',
    description: '48yo Homeowner, >7yr career, Pristine credit, Liquid deposits >10,000 DM.',
    inputs: {
      ...DEFAULT_RISK_INPUTS,
      applicantAge: 48,
      housingTenure: 'Own',
      employmentTenure: '>= 7 yrs',
      checkingAccount: '>= 200 DM (Healthy Liquidity)',
      savingsAccount: '>= 1000 DM',
      durationMonths: 12,
      creditAmount: 8500,
      creditHistory: 'All Paid Duly',
    },
  },
  {
    id: 'APP-2024-7331-US',
    name: 'APP-2024-7331-US (Subprime High-Exposure)',
    badge: 'Rejected (34.2%)',
    description: '22yo Tenant, Probationary job (<1 yr), Critical payment history, Overdraft checking.',
    inputs: {
      ...DEFAULT_RISK_INPUTS,
      applicantAge: 22,
      housingTenure: 'Rent',
      employmentTenure: '< 1 yr',
      checkingAccount: '< 0 DM (Overdraft / Negative)',
      savingsAccount: '< 100 DM',
      durationMonths: 48,
      creditAmount: 9200,
      creditHistory: 'Critical / Delay in Past',
      propertyCollateral: 'Unknown / No Property',
    },
  },
  {
    id: 'APP-2024-6019-NL',
    name: 'APP-2024-6019-NL (Young Professional Tech)',
    badge: 'Approved (83.1%)',
    description: '29yo Software engineer, Renting apartment, 3yr tenure, Healthy liquid checking buffer.',
    inputs: {
      ...DEFAULT_RISK_INPUTS,
      applicantAge: 29,
      housingTenure: 'Rent',
      employmentTenure: '1 - 4 yrs',
      checkingAccount: '>= 200 DM (Healthy Liquidity)',
      savingsAccount: '500 - 1000 DM',
      durationMonths: 18,
      creditAmount: 3500,
      creditHistory: 'Clean / Existing Credits Serviced',
      propertyCollateral: 'Car / Other',
    },
  },
  {
    id: 'APP-2024-5541-CH',
    name: 'APP-2024-5541-CH (Borderline Commercial Loan)',
    badge: 'Manual Review (58.4%)',
    description: '41yo Small business operator, 48-month tenor, Moderate checking buffer, 3 dependents.',
    inputs: {
      ...DEFAULT_RISK_INPUTS,
      applicantAge: 41,
      housingTenure: 'Own',
      dependents: 3,
      employmentTenure: '4 - 7 yrs',
      checkingAccount: '0 - 200 DM (Low Balance)',
      durationMonths: 36,
      creditAmount: 14000,
      purpose: 'Business',
      creditHistory: 'Clean / Existing Credits Serviced',
    },
  },
];

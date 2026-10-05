export type HousingTenure = 'Own' | 'Rent' | 'For Free';
export type ForeignWorkerStatus = 'NO' | 'YES';
export type MaritalStatus = 
  | 'Male: Single / Unmarried'
  | 'Female: Single / Unmarried'
  | 'Male: Married / Widowed'
  | 'Female: Married / Widowed'
  | 'Male: Divorced / Separated'
  | 'Female: Divorced / Separated';

export type CheckingTier = 
  | 'No Checking Account'
  | '< 0 DM (Overdraft / Negative)'
  | '0 - 200 DM (Low Balance)'
  | '>= 200 DM (Healthy Liquidity)';

export type SavingsTier = 
  | '< 100 DM'
  | '100 - 500 DM'
  | '500 - 1000 DM'
  | '>= 1000 DM'
  | 'Unknown / No Savings';

export type EmploymentTenure = 
  | 'Unemployed'
  | '< 1 yr'
  | '1 - 4 yrs'
  | '4 - 7 yrs'
  | '>= 7 yrs';

export type LoanPurpose = 
  | 'Radio/Television'
  | 'Car (New)'
  | 'Car (Used)'
  | 'Furniture / Equipment'
  | 'Domestic Appliances'
  | 'Repairs'
  | 'Education'
  | 'Business'
  | 'Retraining';

export interface RiskVectorInputs {
  // Step 1: Personal
  applicantAge: number;
  housingTenure: HousingTenure;
  dependents: number;
  presentResidenceYears: number;
  foreignWorker: ForeignWorkerStatus;
  maritalStatus: MaritalStatus;

  // Step 2: Financial
  checkingAccount: CheckingTier;
  savingsAccount: SavingsTier;
  employmentTenure: EmploymentTenure;
  installmentRatePercent: number; // 1 - 4% of disposable income
  otherInstallmentPlans: 'None' | 'Bank' | 'Stores';

  // Step 3: Loan
  creditAmount: number; // e.g. 4500
  durationMonths: number; // e.g. 24
  purpose: LoanPurpose;
  existingCreditsCount: number; // 1 - 4
  creditHistory: 'Clean / Existing Credits Serviced' | 'All Paid Duly' | 'Critical / Delay in Past';
  propertyCollateral: 'Real Estate / Property Ownership' | 'Building Society / Savings' | 'Car / Other' | 'Unknown / No Property';
}

export interface ShapFactor {
  id: string;
  name: string;
  impactPercent: number; // e.g. +14.8 or -6.5
  isPositive: boolean;
  category: 'Collateral' | 'Credit History' | 'Employment' | 'Demographics' | 'Loan Terms' | 'Liquidity' | 'Financial';
}

export interface InferenceOutcome {
  dossierId: string;
  goodCreditProbability: number; // e.g. 79.67
  decisionStatus: 'APPROVED' | 'MANUAL_REVIEW' | 'REJECTED';
  statusLabel: string; // e.g. 'OUTCOME: LOW RISK / APPROVED'
  threshold: number; // e.g. 65.0
  deterministicSeed: string; // e.g. '#0x9FC2B'
  lgdEstimate: number; // Loss Given Default e.g. 22.4%
  auditBlock: number; // e.g. 88490
  scoreEquivalent: number; // e.g. 742
  scoreDelta: number; // e.g. +18
  scoreTier: string; // 'FICO Matrix Tier 1'
  recommendedMaxLimit: number; // e.g. 6500
  limitBuffer: number; // e.g. 2500
  expectedLossRate: number; // e.g. 1.12%
  lossRateDelta: number; // e.g. -0.8%
  lossRateCap: number; // e.g. 2.5%
  inferenceConfidence: number; // e.g. 94.2%
  varianceSigma: number; // e.g. 0.014
  shapFactors: ShapFactor[];
  counterfactualAdvice: {
    title: string;
    actionableText: string;
    potentialScore: number;
    potentialLimit: number;
  };
  inferredAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  dossierId: string;
  applicantAge: number;
  loanAmount: number;
  score: number;
  probability: number;
  decision: 'APPROVED' | 'MANUAL_REVIEW' | 'REJECTED';
  underwriter: string;
  blockHash: string;
  complianceState: 'CLEARED' | 'FLAGGED';
}

export type ActiveView = 'scoring' | 'simulations' | 'shapMap' | 'auditLog' | 'presets' | 'docs';

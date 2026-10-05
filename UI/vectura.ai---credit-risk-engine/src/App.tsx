import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Subheader } from './components/Subheader';
import { RiskVectorInputs } from './components/RiskVectorInputs';
import { AlgorithmicOutcome } from './components/AlgorithmicOutcome';
import { ShapAttribution } from './components/ShapAttribution';
import { RiskMemoModal } from './components/RiskMemoModal';
import { PresetProfilesModal } from './components/PresetProfilesModal';
import { DocumentationModal } from './components/DocumentationModal';
import { AuditLogView } from './components/AuditLogView';
import { SimulationsView } from './components/SimulationsView';
import { ShapMapView } from './components/ShapMapView';
import { 
  DEFAULT_RISK_INPUTS, 
  computeInference, 
} from './utils/creditModel';
import { RiskVectorInputs as InputsType, InferenceOutcome, ActiveView } from './types/riskEngine';

export default function App() {
  const [inputs, setInputs] = useState<InputsType>({ ...DEFAULT_RISK_INPUTS });
  const [dossierId, setDossierId] = useState<string>('APP-2024-8849-DE');
  const [outcome, setOutcome] = useState<InferenceOutcome>({
    dossierId: 'LOADING',
    goodCreditProbability: 0,
    decisionStatus: 'MANUAL_REVIEW',
    statusLabel: 'LOADING...',
    threshold: 65.0,
    deterministicSeed: 'WAIT',
    lgdEstimate: 0,
    auditBlock: 0,
    scoreEquivalent: 0,
    scoreDelta: 0,
    scoreTier: 'WAIT',
    recommendedMaxLimit: 0,
    limitBuffer: 0,
    expectedLossRate: 0,
    lossRateDelta: 0,
    lossRateCap: 2.5,
    inferenceConfidence: 0,
    varianceSigma: 0,
    shapFactors: [],
    counterfactualAdvice: { title: 'Loading', actionableText: 'Loading inference from FastAPI...', potentialScore: 0, potentialLimit: 0 },
    inferredAt: 'Loading...'
  } as InferenceOutcome);
  useEffect(() => {
    computeInference(DEFAULT_RISK_INPUTS, 'APP-2024-8849-DE').then(setOutcome);
  }, []);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [lastInferredText, setLastInferredText] = useState<string>('Just now');
  
  // Navigation & Modals state
  const [activeView, setActiveView] = useState<ActiveView>('scoring');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [showRiskMemo, setShowRiskMemo] = useState<boolean>(false);
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);

  // Recalculate handler with realistic sub-second computing state
  const handleRecalculate = async () => {
    setIsRecalculating(true);
    const newOutcome = await computeInference(inputs, dossierId);
    setOutcome(newOutcome);
    setIsRecalculating(false);
    setLastInferredText('Just now');
  };

  // Revert defaults to exact screenshot state
  const handleRevertDefaults = async () => {
    setInputs({ ...DEFAULT_RISK_INPUTS });
    setDossierId('APP-2024-8849-DE');
    const freshOutcome = await computeInference(DEFAULT_RISK_INPUTS, 'APP-2024-8849-DE');
    setOutcome(freshOutcome);
    setLastInferredText('Just now');
  };

  // Load a preset profile
  const handleLoadPreset = async (presetInputs: InputsType, newDossierId: string) => {
    setInputs({ ...presetInputs });
    setDossierId(newDossierId);
    const newOutcome = await computeInference(presetInputs, newDossierId);
    setOutcome(newOutcome);
    setActiveView('scoring');
    setLastInferredText('Just now');
  };

  // Apply counterfactual recommendation
  const handleApplyCounterfactual = async () => {
    // Upgrading checking account to >= 200 DM as advised in counterfactual
    const updatedInputs: InputsType = {
      ...inputs,
      checkingAccount: '>= 200 DM (Healthy Liquidity)',
    };
    setInputs(updatedInputs);
    const updatedOutcome = await computeInference(updatedInputs, dossierId);
    setOutcome(updatedOutcome);
    setLastInferredText('Just now');
  };

  return (
    <div className="min-h-screen bg-[#0b1016] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenPresets={() => setShowPresetsModal(true)}
        onOpenAudit={() => setActiveView('auditLog')}
        onOpenDocs={() => setShowDocsModal(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenPresets={() => setShowPresetsModal(true)}
          onOpenAudit={() => setActiveView('auditLog')}
          onOpenDocs={() => setShowDocsModal(true)}
        />

        {/* Center Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#0a0f16]">
          {activeView === 'scoring' && (
            <div className="flex flex-col min-h-full">
              {/* Target Dossier Subheader */}
              <Subheader
                dossierId={dossierId}
                onRevertDefaults={handleRevertDefaults}
                onExportMemo={() => setShowRiskMemo(true)}
                lastInferredText={lastInferredText}
              />

              {/* Scoring Predictor Layout Grid */}
              <div className="p-4 md:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Column: Risk Vector Inputs (approx 4.5 cols on xl) */}
                <div className="xl:col-span-4 lg:col-span-5 w-full">
                  <RiskVectorInputs
                    inputs={inputs}
                    onChange={async (newInputs) => {
                      setInputs(newInputs);
                      // Live recalculation
                      const newOutcome = await computeInference(newInputs, dossierId);
                      setOutcome(newOutcome);
                    }}
                    onRecalculate={handleRecalculate}
                    isRecalculating={isRecalculating}
                  />
                </div>

                {/* Right Column: Algorithmic Outcome & Explainable AI (approx 7.5 cols on xl) */}
                <div className="xl:col-span-8 lg:col-span-7 flex flex-col gap-6 w-full">
                  {/* Algorithmic Outcome Box */}
                  <AlgorithmicOutcome outcome={outcome} />

                  {/* Explainable AI (SHAP) Factor Attribution Box */}
                  <ShapAttribution
                    factors={outcome.shapFactors}
                    counterfactual={outcome.counterfactualAdvice}
                    onApplyCounterfactual={handleApplyCounterfactual}
                  />
                </div>
              </div>
            </div>
          )}

          {activeView === 'simulations' && (
            <SimulationsView
              onBack={() => setActiveView('scoring')}
              inputs={inputs}
              outcome={outcome}
            />
          )}

          {activeView === 'shapMap' && (
            <ShapMapView
              onBack={() => setActiveView('scoring')}
              outcome={outcome}
            />
          )}

          {activeView === 'auditLog' && (
            <AuditLogView
              onBack={() => setActiveView('scoring')}
              currentDossierId={dossierId}
            />
          )}
        </main>
      </div>

      {/* Risk Memo Export Modal */}
      <RiskMemoModal
        isOpen={showRiskMemo}
        onClose={() => setShowRiskMemo(false)}
        inputs={inputs}
        outcome={outcome}
      />

      {/* Preset Profiles Modal */}
      <PresetProfilesModal
        isOpen={showPresetsModal}
        onClose={() => setShowPresetsModal(false)}
        onSelectProfile={handleLoadPreset}
        currentDossierId={dossierId}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />
    </div>
  );
}

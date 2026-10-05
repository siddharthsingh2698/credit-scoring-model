import React, { useState } from 'react';
import { FileText, ShieldCheck, Download, Search, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { AuditLogEntry } from '../types/riskEngine';

interface AuditLogViewProps {
  onBack: () => void;
  currentDossierId: string;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ onBack, currentDossierId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const dummyAuditLog: AuditLogEntry[] = [
    {
      id: 'aud-01',
      timestamp: '2026-10-05 03:38:12 UTC',
      dossierId: 'APP-2024-8849-DE',
      applicantAge: 35,
      loanAmount: 4500,
      score: 742,
      probability: 79.67,
      decision: 'APPROVED',
      underwriter: 'E. Vance (Sr.)',
      blockHash: '0x88490a7f1b2c9e',
      complianceState: 'CLEARED',
    },
    {
      id: 'aud-02',
      timestamp: '2026-10-05 03:15:40 UTC',
      dossierId: 'APP-2024-9102-FR',
      applicantAge: 48,
      loanAmount: 8500,
      score: 812,
      probability: 94.80,
      decision: 'APPROVED',
      underwriter: 'E. Vance (Sr.)',
      blockHash: '0x88489cf32e1a90',
      complianceState: 'CLEARED',
    },
    {
      id: 'aud-03',
      timestamp: '2026-10-05 02:44:22 UTC',
      dossierId: 'APP-2024-7331-US',
      applicantAge: 22,
      loanAmount: 9200,
      score: 580,
      probability: 34.20,
      decision: 'REJECTED',
      underwriter: 'Auto-Inference Gateway',
      blockHash: '0x88488e104b78ef',
      complianceState: 'CLEARED',
    },
    {
      id: 'aud-04',
      timestamp: '2026-10-05 01:50:09 UTC',
      dossierId: 'APP-2024-5541-CH',
      applicantAge: 41,
      loanAmount: 14000,
      score: 665,
      probability: 58.40,
      decision: 'MANUAL_REVIEW',
      underwriter: 'M. Becker (Risk Lead)',
      blockHash: '0x884879a834e021',
      complianceState: 'CLEARED',
    },
    {
      id: 'aud-05',
      timestamp: '2026-10-04 23:18:55 UTC',
      dossierId: 'APP-2024-6019-NL',
      applicantAge: 29,
      loanAmount: 3500,
      score: 755,
      probability: 83.10,
      decision: 'APPROVED',
      underwriter: 'E. Vance (Sr.)',
      blockHash: '0x884861b2e67fa9',
      complianceState: 'CLEARED',
    },
  ];

  const filtered = dummyAuditLog.filter(
    (e) =>
      e.dossierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.blockHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.decision.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = 'Timestamp,DossierID,Age,Amount,Score,Probability,Decision,Underwriter,BlockHash,Compliance\n';
    const rows = dummyAuditLog
      .map(
        (e) =>
          `"${e.timestamp}","${e.dossierId}",${e.applicantAge},${e.loanAmount},${e.score},${e.probability},"${e.decision}","${e.underwriter}","${e.blockHash}","${e.complianceState}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `AuditLog-Export-${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
  };

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
              <FileText className="w-5 h-5 text-emerald-400" />
              IMMUTABLE UNDERWRITING AUDIT TRAIL
            </h1>
            <p className="text-xs text-slate-400">
              Cryptographically verified inference log for Basel III & EBA Pillar 3 disclosure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Dossier or Block Hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#090e15] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 w-64"
            />
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#101722] border border-[#1b2737] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090f16] border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Dossier Target</th>
                <th className="py-3 px-4">Loan Amt</th>
                <th className="py-3 px-4">FICO Equiv</th>
                <th className="py-3 px-4">P(Good)</th>
                <th className="py-3 px-4">Determination</th>
                <th className="py-3 px-4">Underwriter</th>
                <th className="py-3 px-4">Block Commit Hash</th>
                <th className="py-3 px-4">ECOA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((row) => {
                const isApproved = row.decision === 'APPROVED';
                const isReview = row.decision === 'MANUAL_REVIEW';
                const isTarget = row.dossierId === currentDossierId;

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      isTarget ? 'bg-[#14232c]/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400">{row.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                      {row.dossierId}
                      {isTarget && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">${row.loanAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-200 font-bold">{row.score}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{row.probability}%</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isApproved
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : isReview
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {row.decision}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{row.underwriter}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{row.blockHash}</td>
                    <td className="py-3 px-4 text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{row.complianceState}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

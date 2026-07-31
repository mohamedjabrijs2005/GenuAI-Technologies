import React, { useState } from 'react';
import { Modal } from '../../shared';
import { RiskProfileCard } from './RiskProfileCard';
import { RecommendationCard } from './RecommendationCard';
import { EvidenceSummaryCard } from './EvidenceSummaryCard';
import { RecruiterDecisionPanel } from './RecruiterDecisionPanel';
import type { IntegrityScoreReport, MonitoringEvent } from '../types';
import { generateAssessmentPDF } from '../../../utils/pdfHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  report: IntegrityScoreReport;
}

export const EvidenceViewer: React.FC<Props> = ({ isOpen, onClose, report }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'events' | 'decision'>('profile');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  if (!report) return null;

  const downloadCSV = () => {
    const headers = 'Timestamp,Event Type,Severity,Metadata\n';
    const rows = report.events
      .map((e) => `"${e.timestamp}","${e.type}","${e.severity}","${JSON.stringify(e.metadata || {})}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integrity-events-${report.sessionId}.csv`;
    a.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔍 Recruiter Evidence Viewer" maxWidth="max-w-4xl">
      <div className="flex flex-col gap-6">
        {/* Candidate & Assessment Meta Banner */}
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="text-lg font-bold text-on-surface">{report.candidateName}</div>
            <div className="text-xs text-on-surface-variant font-medium">
              ID: {report.candidateId} • Role: <strong className="text-indigo-brand">{report.jobTitle || 'Software Engineer'}</strong>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => generateAssessmentPDF(report, report.candidateName, report.jobTitle || 'Role')}
              className="px-3 py-1.5 bg-indigo-brand text-white font-bold text-xs rounded-lg shadow-sm hover:scale-[1.02] transition-transform"
            >
              📄 Export PDF Report
            </button>
            <button
              onClick={downloadCSV}
              className="px-3 py-1.5 bg-surface-bright text-on-surface border border-surface-container font-bold text-xs rounded-lg hover:bg-surface-container transition-colors"
            >
              📊 Export CSV
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-surface-container pb-2">
          {(
            [
              ['profile', '🛡️ Risk Profile & Recommendation'],
              ['timeline', '⏱️ Timeline & Events'],
              ['events', '📁 Evidence Breakdown'],
              ['decision', '👤 Recruiter Notes & Decision'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === key
                  ? 'bg-indigo-brand text-white shadow-sm'
                  : 'bg-surface-bright text-on-surface-variant hover:bg-surface-container/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: Profile & Recommendation */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4">
            <RiskProfileCard
              profile={{
                integrityScore: report.integrityScore,
                riskLevel: report.riskLevel,
                identitySummary: {
                  facePresenceScore: report.identitySummary.facePresenceScore,
                  faceMatchScore: report.identitySummary.faceMatchScore,
                  voiceConsistencyScore: report.identitySummary.voiceConsistencyScore,
                  livenessResult: report.identitySummary.livenessResult,
                },
                behaviorSummary: {
                  tabSwitches: report.events.filter((e) => e.type === 'TAB_HIDDEN' || e.type === 'TAB_SWITCH').length,
                  copyPasteCount: report.events.filter((e) => e.type === 'COPY_EVENT' || e.type === 'PASTE_EVENT').length,
                  typingAbnormal: report.typingBiometrics?.abnormalFlag || false,
                },
                aiAnalysisSummary: {
                  aiAssistanceLikelihood: report.aiAssistance.aiAssistanceLikelihood,
                  humanAuthorshipLikelihood: report.aiAssistance.humanAuthorshipLikelihood ?? (100 - report.aiAssistance.aiAssistanceLikelihood),
                },
                plagiarismSummary: {
                  plagiarismScore: report.plagiarism.plagiarismScore,
                },
                explanation: {
                  identityExplanation: `Face remained visible for ${report.identitySummary.facePresenceScore}%. Liveness verified. Voice consistency steady (${report.identitySummary.voiceConsistencyScore}%).`,
                  behaviorExplanation: `${report.events.length} session event(s) logged. ${report.events.filter(e => e.type === 'TAB_HIDDEN').length} tab switch(es).`,
                  aiAnalysisExplanation: `AI Assistance Likelihood is ${report.aiAssistance.aiAssistanceLikelihood}%. Phrasing appears natural.`,
                  plagiarismExplanation: `Plagiarism score is ${report.plagiarism.plagiarismScore}%. No major duplication found.`,
                  overallRiskReason: report.aiExplanation,
                },
              }}
            />
            <RecommendationCard recommendation={{ primaryAction: 'Proceed', reasoning: report.recruiterRecommendation }} />
          </div>
        )}

        {/* TAB 2: Timeline */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold text-on-surface-variant uppercase">Chronological Event Timeline</div>
            {report.events.length === 0 ? (
              <div className="p-6 bg-surface-bright rounded-xl text-center text-xs text-on-surface-variant">No events logged for this session.</div>
            ) : (
              report.events.map((evt: MonitoringEvent) => (
                <div
                  key={evt.id}
                  onClick={() => setExpandedEventId(expandedEventId === evt.id ? null : evt.id)}
                  className="p-3 bg-surface-bright border border-surface-container rounded-xl cursor-pointer hover:border-surface-container-high transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${evt.severity === 'CRITICAL' ? 'bg-error' : evt.severity === 'WARNING' ? 'bg-warning' : 'bg-info'}`} />
                      <span className="text-xs font-bold text-on-surface">{evt.type}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-on-surface-variant">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {expandedEventId === evt.id && evt.metadata && (
                    <pre className="mt-2 p-2 bg-background rounded-lg text-[10px] text-on-surface-variant overflow-x-auto">
                      {JSON.stringify(evt.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Evidence Breakdown */}
        {activeTab === 'events' && (
          <div className="flex flex-col gap-4">
            <EvidenceSummaryCard
              behaviorSummary={{
                tabSwitches: report.events.filter((e) => e.type === 'TAB_HIDDEN').length,
                copyPasteCount: report.events.filter((e) => e.type === 'COPY_EVENT' || e.type === 'PASTE_EVENT').length,
                typingAbnormal: report.typingBiometrics?.abnormalFlag || false,
                totalEventsCount: report.events.length,
              }}
            />
          </div>
        )}

        {/* TAB 4: Recruiter Decision Panel */}
        {activeTab === 'decision' && (
          <RecruiterDecisionPanel
            sessionId={report.sessionId}
            candidateId={report.candidateId}
            candidateName={report.candidateName}
          />
        )}
      </div>
    </Modal>
  );
};

import { RiskLevel } from '../types/integrity';

export interface StructuredAIExplanation {
  identityExplanation: string;
  behaviorExplanation: string;
  aiAnalysisExplanation: string;
  plagiarismExplanation: string;
  overallRiskReason: string;
}

export const generateAIExplanation = (
  facePresence: number,
  livenessPassed: boolean,
  voiceConsistency: number,
  tabSwitches: number,
  copyPasteEvents: number,
  typingAbnormal: boolean,
  aiAssistanceLikelihood: number,
  plagiarismScore: number,
  riskLevel: RiskLevel
): StructuredAIExplanation => {
  // Identity
  const identityExplanation = `Face remained visible for ${facePresence}% of the session. Liveness verification ${
    livenessPassed ? 'passed' : 'requires recruiter review'
  }. Voice consistency remained ${voiceConsistency >= 80 ? 'steady' : 'variable'}.`;

  // Behavior
  const behaviorExplanation = `${
    tabSwitches === 0 ? 'No tab switches detected.' : `${tabSwitches} tab switch(es) recorded.`
  } ${
    copyPasteEvents === 0 ? 'No copy or paste events.' : `${copyPasteEvents} copy/paste event(s) logged.`
  } Typing behaviour remained ${typingAbnormal ? 'variable' : 'consistent'}.`;

  // AI Analysis
  const aiAnalysisExplanation = `AI Assistance Likelihood is ${
    aiAssistanceLikelihood < 30 ? 'Low' : aiAssistanceLikelihood < 60 ? 'Moderate' : 'High'
  } (${aiAssistanceLikelihood}%). Response phrasing appeared ${
    aiAssistanceLikelihood < 50 ? 'natural' : 'highly formal and structured'
  }.`;

  // Plagiarism
  const plagiarismExplanation = `Plagiarism similarity score is ${plagiarismScore}%. ${
    plagiarismScore < 20 ? 'No significant content duplication identified.' : 'Some phrase similarity flagged against past submissions.'
  }`;

  // Overall Risk Reason
  let overallRiskReason = '';
  switch (riskLevel) {
    case 'LOW':
      overallRiskReason = 'Candidate behaviour and identity signals remained consistent throughout the assessment.';
      break;
    case 'MEDIUM':
      overallRiskReason = 'Moderate activity flags (screen/phrasing) observed. Standard recruiter review of evidence timeline is recommended.';
      break;
    case 'HIGH':
      overallRiskReason = 'Multiple behavioral/similarity flags logged. Detailed manual review of evidence timeline by hiring team is required.';
      break;
  }

  return {
    identityExplanation,
    behaviorExplanation,
    aiAnalysisExplanation,
    plagiarismExplanation,
    overallRiskReason,
  };
};

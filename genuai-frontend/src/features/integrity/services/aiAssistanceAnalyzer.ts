/**
 * AI Assistance Likelihood Analyzer — Phase 4
 * Evaluates candidate responses for LLM/GPT-like structure, repetitive transition phrases,
 * unnatural formatting, and burstiness.
 *
 * NOTE: Never state that the candidate definitely used AI. Returns risk indicators only.
 */

export interface AIAssistanceAnalysisResult {
  aiAssistanceLikelihood: number;     // 0 - 100 %
  humanAuthorshipLikelihood: number;  // 0 - 100 %
  confidenceScore: number;            // 0 - 100 %
  contributingCharacteristics: string[];
  explanation: string;
}

export const analyzeAIAssistanceLikelihood = (
  text: string,
  typingBurstCount: number = 0,
  pasteCount: number = 0
): AIAssistanceAnalysisResult => {
  if (!text || text.trim().length < 20) {
    return {
      aiAssistanceLikelihood: 5,
      humanAuthorshipLikelihood: 95,
      confidenceScore: 70,
      contributingCharacteristics: ['Short answer format'],
      explanation: 'Answer is too short to perform reliable AI assistance analysis.',
    };
  }

  const characteristics: string[] = [];
  let scorePoints = 0;

  // 1. Check common GPT transition phrases
  const gptPhrases = [
    'in conclusion',
    'furthermore',
    'moreover',
    'it is important to note',
    'delve into',
    'tapestry',
    'testament to',
    'firstly',
    'secondly',
    'on the other hand',
  ];

  const lower = text.toLowerCase();
  let phraseMatches = 0;
  gptPhrases.forEach((p) => {
    if (lower.includes(p)) phraseMatches++;
  });

  if (phraseMatches >= 2) {
    scorePoints += 25;
    characteristics.push('Formal transition phrases typical of generated text templates');
  }

  // 2. Uniform sentence length (low burstiness)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 3) {
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / lengths.length;

    if (variance < 10 && avgLen > 12) {
      scorePoints += 20;
      characteristics.push('Unusually uniform sentence length and structure');
    }
  }

  // 3. Paste behavior / Instant burst input
  if (pasteCount > 0) {
    scorePoints += 30;
    characteristics.push('Direct paste activity detected during answer entry');
  } else if (typingBurstCount > 3) {
    scorePoints += 15;
    characteristics.push('Extremely fast burst typing detected');
  }

  const aiAssistanceLikelihood = Math.min(85, Math.max(5, scorePoints));
  const humanAuthorshipLikelihood = 100 - aiAssistanceLikelihood;
  const confidenceScore = Math.min(95, 60 + text.length / 20);

  let explanation = '';
  if (aiAssistanceLikelihood < 30) {
    explanation = 'Natural human conversational tone with natural variation in sentence length.';
  } else if (aiAssistanceLikelihood < 60) {
    explanation = 'Moderate formal structure observed. Characteristics suggest structured preparation.';
  } else {
    explanation = 'High formal structure and transition phrase density noted. Recommended for recruiter review.';
  }

  return {
    aiAssistanceLikelihood,
    humanAuthorshipLikelihood,
    confidenceScore: Math.round(confidenceScore),
    contributingCharacteristics: characteristics.length > 0 ? characteristics : ['Standard conversational phrasing'],
    explanation,
  };
};

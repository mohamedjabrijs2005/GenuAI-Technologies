/**
 * AI Assistance Analyzer — detects potential AI-generated or copy-pasted content.
 */

export interface AIAssistanceResult {
  score: number; // 0–100, higher = more likely AI-assisted
  confidence: 'low' | 'medium' | 'high';
  flags: string[];
}

/**
 * Analyze text for signs of AI assistance.
 * This is a lightweight heuristic placeholder.
 * Replace with a real backend call as needed.
 */
export function analyzeForAIAssistance(text: string): AIAssistanceResult {
  const flags: string[] = [];
  let score = 0;

  // Heuristic: very long perfectly-structured text
  if (text.length > 800 && text.split('\n').length > 10) {
    flags.push('Unusually long and structured response');
    score += 30;
  }

  // Heuristic: no filler words
  const fillerCount = (text.match(/\b(um|uh|like|you know|basically)\b/gi) ?? []).length;
  if (text.length > 200 && fillerCount === 0) {
    flags.push('No natural speech fillers detected');
    score += 20;
  }

  // Heuristic: multiple bullet points or numbered lists
  if (/^\s*[\d\-*•]/m.test(text) && (text.match(/^\s*[\d\-*•]/gm) ?? []).length > 4) {
    flags.push('Structured list formatting detected');
    score += 15;
  }

  const confidence: AIAssistanceResult['confidence'] =
    score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';

  return { score: Math.min(score, 100), confidence, flags };
}

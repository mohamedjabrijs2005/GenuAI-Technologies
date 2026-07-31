/**
 * Plagiarism Analyzer — detects verbatim or near-verbatim copied content.
 */

export interface PlagiarismResult {
  isPlagiarized: boolean;
  similarityScore: number; // 0–100
  matchedPhrases: string[];
}

/**
 * Lightweight client-side plagiarism heuristic.
 * For production use, replace with a backend call to a plagiarism detection API.
 */
export function analyzePlagiarism(
  text: string,
  referenceCorpus: string[] = []
): PlagiarismResult {
  const matchedPhrases: string[] = [];
  let maxSimilarity = 0;

  for (const ref of referenceCorpus) {
    const textWords = new Set(text.toLowerCase().split(/\s+/));
    const refWords = ref.toLowerCase().split(/\s+/);
    const matchCount = refWords.filter((w) => textWords.has(w)).length;
    const similarity = refWords.length > 0 ? (matchCount / refWords.length) * 100 : 0;

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }

    if (similarity > 60) {
      matchedPhrases.push(ref.substring(0, 80) + '…');
    }
  }

  return {
    isPlagiarized: maxSimilarity >= 70,
    similarityScore: Math.round(maxSimilarity),
    matchedPhrases,
  };
}

import pool from '../db';
import {
  CandidateConsent,
  IdentityVerificationResult,
  MonitoringEvent,
  IntegrityReport,
} from '../types/integrity';
import { calculateRiskLevel, generateRecruiterRecommendation } from '../utils/integrityPolicy';

export class IntegrityService {
  /** Ensures a session row exists, creating it on first write. */
  private static async ensureSession(sessionId: string, candidateId: number, assessmentId?: number | null, companyId?: number | null) {
    await pool.query(
      `INSERT INTO integrity_sessions (session_id, candidate_id, assessment_id, company_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (session_id) DO UPDATE SET
         assessment_id = COALESCE(EXCLUDED.assessment_id, integrity_sessions.assessment_id),
         company_id = COALESCE(EXCLUDED.company_id, integrity_sessions.company_id),
         updated_at = NOW()`,
      [sessionId, candidateId, assessmentId || null, companyId || null]
    );
  }

  static async saveConsent(candidateId: number, sessionId: string, consent: CandidateConsent): Promise<boolean> {
    await this.ensureSession(sessionId, candidateId);
    await pool.query(
      `UPDATE integrity_sessions SET consent = $1, updated_at = NOW() WHERE session_id = $2`,
      [JSON.stringify(consent), sessionId]
    );
    return true;
  }

  static async getConsent(sessionId: string): Promise<CandidateConsent | null> {
    const r = await pool.query(`SELECT consent FROM integrity_sessions WHERE session_id = $1`, [sessionId]);
    return r.rows[0]?.consent || null;
  }

  /**
   * Records identity verification signals for a session.
   *
   * NOTE ON SCORING: the confidence numbers below are computed the same
   * way they always were (based on whether a photo/voice sample was
   * captured, not a real biometric match against a reference identity).
   * That behavior is UNCHANGED in this pass — only the storage moved
   * from memory to Postgres. Replacing this with a real biometric vendor
   * is tracked as a separate, deliberate follow-up.
   */
  static async verifyCandidateIdentity(
    candidateId: number,
    sessionId: string,
    faceImageBase64?: string,
    _voiceSampleBase64?: string
  ): Promise<IdentityVerificationResult> {
    await this.ensureSession(sessionId, candidateId);

    const hasPhoto = Boolean(faceImageBase64 && faceImageBase64.length > 100);
    const faceMatchScore = hasPhoto ? 92 : 88;
    const facePresenceScore = 96;
    const voiceConsistencyScore = 90;

    const summary: IdentityVerificationResult = {
      faceVerified: true,
      faceMatchScore,
      facePresenceScore,
      voiceVerified: true,
      voiceConsistencyScore,
      livenessPassed: true,
      livenessResult: 'VERIFIED',
      overallConfidence: Math.round((faceMatchScore + facePresenceScore + voiceConsistencyScore) / 3),
      verifiedAt: new Date().toISOString(),
    };

    await pool.query(
      `UPDATE integrity_sessions SET identity_verification = $1, updated_at = NOW() WHERE session_id = $2`,
      [JSON.stringify(summary), sessionId]
    );

    return summary;
  }

  static async logEvent(event: MonitoringEvent): Promise<MonitoringEvent> {
    await this.ensureSession(event.sessionId, event.candidateId);
    await pool.query(
      `INSERT INTO integrity_events (session_id, candidate_id, event_type, severity, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [event.sessionId, event.candidateId, event.type, event.severity, JSON.stringify(event.metadata || {})]
    );
    return event;
  }

  static async getReport(sessionId: string): Promise<IntegrityReport | { error: string }> {
    const sessionRes = await pool.query(
      `SELECT s.*, u.name as candidate_name, u.email as candidate_email
       FROM integrity_sessions s
       JOIN users u ON s.candidate_id = u.id
       WHERE s.session_id = $1`,
      [sessionId]
    );

    if (sessionRes.rows.length === 0) {
      return { error: 'No integrity session found for this ID.' };
    }

    const session = sessionRes.rows[0];

    const eventsRes = await pool.query(
      `SELECT id, session_id, candidate_id, event_type as type, severity, metadata, created_at as timestamp
       FROM integrity_events WHERE session_id = $1 ORDER BY created_at ASC`,
      [sessionId]
    );
    const events: MonitoringEvent[] = eventsRes.rows;

    const integrityScore = Math.max(60, 100 - events.length * 5);
    const riskLevel = calculateRiskLevel(integrityScore);

    const identity = session.identity_verification || {
      faceVerified: false,
      faceMatchScore: 0,
      facePresenceScore: 0,
      voiceVerified: false,
      voiceConsistencyScore: 0,
      livenessPassed: false,
      livenessResult: 'UNCERTAIN',
      overallConfidence: 0,
    };

    // Persist the computed score/risk level back onto the session for fast lookups elsewhere.
    await pool.query(
      `UPDATE integrity_sessions SET integrity_score = $1, risk_level = $2, updated_at = NOW() WHERE session_id = $3`,
      [integrityScore, riskLevel, sessionId]
    );

    return {
      sessionId,
      candidateId: session.candidate_id,
      candidateName: session.candidate_name,
      candidateEmail: session.candidate_email,
      assessmentId: session.assessment_id || undefined,
      integrityScore,
      riskLevel,
      identitySummary: identity,
      screenActivityEventsCount: events.length,
      events,
      // These three blocks are still placeholder analysis, unchanged from
      // before — real typing-biometrics / AI-assistance / plagiarism
      // detection is separate work, not covered by this persistence pass.
      typingBiometrics: {
        wpm: 65,
        pauseCount: 4,
        burstRatio: 0.12,
        backspaceFrequency: 14,
        rhythmVariance: 18,
        abnormalFlag: false,
      },
      aiAssistance: {
        aiAssistanceLikelihood: 12,
        humanAuthorshipLikelihood: 88,
        confidenceScore: 90,
        stylometricFlags: [],
      },
      plagiarism: {
        plagiarismScore: 5,
        previousCandidateSimilarity: 3,
        campaignSimilarity: 4,
        matchedSourcesCount: 0,
      },
      aiExplanation: `Candidate maintained strong presence and screen integrity. ${events.length} event(s) recorded.`,
      recruiterRecommendation: generateRecruiterRecommendation(riskLevel, integrityScore),
      createdAt: session.created_at,
    };
  }

  static async getCompanyReports(companyId: number): Promise<any[]> {
    const res = await pool.query(
      `SELECT s.session_id, s.candidate_id, s.integrity_score, s.risk_level, s.created_at,
              u.name as candidate_name, u.email as candidate_email
       FROM integrity_sessions s
       JOIN users u ON s.candidate_id = u.id
       WHERE s.company_id = $1
       ORDER BY s.created_at DESC`,
      [companyId]
    );
    return res.rows;
  }

  static async getAnalytics(): Promise<Record<string, any>> {
    const scoreRes = await pool.query(`SELECT AVG(integrity_score) as avg_score FROM integrity_sessions WHERE integrity_score IS NOT NULL`);
    const riskRes = await pool.query(
      `SELECT risk_level, COUNT(*) as count FROM integrity_sessions WHERE risk_level IS NOT NULL GROUP BY risk_level`
    );
    const eventRes = await pool.query(
      `SELECT event_type, COUNT(*) as count FROM integrity_events GROUP BY event_type ORDER BY count DESC LIMIT 5`
    );

    const riskDistribution: Record<string, number> = { low: 0, medium: 0, high: 0 };
    for (const row of riskRes.rows) {
      const key = String(row.risk_level).toLowerCase();
      if (key in riskDistribution) riskDistribution[key] = parseInt(row.count, 10);
    }

    return {
      averageIntegrityScore: Math.round(parseFloat(scoreRes.rows[0]?.avg_score) || 0),
      riskDistribution,
      commonViolations: eventRes.rows.map(r => ({ type: r.event_type, count: parseInt(r.count, 10) })),
      aiAssistanceTrend: 'STABLE',
      plagiarismTrend: 'LOW',
    };
  }
}

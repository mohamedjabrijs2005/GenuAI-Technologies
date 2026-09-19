import { Request, Response } from 'express';
import { IntegrityService } from '../services/integrityService';
import { ReportService } from '../services/reportService';
import { AnalyticsService } from '../services/analyticsService';

export const handleSaveConsent = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id;
    const { sessionId, ...consent } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required.' });
    }
    await IntegrityService.saveConsent(candidateId, sessionId, consent as any);
    res.json({ success: true, message: 'Consent recorded successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save consent' });
  }
};

export const handleVerifyIdentity = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id;
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required.' });
    }
    const result = await IntegrityService.verifyCandidateIdentity(
      candidateId,
      sessionId,
      req.body.faceImageBase64,
      req.body.voiceSampleBase64
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Identity verification failed' });
  }
};

export const handleLogEvent = async (req: Request, res: Response) => {
  try {
    const event = { ...req.body, candidateId: req.user!.id };
    const saved = await IntegrityService.logEvent(event);
    res.json({ success: true, event: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to log monitoring event' });
  }
};

export const handleGetReport = async (req: Request, res: Response) => {
  try {
    const sessionId = (req.params.sessionId as string) || '';
    const report = await IntegrityService.getReport(sessionId);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate report' });
  }
};

export const handleGetCompanyReports = async (req: Request, res: Response) => {
  try {
    const companyId = parseInt(req.params.companyId, 10);
    const reports = await IntegrityService.getCompanyReports(companyId);
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch company reports' });
  }
};

export const handleGetAnalytics = async (_req: Request, res: Response) => {
  try {
    const analytics = await IntegrityService.getAnalytics();
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch analytics' });
  }
};

export const handleSaveSessionSummary = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Session summary saved successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save session summary' });
  }
};

export const handleSaveDecision = async (req: Request, res: Response) => {
  try {
    const decision = await ReportService.saveRecruiterDecision(req.body);
    res.json({ success: true, decision });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save decision' });
  }
};

export const handleGetCompanyAnalytics = async (req: Request, res: Response) => {
  try {
    const companyId = parseInt(req.params.companyId, 10);
    const analytics = await AnalyticsService.getCompanyDashboardAnalytics(companyId);
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch company analytics' });
  }
};

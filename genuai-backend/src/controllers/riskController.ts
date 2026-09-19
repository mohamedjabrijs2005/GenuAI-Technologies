import { Request, Response } from 'express';
import { RiskEngine } from '../services/riskEngine';
import { PolicyEngine } from '../services/policyEngine';
import { paramString } from '../middleware/auth';

export const handleEvaluateRisk = async (req: Request, res: Response) => {
  try {
    const profile = RiskEngine.evaluateRiskProfile(req.body);
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to evaluate risk profile' });
  }
};

export const handleGetPolicy = async (req: Request, res: Response) => {
  try {
    const companyId = parseInt(paramString(req.params.companyId), 10);
    const policy = PolicyEngine.getCompanyPolicy(companyId);
    res.json(policy);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch policy' });
  }
};

export const handleSetPolicy = async (req: Request, res: Response) => {
  try {
    const companyId = parseInt(paramString(req.params.companyId), 10);
    const updated = PolicyEngine.setCompanyPolicy(companyId, req.body);
    res.json({ success: true, policy: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update policy' });
  }
};

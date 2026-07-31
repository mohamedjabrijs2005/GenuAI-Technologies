/**
 * Integrity Client — API calls for integrity sessions.
 */

const BASE = '/api/integrity';

export const createIntegritySession = async (userId: string, assessmentId: string) => {
  const res = await fetch(`${BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, assessmentId }),
  });
  return res.json();
};

export const closeIntegritySession = async (sessionId: string) => {
  const res = await fetch(`${BASE}/sessions/${sessionId}/close`, { method: 'POST' });
  return res.json();
};

export const getIntegrityReport = async (sessionId: string) => {
  const res = await fetch(`${BASE}/sessions/${sessionId}/report`);
  return res.json();
};

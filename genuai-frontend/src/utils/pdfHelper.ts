/**
 * Generate the assessment PDF report and open print dialog.
 * Extracted from CandidateDashboard to keep it testable and reusable.
 */
export const generateAssessmentPDF = (result: any, userName: string, role: string): void => {
  const vc = result.verdict === 'HIRE' ? '#00B87C' : result.verdict === 'REVIEW' ? '#F59E0B' : '#FF4444';
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:32px;background:#fff;color:#1E293B;}
  h1{font-size:24px;font-weight:900;color:#667EEA;margin:0 0 4px;}
  .sub{color:#64748B;font-size:13px;margin:0 0 24px;}
  .score{font-size:64px;font-weight:900;color:${vc};line-height:1;}
  .verdict{display:inline-block;padding:6px 20px;border-radius:20px;background:${vc}22;color:${vc};font-weight:800;font-size:18px;margin:8px 0 16px;}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin:20px 0;}
  .card{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:14px;text-align:center;}
  .card-label{font-size:11px;color:#94A3B8;font-weight:700;text-transform:uppercase;margin-bottom:4px;}
  .card-val{font-size:22px;font-weight:800;color:#667EEA;}
  .section{margin:20px 0;}
  .section-title{font-size:14px;font-weight:700;color:#1E293B;margin:0 0 10px;border-bottom:2px solid #E2E8F0;padding-bottom:6px;}
  .item{font-size:13px;color:#64748B;margin:4px 0;padding-left:16px;}
  .item::before{content:"• ";}
  .footer{margin-top:32px;padding-top:16px;border-top:1px solid #E2E8F0;text-align:center;color:#94A3B8;font-size:11px;}
  @media print{body{padding:20px;}}
</style></head><body>
<h1>GenuAI Technologies</h1>
<div class="sub">AI-Powered Recruitment Intelligence Platform — Assessment Report</div>
<div class="sub">Candidate: <strong>${userName}</strong> | Role: <strong>${role}</strong> | Date: <strong>${new Date().toLocaleDateString('en-IN')}</strong></div>
<hr style="border:none;border-top:2px solid #667EEA;margin:0 0 20px;">
<div class="score">${result.overall_score}%</div>
<div><span class="verdict">${result.verdict === 'HIRE' ? '✅ HIRE' : result.verdict === 'REVIEW' ? '⏳ REVIEW' : '❌ REJECT'}</span></div>
<div class="grid">
  <div class="card"><div class="card-label">ATS Score</div><div class="card-val">${result.ats_score || 0}%</div></div>
  <div class="card"><div class="card-label">Skill Test</div><div class="card-val">${result.test_score || 0}%</div></div>
  <div class="card"><div class="card-label">Interview</div><div class="card-val">${result.interview_score || 0}%</div></div>
  <div class="card"><div class="card-label">Authenticity</div><div class="card-val">${result.authenticity_score || 0}%</div></div>
</div>
<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;margin:16px 0;">
  <div style="font-size:13px;color:#64748B;">Triangle Status: <strong style="color:#667EEA;">${result.triangle_status || '—'}</strong> &nbsp;|&nbsp; Consistency: <strong>${result.consistency_score || 0}%</strong> &nbsp;|&nbsp; Salary Estimate: <strong style="color:#00B87C;">₹${result.salary_min || 0}L – ₹${result.salary_max || 0}L/yr</strong></div>
</div>
${result.key_strengths?.length > 0 ? `<div class="section"><div class="section-title">💪 Key Strengths</div>${result.key_strengths.map((s: string) => `<div class="item">${s}</div>`).join('')}</div>` : ''}
${result.improvement_plan?.length > 0 ? `<div class="section"><div class="section-title">📈 Improvement Plan</div>${result.improvement_plan.map((s: string) => `<div class="item">${s}</div>`).join('')}</div>` : ''}
<div class="footer">
  <strong>GenuAI Technologies</strong> · AI-Powered Recruitment Intelligence<br>
  © ${new Date().getFullYear()} GenuAI Technologies. All Rights Reserved.
</div>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

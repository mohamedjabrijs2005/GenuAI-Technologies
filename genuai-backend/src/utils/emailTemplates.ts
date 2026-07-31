/**
 * Base professional HTML wrapper for all GenuAI emails.
 * Uses a premium, clean, mobile-responsive design that mimics Tailwind CSS components.
 */
export const getBaseTemplate = (headerContent: string, bodyContent: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111827;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" max-width="500" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 0;">
              ${headerContent}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: left;">
              <p style="color: #111827; font-size: 14px; margin: 0 0 4px 0; font-weight: 600;">GenuAI Technologies</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Next-Generation Recruitment Intelligence</p>
            </td>
          </tr>

        </table>
        
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
           © ${new Date().getFullYear()} GenuAI. All Rights Reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getOtpTemplate = (name: string, otp: string, type: 'register' | 'reset') => {
  const isReset = type === 'reset';
  const title = isReset ? 'Password Reset' : 'Verify Email';
  const intro = isReset 
    ? 'We received a request to reset your password. Use the verification code below to securely complete the process.' 
    : 'Welcome to GenuAI! To complete your registration, please verify your email address with the code below.';

  const header = `
    <div style="background-color: #ffffff; padding: 40px 40px 0 40px; text-align: left;">
      <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">${title}</h1>
    </div>
  `;

  const body = `
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; font-weight: 500;">Hello ${name},</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">${intro}</p>
    
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px; border: 1px solid #e5e7eb;">
      <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 700; color: #111827; letter-spacing: 8px;">${otp}</span>
    </div>

    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.6;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
  `;

  return getBaseTemplate(header, body);
};

export const getInterviewInviteTemplate = (candidateName: string, interviewLink: string, role?: string, company?: string) => {
  const roleText = role && company ? ` for the <strong>${role}</strong> position at <strong>${company}</strong>` : '';
  
  const header = `
    <div style="background-color: #ffffff; padding: 40px 40px 0 40px; text-align: left;">
      <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Interview Invitation</h1>
    </div>
  `;

  const body = `
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; font-weight: 500;">Hi ${candidateName},</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">You have been invited to an AI-powered interview${roleText}. This assessment is designed to evaluate your technical skills fairly.</p>
    
    <div style="margin: 32px 0;">
      <a href="${interviewLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 500; font-size: 15px; text-decoration: none; padding: 12px 24px; border-radius: 6px; border: 1px solid #1d4ed8;">
        Start Interview
      </a>
    </div>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
      <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 13px; font-weight: 600;">📝 Instructions:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.5;">
        <li>Ensure a stable internet connection.</li>
        <li>Camera and microphone must be enabled.</li>
        <li>The interview cannot be paused.</li>
      </ul>
    </div>
  `;

  return getBaseTemplate(header, body);
};

export const getAssessmentResultTemplate = (candidateName: string, role: string, score: number, breakdown: string, nextSteps: string) => {
  const isExcellent = score >= 85;
  const scoreColor = isExcellent ? '#059669' : (score >= 60 ? '#d97706' : '#dc2626');
  
  const header = `
    <div style="background-color: #ffffff; padding: 40px 40px 0 40px; text-align: left;">
      <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Assessment Results</h1>
    </div>
  `;

  const body = `
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; font-weight: 500;">Hi ${candidateName},</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">Your assessment for the <strong>${role}</strong> role has been evaluated. Here is your summary.</p>
    
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Overall Score</p>
      <div style="font-size: 40px; font-weight: 700; color: ${scoreColor}; line-height: 1;">${score}<span style="font-size: 20px; color: #9ca3af;">/100</span></div>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600;">Performance Breakdown</h4>
      <div style="color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-line; background: #f3f4f6; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">${breakdown}</div>
    </div>

    <div>
      <h4 style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 600;">Next Steps</h4>
      <div style="color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-line; border-left: 3px solid #3b82f6; padding-left: 12px;">${nextSteps}</div>
    </div>
  `;

  return getBaseTemplate(header, body);
};

export const getVerdictTemplate = (candidateName: string, companyName: string, jobTitle: string, isHired: boolean) => {
  const title = isHired ? 'Congratulations!' : 'Application Update';
  const titleColor = isHired ? '#059669' : '#111827';

  const header = `
    <div style="background-color: #ffffff; padding: 40px 40px 0 40px; text-align: left;">
      <h1 style="margin: 0; color: ${titleColor}; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">${title}</h1>
    </div>
  `;

  const body = isHired
    ? `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; font-weight: 500;">Dear ${candidateName},</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">We are thrilled to inform you that you have been <strong style="color: #059669;">selected</strong> for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
      
      <div style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 16px;">
        <ul style="margin: 0; padding: 0; list-style: none;">
          <li style="margin-bottom: 8px; color: #065f46; font-size: 14px;">✅ Our HR team will contact you within 2-3 business days</li>
          <li style="margin-bottom: 8px; color: #065f46; font-size: 14px;">✅ Keep your phone and email accessible</li>
          <li style="color: #065f46; font-size: 14px;">✅ Prepare your documents for verification</li>
        </ul>
      </div>
    `
    : `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; font-weight: 500;">Dear ${candidateName},</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. After careful consideration, we will not be moving forward with your application at this time.</p>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
        <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 13px; font-weight: 600;">How to improve:</h4>
        <ul style="margin: 0; padding: 0; list-style: none;">
          <li style="margin-bottom: 8px; color: #4b5563; font-size: 13px;">📚 Review your skill gaps from your GenuAI assessment</li>
          <li style="margin-bottom: 8px; color: #4b5563; font-size: 13px;">🎯 Practice with our AI Mock Interview Coach</li>
          <li style="color: #4b5563; font-size: 13px;">🚀 Apply again when you feel ready</li>
        </ul>
      </div>
    `;

  return getBaseTemplate(header, body);
};

export const getAdminForwardTemplate = (candidateName: string, previousCompanyName: string, nextCompanyName: string) => {
  const header = `
    <div style="background-color: #ffffff; padding: 40px 40px 0 40px; text-align: left;">
      <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Profile Forwarded</h1>
    </div>
  `;

  const body = `
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; font-weight: 500;">Hi ${candidateName},</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">While you weren't selected by <strong>${previousCompanyName}</strong>, your profile has been automatically forwarded to <strong>${nextCompanyName}</strong> through GenuAI's Waterfall Recruiting.</p>
    
    <div style="border-left: 3px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6;">You do not need to do anything. The recruitment team at ${nextCompanyName} is now reviewing your assessment scores and interview recording.</p>
    </div>
  `;

  return getBaseTemplate(header, body);
};

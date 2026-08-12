import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

let resendClient: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
}

/**
 * Multi-Provider Resilient Mailer
 * 1. Resend API
 * 2. Nodemailer SMTP (Gmail / Custom SMTP)
 * 3. Gmail OAuth2 REST API
 * 4. Diagnostic fallback
 */
export const sendEmail = async (options: { to: string; subject: string; html: string; from?: string }) => {
  const fromEmail = options.from || process.env.GMAIL_USER || process.env.SMTP_USER || 'support@genuai.tech';
  const defaultFrom = `"GenuAI Technologies" <${fromEmail}>`;

  // Strategy 1: Resend API
  if (resendClient) {
    try {
      const res = await resendClient.emails.send({
        from: defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log('[Mailer] Sent via Resend successfully:', res);
      return res;
    } catch (err: any) {
      console.warn('[Mailer] Resend attempt failed, trying next provider:', err?.message);
    }
  }

  // Strategy 2: Nodemailer (Gmail App Password or SMTP)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log('[Mailer] Sent via Gmail SMTP successfully:', info.messageId);
      return info;
    } catch (err: any) {
      console.warn('[Mailer] Gmail SMTP attempt failed, trying next provider:', err?.message);
    }
  }

  // Strategy 3: Standard SMTP Host (if configured)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log('[Mailer] Sent via Custom SMTP successfully:', info.messageId);
      return info;
    } catch (err: any) {
      console.warn('[Mailer] Custom SMTP attempt failed, trying next provider:', err?.message);
    }
  }

  // Strategy 4: Gmail OAuth2 REST API
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN) {
    try {
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const utf8Subject = `=?utf-8?B?${Buffer.from(options.subject).toString('base64')}?=`;
      const messageParts = [
        `From: ${defaultFrom}`,
        `To: ${options.to}`,
        `Subject: ${utf8Subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        options.html,
      ];
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      });

      console.log('[Mailer] Sent via Gmail REST API successfully:', res.data.id);
      return res.data;
    } catch (err: any) {
      console.warn('[Mailer] Gmail REST API attempt failed:', err?.message);
    }
  }

  // Diagnostic log when external email providers are unreachable or unconfigured
  console.log(`\n======================================================`);
  console.log(`[MAILER NOTIFICATION]`);
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  return { delivered: false, note: 'Diagnostic logging mode' };
};

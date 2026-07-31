import { google } from 'googleapis';

const createGmailClient = () => {
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

export const sendEmail = async (options: { to: string; subject: string; html: string; from?: string }) => {
  try {
    const gmail = createGmailClient();
    
    // Default from email if not specified
    const defaultFrom = `"GenuAI Technologies" <${process.env.GMAIL_USER}>`;
    const from = options.from || defaultFrom;
    
    // Construct the email message
    const utf8Subject = `=?utf-8?B?${Buffer.from(options.subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${from}`,
      `To: ${options.to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      options.html,
    ];
    
    const message = messageParts.join('\n');
    
    // The Gmail API requires a base64url encoded string
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send the email via HTTP REST API (Bypasses Port 465 SMTP block)
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Email sent successfully via REST API: %s", res.data.id);
    return res.data;
  } catch (error) {
    console.error("Error sending email via Gmail REST API:", error);
    throw error;
  }
};

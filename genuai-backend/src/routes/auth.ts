import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import pool from '../db';
import { sendEmail } from '../utils/mailer';
import { getOtpTemplate } from '../utils/emailTemplates';

const router = express.Router();
const otpStore: Record<string, { otp: string; expires: number; data: any }> = {};
const FRONTEND_URL_PROD = 'https://genuai-technologies.vercel.app';
const BACKEND_URL_PROD = 'https://genuai-technologies.onrender.com';

const isProd = process.env.NODE_ENV === 'production' || !!process.env.RENDER;

const FRONTEND_URL = isProd ? (process.env.FRONTEND_URL || FRONTEND_URL_PROD) : 'http://localhost:5173';
const BACKEND_URL = isProd ? (process.env.BACKEND_URL || BACKEND_URL_PROD) : 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'genuai_jwt_secret_key_2026';

console.log(`[Auth] Mode: ${isProd ? 'Production' : 'Development'}`);
console.log(`[Auth] Backend URL: ${BACKEND_URL}`);
console.log(`[Auth] Frontend URL: ${FRONTEND_URL}`);

// ─────────────────────────────────────────────
// Passport OAuth Setup
// ─────────────────────────────────────────────

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${BACKEND_URL}/auth/google/callback`,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'User';
      if (!email) return done(new Error('No email from Google'), false);

      // Upsert user
      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user;
      if (existing.rows.length > 0) {
        user = existing.rows[0];
      } else {
        const result = await pool.query(
          'INSERT INTO users (name, email, password_hash, role, phone, college) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,email,role',
          [name, email, '', 'candidate', '', '']
        );
        user = result.rows[0];
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your_github_client_id') {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: `${BACKEND_URL}/auth/github/callback`,
    scope: ['user:email'],
  }, async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || profile.username || 'GitHub User';
      if (!email) return done(new Error('No email from GitHub. Make sure your GitHub email is public or grant email scope.'), false);

      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user;
      if (existing.rows.length > 0) {
        user = existing.rows[0];
      } else {
        const result = await pool.query(
          'INSERT INTO users (name, email, password_hash, role, phone, college) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,email,role',
          [name, email, '', 'candidate', '', '']
        );
        user = result.rows[0];
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_ID !== 'your_linkedin_client_id') {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    callbackURL: `${BACKEND_URL}/auth/linkedin/callback`,
    scope: ['openid', 'profile', 'email'],
  }, async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || 'LinkedIn User';
      if (!email) return done(new Error('No email from LinkedIn.'), false);

      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user;
      if (existing.rows.length > 0) {
        user = existing.rows[0];
      } else {
        const result = await pool.query(
          'INSERT INTO users (name, email, password_hash, role, phone, college) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,email,role',
          [name, email, '', 'candidate', '', '']
        );
        user = result.rows[0];
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
}

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

// ─────────────────────────────────────────────
// Helper: Issue JWT and redirect to frontend
// ─────────────────────────────────────────────
function issueJwtAndRedirect(req: any, res: any) {
  const user: any = req.user;
  if (!user) return res.redirect(`${FRONTEND_URL}/auth?oauth_error=Authentication+failed`);
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const userData = encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role, token }));
  res.redirect(`${FRONTEND_URL}/auth?oauth_user=${userData}`);
}

// ─────────────────────────────────────────────
// Google OAuth Routes
// ─────────────────────────────────────────────
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_client_id') {
    return res.redirect(`${FRONTEND_URL}/auth?oauth_error=Google+OAuth+not+configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/auth?oauth_error=Google+auth+failed` })(req, res, next),
  issueJwtAndRedirect
);

// ─────────────────────────────────────────────
// GitHub OAuth Routes
// ─────────────────────────────────────────────
router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID === 'your_github_client_id') {
    return res.redirect(`${FRONTEND_URL}/auth?oauth_error=GitHub+OAuth+not+configured`);
  }
  passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
});

router.get('/github/callback',
  (req, res, next) => passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/auth?oauth_error=GitHub+auth+failed` })(req, res, next),
  issueJwtAndRedirect
);

// ─────────────────────────────────────────────
// LinkedIn OAuth Routes
// ─────────────────────────────────────────────
router.get('/linkedin', (req, res, next) => {
  if (!process.env.LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID === 'your_linkedin_client_id') {
    return res.redirect(`${FRONTEND_URL}/auth?oauth_error=LinkedIn+OAuth+not+configured`);
  }
  passport.authenticate('linkedin', { session: false })(req, res, next);
});

router.get('/linkedin/callback',
  (req, res, next) => passport.authenticate('linkedin', { session: false, failureRedirect: `${FRONTEND_URL}/auth?oauth_error=LinkedIn+auth+failed` })(req, res, next),
  issueJwtAndRedirect
);

// ─────────────────────────────────────────────
// Microsoft OAuth Route (Fallback / Provisioning)
// ─────────────────────────────────────────────
router.get('/microsoft', (_req, res) => {
  return res.redirect(`${FRONTEND_URL}/auth?oauth_error=Microsoft+login+is+under+enterprise+provisioning.+Please+use+Google,+GitHub,+LinkedIn,+or+Email.`);
});

// ─────────────────────────────────────────────
// Session Validation Route (/auth/me)
// ─────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authenticated session' });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, name, email, role, phone, college FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User profile not found' });
    }
    const u = result.rows[0];
    res.json({
      user: { id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone, college: u.college },
      token
    });
  } catch {
    res.status(401).json({ error: 'Invalid or expired session token' });
  }
});

// ─────────────────────────────────────────────
// Real Email + Password Login Route (ZERO Mock Fallbacks)
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Please enter your password.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [trimmedEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const candidate = result.rows[0];
    if (!candidate.password_hash) {
      return res.status(401).json({ error: 'Account created with OAuth. Please sign in using Google, GitHub, or LinkedIn.' });
    }

    const isMatch = await bcrypt.compare(password, candidate.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: candidate.id, role: candidate.role, email: candidate.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        role: candidate.role,
        phone: candidate.phone,
        college: candidate.college,
      },
      token,
    });
  } catch (err: any) {
    console.error('[Auth Error] Login error:', err.message);
    res.status(500).json({ error: 'Unable to connect. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// Real Registration Routes
// ─────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name, password, role, phone, college, github, linkedin } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Please enter a valid email address.' });
    if (!name || !password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [trimmedEmail]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already registered. Please sign in instead.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[trimmedEmail] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      data: { name, email: trimmedEmail, password, role: role || 'candidate', phone, college, github, linkedin }
    };

    sendEmail({
      to: trimmedEmail,
      subject: 'GenuAI Technologies — Email Verification OTP',
      html: getOtpTemplate(name, otp, 'register'),
    }).catch(err => console.error('Failed to send OTP email asynchronously:', err));

    res.json({ message: 'OTP sent to your email' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to send OTP.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();
    const record = otpStore[trimmedEmail];
    if (!record) return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
    if (Date.now() > record.expires) {
      delete otpStore[trimmedEmail];
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP.' });

    const { name, password, role, phone, college, github, linkedin } = record.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, phone, college, github, linkedin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, role, phone, college',
      [name, trimmedEmail, hashedPassword, role || 'candidate', phone || '', college || '', github || '', linkedin || '']
    );
    delete otpStore[trimmedEmail];

    const newUser = result.rows[0];
    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: newUser, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration verification failed.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, college, github, linkedin } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Please enter a valid email address.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered. Please sign in instead.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, phone, college, github, linkedin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, role, phone, college',
      [name, trimmedEmail, hashedPassword, role || 'candidate', phone || '', college || '', github || '', linkedin || '']
    );
    const newUser = result.rows[0];
    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: newUser, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

// ─────────────────────────────────────────────
// Real Forgot Password & Reset Password
// ─────────────────────────────────────────────
router.post('/forgot-password-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Please enter a valid email address.' });

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT id, name FROM users WHERE LOWER(email) = $1', [trimmedEmail]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'No account found with this email address.' });

    const user = existing.rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[trimmedEmail] = { otp, expires: Date.now() + 10 * 60 * 1000, data: { email: trimmedEmail } };

    sendEmail({
      to: trimmedEmail,
      subject: 'GenuAI Technologies — Password Reset OTP',
      html: getOtpTemplate(user.name, otp, 'reset'),
    }).catch(err => console.error('Failed to send Password Reset OTP asynchronously:', err));

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to send reset code.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required.' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });

    const trimmedEmail = email.trim().toLowerCase();
    const record = otpStore[trimmedEmail];
    if (!record) return res.status(400).json({ error: 'OTP not found or expired. Please request a new one.' });
    if (Date.now() > record.expires) {
      delete otpStore[trimmedEmail];
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE LOWER(email) = $2', [hashedPassword, trimmedEmail]);
    delete otpStore[trimmedEmail];

    res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Password reset failed.' });
  }
});

export default router;

import rateLimit from 'express-rate-limit';

/** Strict limiter for auth endpoints prone to brute-force/abuse (login, OTP, password reset). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // 10 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait a few minutes and try again.' },
});

/** Looser limiter for the LLM proxy, to cap cost exposure per caller. */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // 20 AI calls per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'You are sending requests too quickly. Please slow down.' },
});

/** General-purpose limiter for everything else, as a baseline safety net. */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

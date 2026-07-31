import { Router, Request, Response } from 'express';

const router = Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;
    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_KEY || '';

    if (!apiKey) {
      return res.status(500).json({ error: 'Groq API Key is not configured on the backend server.' });
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: messages || [],
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1024,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: (data as any)?.error?.message || 'AI request failed' });
    }

    res.json(data);
  } catch (err: any) {
    console.error('Groq AI Proxy Error:', err?.message);
    res.status(500).json({ error: err?.message || 'AI generation failed' });
  }
});

export default router;

/**
 * Groq AI Service — centralized LLM calls.
 * Routes all AI generation through the secure backend proxy endpoint (/ai/chat)
 * so API keys are never exposed in the browser.
 */
import apiClient from './apiClient';
import type { GroqEvaluationResult, GroqMockEvaluationResult } from '../types';

// ── Generic Groq Proxy call ─────────────────────────────────────────
export const callGroq = async (
  prompt: string,
  options: { json?: boolean; temperature?: number; max_tokens?: number } = {}
): Promise<string> => {
  const res = await apiClient.post('/ai/chat', {
    prompt,
    messages: [{ role: 'user', content: prompt }],
    ...(options.json ? { response_format: { type: 'json_object' } } : {}),
    temperature: options.temperature ?? 0.5,
    max_tokens: options.max_tokens ?? 500,
  });
  return res.data.choices[0].message.content;
};

// ── AI Evaluation (Triple Pillar — used in CandidateDashboard) ───────────────
export const evaluateAI = async (data: {
  resume_text: string;
  skills: string[];
  test_score: number;
  interview_pitch: string;
  role: string;
}): Promise<{ data: GroqEvaluationResult }> => {
  const { resume_text, skills, test_score, interview_pitch, role } = data;

  const prompt = `You are a strict, top-tier AI Recruiter. You must evaluate this candidate using a highly strategic TRIPLE-PILLAR approach. 
The 3 Pillars (Resume Profile, Skill Test, and Voice Pitch) are EQUAL priorities for success. All three must reflect high efficiency and excellence for a positive verdict.

1. Resume Profile: ${(resume_text || '').substring(0, 1000)}
2. Skill Test Score: ${test_score}/100 (Role: ${role}, Skills: ${(skills || []).join(', ')})
3. Voice Pitch Transcription: "${interview_pitch}"

CRITICAL VOICE PITCH EVALUATION (Fluency & Voice Clarity):
Your absolute top priority when evaluating the Pitch is "Fluency of Language" and "Voice Clarity". You must logically deduce this from their transcription text:
- Voice Clarity: Demand clean, articulate speech. Apply SEVERE score penalties for filler words ("um", "ah", "like"), stuttering, or garbled sentences.
- Fluency of Language: Demand smooth sentence structure, natural context transitions, and advanced professional vocabulary.

Return ONLY a valid JSON object (no markdown, no backticks, no other text) with these exact fields:
{
    "resume_score": 85,
    "interview_score": 80,
    "communication_score": 75,
    "technical_depth": 80,
    "confidence_level": "Medium",
    "key_strengths": ["strength1", "strength2"],
    "areas_to_improve": ["area1", "area2"],
    "ai_verdict": "HIRE",
    "ai_reasoning": "Explanation explicitly highlighting their Fluency/Voice Clarity and how the 3 pillars balanced out."
}`;

  try {
    const content = await callGroq(prompt, { json: true, temperature: 0.2 });
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    return { data: JSON.parse(jsonStr) };
  } catch {
    return {
      data: {
        resume_score: 80,
        interview_score: 70,
        communication_score: 60,
        technical_depth: 70,
        confidence_level: 'Medium',
        key_strengths: ['Communication', 'Problem Solving'],
        areas_to_improve: ['Voice Clarity', 'Language Fluency'],
        ai_verdict: 'REVIEW',
        ai_reasoning: 'Fall-back evaluation used due to network constraints.',
      },
    };
  }
};

// ── Mock Interview Question Generation ───────────────────────────────────────
export const generateInterviewQuestion = async (
  role: string,
  type: string,
  previousQs: string[]
): Promise<string> => {
  const prev = previousQs.length ? `Avoid repeating these: ${previousQs.slice(-3).join('; ')}` : '';
  const prompt = `Generate ONE ${type} interview question for a ${role} candidate. ${prev} Return ONLY the question text, nothing else. Make it a realistic, challenging interview question.`;
  return callGroq(prompt, { temperature: 0.8, max_tokens: 120 });
};

// ── Mock Interview Answer Evaluation ─────────────────────────────────────────
export const evaluateInterviewAnswer = async (
  question: string,
  answer: string,
  role: string
): Promise<GroqMockEvaluationResult> => {
  const prompt = `You are a strict interviewer evaluating a ${role} candidate.
Question: "${question}"
Candidate Answer: "${answer}"
Rate this answer and return ONLY valid JSON:
{"score":85,"rating":"Good","strengths":["point1","point2"],"improvements":["point1"],"ideal_answer":"Brief ideal answer in 2 sentences."}`;

  const content = await callGroq(prompt, { json: true, temperature: 0.3, max_tokens: 400 });
  return JSON.parse(content);
};

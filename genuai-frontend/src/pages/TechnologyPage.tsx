import React from 'react';
import { Cpu, Server, Database, Lock, Globe, Code, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TechnologyPage() {
  const navigate = useNavigate();

  const stack = [
    { category: 'Frontend Architecture', tech: 'React 18, TypeScript, Tailwind CSS, Vite', desc: 'Single-page responsive application with atomic component architecture.' },
    { category: 'Backend Engine', tech: 'Node.js, Express.js, TypeScript', desc: 'Asynchronous event-driven REST API server handling engine orchestration.' },
    { category: 'Database & Persistence', tech: 'PostgreSQL 16, pg Pool, Redis', desc: 'Relational data store for canonical role taxonomy, versions, and match scores.' },
    { category: 'AI Speech & NLP', tech: 'Groq LPUs, Whisper V3, Custom SVAR Engine', desc: 'Low-latency verbal fluency parsing, pronunciation scoring, and sentiment analysis.' },
    { category: 'Proctored IDE Compiler', tech: 'Isolated Docker Containers & Judge0 API', desc: 'Sandboxed code execution environment supporting 10+ programming languages.' },
    { category: 'Anti-Proxy Proctoring', tech: 'TensorFlow.js, MediaPipe, WebRTC', desc: 'Client-side real-time facial landmark, gaze tracking, and secondary person detection.' },
    { category: 'Authentication & Security', tech: 'Supabase Auth, JWT Bearer, AES-256', desc: 'Encrypted token authentication with row-level access security.' },
    { category: 'Cloud Infrastructure', tech: 'Render, Vercel, AWS S3, Cloudflare CDN', desc: 'High-availability global edge deployment with SSL transport encryption (TLS 1.3).' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-body-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modern Software Stack</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Technology Architecture
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Enterprise-grade infrastructure driving GenuAI Works role-aware requirement orchestration, anti-proxy proctoring, and match scoring.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Technology Stack</th>
                <th className="pb-3 px-3">Architectural Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stack.map((row) => (
                <tr key={row.category} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-3 font-bold text-white whitespace-nowrap">{row.category}</td>
                  <td className="py-4 px-3 font-mono text-indigo-400 font-semibold">{row.tech}</td>
                  <td className="py-4 px-3 text-slate-300 leading-relaxed">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

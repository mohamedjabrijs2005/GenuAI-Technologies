import React from 'react';
import { BookOpen, Globe, Code, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LearningHubPage() {
  const navigate = useNavigate();

  const spokenLanguages = [
    { name: 'English', code: 'en-US', status: 'Live & Active', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { name: 'Tamil', code: 'ta-IN', status: 'Beta Testing', badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { name: 'Hindi', code: 'hi-IN', status: 'Beta Testing', badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { name: 'Spanish', code: 'es-ES', status: 'Planned Q3 2026', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
    { name: 'German', code: 'de-DE', status: 'Planned Q3 2026', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
    { name: 'Japanese', code: 'ja-JP', status: 'Planned Q4 2026', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
    { name: 'French', code: 'fr-FR', status: 'Planned Q4 2026', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
    { name: 'Mandarin', code: 'zh-CN', status: 'Planned 2027', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
  ];

  const codeLanguages = [
    { name: 'Python 3.11', status: 'Live & Active' },
    { name: 'JavaScript / TypeScript (Node 20)', status: 'Live & Active' },
    { name: 'Java 17 LTS', status: 'Live & Active' },
    { name: 'C++ 20 (GCC)', status: 'Live & Active' },
    { name: 'C# (.NET 8)', status: 'Live & Active' },
    { name: 'Go 1.22', status: 'Live & Active' },
    { name: 'SQL (PostgreSQL 16)', status: 'Live & Active' },
    { name: 'Rust 1.78', status: 'Beta Testing' },
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
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice &amp; Language Support Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Learning &amp; Language Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Practice in your preferred language. SVAR speech recognition and coding environment support matrix.
          </p>
        </div>

        {/* Spoken Language Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>SVAR Spoken Language Support Matrix</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {spokenLanguages.map((l) => (
              <div key={l.name} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{l.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{l.code}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${l.badge}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Environment Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <span>Proctored Coding IDE Languages</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {codeLanguages.map((c) => (
              <div key={c.name} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div className="text-xs font-bold text-white">{c.name}</div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

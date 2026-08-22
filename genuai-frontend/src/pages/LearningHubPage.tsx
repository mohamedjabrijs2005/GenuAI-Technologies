import React from 'react';
import { BookOpen, Globe, Code, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LearningHubPage() {
  const navigate = useNavigate();

  const spokenLanguages = [
    { name: 'English', code: 'en-US', status: 'Live & Active', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Tamil', code: 'ta-IN', status: 'Beta Testing', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: 'Hindi', code: 'hi-IN', status: 'Beta Testing', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: 'Spanish', code: 'es-ES', status: 'Planned Q3 2026', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
    { name: 'German', code: 'de-DE', status: 'Planned Q3 2026', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
    { name: 'Japanese', code: 'ja-JP', status: 'Planned Q4 2026', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
    { name: 'French', code: 'fr-FR', status: 'Planned Q4 2026', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
    { name: 'Mandarin', code: 'zh-CN', status: 'Planned 2027', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Home</span>
        </button>

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200/80">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice &amp; Language Support Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Learning &amp; Language Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Practice in your preferred language. SVAR speech recognition and coding environment support matrix.
          </p>
        </div>

        {/* Spoken Language Table */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>SVAR Spoken Language Support Matrix</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {spokenLanguages.map((l) => (
              <div key={l.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{l.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">{l.code}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${l.badge}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Environment Matrix */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-600" />
            <span>Proctored Coding IDE Languages</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {codeLanguages.map((c) => (
              <div key={c.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900">{c.name}</div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


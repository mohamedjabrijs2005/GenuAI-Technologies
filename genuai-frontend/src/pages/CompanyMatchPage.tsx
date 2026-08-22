import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSavedSelections,
  getCompanyMatches,
  CompanyMatchScoreItem,
  CompanyRoleSelectionItem,
} from '../services/genuaiWorksService';
import { Building2, Sparkles, ArrowLeft, CheckCircle2, AlertCircle, Award } from 'lucide-react';

export default function CompanyMatchPage({ user, onBack }: { user?: any; onBack?: () => void }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<CompanyMatchScoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const saved = getSavedSelections();
      const selectionsList: CompanyRoleSelectionItem[] =
        saved.length > 0
          ? saved
          : [
              { companyId: 101, companyName: 'Zoho', roleTitle: 'Sales Executive' },
              { companyId: 102, companyName: 'Apple', roleTitle: 'Sales Executive' },
              { companyId: 103, companyName: 'Google', roleTitle: 'Data Analyst' },
            ];

      try {
        const matchData = await getCompanyMatches(user?.id || 1, selectionsList);
        setMatches(matchData);
      } catch (err: any) {
        console.error('Failed to load matches:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Company-Specific Matching Engine
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Your Target Company Matches</h1>
            </div>
          </div>

          <button
            onClick={() => navigate('/my-assessment')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 transition"
          >
            Back to Assessment Path
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6 hover:border-slate-600 transition"
              >
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-2xl text-indigo-300">
                      {m.companyName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-white">{m.companyName}</h2>
                        <span className="text-xs bg-slate-700 px-2.5 py-0.5 rounded-full font-mono text-slate-300">
                          v1 Locked
                        </span>
                      </div>
                      <p className="text-sm text-purple-300 font-semibold mt-0.5">{m.roleTitle}</p>
                    </div>
                  </div>

                  {/* Match Score Circular Gauge Badge */}
                  <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 px-5 py-3 rounded-2xl">
                    <Award className="w-6 h-6 text-indigo-400" />
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Match Score</div>
                      <div className="text-3xl font-black text-white font-mono">
                        {m.overallMatchScore}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Components Breakdown */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                    Weighted Component Evidence
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(m.scoreComponents).map(([key, item]) => (
                      <div
                        key={key}
                        className="bg-slate-900/70 border border-slate-700/40 p-3.5 rounded-xl space-y-1"
                      >
                        <div className="text-xs text-slate-400 font-medium truncate">{item.moduleName}</div>
                        <div className="text-xl font-bold text-white font-mono">{item.score}%</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Weight: {(item.weight * 100).toFixed(0)}% • Contrib: {item.contribution}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Weak Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {m.strengths && m.strengths.length > 0 && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> Strong Areas
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {m.strengths.map((s, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.weakAreas && m.weakAreas.length > 0 && (
                    <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" /> Areas for Improvement
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {m.weakAreas.map((w, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* AI Explainable Matching Panel (Rule §28) */}
                <div className="bg-slate-900/90 border border-indigo-500/20 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-indigo-400 block mb-1">Why this match score?</span>
                  {m.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

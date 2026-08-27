import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSavedSelections,
  getCompanyMatches,
  CompanyMatchScoreItem,
  CompanyRoleSelectionItem,
} from '../services/genuaiWorksService';
import {
  Building2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { GenuAILogo } from '../components/common/GenuAILogo';

export default function CompanyMatchPage({ user, onBack }: { user?: any; onBack?: () => void }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<CompanyMatchScoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const saved = getSavedSelections();
      if (saved.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      try {
        const matchData = await getCompanyMatches(user?.id || 1, saved);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body-base antialiased pb-20 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/candidate-path')}
                className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Back to Paths"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <GenuAILogo size="sm" showText={true} />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200/80">
              <Sparkles className="w-3.5 h-3.5" />
              Step 3 of 3: Calibrated Company Matches
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/my-assessment')}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              Assessment Path
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 mb-2">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Matching Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Target Company Match Scores
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Independent calibration based on each company's locked module weights and minimum qualification thresholds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/companies')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <span>Edit Target Selections</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Calculating company-specific match scores...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">No Target Selections Found</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Please choose your target employers and desired positions in Step 1 to generate version-bound match scores.
            </p>
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <span>Select Target Companies</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((m, idx) => {
              const isHigh = m.overallMatchScore >= 80;
              const isMedium = m.overallMatchScore >= 60 && m.overallMatchScore < 80;

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition space-y-6"
                >
                  {/* Score Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-2xl text-blue-700">
                        {m.companyName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-slate-900">{m.companyName}</h2>
                          <span className="text-xs bg-slate-100 px-2.5 py-0.5 rounded-md font-mono font-semibold text-slate-600 border border-slate-200">
                            {m.roleTitle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Calculated from dynamic assessment modules weighted according to employer configuration.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div
                          className={`text-3xl sm:text-4xl font-black font-mono leading-none ${
                            isHigh ? 'text-emerald-600' : isMedium ? 'text-blue-600' : 'text-amber-600'
                          }`}
                        >
                          {m.overallMatchScore}%
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match Score</span>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                          isHigh
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isMedium
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isHigh ? 'Strong Match' : isMedium ? 'Good Fit' : 'Developing'}
                      </span>
                    </div>
                  </div>

                  {/* Component Breakdown Table */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Module Score Contributions</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(m.scoreComponents || {}).map(([cKey, comp]: [string, any]) => (
                        <div
                          key={cKey}
                          className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5"
                        >
                          <div className="flex justify-between font-bold text-slate-900">
                            <span className="truncate pr-1">{comp.moduleName || cKey}</span>
                            <span className="font-mono text-blue-700">{comp.score}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${comp.score}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-0.5">
                            <span>Weight: {Math.round(comp.weight * 100)}%</span>
                            <span className="font-mono text-emerald-700 font-bold">+{comp.contribution} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Growth Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Strengths */}
                    {m.strengths && m.strengths.length > 0 && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Candidate Strengths</span>
                        </div>
                        <ul className="space-y-1">
                          {m.strengths.map((st, sIdx) => (
                            <li key={sIdx} className="text-xs text-emerald-900 flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weak Areas */}
                    {m.weakAreas && m.weakAreas.length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Recommended Improvements</span>
                        </div>
                        <ul className="space-y-1">
                          {m.weakAreas.map((wk, wIdx) => (
                            <li key={wIdx} className="text-xs text-amber-900 flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{wk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

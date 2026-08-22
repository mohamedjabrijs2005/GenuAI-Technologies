import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Target, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function CandidateReadinessPage() {
  const navigate = useNavigate();
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch or compute readiness score
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/candidate/readiness');
        setReadiness(res.data.readiness);
      } catch {
        // Fallback demo readiness data
        setReadiness({
          roleTitle: 'Software Engineer',
          overallReadiness: 84,
          componentScores: {
            technicalSkills: 85,
            problemSolving: 82,
            communication: 88,
            aptitude: 84,
          },
          skillGaps: [
            {
              skillName: 'System Architecture & Distributed Caching',
              category: 'technical',
              requiredLevel: 'Advanced',
              currentLevel: 'Intermediate',
              gapSeverity: 'medium',
              recommendations: [
                'Practice designing distributed caching layers (Redis/Memcached).',
                'Review microservice communication patterns (gRPC vs REST).',
              ],
            },
            {
              skillName: 'Algorithmic Efficiency (DSA)',
              category: 'technical',
              requiredLevel: 'Advanced',
              currentLevel: 'Advanced',
              gapSeverity: 'none',
              recommendations: ['Target proficiency met.'],
            },
            {
              skillName: 'Verbal Fluency & Presentation',
              category: 'soft_skill',
              requiredLevel: 'Proficient',
              currentLevel: 'Proficient',
              gapSeverity: 'none',
              recommendations: ['Target proficiency met.'],
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-body-base">
        <div className="flex items-center gap-3 text-indigo-400">
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Computing Candidate Readiness &amp; Skill Gap Analysis...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-body-base py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Career Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Candidate Readiness &amp; Skill Gap Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Target Role: <strong className="text-white">{readiness?.roleTitle}</strong> • Evaluated against aggregated target requirements
            </p>
          </div>
          <button
            onClick={() => navigate('/companies')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer border border-slate-700"
          >
            Target Companies
          </button>
        </div>

        {/* Readiness Gauge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Gauge Left */}
          <div className="md:col-span-5 text-center flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  strokeDasharray={`${readiness?.overallReadiness || 84}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">{readiness?.overallReadiness || 84}%</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Readiness</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              High Market Readiness
            </span>
          </div>

          {/* Breakdown Right */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Component Competency Breakdown</h3>
            {Object.entries(readiness?.componentScores || {}).map(([key, score]: [string, any]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono text-indigo-400 font-bold">{score}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Skill Gap Analysis &amp; Actionable Recommendations</h2>
              <p className="text-xs text-slate-400">Target vs current proficiency mapping with recommended learning paths.</p>
            </div>
          </div>

          <div className="space-y-4">
            {readiness?.skillGaps?.map((gap: any, idx: number) => {
              const isGap = gap.gapSeverity !== 'none';
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isGap ? 'bg-slate-800/60 border-amber-500/30' : 'bg-slate-800/30 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {isGap ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <h3 className="text-sm font-bold text-white">{gap.skillName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        Current: <strong className="text-slate-200">{gap.currentLevel}</strong> → Required: <strong className="text-indigo-400">{gap.requiredLevel}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          gap.gapSeverity === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : gap.gapSeverity === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {gap.gapSeverity === 'none' ? 'Met ✓' : `${gap.gapSeverity} Gap`}
                      </span>
                    </div>
                  </div>

                  <div className="pl-6 space-y-1">
                    {gap.recommendations?.map((rec: string, rIdx: number) => (
                      <div key={rIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { GenuAILogo } from '../components/common/GenuAILogo';

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 font-body-base gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Computing Candidate Readiness &amp; Skill Gap Analysis...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body-base antialiased pb-20 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/candidate-path')}
              className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Back to Paths"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <GenuAILogo size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-200/80 cursor-pointer"
            >
              <span>Target Companies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Career Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Candidate Readiness &amp; Skill Gap Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Target Role: <strong className="text-slate-800 font-bold">{readiness?.roleTitle}</strong> • Evaluated against aggregated target employer requirements
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/my-assessment')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <span>Take Dynamic Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Readiness Gauge Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Gauge Left */}
          <div className="md:col-span-5 text-center flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray={`${readiness?.overallReadiness ?? 0}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900">{readiness?.overallReadiness ?? 0}%</span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Readiness</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              {(readiness?.overallReadiness ?? 0) >= 70 ? "High Market Readiness" : "Assessment in Progress"}
            </span>
          </div>

          {/* Breakdown Right */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Component Competency Breakdown
              </h3>
            </div>

            {Object.entries(readiness?.componentScores || {}).map(([key, score]: [string, any]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono text-blue-700 font-bold">{score}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis Section */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Skill Gap Analysis &amp; Actionable Recommendations</h2>
              <p className="text-xs text-slate-500">Target vs current proficiency mapping with recommended learning pathways.</p>
            </div>
          </div>

          <div className="space-y-4">
            {readiness?.skillGaps?.map((gap: any, idx: number) => {
              const isGap = gap.gapSeverity !== 'none';
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isGap ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/60 border-slate-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      {isGap ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <h3 className="text-sm font-bold text-slate-900">{gap.skillName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        Current: <strong className="text-slate-800">{gap.currentLevel}</strong> → Required:{' '}
                        <strong className="text-blue-700">{gap.requiredLevel}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          gap.gapSeverity === 'medium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : gap.gapSeverity === 'high'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {gap.gapSeverity === 'none' ? 'Met ✓' : `${gap.gapSeverity} Gap`}
                      </span>
                    </div>
                  </div>

                  <div className="pl-6 space-y-1.5">
                    {gap.recommendations?.map((rec: string, rIdx: number) => (
                      <div key={rIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

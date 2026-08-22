import React from 'react';
import { Sparkles, ArrowLeft, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoadmapPage() {
  const navigate = useNavigate();

  const phases = [
    {
      num: '01',
      title: 'Phase 1: Core Assessment Module Library & Multi-Company Match Engine',
      status: 'In Active Development',
      timeline: 'Q1 2026',
      desc: 'Core assessment module library (GenuAI Skill Test, Coding IDE, SVAR Verbal, AI Interview), company role selector, requirement aggregation engine, and version-bound match scores.',
      highlights: ['Role-Aware Requirement Aggregation', 'Verified Result Reuse', 'Explainable Company Match Scores'],
    },
    {
      num: '02',
      title: 'Phase 2: Company Configuration Locking & Paid Version Change Flow',
      status: 'In Active Development',
      timeline: 'Q2 2026',
      desc: 'Company portal requirement selector (4-6 modules limit), configuration agreement signature modal, V1 lock enforcement, and subscription change request workflow.',
      highlights: ['4-6 Requirement Validation', 'Configuration Agreement Signature', 'V1/V2 Version Binding'],
    },
    {
      num: '03',
      title: 'Phase 3: Admin Role Equivalency & Taxonomy Governance',
      status: 'In Active Development',
      timeline: 'Q2 2026',
      desc: 'Admin portal for managing canonical role taxonomy, skill aliases, and reviewing AI-suggested role equivalency mappings.',
      highlights: ['Canonical Role Taxonomy', 'AI-Suggested Equivalencies', 'Admin Confirmation Workflow'],
    },
    {
      num: '04',
      title: 'Phase 4: Candidate Career Intelligence & Skill Gap Engine',
      status: 'Planned',
      timeline: 'Q3 2026',
      desc: 'Candidate Market Readiness Score (0-100%), component competency breakdown, skill gap severity analysis, and targeted learning recommendations.',
      highlights: ['Readiness Score Gauge', 'Skill Gap Severity Analysis', 'Actionable Learning Paths'],
    },
    {
      num: '05',
      title: 'Phase 5: Institutional Campus Governance & Cohort Analytics',
      status: 'Planned',
      timeline: 'Q4 2026',
      desc: 'Placement officer dashboard, bulk student verification, cohort skill benchmark analytics, and campus recruitment drive management.',
      highlights: ['Campus Dashboard', 'Cohort Skill Analytics', 'Placement Drive Management'],
    },
    {
      num: '06',
      title: 'Phase 6: Multi-Tenant Enterprise API & ATS Integrations',
      status: 'Planned',
      timeline: 'Q1 2027',
      desc: 'Native webhooks and REST integrations for Greenhouse, Lever, Workday, and SAP SuccessFactors.',
      highlights: ['Greenhouse / Lever Webhooks', 'Workday Integration', 'Automated Scorecard Sync'],
    },
    {
      num: '07',
      title: 'Phase 7: Global Multilingual Assessment Expansion',
      status: 'Planned',
      timeline: 'Q2 2027',
      desc: 'SVAR verbal communication support for Spanish, German, Japanese, Tamil, Hindi, and Mandarin.',
      highlights: ['Global Accent Robustness', 'Multilingual SVAR', 'International Certification'],
    },
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Roadmap</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Platform Vision &amp; Roadmap
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Our multi-phase engineering milestones for building the global standard for role-aware recruitment intelligence.
          </p>
        </div>

        <div className="space-y-4">
          {phases.map((phase) => {
            const isActive = phase.status === 'In Active Development';
            return (
              <div
                key={phase.num}
                className={`bg-slate-900 border rounded-3xl p-6 sm:p-8 shadow-xl transition-all ${
                  isActive ? 'border-indigo-500/40 ring-1 ring-indigo-500/20' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                      {phase.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">{phase.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {phase.timeline}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isActive
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {phase.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">{phase.desc}</p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                  {phase.highlights.map((h) => (
                    <span key={h} className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-2.5 py-0.5 rounded-lg border border-slate-700/60">
                      • {h}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

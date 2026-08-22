import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Building2, Cpu, CheckCircle2, FileCheck, Scale, Lock, ArrowRight } from 'lucide-react';
import { OrientationHeader } from '../components/orientation/OrientationHeader';
import { OrientationFooter } from '../components/orientation/OrientationFooter';

export default function AgreementsPage() {
  const [activeRole, setActiveRole] = useState<'candidate' | 'company' | 'admin'>('candidate');

  const agreements = {
    candidate: {
      title: 'Candidate Participation & Honor Code',
      badge: 'Candidate Role',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: UserCheck,
      iconColor: 'text-indigo-600 bg-indigo-50',
      summary: 'Binding commitment to authentic identity verification, fair test execution, and score reuse across target companies.',
      clauses: [
        {
          num: '01',
          heading: 'Authentic Identity & Anti-Proxy Undertaking',
          text: 'Candidates agree to complete all proctored test modules in person. Biometric facial recognition and audio verification confirm that the registered candidate remains the sole test-taker.',
        },
        {
          num: '02',
          heading: 'Score Portability & 12-Month Reuse Rights',
          text: 'Completed evaluations produce an authenticated scorecard valid for 12 months. Candidates retain ownership and choose which partner employers receive their results.',
        },
        {
          num: '03',
          heading: 'Environment Integrity & 30-Day Retest Cooldown',
          text: 'No secondary individuals, mobile devices, audio whispering, or unauthorized tab switching are permitted during testing. A mandatory 30-day cooldown applies before retesting.',
        },
        {
          num: '04',
          heading: 'Explicit Data Consent & Access Control',
          text: 'Candidate credentials, resumes, and evaluation telemetry are shared strictly with company roles chosen explicitly by the candidate. Data is never sold to recruiters or brokers.',
        },
      ],
    },
    company: {
      title: 'Employer Partner Operating Agreement',
      badge: 'Employer Partner',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Building2,
      iconColor: 'text-emerald-600 bg-emerald-50',
      summary: 'Operational agreement governing 4–6 requirement module locking, score recognition without re-takes, and confidential candidate data handling.',
      clauses: [
        {
          num: '01',
          heading: 'Requirement Module Configuration Locking',
          text: 'Employers configure and lock 4 to 6 required assessment modules per job role before publishing opportunities. Once candidates begin evaluations, requirements remain version-locked.',
        },
        {
          num: '02',
          heading: 'Scorecard Recognition & Re-take Elimination',
          text: 'Partner employers agree to accept verified GenuAI scorecards for identical module requirements without forcing candidates to retake tests for separate applications.',
        },
        {
          num: '03',
          heading: 'Evidentiary Proctoring Log Access',
          text: 'Recruiters receive timestamped proctoring logs and trust indices strictly as evidentiary aids to support human hiring decisions, avoiding automated disqualifications.',
        },
        {
          num: '04',
          heading: 'Confidential Candidate Data Protection',
          text: 'Employer partners agree not to leak, export, or broadcast candidate scorecards or resumes to unverified external agencies or third-party databases.',
        },
      ],
    },
    admin: {
      title: 'Institution & Platform Governance Agreement',
      badge: 'Placement & Admin',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Cpu,
      iconColor: 'text-purple-600 bg-purple-50',
      summary: 'Governance framework for placement officers and platform admins regarding cohort skill analytics, taxonomy mapping, and human appeal auditing.',
      clauses: [
        {
          num: '01',
          heading: 'Cohort Skill Gap & Benchmark Governance',
          text: 'Placement officers access aggregated student cohort skill benchmarks to identify curriculum gaps, guide placement drives, and track institutional readiness.',
        },
        {
          num: '02',
          heading: 'Standardized Role Taxonomy Alignment',
          text: 'Administrators maintain canonical role definitions and skill alias mappings, ensuring consistent requirement aggregation across all participating employers.',
        },
        {
          num: '03',
          heading: 'Human Audit Panel for Candidate Appeals',
          text: 'Flagged proctoring sessions resulting from network drops or environmental anomalies are audited by an independent human review panel within 5 business days.',
        },
        {
          num: '04',
          heading: 'Algorithmic Fairness & Bias Monitoring',
          text: 'Platform administrators oversee routine quarterly disparity audits to ensure evaluation models maintain strict neutrality across demographics and regional accents.',
        },
      ],
    },
  };

  const current = agreements[activeRole];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans pb-16">
      {/* Step 7 Orientation Header */}
      <OrientationHeader currentStep={7} title="Role Agreements" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200/80">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Step 7 of 7 • Final Operational Sign-off</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Platform Role Agreements
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Operational commitments for Candidates, Employer Partners, and Placement Administrators to ensure transparent, fair, and proctored recruitment.
          </p>
        </div>

        {/* 3 Role Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveRole('candidate')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              activeRole === 'candidate'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              activeRole === 'candidate' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">1. Candidate Agreement</div>
              <div className={`text-[10px] font-medium ${activeRole === 'candidate' ? 'text-indigo-100' : 'text-slate-500'}`}>
                Honor code &amp; score reuse
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveRole('company')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              activeRole === 'company'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              activeRole === 'company' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">2. Employer Agreement</div>
              <div className={`text-[10px] font-medium ${activeRole === 'company' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Module locking &amp; score acceptance
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              activeRole === 'admin'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              activeRole === 'admin' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">3. Campus &amp; Admin Agreement</div>
              <div className={`text-[10px] font-medium ${activeRole === 'admin' ? 'text-purple-100' : 'text-slate-500'}`}>
                Cohort analytics &amp; governance
              </div>
            </div>
          </button>
        </div>

        {/* Selected Role Agreement Card Panel */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${current.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${current.badgeColor}`}>
                  {current.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{current.title}</h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real-Time Operational Commitment</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium leading-relaxed">
            {current.summary}
          </div>

          {/* 4 Clauses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {current.clauses.map((clause) => (
              <div key={clause.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600">Clause {clause.num}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">{clause.heading}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">{clause.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Orientation Consent Footer - Final Step redirects to /auth */}
        <OrientationFooter
          currentStep={6}
          pageTitle="Role Agreements"
          nextPath="/auth"
          nextTitle="Complete Orientation & Sign In"
        />
      </div>
    </div>
  );
}

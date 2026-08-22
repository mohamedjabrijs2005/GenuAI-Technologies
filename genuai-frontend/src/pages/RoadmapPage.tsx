import React, { useState } from 'react';
import { Sparkles, UserCheck, Building2, Cpu, CheckCircle2, ArrowRight, Calendar, Target, Award, Rocket } from 'lucide-react';
import { OrientationHeader } from '../components/orientation/OrientationHeader';
import { OrientationFooter } from '../components/orientation/OrientationFooter';

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<'candidate' | 'company' | 'admin'>('candidate');

  const roadmaps = {
    candidate: {
      roleTitle: 'Candidate Career Journey Roadmap',
      badge: 'Candidate Path',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: UserCheck,
      iconColor: 'text-indigo-600 bg-indigo-50',
      description: 'Your 4-phase journey from selecting target companies to receiving verified match scorecards accepted across all partner employers.',
      phases: [
        {
          phase: 'Phase 01',
          title: 'Target Company & Role Selection',
          timeline: 'Immediate / Initial Onboarding',
          status: 'Active Feature',
          details: 'Select target companies (e.g. Google, Microsoft, Zoho) and target engineering roles to generate an aggregated, single-assessment evaluation path.',
          highlights: ['Target Company Selector', 'Dynamic Module Aggregation', 'Zero Redundant Testing'],
        },
        {
          phase: 'Phase 02',
          title: 'Unified Proctored Evaluation Session',
          timeline: 'Schedule at Candidate Convenience',
          status: 'Active Feature',
          details: 'Complete one official evaluation covering coding IDE compiler tasks, verbal fluency, and technical problem-solving with real-time biometric proctoring.',
          highlights: ['Proctored IDE Compiler', 'Verbal Fluency Engine', 'Biometric Verification'],
        },
        {
          phase: 'Phase 03',
          title: 'Verified Scorecard Generation & 12-Month Reuse',
          timeline: 'Post-Evaluation Verification',
          status: 'Active Feature',
          details: 'Receive an authenticated talent credential valid for 12 months. Instantly reuse scores across newly added partner employer job openings.',
          highlights: ['12-Month Scorecard Validity', 'Multi-Company Score Reuse', 'Candidate Consent Privacy'],
        },
        {
          phase: 'Phase 04',
          title: 'Direct Interview Dispatch & Career Growth',
          timeline: 'Ongoing Recruiter Alignment',
          status: 'Active Rollout',
          details: 'Recruiters inspect your verified scorecard and anomaly logs for direct interview shortlisting without preliminary screening calls.',
          highlights: ['Direct Interview Invitations', 'Explainable Match Scoring', 'Career Progress Tracker'],
        },
      ],
    },
    company: {
      roleTitle: 'Employer Hiring & Integration Roadmap',
      badge: 'Employer Partner',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Building2,
      iconColor: 'text-emerald-600 bg-emerald-50',
      description: 'The 4-phase employer workflow for configuring 4–6 requirement modules, locking role versions, and accessing authenticated candidate pipelines.',
      phases: [
        {
          phase: 'Phase 01',
          title: 'Requirement Module Configuration & Locking',
          timeline: 'Role Creation Stage',
          status: 'Active Feature',
          details: 'Configure 4 to 6 required skill modules per job description and lock configuration versions to establish clear scoring rubrics.',
          highlights: ['4-6 Module Selector', 'Version Binding (V1/V2)', 'Requirement Locking'],
        },
        {
          phase: 'Phase 02',
          title: 'Automated Candidate Match Score Calculation',
          timeline: 'Real-Time Pipeline Sync',
          status: 'Active Feature',
          details: 'Ingest candidate verified scorecards and compute role-specific match indices based on locked company requirements.',
          highlights: ['Role-Specific Match Index', 'Transparent Skill Percentiles', 'Automated Candidate Ranking'],
        },
        {
          phase: 'Phase 03',
          title: 'Evidentiary Proctoring Log Auditing',
          timeline: 'Shortlist Verification Stage',
          status: 'Active Feature',
          details: 'Inspect timestamped session anomaly logs and biometric trust reports to ensure fair, human-guided candidate shortlisting.',
          highlights: ['Timestamped Anomaly Auditing', 'Human-in-the-Loop Review', 'Evidentiary Fraud Prevention'],
        },
        {
          phase: 'Phase 04',
          title: 'Enterprise ATS & Webhook Sync Integration',
          timeline: 'Q3 2026 Rollout',
          status: 'In Development',
          details: 'Automated bi-directional sync with Greenhouse, Lever, Workday, and SAP SuccessFactors for seamless recruitment ops.',
          highlights: ['ATS Webhook Sync', 'Greenhouse & Lever Integration', 'Automated Scorecard Export'],
        },
      ],
    },
    admin: {
      roleTitle: 'Campus & Institutional Governance Roadmap',
      badge: 'Campus Placement & Admin',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Cpu,
      iconColor: 'text-purple-600 bg-purple-50',
      description: 'Campus placement officer dashboard milestones for cohort skill analytics, institutional benchmarks, and bias-free evaluation monitoring.',
      phases: [
        {
          phase: 'Phase 01',
          title: 'Bulk Student Onboarding & Verification',
          timeline: 'Campus Drive Onboarding',
          status: 'Active Feature',
          details: 'Onboard entire student cohorts with verified academic credentials and schedule campus-wide proctored assessment drives.',
          highlights: ['Bulk Candidate Enrollment', 'Campus Verification Badges', 'Scheduled Assessment Drives'],
        },
        {
          phase: 'Phase 02',
          title: 'Real-Time Cohort Skill-Gap Analytics',
          timeline: 'Placement Preparation Stage',
          status: 'Active Feature',
          details: 'Placement officers view real-time analytics comparing student cohort competencies against current employer requirement baselines.',
          highlights: ['Skill-Gap Heatmaps', 'Employer Baseline Benchmark', 'Curriculum Insight Reports'],
        },
        {
          phase: 'Phase 03',
          title: 'Institutional Placement Drive Governance',
          timeline: 'Campus Hiring Drive Stage',
          status: 'Active Feature',
          details: 'Track student shortlisting progress across partner employers and manage institutional placement metrics with full governance oversight.',
          highlights: ['Placement Officer Dashboard', 'Shortlist Funnel Tracking', 'Verified Credentials Registry'],
        },
        {
          phase: 'Phase 04',
          title: 'Demographic Disparity & Bias Auditing',
          timeline: 'Quarterly Audit Cycle',
          status: 'Active Rollout',
          details: 'Conduct routine statistical audits to verify evaluation neutrality across gender, regional accents, and institutional backgrounds.',
          highlights: ['Quarterly Bias Audits', 'Dialect Neutrality Checks', 'Demographic Parity Reporting'],
        },
      ],
    },
  };

  const current = roadmaps[activeTab];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans pb-16">
      {/* Step 4 Orientation Header */}
      <OrientationHeader currentStep={4} title="Product Roadmap" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 4 of 6 • Role-Aware Product Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Ecosystem Product Roadmap
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Tailored 4-phase execution milestones for Candidates, Employer Partners, and Campus Placement Officers.
          </p>
        </div>

        {/* 3 Role Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('candidate')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'candidate'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              activeTab === 'candidate' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">1. Candidate Roadmap</div>
              <div className={`text-[10px] font-medium ${activeTab === 'candidate' ? 'text-indigo-100' : 'text-slate-500'}`}>
                Assessment &amp; score reuse path
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('company')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'company'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              activeTab === 'company' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">2. Employer Roadmap</div>
              <div className={`text-[10px] font-medium ${activeTab === 'company' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Module locking &amp; ATS sync
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              activeTab === 'admin' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">3. Campus &amp; Admin Roadmap</div>
              <div className={`text-[10px] font-medium ${activeTab === 'admin' ? 'text-purple-100' : 'text-slate-500'}`}>
                Cohort analytics &amp; governance
              </div>
            </div>
          </button>
        </div>

        {/* Selected Roadmap Timeline Container */}
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
                <h3 className="text-xl font-bold text-slate-900 mt-1">{current.roleTitle}</h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80 shrink-0">
              <Rocket className="w-3.5 h-3.5" />
              <span>Usable Execution Milestones</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            {current.description}
          </p>

          {/* 4 Phases Timeline Grid */}
          <div className="space-y-4">
            {current.phases.map((p) => (
              <div key={p.phase} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {p.phase}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {p.timeline}
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                      {p.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{p.details}</p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                  {p.highlights.map((h) => (
                    <span key={h} className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      • {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orientation Consent Footer */}
        <OrientationFooter
          currentStep={4}
          pageTitle="Product Roadmap"
          nextPath="/security"
          nextTitle="Step 5: Security Center"
        />
      </div>
    </div>
  );
}

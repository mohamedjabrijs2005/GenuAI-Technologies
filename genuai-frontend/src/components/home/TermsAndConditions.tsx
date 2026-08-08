import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Scale, AlertTriangle, Eye, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    {
      id: 'portability',
      title: '01. Assessment Portability & Score Validity',
      icon: RefreshCw,
      summary: 'Candidates complete one unified official evaluation; the resulting authenticated scorecard remains valid for 12 months across all selected partner employers.',
      details: [
        'A single completed GenuAI Official Assessment creates a verifiable talent credential valid for 12 calendar months from the completion timestamp.',
        'Candidates maintain full ownership of their assessment results and can choose which participating companies receive their standardized scores.',
        'Retesting policies enforce a mandatory 30-day cooldown between official full-cycle attempts to prevent memorization and ensure authentic skill measurement.',
        'Participating employers agree to recognize standardized GenuAI scorecards without requiring redundant preliminary aptitude or coding screening.',
      ],
    },
    {
      id: 'consent',
      title: '02. Multi-Company Consent & Data Distribution',
      icon: UserCheck,
      summary: 'Candidate data is dispatched strictly based on explicit user selection before or after testing; no blind distribution to unauthorized third parties.',
      details: [
        'Before commencing an assessment, candidates explicitly select their target companies (e.g., Google, Microsoft, Zoho, etc.).',
        'Assessment telemetry, including coding scores, SVAR verbal fluency, group discussion ratings, and ATS resume matches, is only shared with verified recipient companies.',
        'No candidate credentials, resumes, or contact details are ever sold, rented, or broadcast to unverified recruiters or third-party marketing brokers.',
        'Candidates may revoke company access or download their cryptographic evaluation summary at any time from their personal dashboard.',
      ],
    },
    {
      id: 'proctoring',
      title: '03. Anti-Cheating & Biometric Proctoring Rules',
      icon: AlertTriangle,
      summary: 'Strict zero-tolerance policy against proxy test-takers, second-person whispering, unauthorized phones, and external unproctored AI assistance.',
      details: [
        'Mandatory camera, microphone, and browser focus permissions are required for the entire duration of all official test modules.',
        'Continuous biometric face recognition and voice timbre verification confirm that the registered applicant is the sole individual present.',
        'Detection of secondary persons in the camera frame, mobile phone screen reflections, unauthorized tab switching, or external audio whispering triggers immediate integrity warnings.',
        'Severe integrity violations result in immediate test termination, scorecard invalidation, and a 6-month platform suspension across all employer networks.',
      ],
    },
    {
      id: 'trust-score',
      title: '04. AI Trust Score & Evidentiary Standard',
      icon: ShieldCheck,
      summary: 'The AI Trust Score is an aggregated evidentiary metric designed to assist human recruiters in evaluating test authenticity objectively.',
      details: [
        'The AI Trust Score combines facial landmark consistency, audio baseline match, eye-gaze tracking, and environment stability into a percentage index.',
        'GenuAI explicitly designates the AI Trust Score as an evidentiary aid; it is not advertised as a 100% infallible fraud detection guarantee.',
        'Recruiters review timestamped anomaly logs before making final employment determinations to ensure fairness and prevent false positives.',
        'Biometric vectors are encrypted at rest using AES-256 and processed in compliance with global ethical AI guidelines.',
      ],
    },
    {
      id: 'privacy',
      title: '05. Candidate Privacy, DPDP & GDPR Compliance',
      icon: Lock,
      summary: 'Comprehensive candidate data rights under DPDP 2023, GDPR, and international data protection laws with explicit retention lifecycles.',
      details: [
        'Candidates have the fundamental right to request complete data deletion, export their assessment JSON scorecard, and inspect proctoring logs.',
        'Raw audio/video session recordings are permanently purged 90 days after assessment completion; only cryptographic verification digests and scorecards are preserved.',
        'GenuAI does not process biometric data for advertising, social profiling, or unauthorized background surveillance.',
        'All data storage is hosted in ISO 27001-certified, SOC-2 compliant data centers with end-to-end transport encryption (TLS 1.3).',
      ],
    },
    {
      id: 'non-discrimination',
      title: '06. Non-Discrimination & Algorithmic Fairness',
      icon: Scale,
      summary: 'Algorithmic models are continuously audited against gender, ethnic, dialectal, and institutional pedigree bias.',
      details: [
        'SVAR speech recognition and AI interview models are trained across diverse regional and international accents to eliminate linguistic penalization.',
        'College brand, geography, and gender are completely decoupled from core skill percentiles in initial automated screening rounds.',
        'Routine bias audits and disparity tests are conducted every quarter to maintain statistical fairness across demographic cohorts.',
        'Recruiters receive standardized scoring rubrics calibrated strictly against verifiable technical and problem-solving benchmarks.',
      ],
    },
    {
      id: 'appeals',
      title: '07. Score Review & Candidate Appeal Procedure',
      icon: FileText,
      summary: 'Candidates retain the legal right to contest flagged proctoring warnings and request a certified human review within 14 business days.',
      details: [
        'If a session is flagged for environment anomalies due to technical hardware glitches or network drops, candidates can file an official appeal within 14 days.',
        'An independent human audit panel reviews the encrypted proctoring logs and code submission timestamps within 5 business days.',
        'Legitimate appeals resulting from connectivity interruptions entitle the candidate to an expedited proctored re-assessment at zero additional fee.',
        'Final arbitration outcomes are documented transparently with clear rationale provided in the candidate portal.',
      ],
    },
    {
      id: 'ip',
      title: '08. Intellectual Property & Assessment Copyright',
      icon: Eye,
      summary: 'All question banks, SVAR speech models, compiler architectures, and scoring algorithms are proprietary assets of GenuAI Technologies.',
      details: [
        'Candidates are strictly prohibited from screen-recording, scraping, publishing, or sharing proprietary GenuAI test questions and coding prompts.',
        'Code written by candidates during project challenges remains the intellectual property of the author, subject to evaluation licensing by prospective employers.',
        'Violations involving commercial leakage of test materials will be prosecuted under applicable digital intellectual property laws.',
        'By participating, candidates and companies agree to abide by all platform terms and institutional guidelines.',
      ],
    },
  ];

  return (
    <section id="terms-and-conditions" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <Scale className="w-3.5 h-3.5" />
            <span>Platform Governance &amp; Compliance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Terms &amp; Conditions Applied Concepts
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Our legal, operational, and ethical framework guarantees assessment integrity, candidate data protection, multi-company scorecard portability, and non-discriminatory hiring standards.
          </p>
        </div>

        {/* 8-Tab Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(idx)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-indigo-brand text-white border-indigo-brand shadow-md scale-[1.02]'
                    : 'bg-surface border-surface-container text-on-surface hover:bg-surface-bright'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-brand/10 text-indigo-brand'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold leading-tight truncate">
                  {sec.title.split('. ')[1]}
                </div>
                <div className={`text-[9px] font-mono mt-1 ${isActive ? 'text-indigo-100' : 'text-on-surface-variant'}`}>
                  0{idx + 1}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Policy Deep-Dive Panel */}
        <div className="glass rounded-3xl p-6 sm:p-10 border border-surface-container shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-container/60 mb-6">
            <div>
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider mb-1">
                Official Platform Policy • Section 0{activeTab + 1}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
                {sections[activeTab].title}
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success-dark text-xs font-bold border border-success/20 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Legally Binding Policy</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-surface-bright border border-surface-container mb-6 text-sm text-on-surface font-medium leading-relaxed">
            {sections[activeTab].summary}
          </div>

          {/* Detailed Clauses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections[activeTab].details.map((clause, i) => (
              <div key={i} className="p-4 rounded-2xl bg-surface border border-surface-container flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {clause}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Compliance Guarantee Banner */}
          <div className="mt-8 pt-6 border-t border-surface-container/60 flex flex-wrap items-center justify-between gap-4 text-[11px] text-on-surface-variant">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>GenuAI Trust Framework • Continuous Audit &amp; Fair Recruitment Standard</span>
            </div>
            <div className="font-mono text-indigo-brand font-semibold">
              Doc Ref: GENUAI-TOS-2026-V2.1
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

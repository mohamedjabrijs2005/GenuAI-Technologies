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
        'The Trust Score operates as an evidentiary decision-support tool for recruiters and does not replace final human employer hiring discretion.',
        'Recruiters receive a multi-signal audit log rather than raw unindexed video files, ensuring compliance and unbiased review.',
        'Platform algorithms are continually audited to minimize false positive triggers caused by ambient lighting or domestic background noises.',
      ],
    },
    {
      id: 'privacy',
      title: '05. Privacy, Cryptography & DPDP / GDPR Compliance',
      icon: Lock,
      summary: 'Enterprise-grade encryption at rest and in transit; biometric embeddings are cryptographically hashed and never stored as raw unencrypted video.',
      details: [
        'All candidate video feeds, code submissions, and personal records are encrypted with AES-256 at rest and TLS 1.3 in transit.',
        'Biometric verification vectors are stored as non-reversible mathematical facial and vocal embeddings rather than raw media.',
        'Full compliance with the Digital Personal Data Protection (DPDP) Act and GDPR standards, including candidate rights to data portability and deletion.',
        'Data access logs are cryptographically hashed on Supabase PostgreSQL with strict Row-Level Security (RLS) enforcement.',
      ],
    },
    {
      id: 'equality',
      title: '06. Non-Discrimination & Equal Opportunity Clause',
      icon: Scale,
      summary: '100% merit-first evaluation standard eliminating human subjective bias based on gender, ethnicity, geography, or academic pedigree.',
      details: [
        'Assessments evaluate pure algorithmic logic, technical system design, verbal fluency, and problem-solving without demographic bias.',
        'Blind screening options allow employers to evaluate verified skill matrices prior to viewing applicant names or photographs.',
        'Participating companies agree to uphold fair employment standards and evaluate candidates strictly on authenticated merit and demonstrated competencies.',
        'Disability accommodations and alternative testing modalities can be requested through institutional placement coordinators.',
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
    <section id="terms" className="py-20 sm:py-24 lg:py-32 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-brand/20">
            <Scale className="w-3.5 h-3.5" />
            <span>Platform Governance &amp; Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            Terms &amp; Conditions Applied Concepts
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Our legal, operational, and ethical framework guarantees assessment integrity, candidate data protection, multi-company scorecard portability, and non-discriminatory hiring standards.
          </p>
        </div>

        {/* Tab Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(idx)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-brand text-white border-indigo-brand shadow-md scale-105'
                    : 'bg-surface border-surface-container text-on-surface-variant hover:border-indigo-brand/40 hover:text-on-surface'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-indigo-brand'}`} />
                <span className="text-[11px] font-bold leading-snug line-clamp-1">
                  Section 0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Policy Card View */}
        <div className="glass rounded-3xl p-8 sm:p-12 border border-surface-container shadow-xl mb-12 animate-[fadeIn_0.3s_ease]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-container pb-6 mb-8">
            <div>
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-widest mb-1">
                Official Platform Policy · Active Governance Standard
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-on-surface">
                {sections[activeTab].title}
              </h3>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-success/10 text-success-dark text-xs font-bold border border-success/30 shrink-0">
              Legally Binding &amp; Verified ✓
            </span>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-indigo-brand/5 border border-indigo-brand/20 text-xs sm:text-sm font-semibold text-on-surface mb-8">
            💡 <strong>Core Principle:</strong> {sections[activeTab].summary}
          </div>

          {/* Clauses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections[activeTab].details.map((clause, i) => (
              <div key={i} className="p-5 rounded-2xl bg-surface border border-surface-container flex items-start gap-3.5 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {clause}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Agreement Banner */}
          <div className="mt-8 pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-indigo-brand shrink-0" />
              <span>Governed under International Data Protection &amp; Academic Integrity Standards</span>
            </div>
            <div className="text-[11px] font-mono text-on-surface-variant/70">
              Last Updated: August 2026 · Version 3.4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

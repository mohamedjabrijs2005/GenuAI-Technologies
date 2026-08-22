import React from 'react';
import {
  ShieldCheck, FileText, Lock, Scale, AlertTriangle,
  Eye, RefreshCw, UserCheck, CheckCircle2
} from 'lucide-react';
import { OrientationHeader } from '../components/orientation/OrientationHeader';
import { OrientationFooter } from '../components/orientation/OrientationFooter';

export default function TermsPage() {
  const sections = [
    {
      num: '01',
      title: 'Assessment Portability & Score Validity',
      icon: RefreshCw,
      badge: 'Score Portability',
      summary: 'Candidates complete one unified official evaluation; the resulting authenticated scorecard remains valid for 12 months across all selected partner employers.',
      details: [
        'A single completed GenuAI Official Assessment creates a verifiable talent credential valid for 12 calendar months from the completion timestamp.',
        'Candidates maintain full ownership of their assessment results and can choose which participating companies receive their scores.',
        'Retesting policies enforce a mandatory 30-day cooldown between official full-cycle attempts to prevent memorization and ensure authentic skill measurement.',
        'Employers who join the GenuAI partner network agree to recognize verified results for the specific skills they configured and locked, without requiring candidate re-takes.',
      ],
    },
    {
      num: '02',
      title: 'Multi-Company Consent & Data Distribution',
      icon: UserCheck,
      badge: 'Data Control',
      summary: 'Candidate data is dispatched strictly based on explicit user selection before or after testing; no blind distribution to unauthorized third parties.',
      details: [
        'Before commencing an assessment, candidates explicitly select their target companies (e.g., Google, Apple, Zoho).',
        'Assessment telemetry, including coding scores, SVAR verbal fluency, group discussion ratings, and ATS resume matches, is only shared with verified recipient companies.',
        'No candidate credentials, resumes, or contact details are ever sold, rented, or broadcast to unverified recruiters or third-party marketing brokers.',
        'Candidates may revoke company access or download their evaluation summary at any time directly from their personal dashboard.',
      ],
    },
    {
      num: '03',
      title: 'Anti-Cheating & Biometric Proctoring Rules',
      icon: AlertTriangle,
      badge: 'Test Integrity',
      summary: 'Strict zero-tolerance policy against proxy test-takers, second-person whispering, unauthorized phones, and external unproctored AI assistance.',
      details: [
        'Mandatory camera, microphone, and browser focus permissions are required for the entire duration of all official test modules.',
        'Continuous biometric face recognition and voice timbre verification confirm that the registered applicant is the sole individual present.',
        'Detection of secondary persons in the camera frame, mobile phone screen reflections, unauthorized tab switching, or external audio whispering triggers immediate integrity warnings.',
        'Severe integrity violations result in immediate test termination, scorecard invalidation, and a 6-month platform suspension across all employer networks.',
      ],
    },
    {
      num: '04',
      title: 'AI Trust Score & Evidentiary Standard',
      icon: ShieldCheck,
      badge: 'Evidentiary Standard',
      summary: 'The AI Trust Score is an aggregated evidentiary metric designed to assist human recruiters in evaluating test authenticity objectively.',
      details: [
        'The AI Trust Score combines facial landmark consistency, audio baseline match, eye-gaze tracking, and environment stability into a percentage index.',
        'GenuAI explicitly designates the AI Trust Score as an evidentiary aid; it is not advertised as a 100% infallible fraud detection guarantee.',
        'Recruiters review timestamped anomaly logs before making final employment determinations to ensure fairness and prevent false positives.',
        'Biometric vectors are encrypted at rest using AES-256 and processed in compliance with global ethical AI guidelines.',
      ],
    },
    {
      num: '05',
      title: 'Candidate Privacy, DPDP & GDPR Compliance',
      icon: Lock,
      badge: 'Privacy Compliance',
      summary: 'Comprehensive candidate data rights under DPDP 2023, GDPR, and international data protection laws with explicit retention lifecycles.',
      details: [
        'Candidates have the fundamental right to request complete data deletion, export their assessment JSON scorecard, and inspect proctoring logs.',
        'Raw audio/video session recordings are permanently purged 90 days after assessment completion; only cryptographic verification digests and scorecards are preserved.',
        'GenuAI does not process biometric data for advertising, social profiling, or unauthorized background surveillance.',
        'All data storage is hosted in ISO 27001-certified, SOC-2 compliant data centers with end-to-end transport encryption (TLS 1.3).',
      ],
    },
    {
      num: '06',
      title: 'Non-Discrimination & Algorithmic Fairness',
      icon: Scale,
      badge: 'Algorithmic Fairness',
      summary: 'Algorithmic models are continuously audited against gender, ethnic, dialectal, and institutional pedigree bias.',
      details: [
        'SVAR speech recognition and AI interview models are trained across diverse regional and international accents to eliminate linguistic penalization.',
        'College brand, geography, and gender are completely decoupled from core skill percentiles in initial automated screening rounds.',
        'Routine bias audits and disparity tests are conducted every quarter to maintain statistical fairness across demographic cohorts.',
        'Recruiters receive scoring rubrics calibrated strictly against verifiable technical and problem-solving benchmarks.',
      ],
    },
    {
      num: '07',
      title: 'Score Review & Candidate Appeal Procedure',
      icon: FileText,
      badge: 'Appeal Rights',
      summary: 'Candidates retain the legal right to contest flagged proctoring warnings and request a certified human review within 14 business days.',
      details: [
        'If a session is flagged for environment anomalies due to technical system anomalies or network drops, candidates can file an official appeal within 14 days.',
        'An independent human audit panel reviews the encrypted proctoring logs and code submission timestamps within 5 business days.',
        'Legitimate appeals resulting from connectivity interruptions entitle the candidate to an expedited proctored re-assessment at zero additional fee.',
        'Final arbitration outcomes are documented transparently with clear rationale provided in the candidate portal.',
      ],
    },
    {
      num: '08',
      title: 'Intellectual Property & Assessment Copyright',
      icon: Eye,
      badge: 'Proprietary IP',
      summary: 'All question banks, SVAR speech models, compiler architectures, and scoring algorithms are proprietary assets of GenuAI Technologies.',
      details: [
        'Candidates are strictly prohibited from screen-recording, scraping, publishing, or sharing proprietary GenuAI test questions and coding prompts.',
        'Code written by candidates during project challenges remains the intellectual property of the author, subject to evaluation licensing by prospective employers.',
        'Violations involving commercial leakage of test materials will be prosecuted under applicable digital intellectual property laws.',
        'By participating, candidates and companies agree to abide by all ecosystem terms and institutional guidelines.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans pb-16">
      {/* Step 1 Orientation Header */}
      <OrientationHeader currentStep={1} title="Terms & Conditions" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 space-y-10">
        {/* Page Title & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200/80 shadow-2xs">
            <Scale className="w-4 h-4" />
            <span>Platform Governance &amp; Operational Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Our operational framework guarantees score portability, candidate consent, biometric proctoring rules, and non-discriminatory hiring standards.
          </p>
        </div>

        {/* 8 Clean Document Section Cards */}
        <div className="space-y-6">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.num}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">Section {sec.num}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {sec.badge}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{sec.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Summary Highlight Box */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-800 font-medium leading-relaxed">
                  {sec.summary}
                </div>

                {/* Detailed Clauses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {sec.details.map((clause, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">{clause}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Guided Orientation Step 1 Consent Footer */}
        <OrientationFooter
          currentStep={1}
          pageTitle="Terms & Conditions"
          nextPath="/privacy"
          nextTitle="Privacy Policy"
        />
      </div>
    </div>
  );
}

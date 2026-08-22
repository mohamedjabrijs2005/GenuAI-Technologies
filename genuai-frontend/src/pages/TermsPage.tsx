import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Scale, AlertTriangle, Eye, RefreshCw, CheckCircle2, UserCheck, ChevronRight } from 'lucide-react';
import { OrientationHeader } from '../components/orientation/OrientationHeader';
import { OrientationFooter } from '../components/orientation/OrientationFooter';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('portability');

  const sections = [
    {
      id: 'portability',
      num: '01',
      title: 'Assessment Portability & Score Validity',
      icon: RefreshCw,
      summary: 'Candidates complete one unified official evaluation; the resulting authenticated scorecard remains valid for 12 months across all selected partner employers.',
      details: [
        'A single completed GenuAI Official Assessment creates a verifiable talent credential valid for 12 calendar months from the completion timestamp.',
        'Candidates maintain full ownership of their assessment results and can choose which participating companies receive their scores.',
        'Retesting policies enforce a mandatory 30-day cooldown between official full-cycle attempts to prevent memorization and ensure authentic skill measurement.',
        'Employers who join the GenuAI partner network agree to recognize verified results for the specific skills they configured and locked, without requiring the candidate to retake those same skills for another participating employer\'s identical requirement.',
      ],
    },
    {
      id: 'consent',
      num: '02',
      title: 'Multi-Company Consent & Data Distribution',
      icon: UserCheck,
      summary: 'Candidate data is dispatched strictly based on explicit user selection before or after testing; no blind distribution to unauthorized third parties.',
      details: [
        'Before commencing an assessment, candidates explicitly select their target companies (e.g., Google, Apple, Zoho, etc.).',
        'Assessment telemetry, including coding scores, SVAR verbal fluency, group discussion ratings, and ATS resume matches, is only shared with verified recipient companies.',
        'No candidate credentials, resumes, or contact details are ever sold, rented, or broadcast to unverified recruiters or third-party marketing brokers.',
        'Candidates may revoke company access or download their evaluation summary at any time from their personal dashboard.',
      ],
    },
    {
      id: 'proctoring',
      num: '03',
      title: 'Anti-Cheating & Biometric Proctoring Rules',
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
      num: '04',
      title: 'AI Trust Score & Evidentiary Standard',
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
      num: '05',
      title: 'Candidate Privacy, DPDP & GDPR Compliance',
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
      num: '06',
      title: 'Non-Discrimination & Algorithmic Fairness',
      icon: Scale,
      summary: 'Algorithmic models are continuously audited against gender, ethnic, dialectal, and institutional pedigree bias.',
      details: [
        'SVAR speech recognition and AI interview models are trained across diverse regional and international accents to eliminate linguistic penalization.',
        'College brand, geography, and gender are completely decoupled from core skill percentiles in initial automated screening rounds.',
        'Routine bias audits and disparity tests are conducted every quarter to maintain statistical fairness across demographic cohorts.',
        'Recruiters receive scoring rubrics calibrated strictly against verifiable technical and problem-solving benchmarks.',
      ],
    },
    {
      id: 'appeals',
      num: '07',
      title: 'Score Review & Candidate Appeal Procedure',
      icon: FileText,
      summary: 'Candidates retain the legal right to contest flagged proctoring warnings and request a certified human review within 14 business days.',
      details: [
        'If a session is flagged for environment anomalies due to technical system anomalies or network drops, candidates can file an official appeal within 14 days.',
        'An independent human audit panel reviews the encrypted proctoring logs and code submission timestamps within 5 business days.',
        'Legitimate appeals resulting from connectivity interruptions entitle the candidate to an expedited proctored re-assessment at zero additional fee.',
        'Final arbitration outcomes are documented transparently with clear rationale provided in the candidate portal.',
      ],
    },
    {
      id: 'ip',
      num: '08',
      title: 'Intellectual Property & Assessment Copyright',
      icon: Eye,
      summary: 'All question banks, SVAR speech models, compiler architectures, and scoring algorithms are proprietary assets of GenuAI Technologies.',
      details: [
        'Candidates are strictly prohibited from screen-recording, scraping, publishing, or sharing proprietary GenuAI test questions and coding prompts.',
        'Code written by candidates during project challenges remains the intellectual property of the author, subject to evaluation licensing by prospective employers.',
        'Violations involving commercial leakage of test materials will be prosecuted under applicable digital intellectual property laws.',
        'By participating, candidates and companies agree to abide by all ecosystem terms and institutional guidelines.',
      ],
    },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`terms-sec-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans pb-16">
      <OrientationHeader currentStep={1} title="Terms & Conditions" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Document Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200/80">
            <Scale className="w-3.5 h-3.5" />
            <span>Platform Governance &amp; Operating Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Terms &amp; Conditions Document
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Read through our ecosystem terms governing score portability, candidate consent, biometric proctoring, and algorithmic fairness.
          </p>
        </div>

        {/* Executive 2-Column Document Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Document Table of Contents</span>
            </div>

            <div className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isSelected = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                        : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {sec.num}
                      </span>
                      <span className="text-xs truncate">{sec.title.split('. ')[1]}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Continuous Document Flow */}
          <div className="lg:col-span-8 space-y-6">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  id={`terms-sec-${sec.id}`}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-24"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                        Section {sec.num}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 text-xs text-slate-800 font-medium leading-relaxed">
                    {sec.summary}
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {sec.details.map((clause, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/50">
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

            {/* Guided Orientation Step 1 Consent Footer */}
            <OrientationFooter
              currentStep={1}
              pageTitle="Terms & Conditions"
              nextPath="/privacy"
              nextTitle="Step 2: Privacy Policy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}



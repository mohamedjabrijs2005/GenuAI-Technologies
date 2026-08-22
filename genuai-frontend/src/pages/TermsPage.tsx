import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, FileText, Lock, Scale, AlertTriangle,
  Eye, RefreshCw, UserCheck, ChevronRight, CheckCircle2,
  ArrowRight, BookOpen
} from 'lucide-react';
import { OrientationHeader } from '../components/orientation/OrientationHeader';
import { OrientationFooter } from '../components/orientation/OrientationFooter';

const sections = [
  {
    id: 'portability',
    num: '01',
    title: 'Assessment Portability & Score Validity',
    icon: RefreshCw,
    color: 'indigo',
    summary: 'One unified assessment. Twelve months validity. Accepted across every company you target.',
    details: [
      'A single completed GenuAI Official Assessment creates a verifiable talent credential valid for 12 calendar months from the completion timestamp.',
      'Candidates maintain full ownership of their assessment results and choose which participating companies receive their scores.',
      'A mandatory 30-day cooldown between official full-cycle attempts prevents memorization and ensures authentic skill measurement.',
      'Employers in the GenuAI partner network agree to recognize verified results for the specific skills they configured and locked — no re-takes for identical requirements at other partner companies.',
    ],
  },
  {
    id: 'consent',
    num: '02',
    title: 'Multi-Company Consent & Data Distribution',
    icon: UserCheck,
    color: 'emerald',
    summary: 'Your data goes only where you explicitly send it. Zero blind distribution. Zero third-party brokers.',
    details: [
      'Before commencing an assessment, candidates explicitly select target companies (e.g., Google, Apple, Zoho).',
      'Assessment telemetry — coding scores, SVAR verbal fluency, group discussion ratings, ATS resume matches — is shared only with verified recipient companies.',
      'No credentials, resumes, or contact details are ever sold, rented, or broadcast to unverified recruiters or marketing brokers.',
      'Candidates may revoke company access or download their evaluation summary at any time from their personal dashboard.',
    ],
  },
  {
    id: 'proctoring',
    num: '03',
    title: 'Anti-Cheating & Biometric Proctoring Rules',
    icon: AlertTriangle,
    color: 'amber',
    summary: 'Zero-tolerance policy. No proxy test-takers, whispering, unauthorized phones, or external AI assistance.',
    details: [
      'Camera, microphone, and browser focus permissions are mandatory for the entire duration of all official test modules.',
      'Continuous biometric face recognition and voice timbre verification confirm the registered applicant is the sole individual present.',
      'Detection of secondary persons, mobile phone screen reflections, tab switching, or audio whispering triggers immediate integrity warnings.',
      'Severe violations result in immediate test termination, scorecard invalidation, and a 6-month platform suspension across all employer networks.',
    ],
  },
  {
    id: 'trust-score',
    num: '04',
    title: 'AI Trust Score & Evidentiary Standard',
    icon: ShieldCheck,
    color: 'indigo',
    summary: 'An aggregated evidentiary metric designed to assist human recruiters — not replace their judgment.',
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
    color: 'emerald',
    summary: 'Full data rights. 90-day raw media purge. ISO 27001 and SOC-2 certified infrastructure.',
    details: [
      'Candidates have the right to request complete data deletion, export their assessment JSON scorecard, and inspect proctoring logs.',
      'Raw audio/video session recordings are permanently purged 90 days after assessment completion; only cryptographic verification digests and scorecards are preserved.',
      'GenuAI does not process biometric data for advertising, social profiling, or unauthorized background surveillance.',
      'All data storage is hosted in ISO 27001-certified, SOC-2 compliant data centers with end-to-end TLS 1.3 transport encryption.',
    ],
  },
  {
    id: 'non-discrimination',
    num: '06',
    title: 'Non-Discrimination & Algorithmic Fairness',
    icon: Scale,
    color: 'violet',
    summary: 'Models audited against gender, ethnic, dialectal, and institutional pedigree bias every quarter.',
    details: [
      'SVAR speech recognition and AI interview models are trained across diverse regional and international accents to eliminate linguistic penalization.',
      'College brand, geography, and gender are completely decoupled from core skill percentiles in automated screening rounds.',
      'Routine bias audits and disparity tests are conducted quarterly to maintain statistical fairness across demographic cohorts.',
      'Recruiters receive scoring rubrics calibrated strictly against verifiable technical and problem-solving benchmarks.',
    ],
  },
  {
    id: 'appeals',
    num: '07',
    title: 'Score Review & Candidate Appeal Procedure',
    icon: FileText,
    color: 'amber',
    summary: 'Legal right to contest flagged warnings. Independent human review within 14 business days.',
    details: [
      'If a session is flagged for environment anomalies due to technical system faults or network drops, candidates can file an official appeal within 14 days.',
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
    color: 'violet',
    summary: 'All question banks, SVAR models, compiler architectures, and scoring algorithms are proprietary GenuAI assets.',
    details: [
      'Candidates are strictly prohibited from screen-recording, scraping, publishing, or sharing proprietary GenuAI test questions and coding prompts.',
      'Code written by candidates during project challenges remains the intellectual property of the author, subject to evaluation licensing by prospective employers.',
      'Violations involving commercial leakage of test materials will be prosecuted under applicable digital intellectual property laws.',
      'By participating, candidates and companies agree to abide by all ecosystem terms and institutional guidelines.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string; dot: string }> = {
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-600',
    dot: 'bg-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    dot: 'bg-amber-500',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100 text-violet-600',
    dot: 'bg-violet-500',
  },
};

export default function TermsPage() {
  const [activeId, setActiveId] = useState('portability');
  const [readSections, setReadSections] = useState<Set<string>>(new Set());

  // Track which section is in view for sidebar highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('terms-sec-', '');
            setActiveId(id);
            setReadSections((prev) => new Set([...prev, id]));
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(`terms-sec-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`terms-sec-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeSection = sections.find((s) => s.id === activeId) || sections[0];
  const colors = colorMap[activeSection.color];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Orientation header */}
      <OrientationHeader currentStep={1} title="Terms & Conditions" />

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            <span>Platform Governance · Step 1 of 7</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm sm:text-base text-indigo-200/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Eight foundational clauses governing assessment portability, biometric proctoring, candidate consent, algorithmic fairness, and data rights. Read all sections before proceeding.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {sections.map((s) => {
              const isRead = readSections.has(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    isRead
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-indigo-400/40 hover:text-indigo-300'
                  }`}
                >
                  {isRead && <CheckCircle2 className="w-3 h-3" />}
                  {s.num}
                </button>
              );
            })}
            <span className="text-[10px] text-indigo-300/60 font-medium">
              {readSections.size}/{sections.length} sections read
            </span>
          </div>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start">

          {/* ── LEFT: Sticky table of contents ── */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-2">
            {/* Section nav header */}
            <div className="flex items-center gap-2 px-1 pb-3 mb-1 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Document Index</span>
            </div>

            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeId === sec.id;
              const isRead = readSections.has(sec.id);
              const c = colorMap[sec.color];

              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`w-full group flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${c.bg} ${c.border} shadow-sm`
                      : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  {/* Icon pill */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isActive ? c.iconBg : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
                      isActive ? c.text : 'text-slate-400'
                    }`}>
                      Section {sec.num}
                    </div>
                    <div className={`text-xs font-semibold leading-tight truncate ${
                      isActive ? 'text-slate-900' : 'text-slate-600'
                    }`}>
                      {sec.title}
                    </div>
                  </div>

                  {/* Read badge / chevron */}
                  {isRead ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-all ${
                      isActive ? c.text : 'text-slate-300 group-hover:text-slate-400'
                    }`} />
                  )}
                </button>
              );
            })}

            {/* Progress label */}
            <div className="pt-3 px-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                <span>Reading progress</span>
                <span>{readSections.size}/{sections.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(readSections.size / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </aside>

          {/* ── RIGHT: Document sections ── */}
          <main className="lg:col-span-8 space-y-6">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const c = colorMap[sec.color];
              const isRead = readSections.has(sec.id);

              return (
                <article
                  key={sec.id}
                  id={`terms-sec-${sec.id}`}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden scroll-mt-28 transition-all hover:shadow-sm"
                >
                  {/* Card header */}
                  <div className={`${c.bg} border-b ${c.border} px-6 sm:px-8 py-5 flex items-center justify-between gap-4`}>
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${c.text} block`}>
                          Section {sec.num}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {sec.title}
                        </h3>
                      </div>
                    </div>

                    {isRead && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Read
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="px-6 sm:px-8 py-6 space-y-5">
                    {/* Summary */}
                    <p className="text-sm text-slate-700 font-medium leading-relaxed border-l-4 border-indigo-200 pl-4 bg-slate-50/60 py-3 pr-3 rounded-r-xl">
                      {sec.summary}
                    </p>

                    {/* Clauses */}
                    <div className="space-y-3">
                      {sec.details.map((clause, idx) => (
                        <div key={idx} className="flex items-start gap-3.5">
                          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${c.dot}`}>
                            {idx + 1}
                          </span>
                          <p className="text-sm text-slate-600 leading-relaxed">{clause}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Orientation consent footer */}
            <OrientationFooter
              currentStep={1}
              pageTitle="Terms & Conditions"
              nextPath="/privacy"
              nextTitle="Privacy Policy"
            />
          </main>
        </div>
      </div>
    </div>
  );
}

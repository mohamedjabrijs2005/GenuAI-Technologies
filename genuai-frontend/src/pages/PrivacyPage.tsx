import React from 'react';
import { Lock, ShieldCheck, CheckCircle2, UserCheck, EyeOff, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();

  const principles = [
    {
      title: '1. Explicit Consent & Target Scoping',
      desc: 'Candidate telemetry, scores, and resume data are shared strictly with company roles chosen explicitly by the candidate.',
      icon: UserCheck,
    },
    {
      title: '2. 90-Day Raw Media Purge Protocol',
      desc: 'Raw audio and video proctoring session recordings are permanently deleted 90 days after assessment completion.',
      icon: Lock,
    },
    {
      title: '3. Zero Data Monetization Guarantee',
      desc: 'Candidate data is never sold, leased, or broadcast to unverified third-party recruiters, advertisers, or data brokers.',
      icon: EyeOff,
    },
    {
      title: '4. Enterprise Security Standard (TLS 1.3 & AES-256)',
      desc: 'All data is encrypted in transit and at rest in ISO 27001 and SOC-2 compliant data center infrastructure.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Home</span>
        </button>

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200/80">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection &amp; Candidate Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            GenuAI Technologies is committed to candidate privacy, DPDP 2023 compliance, GDPR data rights, and ethical AI data handling.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Sections */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
            Candidate Rights under DPDP Act 2023 &amp; GDPR
          </h2>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-normal">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <strong className="text-slate-900 block mb-1 font-bold text-sm">Right to Access &amp; Portability:</strong>
              Candidates can inspect all generated assessment scorecards, view timestamped evaluation components, and export their verification profile as JSON.
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <strong className="text-slate-900 block mb-1 font-bold text-sm">Right to Erasure &amp; Consent Revocation:</strong>
              Candidates may revoke recipient access or request full data erasure directly from their Candidate Dashboard settings.
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <strong className="text-slate-900 block mb-1 font-bold text-sm">Biometric Data Protection:</strong>
              Biometric facial landmark vectors and voice timbre baselines are processed solely for live anti-proxy verification during active assessment sessions. They are never used for advertising, surveillance, or social scoring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


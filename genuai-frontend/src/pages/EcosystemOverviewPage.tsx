import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import {
  Layers,
  ShieldCheck,
  Building2,
  Users,
  Cpu,
  ArrowRight,
  Zap,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Globe2,
  Lock,
  Compass,
} from 'lucide-react';

export default function EcosystemOverviewPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-base antialiased selection:bg-indigo-brand selection:text-white">
      {/* Top Navbar */}
      <Navbar onGetStarted={handleGetStarted} />

      <main className="pt-24 pb-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-12 lg:py-20 border-b border-surface-container">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-brand/15 via-purple-500/10 to-accent-gold/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-brand/10 border border-indigo-brand/20 text-indigo-brand text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              <span>Unified Recruitment Ecosystem</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-on-surface leading-tight max-w-4xl mx-auto">
              One Persistent Intelligence Layer. <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-brand via-purple-600 to-accent-gold">
                Limitless Hiring Impact.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              GenuAI brings together candidates, enterprise hiring partners, and institutional administrators into a single, anti-proxy, fraud-resistant talent ecosystem.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="px-7 py-3.5 rounded-2xl bg-indigo-brand text-white font-bold text-sm hover:bg-indigo-brand-dark transition-all flex items-center gap-2 shadow-lg shadow-indigo-brand/25 cursor-pointer"
              >
                <span>Enter Ecosystem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/#about')}
                className="px-7 py-3.5 rounded-2xl bg-surface-bright text-on-surface border border-surface-container font-bold text-sm hover:bg-surface-container/60 transition-all cursor-pointer"
              >
                Explore Architecture
              </button>
            </div>
          </div>
        </section>

        {/* 3 PILLARS OF THE ECOSYSTEM */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-brand">
              Tri-Party Architecture
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-on-surface">
              The 3 Pillars of GenuAI Ecosystem
            </h3>
            <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
              Connected through shared AI intelligence, proctoring telemetry, and instant verified scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Candidate Pillar */}
            <div className="p-7 rounded-[32px] bg-white border border-surface-container shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-on-surface">Candidate Ecosystem</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Single assessment effort yields a reusable, verifiable GenuAI Talent Passport. Candidates take proctored coding, aptitude, and AI SVAR interviews once and share with hundreds of employers.
                </p>
                <ul className="space-y-2 text-xs font-medium text-on-surface">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Persistent Verified Talent Passport</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>6-Module AI Evaluation Suite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant Skill Gap Analytics</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigate('/auth?intent=candidate')}
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-brand font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Access Candidate Portal →
              </button>
            </div>

            {/* Company Pillar */}
            <div className="p-7 rounded-[32px] bg-white border border-surface-container shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-on-surface">Employer Ecosystem</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Enterprise recruiters publish roles, access pre-evaluated talent pools, review anti-proxy face match logs, and advance candidates seamlessly through the 10-stage pipeline board.
                </p>
                <ul className="space-y-2 text-xs font-medium text-on-surface">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>AI Resume &amp; Skill Ranker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Anti-Proxy Proctoring Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>10-Stage Pipeline Management</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigate('/auth?intent=company')}
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-purple-600 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Access Company Portal →
              </button>
            </div>

            {/* Admin Pillar */}
            <div className="p-7 rounded-[32px] bg-white border border-surface-container shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-on-surface">Admin &amp; Governance</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Institutional placement officers and super administrators oversee platform integrity, review company approvals, monitor real-time infrastructure ping, and inspect immutable audit logs.
                </p>
                <ul className="space-y-2 text-xs font-medium text-on-surface">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Real-time Ecosystem Telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Security Audit Stream</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Enterprise Governance Controls</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigate('/auth?intent=admin')}
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-600 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Access Admin Command →
              </button>
            </div>
          </div>
        </section>

        {/* ECOSYSTEM TELEMETRY METRICS */}
        <section className="bg-slate-900 text-white py-16 sm:py-20 my-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Live Telemetry
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Real-time Ecosystem Metrics
                </h3>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Active Talent Pool</p>
                <p className="text-3xl font-black text-white">1,248+</p>
                <p className="text-[11px] text-slate-400">Verified candidate profiles</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Hiring Partners</p>
                <p className="text-3xl font-black text-white">180+</p>
                <p className="text-[11px] text-slate-400">Registered enterprise employers</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Evaluations Taken</p>
                <p className="text-3xl font-black text-indigo-400">42,000+</p>
                <p className="text-[11px] text-slate-400">Anti-proxy assessments</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Verification Rate</p>
                <p className="text-3xl font-black text-emerald-400">99.8%</p>
                <p className="text-[11px] text-slate-400">Proctoring integrity confidence</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-16 text-center max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-on-surface">
            Ready to Experience the GenuAI Ecosystem?
          </h2>
          <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
            Get started in seconds whether you are a candidate building your career profile or an employer seeking verified engineering talent.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="px-8 py-4 rounded-2xl bg-indigo-brand text-white font-bold text-sm hover:bg-indigo-brand-dark transition-all inline-flex items-center gap-2 shadow-xl shadow-indigo-brand/25 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

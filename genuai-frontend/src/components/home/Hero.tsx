import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, User, Building, Cpu, Database, Award, Activity } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const Hero: React.FC<Props> = ({ onGetStarted, onExplore }) => {
  const [pulseStage, setPulseStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseStage((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const companies = [
    { name: 'Google', role: 'Software Engineer', match: '96%' },
    { name: 'Microsoft', role: 'AI Specialist', match: '94%' },
    { name: 'Amazon', role: 'Full Stack Dev', match: '91%' },
    { name: 'Zoho', role: 'Backend Lead', match: '95%' },
  ];

  return (
    <section id="hero" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36 overflow-hidden bg-background">
      {/* Dynamic Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-brand/15 to-accent-gold/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-brand/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Content Left (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-brand/10 border border-indigo-brand/20 text-indigo-brand text-xs font-bold uppercase tracking-wider shadow-sm animate-[fadeIn_0.4s_ease]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-brand animate-pulse" />
              <span>AI-Powered Recruitment Intelligence</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.08]">
              One Assessment. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-brand to-[#7C3AED]">
                Multiple Opportunities.
              </span> <br />
              Verified Talent.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto lg:mx-0">
              GenuAI Technologies is an AI-powered recruitment intelligence platform that verifies skills, detects recruitment fraud, and connects candidates with multiple companies through one trusted assessment.
            </p>

            {/* Core USP Ribbon */}
            <div className="inline-block p-3 rounded-2xl bg-surface-bright border border-surface-container shadow-sm">
              <div className="text-xs font-semibold text-on-surface-variant flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-on-surface font-bold">One Assessment</span>
                <span className="text-on-surface-variant/40">•</span>
                <span className="text-indigo-brand font-bold">Multiple Companies</span>
                <span className="text-on-surface-variant/40">•</span>
                <span className="text-success-dark font-bold">Verified Talent</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-on-surface bg-surface border border-surface-container shadow-sm hover:bg-surface-bright hover:border-surface-container-high transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-brand"
              >
                <span>Experience GenuAI</span>
                <Activity className="w-4 h-4 text-indigo-brand" />
              </button>

              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark hover:shadow-xl hover:shadow-indigo-brand/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-brand focus-visible:ring-offset-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Subtext */}
            <p className="text-xs font-medium text-on-surface-variant/70 italic">
              "Your skills should travel with you." — Unified credentials recognized across organizations.
            </p>
          </div>

          {/* Hero Visual Right: Animated AI Recruitment Ecosystem (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="glass rounded-3xl p-6 sm:p-8 border border-surface-container shadow-2xl relative overflow-hidden">
              {/* Header inside visual */}
              <div className="flex items-center justify-between border-b border-surface-container/60 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Live Recruitment Flow
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-indigo-brand bg-indigo-brand/10 px-2.5 py-0.5 rounded-full border border-indigo-brand/20">
                  GenuAI Pipeline
                </span>
              </div>

              {/* Ecosystem Flow Nodes */}
              <div className="space-y-4 relative">
                {/* 1. Candidate Node */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                    pulseStage >= 0
                      ? 'bg-surface-bright border-indigo-brand shadow-sm'
                      : 'bg-surface border-surface-container opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">Candidate Profile</div>
                      <div className="text-[11px] text-on-surface-variant">Verified Skills &amp; Credentials</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-brand/10 text-indigo-brand">
                    Step 1
                  </span>
                </div>

                {/* Connecting signal line */}
                <div className="h-4 w-0.5 bg-gradient-to-b from-indigo-brand to-accent-gold mx-auto" />

                {/* 2. AI Assessment & Verification Node */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                    pulseStage >= 1
                      ? 'bg-indigo-brand/5 border-indigo-brand/60 shadow-md ring-1 ring-indigo-brand/20'
                      : 'bg-surface border-surface-container opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-gold/15 text-accent-gold-dark flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <span>AI Assessment &amp; Anti-Proxy</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      </div>
                      <div className="text-[11px] text-on-surface-variant">Biometrics • Coding • GD • Verbal</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-success/15 text-success-dark">
                    94% Trust Score
                  </span>
                </div>

                {/* Connecting signal line */}
                <div className="h-4 w-0.5 bg-gradient-to-b from-accent-gold to-success mx-auto" />

                {/* 3. Verified Talent Node */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                    pulseStage >= 2
                      ? 'bg-success/10 border-success/40 shadow-sm'
                      : 'bg-surface border-surface-container opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/15 text-success-dark flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">Verified Talent Passport</div>
                      <div className="text-[11px] text-on-surface-variant">Single Standardized Scorecard</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-success text-white">
                    Verified
                  </span>
                </div>

                {/* Connecting signal line */}
                <div className="h-4 w-0.5 bg-gradient-to-b from-success to-indigo-brand mx-auto" />

                {/* 4. Multiple Companies Distribution */}
                <div className="p-4 rounded-2xl bg-surface-bright border border-surface-container">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>One Score → Multiple Companies</span>
                    <Building className="w-3.5 h-3.5 text-indigo-brand" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {companies.map((c, i) => (
                      <div
                        key={c.name}
                        className={`p-2 rounded-xl bg-surface border transition-all duration-300 text-left ${
                          pulseStage >= 3
                            ? 'border-indigo-brand/30 shadow-xs'
                            : 'border-surface-container'
                        }`}
                      >
                        <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-success font-semibold">{c.match}</span>
                        </div>
                        <div className="text-[10px] text-on-surface-variant truncate">{c.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom status badge */}
              <div className="mt-4 pt-3 border-t border-surface-container/60 flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                <span>⚡ Edge AI &amp; Local Verification</span>
                <span className="text-indigo-brand font-bold">Zero Redundant Retesting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

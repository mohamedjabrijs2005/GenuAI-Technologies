import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, User, Building, Cpu, Award, Activity } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onGetStarted: () => void;
  onExplore: () => void;
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const Hero: React.FC<Props> = ({ onGetStarted, onExplore, onProtectedAction }) => {
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

  const handleCandidateNodeClick = () => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'candidate',
        title: 'Ready to enter the Candidate Ecosystem?',
        description: 'Sign in or create an account to take unified assessments, practice coding, and build your verified talent profile.',
      });
    }
  };

  const handleAssessmentNodeClick = () => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'candidate',
        title: 'Ready to start AI Assessment & Anti-Proxy Verification?',
        description: 'Sign in or create an account to access standardized assessments, coding IDE, and speech evaluation.',
      });
    }
  };

  const handleCompanyNodeClick = () => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'company',
        title: 'Ready to enter the Company Ecosystem?',
        description: 'Sign in or create an account to discover authenticated talent, access standardized scorecards, and streamline hiring.',
      });
    }
  };

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-background">
      {/* Dynamic Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-indigo-brand/15 to-accent-gold/10 blur-[90px] sm:blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-indigo-brand/10 blur-[80px] sm:blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Hero Content Left (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-brand/10 border border-indigo-brand/20 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs animate-[fadeIn_0.4s_ease]">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-indigo-brand animate-pulse shrink-0" />
              <span className="truncate">AI-Powered Recruitment Intelligence</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.1] sm:leading-[1.08]">
              Role-Aware Recruitment. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                Dynamic Assessment.
              </span> <br />
              Fair Candidate Comparison.
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Your assessment path is built from what your selected companies actually require — never a one-size-fits-all test. Select your target companies and roles. GenuAI Works merges their overlapping requirements — shared skills are tested once, company-specific skills only when relevant.
            </p>

            {/* Core USP Ribbon */}
            <div className="inline-block p-2.5 sm:p-3 rounded-2xl bg-surface-bright border border-surface-container shadow-xs w-full sm:w-auto">
              <div className="text-[11px] sm:text-xs font-semibold text-on-surface-variant flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-500 shrink-0" />
                <span className="text-on-surface font-bold">Target Companies &amp; Roles</span>
                <span className="text-on-surface-variant/40 hidden sm:inline">•</span>
                <span className="text-indigo-600 font-bold font-mono">GenuAI Works Engine</span>
                <span className="text-on-surface-variant/40 hidden sm:inline">•</span>
                <span className="text-purple-600 font-bold">Explainable Match Score</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-6 h-12 rounded-xl font-bold text-xs sm:text-sm text-on-surface bg-surface border border-surface-container shadow-xs hover:bg-slate-800/80 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Experience GenuAI</span>
                <Activity className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 h-12 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Subtext */}
            <p className="text-[11px] sm:text-xs font-medium text-on-surface-variant/70 italic">
              Explore companies freely. Shared skills are evaluated once and reused across target roles.
            </p>
          </div>

          {/* Hero Visual Right: Animated AI Recruitment Ecosystem (5 cols) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="glass rounded-3xl p-4 sm:p-6 lg:p-8 border border-surface-container shadow-xl relative overflow-hidden">
              {/* Header inside visual */}
              <div className="flex items-center justify-between border-b border-surface-container/60 pb-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-ping" />
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface uppercase tracking-wider">
                    Live Recruitment Flow
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-brand bg-indigo-brand/10 px-2.5 py-0.5 rounded-full border border-indigo-brand/20">
                  GenuAI Pipeline
                </span>
              </div>

              {/* Ecosystem Flow Nodes */}
              <div className="space-y-3 sm:space-y-4 relative">
                {/* 1. Candidate Node */}
                <div
                  onClick={handleCandidateNodeClick}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between cursor-pointer hover:border-indigo-brand ${
                    pulseStage >= 0
                      ? 'bg-surface-bright border-indigo-brand shadow-xs'
                      : 'bg-surface border-surface-container opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">Candidate Profile</div>
                      <div className="text-[10px] sm:text-[11px] text-on-surface-variant">Verified Skills &amp; Credentials</div>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-brand/10 text-indigo-brand shrink-0">
                    Step 1
                  </span>
                </div>

                {/* Connecting signal line */}
                <div className="h-3 sm:h-4 w-0.5 bg-gradient-to-b from-indigo-brand to-accent-gold mx-auto" />

                {/* 2. AI Assessment & Verification Node */}
                <div
                  onClick={handleAssessmentNodeClick}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between cursor-pointer hover:border-indigo-brand ${
                    pulseStage >= 1
                      ? 'bg-indigo-brand/5 border-indigo-brand/60 shadow-xs ring-1 ring-indigo-brand/20'
                      : 'bg-surface border-surface-container opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent-gold/15 text-accent-gold-dark flex items-center justify-center font-bold shrink-0">
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <span>AI Assessment &amp; Anti-Proxy</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-on-surface-variant">Biometrics • Coding • GD • Verbal</div>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded bg-success/15 text-success-dark shrink-0">
                    94% Trust
                  </span>
                </div>

                {/* Connecting signal line */}
                <div className="h-3 sm:h-4 w-0.5 bg-gradient-to-b from-accent-gold to-success mx-auto" />

                {/* 3. Verified Talent Node */}
                <div
                  onClick={handleCandidateNodeClick}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between cursor-pointer hover:border-success ${
                    pulseStage >= 2
                      ? 'bg-success/10 border-success/40 shadow-xs'
                      : 'bg-surface border-surface-container opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-success/15 text-success-dark flex items-center justify-center font-bold shrink-0">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">Verified Talent Passport</div>
                      <div className="text-[10px] sm:text-[11px] text-on-surface-variant">Single Standardized Scorecard</div>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded bg-success text-white shrink-0">
                    Verified
                  </span>
                </div>

                {/* Connecting signal line */}
                <div className="h-3 sm:h-4 w-0.5 bg-gradient-to-b from-success to-indigo-brand mx-auto" />

                {/* 4. Multiple Companies Distribution */}
                <div
                  onClick={handleCompanyNodeClick}
                  className="p-3 sm:p-4 rounded-2xl bg-surface-bright border border-surface-container cursor-pointer hover:border-indigo-brand/50 transition-colors"
                >
                  <div className="text-[10px] sm:text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>One Score → Multiple Companies</span>
                    <Building className="w-3.5 h-3.5 text-indigo-brand" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {companies.map((c) => (
                      <div
                        key={c.name}
                        className={`p-2 rounded-xl bg-surface border transition-all duration-300 text-left ${
                          pulseStage >= 3
                            ? 'border-indigo-brand/30 shadow-xs'
                            : 'border-surface-container'
                        }`}
                      >
                        <div className="text-[11px] sm:text-xs font-bold text-on-surface flex items-center justify-between">
                          <span className="truncate">{c.name}</span>
                          <span className="text-[9px] sm:text-[10px] text-success font-semibold shrink-0 ml-1">{c.match}</span>
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-on-surface-variant truncate">{c.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom status badge */}
              <div className="mt-3 pt-2.5 border-t border-surface-container/60 flex items-center justify-between text-[10px] sm:text-[11px] text-on-surface-variant font-medium">
                <span>⚡ Multi-Modal AI Verification</span>
                <span className="text-indigo-brand font-bold">Zero Retesting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

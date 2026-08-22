import React from 'react';
import { CheckCircle2, XCircle, Zap, Sparkles } from 'lucide-react';

export const Comparison: React.FC = () => {
  const points = [
    {
      metric: 'Ecosystem Fragmentation',
      trad: 'Candidates manage 10+ different job portals & accounts',
      genu: 'One Unified Assessment Ecosystem with single persistent talent passport',
    },
    {
      metric: 'Assessment Repetition',
      trad: 'Repeatedly take identical coding & aptitude tests per company',
      genu: 'One Comprehensive Assessment shared with multiple companies',
    },
    {
      metric: 'Fraud & Anti-Proxy Security',
      trad: 'Weak basic webcams easily bypassed with second persons & phones',
      genu: 'Multi-modal AI Anti-Proxy (Face, Voice, Liveness, Gaze & AI Scoring)',
    },
    {
      metric: 'Interview & GD Infrastructure',
      trad: 'Requires massive manual recruiter hours and disjointed scheduling',
      genu: 'Automated AI Interviews & AI-Moderated Group Discussions on demand',
    },
    {
      metric: 'Evaluation Standard',
      trad: 'Inconsistent rubrics across disparate testing vendors',
      genu: 'Role-specific scorecard, built from each company\'s locked requirements',
    },
    {
      metric: 'Time to Verified Hire',
      trad: '4 to 8 weeks with high candidate drop-off rate',
      genu: 'Instant verified candidate dispatch with pre-calculated trust scores',
    },
  ];

  return (
    <section id="comparison" className="py-20 sm:py-24 lg:py-32 bg-surface-bright/50 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-brand/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Paradigm Shift</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            Traditional Hiring vs. GenuAI
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            See how GenuAI completely replaces the repetitive, fragmented hiring cycle with an intelligent, multi-company talent network.
          </p>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Traditional Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-surface border border-surface-container shadow-xs opacity-90">
            <div className="text-xs font-bold text-error uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Legacy Recruitment Model</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-6">
              Fragmented &amp; Repetitive
            </h3>

            <div className="space-y-6">
              {points.map((p) => (
                <div key={p.metric} className="border-b border-surface-container/60 pb-4">
                  <div className="text-xs font-bold text-on-surface-variant mb-1">{p.metric}</div>
                  <div className="text-xs text-error flex items-start gap-2">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{p.trad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GenuAI Column (7 cols) - Visually Dominant */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-brand/10 via-surface to-accent-gold/10 border-2 border-indigo-brand shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-indigo-brand uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-brand" />
                  <span>The GenuAI Ecosystem</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-brand text-white text-[11px] font-bold">
                  Recommended Standard
                </span>
              </div>
              <h3 className="text-2xl font-black text-on-surface mb-6">
                Target Companies • Dynamic Paths • Verified Talent
              </h3>

              <div className="space-y-6">
                {points.map((p) => (
                  <div key={p.metric} className="border-b border-surface-container pb-4">
                    <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider mb-1">
                      {p.metric}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-on-surface flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{p.genu}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-container flex items-center justify-between text-xs font-bold text-on-surface">
              <span>Fewer Repeated Tests Across Companies</span>
              <span className="text-emerald-400 font-mono">Multi-Layer AI-Assisted Verification</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

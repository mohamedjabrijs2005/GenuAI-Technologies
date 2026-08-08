import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const FinalCTA: React.FC<Props> = ({ onGetStarted, onExplore }) => {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-brand/20 to-accent-gold/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider border border-indigo-brand/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-brand animate-pulse" />
            <span>Join The Recruitment Revolution</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-on-surface leading-tight">
            Recruitment Should Measure Potential, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-brand to-[#7C3AED]">
              Not Just Paper.
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Experience secure, intelligent and verified recruitment with GenuAI Technologies. Start your unified assessment today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-on-surface bg-surface border border-surface-container shadow-sm hover:bg-surface-bright transition-all"
            >
              Explore GenuAI
            </button>

            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark hover:shadow-2xl hover:shadow-indigo-brand/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-brand focus-visible:ring-offset-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-8 border-t border-surface-container/60 max-w-lg mx-auto">
            <div className="text-xs font-bold text-on-surface uppercase tracking-widest">
              GenuAI Technologies
            </div>
            <div className="text-xs font-medium text-on-surface-variant mt-1">
              "One Assessment. Multiple Opportunities. Verified Talent."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

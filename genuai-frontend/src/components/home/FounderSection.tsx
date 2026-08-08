import React from 'react';
import { Quote, Sparkles, Award, ShieldCheck } from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <section id="founder" className="py-12 sm:py-16 lg:py-24 bg-surface relative z-10 border-t border-b border-surface-container/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Text Content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-accent-gold/15 text-accent-gold-dark text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-accent-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Leadership &amp; Vision</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Built by Founders, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-indigo-brand to-[#7C3AED]">
                For the Future of Work.
              </span>
            </h2>

            <div className="w-16 h-1 bg-accent-gold rounded-full" />

            <div className="relative">
              <Quote className="w-10 h-10 text-accent-gold/20 absolute -top-4 -left-3 pointer-events-none" />
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed pl-6 italic">
                "We built GenuAI Technologies because the traditional hiring process is fundamentally broken. Relying solely on resumes and biased human screening leaves incredible talent undiscovered and companies struggling to build top-tier teams."
              </p>
            </div>

            <p className="text-sm sm:text-base text-on-surface-variant/90 leading-relaxed">
              Our multi-dimensional AI platform evaluates candidates across 6 core dimensions, providing real-time, actionable insights. This ensures that every hire is based on true merit and demonstrated capability, bridging the gap between exceptional developers and world-class opportunities.
            </p>

            <div className="pt-2 border-t border-surface-container/60 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-on-surface">Mohamed Jabri J S</h4>
                <p className="text-xs font-bold text-accent-gold uppercase tracking-wider">
                  Founder &amp; CEO, GenuAI Technologies
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-brand/10 text-indigo-brand text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Leadership</span>
              </div>
            </div>
          </div>

          {/* Right Founder Photo */}
          <div className="w-full sm:w-[380px] lg:w-[420px] aspect-[4/5] relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/20 to-indigo-brand/20 blur-3xl rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src="/founder_real.jpg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://ui-avatars.com/api/?name=Mohamed+Jabri+J+S&background=1E293B&color=D4AF37&size=450';
              }}
              alt="Mohamed Jabri J S - Founder & CEO"
              className="w-full h-full object-cover object-top rounded-3xl shadow-2xl relative z-10 border border-surface-container transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

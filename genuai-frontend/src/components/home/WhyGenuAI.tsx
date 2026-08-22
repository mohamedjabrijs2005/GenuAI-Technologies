import React from 'react';
import { Star, ShieldCheck, Cpu, Building2, Users, ArrowRight } from 'lucide-react';

export const WhyGenuAI: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Target Company Selection & Reuse',
      desc: 'Select target companies and roles. GenuAI Works merges overlapping requirements — shared skills tested once, company-specific skills only when relevant.',
      icon: Star,
    },
    {
      num: '02',
      title: 'Multi-Modal AI Verification',
      desc: 'Face, voice, liveness and environment-based verification concepts running in standard browser sessions.',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'Complete Recruitment Assessment Ecosystem',
      desc: 'ATS parsing, aptitude, coding compiler, verbal SVAR, AI interviews, GDs, and live git repositories unified in one ecosystem.',
      icon: Building2,
    },
    {
      num: '04',
      title: 'AI-Powered Recruitment Intelligence',
      desc: 'Multi-layered AI analysis of candidate performance, verbal fluency, coding logic, and verified hiring signals.',
      icon: Cpu,
    },
    {
      num: '05',
      title: 'Candidate + Company + Institution Ecosystem',
      desc: 'Seamless three-way visibility giving candidates skill portability, employers verified talent, and colleges administrative governance.',
      icon: Users,
    },
  ];

  return (
    <section id="why-genuai" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-accent-gold/15 text-accent-gold-dark text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-accent-gold/30">
            <Star className="w-3.5 h-3.5" />
            <span>Value Pillars</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Why GenuAI Technologies?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Five core value pillars defining the next generation of authenticated, efficient, and skill-first hiring.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`glass rounded-3xl p-8 border border-surface-container shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                  i === 0 ? 'md:col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-brand/5 to-surface' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-black text-on-surface-variant/40">
                      PILLAR {p.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface mb-3">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-surface-container/60 flex items-center text-xs font-bold text-indigo-brand">
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

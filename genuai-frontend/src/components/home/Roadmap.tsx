import React from 'react';
import { Compass, CheckCircle2, ShieldCheck, Cpu, School, Building2, Globe2, Sparkles } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const roadmapItems = [
    {
      stage: 'Phase 01',
      title: 'Dynamic Path Engine & Core Assessment Library',
      status: 'In Active Development',
      desc: 'Core assessment module library, ATS resume parser, proctored coding IDE, role requirement aggregation, and version-bound match scores.',
      icon: CheckCircle2,
      accent: {
        iconBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20',
        stageText: 'text-indigo-700',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-500/20',
        cardBorder: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/20',
        glow: 'hover:shadow-indigo-500/10',
      },
    },
    {
      stage: 'Phase 02',
      title: 'Company Config Locking & Versioning',
      status: 'In Active Development',
      desc: 'Company portal requirement selector (4-6 modules limit), configuration agreement signature modal, V1 lock enforcement, and subscription change request workflow.',
      icon: ShieldCheck,
      accent: {
        iconBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20',
        stageText: 'text-emerald-700',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20',
      },
    },
  ];

  return (
    <section id="roadmap" className="py-12 sm:py-16 lg:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Strategic Horizon</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Where GenuAI Is Going
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            From our current working prototype to global enterprise cloud deployment, we clearly delineate our active milestones from future innovations.
          </p>
        </div>

        {/* Roadmap Timeline with 7 Distinct Color Schemes */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {roadmapItems.map((item) => {
            const Icon = item.icon;
            const { iconBg, stageText, badge, cardBorder, glow } = item.accent;

            return (
              <div
                key={item.stage}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-lg ${cardBorder} ${glow}`}
              >
                <div className="flex items-start gap-4">
                  {/* Distinct Colored Icon Box */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-xs font-mono font-bold ${stageText}`}>
                        {item.stage}
                      </span>
                      <span className="text-on-surface-variant/30">•</span>
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge}`}>
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to Full Roadmap */}
        <div className="mt-8 text-center">
          <a
            href="/roadmap"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs hover:bg-indigo-600/20 transition-all"
          >
            <span>See full 7-phase product roadmap</span>
            <Compass className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

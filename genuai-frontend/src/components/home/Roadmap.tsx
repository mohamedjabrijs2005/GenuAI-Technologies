import React from 'react';
import { Compass, CheckCircle2, ShieldCheck, Cpu, School, Building2, Globe2, Sparkles } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const roadmapItems = [
    // ── Group 1: 3 Distinct Active & Live Deployment Colors ──
    {
      stage: 'Phase 01',
      title: 'Current MVP / Prototype',
      status: 'Completed • Live',
      desc: 'Core 8-module assessment ecosystem, ATS resume parser, multi-language coding IDE, and automated scoring.',
      icon: CheckCircle2,
      accent: {
        iconBg: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20',
        stageText: 'text-emerald-700',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20',
        cardBorder: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20',
        glow: 'hover:shadow-emerald-500/10',
      },
    },
    {
      stage: 'Phase 02',
      title: 'AI Verification Enhancement',
      status: 'Completed • Live',
      desc: 'Browser-based face recognition, voice baseline matching, continuous gaze tracking, and AI Trust scoring algorithms.',
      icon: ShieldCheck,
      accent: {
        iconBg: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20',
        stageText: 'text-cyan-700',
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-300 ring-1 ring-cyan-500/20',
        cardBorder: 'border-cyan-200 hover:border-cyan-400 bg-cyan-50/20',
        glow: 'hover:shadow-cyan-500/10',
      },
    },
    {
      stage: 'Phase 03',
      title: 'Assessment Intelligence Enhancement',
      status: 'In Active Deployment',
      desc: 'Contextual technical interrogation, natural dialogue synthesis, and collaborative group discussion scoring.',
      icon: Cpu,
      accent: {
        iconBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20',
        stageText: 'text-indigo-700',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-500/20',
        cardBorder: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/20',
        glow: 'hover:shadow-indigo-500/10',
      },
    },

    // ── Group 2: 4 Distinct Future & Expansion Colors ──
    {
      stage: 'Phase 04',
      title: 'Pilot Deployment',
      status: 'Q3 2026 • Pilot Phase',
      desc: 'Placement cell trials across engineering institutions to validate multi-company distribution and cohort telemetry.',
      icon: School,
      accent: {
        iconBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/20',
        stageText: 'text-amber-700',
        badge: 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-500/20',
        cardBorder: 'border-amber-200 hover:border-amber-400 bg-amber-50/20',
        glow: 'hover:shadow-amber-500/10',
      },
    },
    {
      stage: 'Phase 05',
      title: 'Company & Institution Partnerships',
      status: 'Q4 2026 • Expansion',
      desc: 'Direct ATS integration with top tier tech companies and automated candidate dispatch pipelines.',
      icon: Building2,
      accent: {
        iconBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/20',
        stageText: 'text-purple-700',
        badge: 'bg-purple-50 text-purple-700 border-purple-300 ring-1 ring-purple-500/20',
        cardBorder: 'border-purple-200 hover:border-purple-400 bg-purple-50/20',
        glow: 'hover:shadow-purple-500/10',
      },
    },
    {
      stage: 'Phase 06',
      title: 'Commercial Platform',
      status: 'Roadmap 2027 • Global Scale',
      desc: 'Native audio coaching & assessment delivery across Tamil, Hindi, Japanese, Chinese, German, and Spanish.',
      icon: Globe2,
      accent: {
        iconBg: 'bg-rose-500 text-white shadow-md shadow-rose-500/20',
        stageText: 'text-rose-700',
        badge: 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-500/20',
        cardBorder: 'border-rose-200 hover:border-rose-400 bg-rose-50/20',
        glow: 'hover:shadow-rose-500/10',
      },
    },
    {
      stage: 'Phase 07',
      title: 'Scalable Recruitment Intelligence Infrastructure',
      status: 'Future Horizon • Cloud Architecture',
      desc: 'Standardized international skill accreditation protocol with cryptographic verification and distributed cloud microservices.',
      icon: Sparkles,
      accent: {
        iconBg: 'bg-teal-600 text-white shadow-md shadow-teal-600/20',
        stageText: 'text-teal-700',
        badge: 'bg-teal-50 text-teal-700 border-teal-300 ring-1 ring-teal-500/20',
        cardBorder: 'border-teal-200 hover:border-teal-400 bg-teal-50/20',
        glow: 'hover:shadow-teal-500/10',
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
      </div>
    </section>
  );
};

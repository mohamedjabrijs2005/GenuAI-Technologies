import React from 'react';
import { AlertTriangle, Layers, RotateCcw, ShieldAlert, ServerOff } from 'lucide-react';

export const Problem: React.FC = () => {
  const problems = [
    {
      num: '01',
      title: 'Fragmented Recruitment',
      desc: 'Candidates and companies operate across multiple disconnected portals, job boards, and evaluation tools with no unified skill identity or persistent verifiable credentials.',
      icon: Layers,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      num: '02',
      title: 'Repeated Assessments',
      desc: 'Candidates are forced to repeatedly take identical aptitude, coding, and English tests for every individual company, leading to massive candidate fatigue and lost productivity.',
      icon: RotateCcw,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      num: '03',
      title: 'Recruitment Fraud',
      desc: 'Fake resumes, proxy test-takers, second-person whispering, impersonation, and unauthorized AI tool usage undermine hiring integrity and severely reduce recruiter trust.',
      icon: ShieldAlert,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      num: '04',
      title: 'Limited Assessment Infrastructure',
      desc: 'Many companies cannot independently conduct coding tests, group discussions, technical interviews, and live project evaluations due to heavy time, cost, and infrastructure constraints.',
      icon: ServerOff,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <section id="problem" className="py-12 sm:py-16 lg:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-error/10 text-error text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-error/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Hiring Bottleneck</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Recruitment Has a Trust &amp; Efficiency Problem.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Traditional hiring pipelines are broken for both applicants and employers. Fragmented platforms, repetitive testing, and rampant cheating create friction across the entire industry.
          </p>
        </div>

        {/* 4 Problem Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-surface-container shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${p.bg} ${p.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-on-surface-variant/40">
                      {p.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-on-surface mb-3">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Statement Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-surface-bright border border-surface-container text-center max-w-4xl mx-auto shadow-sm">
          <p className="text-lg sm:text-xl font-bold text-on-surface leading-snug">
            "Candidates repeat the process. Companies repeat the effort. Nobody gets the complete picture."
          </p>
          <div className="mt-2 text-xs font-medium text-on-surface-variant">
            GenuAI solves this by replacing repetitive screening with a single verified talent ecosystem.
          </div>
        </div>
      </div>
    </section>
  );
};

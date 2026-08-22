import React from 'react';
import { FileText, Award, Users, Code, Video, FolderGit2, ShieldCheck, BarChart3, Plus, ArrowRight, Sparkles } from 'lucide-react';

export const Solution: React.FC = () => {
  const elements = [
    { name: 'Resume Analysis', icon: FileText, desc: 'ATS parser & skill extractor' },
    { name: 'Aptitude Test', icon: Award, desc: 'Quantitative & logical engine' },
    { name: 'Group Discussion', icon: Users, desc: 'Collaborative leadership AI' },
    { name: 'Coding Evaluation', icon: Code, desc: 'Multi-language compiler' },
    { name: 'AI Interview', icon: Video, desc: 'Adaptive speech & tech Q&A' },
    { name: 'Project Assessment', icon: FolderGit2, desc: 'Real-world git repository' },
    { name: 'AI Verification', icon: ShieldCheck, desc: 'Anti-proxy & biometric trust' },
    { name: 'Recruitment Intel', icon: BarChart3, desc: 'Data-driven scorecard' },
  ];

  return (
    <section id="solution" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 relative border-t border-b border-surface-container/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-success/10 text-success-dark text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-success/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Unified Solution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            One Intelligent Recruitment Ecosystem
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Instead of stitching together multiple isolated tools, GenuAI brings all recruitment stages together into a single, standardized, fraud-resistant intelligence ecosystem.
          </p>
        </div>

        {/* The Equation / Formula Visual */}
        <div className="glass rounded-3xl p-8 sm:p-12 border border-surface-container shadow-sm mb-12">
          <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest text-center mb-8">
            8 modules available. Companies select and lock the 4–6 that matter for each role.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {elements.map((el, i) => {
              const Icon = el.icon;
              return (
                <div key={el.name} className="flex flex-col items-center text-center p-3 rounded-2xl bg-surface border border-surface-container/70 shadow-xs hover:border-indigo-brand/50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-on-surface leading-snug mb-1">{el.name}</div>
                  <div className="text-[10px] text-on-surface-variant/80 line-clamp-2">{el.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Equal Sign Result */}
          <div className="pt-6 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-brand to-[#7C3AED] text-white flex items-center justify-center text-xl font-black shadow-md">
                =
              </div>
              <div>
                <div className="text-lg font-bold text-on-surface">GENUAI TECHNOLOGIES</div>
                <div className="text-xs text-on-surface-variant">The Complete End-to-End Recruitment Intelligence Standard</div>
              </div>
            </div>

            <div className="px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold">
              Role-Aware Requirement Orchestration
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

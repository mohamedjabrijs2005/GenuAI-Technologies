import React from 'react';
import { Award, Code, Mic, Users, Video, FolderGit2, CheckCircle2, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const WhyCompanies: React.FC = () => {
  const modules = [
    { title: 'Aptitude Assessment', desc: 'Quantitative, logical, and verbal reasoning test engine', icon: Award },
    { title: 'Coding Assessment', desc: 'Real-time multi-language compiler with test-case scoring', icon: Code },
    { title: 'Communication Evaluation', desc: 'Automated SVAR verbal speech fluency and clarity scoring', icon: Mic },
    { title: 'Group Discussion', desc: 'AI-moderated collaborative problem-solving evaluation', icon: Users },
    { title: 'AI Interview', desc: 'Adaptive technical Q&A with real-time speech evaluation', icon: Video },
    { title: 'Live Project Assessment', desc: 'Hands-on repository building and system design testing', icon: FolderGit2 },
    { title: 'Skill Validation', desc: 'Multi-dimensional skill matrix mapped to market standards', icon: CheckCircle2 },
    { title: 'Candidate Verification', desc: 'Continuous biometric identity and anti-proxy proctoring', icon: ShieldCheck },
  ];

  return (
    <section id="why-companies" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modular Evaluation Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Every Company Cannot Build Every Assessment.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Conducting comprehensive hiring requires massive server clusters, proctoring models, AI evaluators, and expert interviewers. GenuAI delivers these 8 enterprise-grade assessment modules out of the box.
          </p>
        </div>

        {/* 8 Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-surface-container shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center mb-5 group-hover:bg-indigo-brand group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">
                    {m.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-surface-container/60 flex items-center gap-1.5 text-[11px] font-bold text-success-dark">
                  <Check className="w-3.5 h-3.5" />
                  <span>Enterprise Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

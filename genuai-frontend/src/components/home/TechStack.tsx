import React from 'react';
import { Code, Server, Database, Sparkles, Shield, Mail, Cloud, Cpu } from 'lucide-react';

export const TechStack: React.FC = () => {
  const stack = [
    { name: 'React & TypeScript', category: 'Frontend', icon: Code },
    { name: 'Node & Express', category: 'Backend Engine', icon: Server },
    { name: 'PostgreSQL & Redis', category: 'Data Store', icon: Database },
    { name: 'Groq LPUs & Whisper V3', category: 'AI Speech & NLP', icon: Sparkles },
    { name: 'Docker Judge0 IDE', category: 'Proctored IDE', icon: Cpu },
  ];

  return (
    <section id="tech-stack" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/30 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modern Software Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-3 leading-tight">
            Powered by Modern Software &amp; AI Infrastructure
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            High-concurrency microservices, real-time speech processing, and sandboxed code compilation.
          </p>
        </div>

        {/* Single Row of 5 Core Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stack.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-4 rounded-2xl bg-surface border border-surface-container shadow-xs flex flex-col items-center text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>

        {/* Link to Full Tech Stack Page */}
        <div className="text-center">
          <a
            href="/technology"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-xs hover:bg-slate-800 transition-all"
          >
            <span>Explore complete architectural software stack table</span>
            <Cpu className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

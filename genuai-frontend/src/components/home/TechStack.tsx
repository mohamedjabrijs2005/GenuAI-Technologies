import React from 'react';
import { Code, Server, Database, Sparkles, Shield, Mail, Cloud, Cpu } from 'lucide-react';

export const TechStack: React.FC = () => {
  const stack = [
    { name: 'React.js & TypeScript', category: 'Frontend', desc: 'Reactive, type-safe user interface architecture with modular components', icon: Code },
    { name: 'Tailwind CSS', category: 'Design System', desc: 'Custom high-contrast aesthetic design tokens and responsive utility styling', icon: Sparkles },
    { name: 'Node.js & Express.js', category: 'Backend Engine', desc: 'High-concurrency microservices and assessment routing pipelines', icon: Server },
    { name: 'Supabase', category: 'Database & Store', desc: 'PostgreSQL relational store with row-level security and fast queries', icon: Database },
    { name: 'Google Gemini API', category: 'AI Intelligence', desc: 'Multi-modal candidate assessment analysis and natural dialogue synthesis', icon: Sparkles },
    { name: 'Anthropic Claude API', category: 'AI Reasoning', desc: 'Deep technical code reasoning and complex problem-solving evaluation', icon: Cpu },
    { name: 'Groq API', category: 'Fast Inference', desc: 'Ultra-low-latency real-time evaluation and speech analysis', icon: Sparkles },
    { name: 'OAuth Authentication', category: 'Security & Auth', desc: 'Secure Google and GitHub identity verification and session tokens', icon: Shield },
    { name: 'Gmail API', category: 'Communication', desc: 'Automated candidate scorecard dispatch and credential verification notifications', icon: Mail },
    { name: 'Vercel & Render', category: 'Deployment', desc: 'Global CDN distribution and auto-scaling cloud microservices infrastructure', icon: Cloud },
  ];

  return (
    <section id="tech-stack" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/30 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modern Software Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Powered by Modern Software &amp; AI
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Engineered with modern, reliable, and scalable web, AI, and cloud technologies designed for high-concurrency recruitment operations.
          </p>
        </div>

        {/* 10 Software Technology Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {stack.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-surface-container shadow-xs hover:border-indigo-brand/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

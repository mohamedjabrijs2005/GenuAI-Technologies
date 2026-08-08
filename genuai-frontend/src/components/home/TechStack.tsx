import React from 'react';
import { Cpu, Code2, Database, Cloud, Shield, Mail, Zap, Server, Globe } from 'lucide-react';

export const TechStack: React.FC = () => {
  const stack = [
    { name: 'React.js & TypeScript', category: 'Frontend', desc: 'Reactive UI architecture with strict type safety', icon: Code2 },
    { name: 'Tailwind CSS', category: 'Design System', desc: 'Utility-first responsive aesthetic framework', icon: Zap },
    { name: 'Node.js & Express.js', category: 'Backend Engine', desc: 'High-concurrency microservices & assessment routers', icon: Server },
    { name: 'Supabase', category: 'Database & Auth', desc: 'PostgreSQL relational store with row-level security', icon: Database },
    { name: 'Google Gemini API', category: 'AI Reasoning', desc: 'Multimodal evaluation & semantic question synthesis', icon: Cpu },
    { name: 'Anthropic Claude API', category: 'AI Intelligence', desc: 'Contextual code analysis & natural conversation', icon: Cpu },
    { name: 'Groq LPU Engine', category: 'Fast Inference', desc: 'Ultra-low latency LLM proctoring & interview scoring', icon: Zap },
    { name: 'OAuth 2.0', category: 'Authentication', desc: 'Secure Google, Microsoft, and corporate single sign-on', icon: Shield },
    { name: 'Gmail API', category: 'Notifications', desc: 'Verified transactional test invites and dispatch notifications', icon: Mail },
    { name: 'Vercel & Render', category: 'Edge Cloud', desc: 'Global CDN distribution and auto-scaling backend infrastructure', icon: Cloud },
    { name: 'GenuAI Edge AI', category: 'Hardware Unit', desc: 'Raspberry Pi 5 + Google Coral TPU local inference engine', icon: Cpu },
  ];

  return (
    <section id="tech-stack" className="py-20 sm:py-24 lg:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-brand/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modern Engineering Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            Powered by Modern Technology
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Engineered with modern, reliable, and scalable web, AI, and edge technologies designed for high-concurrency recruitment operations.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stack.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="glass rounded-3xl p-5 border border-surface-container shadow-xs hover:border-indigo-brand/40 hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center group-hover:bg-indigo-brand group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-bright text-on-surface-variant uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-on-surface mb-1">
                  {item.name}
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

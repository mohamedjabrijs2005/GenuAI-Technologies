import React from 'react';
import { BarChart3, BrainCircuit, UserCheck, ShieldCheck, Building2, CheckCircle2, TrendingUp } from 'lucide-react';

export const RecruitmentIntelligence: React.FC = () => {
  const stages = [
    { title: 'Candidate Performance', desc: 'Real assessment telemetry & code submissions', icon: UserCheck },
    { title: 'AI Analysis', desc: 'Multi-modal natural language & vision evaluation', icon: BrainCircuit },
    { title: 'Skill Insights', desc: 'Granular competency breakdown across 20+ parameters', icon: BarChart3 },
    { title: 'Verification', desc: 'Anti-proxy biometric trust scoring & evidence log', icon: ShieldCheck },
    { title: 'Company Matching', desc: 'Standardized score distribution to chosen employers', icon: Building2 },
    { title: 'Recruitment Decision', desc: 'Data-driven hiring offers and interview invites', icon: CheckCircle2 },
  ];

  return (
    <section id="intelligence" className="py-20 sm:py-24 lg:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-brand/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Actionable Hiring Analytics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            From Assessment Data to Hiring Intelligence
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Raw test scores alone do not tell the whole story. GenuAI converts thousands of live behavioral, technical, and collaborative data points into clear hiring intelligence.
          </p>
        </div>

        {/* 6 Stage Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {stages.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.title}
                className="glass rounded-3xl p-5 border border-surface-container shadow-xs text-center flex flex-col justify-between hover:border-indigo-brand/40 transition-all group"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-brand/10 text-indigo-brand mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-indigo-brand uppercase tracking-wider mb-1">
                    Stage 0{idx + 1}
                  </div>
                  <h3 className="text-xs font-bold text-on-surface mb-1.5 leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {st.desc}
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

import React from 'react';
import { UserCheck, Building2, Shield, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onSelectRole: (role: 'candidate' | 'company' | 'admin') => void;
}

export const RoleSelectionModal: React.FC<Props> = ({ onSelectRole }) => {
  const roles = [
    {
      key: 'candidate' as const,
      title: 'CANDIDATE',
      tagline: 'Find opportunities and verify your skills.',
      desc: 'Take one unified AI assessment, prove your coding & communication competencies, and connect with multiple verified employers.',
      icon: UserCheck,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Job Seeker',
    },
    {
      key: 'company' as const,
      title: 'COMPANY',
      tagline: 'Discover and evaluate verified talent.',
      desc: 'Screen pre-verified applicants, access tamper-evident AI Trust Scores, and fast-track hiring with zero redundant testing overhead.',
      icon: Building2,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Employer',
    },
    {
      key: 'admin' as const,
      title: 'ADMIN / INSTITUTION',
      tagline: 'Manage recruitment and assessment operations.',
      desc: 'Oversee placement drives, configure custom assessment benchmarks, review anti-proxy audit logs, and manage governance.',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Placement & Ops',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-on-background/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface border border-surface-container rounded-3xl p-6 sm:p-10 max-w-4xl w-full shadow-2xl animate-[fadeIn_0.3s_ease]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to GenuAI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-on-surface mb-2">
            What brings you to GenuAI?
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Select your role to personalize your platform experience and redirect to your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => onSelectRole(r.key)}
                className="glass rounded-2xl p-6 border border-surface-container hover:border-indigo-brand hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant uppercase">
                      {r.badge}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider mb-1">
                    {r.title}
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">
                    "{r.tagline}"
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {r.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-surface-container flex items-center justify-between text-xs font-bold text-indigo-brand group-hover:text-indigo-brand-dark">
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

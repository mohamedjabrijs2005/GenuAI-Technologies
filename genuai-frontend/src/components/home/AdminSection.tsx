import React from 'react';
import { Users, Building, Shield, ArrowRight, BarChart3, Database, KeyRound, SlidersHorizontal, Scale, Eye, Activity, FileCheck } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const AdminSection: React.FC<Props> = ({ onProtectedAction }) => {
  const adminTools = [
    { title: 'Global Assessment Monitoring', desc: 'Real-time telemetry and proctoring activity feeds across all live testing sessions.', icon: Eye },
    { title: 'AI Model Drift & Calibration', desc: 'Audit anti-proxy confidence thresholds, false positive logs, and accuracy metrics.', icon: SlidersHorizontal },
    { title: 'Institutional User Management', desc: 'Role-based access control (RBAC), API keys, and partner organization provisioning.', icon: KeyRound },
    { title: 'Compliance & Audit Logs', desc: 'Immutable activity tracking for fairness, dispute investigations, and DPDP/GDPR requests.', icon: FileCheck },
    { title: 'Cross-Company Analytics', desc: 'Aggregated hiring benchmarks, score distributions, and talent pipeline health metrics.', icon: BarChart3 },
    { title: 'Dispute & Appeal Resolution', desc: '14-day appeal workflow console for reviewing candidate score challenges.', icon: Scale },
    { title: 'System Health & Cloud Clusters', desc: 'Latency, uptime, and cluster workload telemetry across distributed cloud workers.', icon: Activity },
    { title: 'Enterprise Data Lake', desc: 'Secure, encrypted candidate assessment storage with granular retention policies.', icon: Database },
  ];

  const handleProtectedClick = (toolTitle: string) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'admin',
        title: 'Ready to enter Institutional Governance?',
        description: `Sign in or create an account to access ${toolTitle} and oversee verified recruitment operations.`,
      });
    }
  };

  return (
    <section id="admin" className="py-12 sm:py-16 lg:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-purple-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Institutional Governance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            One Ecosystem. Complete Recruitment Control.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Designed for university placement cells, corporate talent heads, and ecosystem administrators to oversee verified recruitment at institutional scale.
          </p>
        </div>

        {/* Ecosystem Visual: Candidates <-> GenuAI <-> Companies, Admin <-> GenuAI */}
        <div className="glass rounded-3xl p-6 sm:p-10 border border-surface-container shadow-xl mb-10 sm:mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-indigo-brand uppercase tracking-widest bg-indigo-brand/10 px-3 py-1 rounded-full border border-indigo-brand/20">
              Institutional Tri-Party Ecosystem
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
            {/* Candidates */}
            <div
              onClick={() => handleProtectedClick('Candidate Placement Console')}
              className="p-6 rounded-2xl bg-surface-bright border border-surface-container cursor-pointer hover:border-blue-500/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 mx-auto flex items-center justify-center font-bold mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-on-surface">Candidates &amp; Students</div>
              <div className="text-xs text-on-surface-variant mt-1">Take Single Verified Assessment</div>
            </div>

            {/* Central GenuAI Engine */}
            <div
              onClick={() => handleProtectedClick('Central Governance Hub')}
              className="p-8 rounded-3xl bg-gradient-to-br from-indigo-brand to-indigo-brand-dark text-white shadow-xl relative overflow-hidden cursor-pointer"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-100 mb-2">Central Core</div>
              <div className="text-2xl font-black mb-1">GENUAI HUB</div>
              <div className="text-xs text-indigo-200">Intelligence, Verification &amp; Distribution</div>
              <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold">
                Governance &amp; Anti-Proxy Layer
              </div>
            </div>

            {/* Companies */}
            <div
              onClick={() => handleProtectedClick('Partner Employer Portal')}
              className="p-6 rounded-2xl bg-surface-bright border border-surface-container cursor-pointer hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center font-bold mb-3">
                <Building className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-on-surface">Partner Employers</div>
              <div className="text-xs text-on-surface-variant mt-1">Instant Verified Talent Access</div>
            </div>
          </div>

          {/* Bottom Admin Link */}
          <div className="mt-8 pt-6 border-t border-surface-container text-center">
            <button
              onClick={() => handleProtectedClick('Full Ecosystem Governance')}
              className="inline-flex items-center gap-2 text-xs font-bold text-on-surface bg-surface px-4 py-2 rounded-2xl border border-surface-container hover:bg-surface-bright hover:border-purple-500/30 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Institutions &amp; Administrators ↕ Full Governance &amp; Analytics Oversight</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-purple-600" />
            </button>
          </div>
        </div>

        {/* 8 Admin Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {adminTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                onClick={() => handleProtectedClick(tool.title)}
                className="glass rounded-3xl p-5 border border-surface-container shadow-xs hover:border-purple-500/40 hover:-translate-y-1 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-on-surface mb-2">{tool.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{tool.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container/60 flex items-center text-[11px] font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                  <span>Open Console</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

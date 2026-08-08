import React from 'react';
import { UserCheck, Building2, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const About: React.FC<Props> = ({ onProtectedAction }) => {
  const cards = [
    {
      role: 'CANDIDATE',
      intent: 'candidate',
      tagline: 'Prove your skills.',
      description:
        'Take one comprehensive, proctored assessment across technical, verbal, and collaboration dimensions. Build a tamper-proof credential that opens doors to multiple companies.',
      icon: UserCheck,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Skill Freedom',
      modalTitle: 'Ready to enter the Candidate Ecosystem?',
      modalDesc: 'Sign in or create an account to take assessments, build your verified profile, and unlock multi-company opportunities.',
    },
    {
      role: 'COMPANY',
      intent: 'company',
      tagline: 'Discover verified talent.',
      description:
        'Access standardized, authentic candidate evaluations without incurring massive infrastructure costs or building complex assessment pipelines from scratch.',
      icon: Building2,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Zero Retest Overhead',
      modalTitle: 'Ready to enter the Company Ecosystem?',
      modalDesc: 'Sign in or create an account to discover authenticated talent, access standardized scorecards, and streamline hiring.',
    },
    {
      role: 'GENUAI',
      intent: 'genuai',
      tagline: 'Connect skills with opportunity.',
      description:
        'The intelligent recruitment layer that unifies assessment, anti-proxy verification, edge computing, and predictive hiring analytics into a trusted ecosystem.',
      icon: Cpu,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Unified Intelligence',
      modalTitle: 'Ready to enter the GenuAI Ecosystem?',
      modalDesc: 'Sign in or create an account to access institutional placement analytics and ecosystem governance.',
    },
  ];

  const handleCardClick = (c: typeof cards[0]) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: c.intent,
        title: c.modalTitle,
        description: c.modalDesc,
      });
    }
  };

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/50 relative border-t border-b border-surface-container/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Unified Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            What is GenuAI?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            GenuAI is a unified AI-powered recruitment ecosystem connecting <strong className="text-on-surface">Candidates</strong>, <strong className="text-on-surface">Companies</strong>, <strong className="text-on-surface">Institutions</strong>, and <strong className="text-on-surface">Administrators</strong> through intelligent assessment, verification, and recruitment analytics.
          </p>
        </div>

        {/* Three Connected Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 relative">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.role}
                onClick={() => handleCardClick(c)}
                className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-surface-container shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider">
                      {c.badge}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-indigo-brand uppercase tracking-widest mb-1">
                    {c.role}
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-3">
                    "{c.tagline}"
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-surface-container/60 flex items-center text-xs font-bold text-indigo-brand group-hover:text-indigo-brand-dark transition-colors">
                  <span>Explore Ecosystem Role</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

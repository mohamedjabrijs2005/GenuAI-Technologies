import React from 'react';
import { Building2, ShieldAlert, Cpu, BarChart2, ShieldCheck, Video, LayoutDashboard, ArrowRight } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const CompanySection: React.FC<Props> = ({ onProtectedAction }) => {
  const features = [
    { title: 'Zero Assessment Overhead', desc: 'Eliminate the cost of building custom aptitude and coding testing clusters.', icon: Building2 },
    { title: 'Anti-Proxy Verification', desc: 'Screen out fraudulent candidates, fake profiles, and remote proxy test-takers.', icon: ShieldAlert },
    { title: 'Standardized Scoring', desc: 'Trust consistent, calibrated scorecards across all candidate applications.', icon: Cpu },
    { title: 'Pre-Screened Talent Pool', desc: 'Instantly access pre-evaluated candidates matching your exact role criteria.', icon: ShieldCheck },
    { title: 'Recruitment Analytics', desc: 'Real-time hiring pipelines, cohort benchmarks, and candidate analytics.', icon: BarChart2 },
    { title: 'Integrated Video Interviews', desc: 'View AI-recorded technical interviews with instant transcription and scorecards.', icon: Video },
    { title: 'Company Dashboard', desc: 'Centralized portal to review verified scorecards, schedule interviews, and issue offers.', icon: LayoutDashboard },
  ];

  const handleProtectedClick = (featureTitle: string) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'company',
        title: 'Ready to enter the Company Ecosystem?',
        description: `Sign in or create an account to access ${featureTitle} and streamline verified hiring.`,
      });
    }
  };

  return (
    <section id="companies" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-emerald-500/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Recruitment Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-2 sm:mb-4 leading-tight">
            From Applicants to Verified Talent
          </h2>
          <p className="text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2 sm:mb-4">
            "Discover skills. Verify talent. Hire smarter."
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Eliminate candidate ghosting and proxy fraud. Access pre-screened, authentic candidate evaluations ready for instant interview fast-tracking.
          </p>
        </div>

        {/* 7 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                onClick={() => handleProtectedClick(f.title)}
                className="glass rounded-3xl p-5 border border-surface-container shadow-xs hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container/60 flex items-center text-[11px] font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  <span>Access Company Tool</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-6 rounded-3xl bg-surface border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold text-on-surface">Enter the Employer Talent Hub</div>
            <div className="text-xs text-on-surface-variant">Instant access to verified assessment scorecards and candidate analytics.</div>
          </div>
          <button
            onClick={() => handleProtectedClick('Company Dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Access Company Portal
          </button>
        </div>
      </div>
    </section>
  );
};

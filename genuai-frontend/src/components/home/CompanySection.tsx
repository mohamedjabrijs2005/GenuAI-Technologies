import React from 'react';
import { Building2, Search, Code, Users, Video, FolderGit2, ShieldCheck, BarChart3, BrainCircuit, LayoutDashboard } from 'lucide-react';

export const CompanySection: React.FC = () => {
  const features = [
    { title: 'AI Resume Screening', desc: 'Automated skill extraction and ATS ranking across thousands of incoming applications.', icon: Search },
    { title: 'Role-Based Assessments', desc: 'Pre-calibrated test modules mapped directly to specific job descriptions.', icon: Building2 },
    { title: 'Coding Evaluation', desc: 'Multi-language compiler with plagiarism checks and runtime performance benchmarks.', icon: Code },
    { title: 'Group Discussions', desc: 'Structured assessment of peer leadership, active listening, and negotiation skills.', icon: Users },
    { title: 'AI Interviews', desc: 'Automated technical interviews with contextual follow-ups and speech scoring.', icon: Video },
    { title: 'Project Assessment', desc: 'Code repository validation evaluating production architecture and design patterns.', icon: FolderGit2 },
    { title: 'Candidate Verification', desc: 'Biometric identity, gaze orientation, and anti-proxy proctoring reports.', icon: ShieldCheck },
    { title: 'Recruitment Analytics', desc: 'Real-time hiring funnel metrics, pipeline velocity, and talent quality indicators.', icon: BarChart3 },
    { title: 'AI Decision Support', desc: 'Predictive candidate fit recommendations based on verified historical scores.', icon: BrainCircuit },
    { title: 'Company Dashboard', desc: 'Centralized portal to review verified scorecards, schedule interviews, and issue offers.', icon: LayoutDashboard },
  ];

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

        {/* 10 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass rounded-3xl p-5 border border-surface-container shadow-xs hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

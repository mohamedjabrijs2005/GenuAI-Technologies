import React from 'react';
import { UserCheck, FileText, Code, Users, Video, FolderGit2, Award, Building, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';

export const CandidateSection: React.FC = () => {
  const features = [
    { title: 'One Assessment → Multiple Opportunities', desc: 'Attempt one unified test and share results with all your selected target employers.', icon: Award },
    { title: 'AI Resume Analysis', desc: 'Instant ATS scoring, keyword detection, and CV improvement recommendations.', icon: FileText },
    { title: 'Skill Assessments', desc: 'Adaptive testing for aptitude, verbal fluency, and domain-specific knowledge.', icon: UserCheck },
    { title: 'Coding Practice', desc: 'Interactive IDE with automated test cases and algorithmic complexity feedback.', icon: Code },
    { title: 'GD Practice', desc: 'AI-guided simulated group discussions to build communication confidence.', icon: Users },
    { title: 'AI Interview Practice', desc: 'Voice-enabled AI mock interviews with instant speech clarity and technical scoring.', icon: Video },
    { title: 'Project-Based Assessment', desc: 'Real-world repository challenges proving hands-on engineering capabilities.', icon: FolderGit2 },
    { title: 'Verified Skill Profile', desc: 'A tamper-proof credential passport demonstrating authenticated competencies.', icon: ShieldCheck },
    { title: 'Company Matching', desc: 'Intelligent role recommendation matching your skill footprint to open vacancies.', icon: Building },
    { title: 'Recruitment Insights', desc: 'Benchmark your performance against global peer percentiles and market standards.', icon: BarChart2 },
  ];

  return (
    <section id="candidates" className="py-12 sm:py-16 lg:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Candidate Empowerment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-2 sm:mb-4 leading-tight">
            Built for Candidates
          </h2>
          <p className="text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-brand to-[#7C3AED] mb-2 sm:mb-4">
            "Your skills should travel with you."
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Stop wasting weeks taking identical tests. Prove your competencies once and let your verified talent passport unlock opportunities across top technology leaders.
          </p>
        </div>

        {/* 10 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass rounded-3xl p-5 border border-surface-container shadow-xs hover:border-indigo-brand/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center mb-4 group-hover:bg-indigo-brand group-hover:text-white transition-colors">
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

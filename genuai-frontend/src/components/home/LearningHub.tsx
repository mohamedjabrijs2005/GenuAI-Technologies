import React from 'react';
import { BookOpen, Code, Mic, Users, Video, FolderGit2, Globe2, ArrowRight } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const LearningHub: React.FC<Props> = ({ onProtectedAction }) => {
  const hubs = [
    { title: 'Aptitude Sandbox', desc: 'Unlimited practice tests covering numerical ability, data interpretation, and deductive logic.', icon: BookOpen },
    { title: 'Coding Practice IDE', desc: 'Real-time multi-language code runner with 500+ data structures & algorithms challenges.', icon: Code },
    { title: 'AI-Guided GD Simulator', desc: 'Practice debate pacing, active listening, and constructive rebuttal in simulated groups.', icon: Users },
    { title: 'AI Mock Interview', desc: 'Interactive AI voice agent asking domain-specific questions with instant feedback.', icon: Video },
    { title: 'Project Sandbox', desc: 'Build and test production-ready micro-apps directly linked to your Git profile.', icon: FolderGit2 },
    { title: 'Multilingual Support', desc: 'Speech evaluation and practice modules calibrated across diverse global accents.', icon: Globe2 },
  ];

  const languages = [
    { name: 'English', status: 'Active • Live' },
    { name: 'Tamil (தமிழ்)', status: 'Planned • Roadmap' },
    { name: 'Hindi (हिन्दी)', status: 'Planned • Roadmap' },
    { name: 'Japanese (日本語)', status: 'Planned • Roadmap' },
    { name: 'Chinese (中文)', status: 'Planned • Roadmap' },
  ];

  const handlePracticeClick = (hubTitle: string) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'candidate',
        title: 'Ready to practice in the Learning Hub?',
        description: `Sign in or create an account to access ${hubTitle}, mock tests, and real-time coding sandboxes.`,
      });
    }
  };

  return (
    <section id="learning-hub" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Inclusive Learning &amp; Upskilling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Learn. Practice. Get Verified.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Assessment without preparation creates anxiety. GenuAI provides complete practice environments so candidates can sharpen their coding, speaking, and collaboration skills before taking the official evaluation.
          </p>
        </div>

        {/* 6 Learning Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <div
                key={hub.title}
                onClick={() => handlePracticeClick(hub.title)}
                className="glass rounded-3xl p-6 border border-surface-container shadow-xs hover:border-blue-500/40 hover:-translate-y-1 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">{hub.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{hub.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-container/60 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>Practice Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Multilingual Vision Callout */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-surface-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider">
                Multilingual AI Evaluation Engine
              </div>
              <div className="text-lg font-bold text-on-surface">Supporting Diverse Linguistic Backgrounds</div>
              <p className="text-xs text-on-surface-variant max-w-xl">
                GenuAI is designed to remove linguistic bias. Candidates can demonstrate technical problem solving while receiving native language coaching.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-surface-container text-xs font-bold text-on-surface flex items-center gap-2"
                >
                  <span>{lang.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand" />
                  <span className="text-[10px] text-on-surface-variant font-normal">{lang.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

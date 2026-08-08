import React from 'react';
import { BookOpen, Code, Mic, Users, Video, Globe, Sparkles, Check, Languages } from 'lucide-react';

export const LearningHub: React.FC = () => {
  const hubs = [
    { title: 'Coding Practice IDE', desc: 'Algorithm challenges, data structure drills, and test case validators.', icon: Code },
    { title: 'SVAR Verbal Lab', desc: 'Pronunciation drills, speech fluency benchmarks, and conversational coaching.', icon: Mic },
    { title: 'AI Mock Interviews', desc: 'Simulated technical & behavioral interviews with instant speech evaluation.', icon: Video },
    { title: 'GD Simulation Arena', desc: 'Topic-based collaborative discussions with automated moderation.', icon: Users },
    { title: 'Curated Learning Tracks', desc: 'Structured roadmaps covering full-stack web, AI engineering, and cloud systems.', icon: BookOpen },
    { title: 'Skill Benchmark Drills', desc: 'Timed mock quizzes calibrated to actual company recruitment patterns.', icon: Sparkles },
  ];

  const languages = [
    { name: 'English', status: 'Active • Live' },
    { name: 'Tamil (தமிழ்)', status: 'Planned • Roadmap' },
    { name: 'Hindi (हिन्दी)', status: 'Planned • Roadmap' },
    { name: 'Japanese (日本語)', status: 'Planned • Roadmap' },
    { name: 'Chinese (中文)', status: 'Planned • Roadmap' },
  ];

  return (
    <section id="learning-hub" className="py-20 sm:py-24 lg:py-32 bg-surface-bright/50 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Inclusive Learning &amp; Upskilling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            Learn. Practice. Get Verified.
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Assessment without preparation creates anxiety. GenuAI provides complete practice environments so candidates can sharpen their coding, speaking, and collaboration skills before taking the official evaluation.
          </p>
        </div>

        {/* 6 Learning Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <div
                key={hub.title}
                className="glass rounded-3xl p-6 sm:p-8 border border-surface-container shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">
                    {hub.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {hub.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multilingual Vision Card */}
        <div className="glass rounded-3xl p-8 sm:p-10 border border-surface-container shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider">Multilingual Vision</div>
              <h3 className="text-lg font-bold text-on-surface">"Learn in the language you understand best."</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
            We are architecting native language interfaces so talent from diverse linguistic backgrounds can access high-quality technical preparation without linguistic barriers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {languages.map((lang) => (
              <div key={lang.name} className="p-3 rounded-2xl bg-surface border border-surface-container text-xs font-bold text-on-surface">
                <div>{lang.name}</div>
                <div className="text-[10px] text-indigo-brand font-medium mt-1">{lang.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

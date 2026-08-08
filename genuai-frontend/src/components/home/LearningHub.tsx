import React, { useState } from 'react';
import { BookOpen, Code, Mic, Users, Video, FolderGit2, Globe2, ArrowRight, Terminal, CheckCircle2 } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const LearningHub: React.FC<Props> = ({ onProtectedAction }) => {
  const [activeTab, setActiveTab] = useState<'spoken' | 'programming'>('spoken');

  const hubs = [
    { title: 'Aptitude Sandbox', desc: 'Unlimited practice tests covering numerical ability, data interpretation, and deductive logic.', icon: BookOpen },
    { title: 'Coding Practice IDE', desc: 'Real-time multi-language code runner with 500+ data structures & algorithms challenges.', icon: Code },
    { title: 'AI-Guided GD Simulator', desc: 'Practice debate pacing, active listening, and constructive rebuttal in simulated groups.', icon: Users },
    { title: 'AI Mock Interview', desc: 'Interactive AI voice agent asking domain-specific questions with instant feedback.', icon: Video },
    { title: 'Project Sandbox', desc: 'Build and test production-ready micro-apps directly linked to your Git profile.', icon: FolderGit2 },
    { title: 'Multilingual Support', desc: 'Speech evaluation and practice modules calibrated across diverse global accents.', icon: Globe2 },
  ];

  // 1. Natural Spoken & Regional Languages in GenuAI
  const spokenLanguages = [
    { name: 'English', native: 'Global Standard', status: 'Active • Live', live: true, flag: '🌐' },
    { name: 'Tamil', native: 'தமிழ்', status: 'Active Beta', live: true, flag: '🇮🇳' },
    { name: 'Hindi', native: 'हिन्दी', status: 'Active Beta', live: true, flag: '🇮🇳' },
    { name: 'Telugu', native: 'తెలుగు', status: 'Planned • Roadmap', live: false, flag: '🇮🇳' },
    { name: 'Kannada', native: 'ಕನ್ನಡ', status: 'Planned • Roadmap', live: false, flag: '🇮🇳' },
    { name: 'Malayalam', native: 'മലയാളം', status: 'Planned • Roadmap', live: false, flag: '🇮🇳' },
    { name: 'Bengali', native: 'বাংলা', status: 'Planned • Roadmap', live: false, flag: '🇮🇳' },
    { name: 'Japanese', native: '日本語', status: 'Planned • Roadmap', live: false, flag: '🇯🇵' },
    { name: 'Chinese (Mandarin)', native: '中文', status: 'Planned • Roadmap', live: false, flag: '🇨🇳' },
    { name: 'German', native: 'Deutsch', status: 'Planned • Roadmap', live: false, flag: '🇩🇪' },
    { name: 'French', native: 'Français', status: 'Planned • Roadmap', live: false, flag: '🇫🇷' },
    { name: 'Spanish', native: 'Español', status: 'Planned • Roadmap', live: false, flag: '🇪🇸' },
    { name: 'Arabic', native: 'العربية', status: 'Planned • Roadmap', live: false, flag: '🇦🇪' },
  ];

  // 2. Programming Languages in GenuAI Compiler & IDE Sandbox
  const programmingLanguages = [
    { name: 'Python 3.12', type: 'DSA, ML & Scripting', status: 'Active • Live Compiler', live: true, icon: '🐍' },
    { name: 'JavaScript (Node.js 20)', type: 'Frontend & Full Stack', status: 'Active • Live Compiler', live: true, icon: '⚡' },
    { name: 'TypeScript', type: 'Type-Safe Applications', status: 'Active • Live Compiler', live: true, icon: '🔷' },
    { name: 'Java 21 (LTS)', type: 'Enterprise & System Design', status: 'Active • Live Compiler', live: true, icon: '☕' },
    { name: 'C++ 20 (GCC 13)', type: 'High Performance & CP', status: 'Active • Live Compiler', live: true, icon: '⚙️' },
    { name: 'C (C17 Standard)', type: 'Systems & Low Level', status: 'Active • Live Compiler', live: true, icon: '💻' },
    { name: 'Go (Golang 1.22)', type: 'Microservices & Concurrency', status: 'Active • Live Compiler', live: true, icon: '🐹' },
    { name: 'Rust (2021 Edition)', type: 'Memory Safety & WebAssembly', status: 'Active • Live Compiler', live: true, icon: '🦀' },
    { name: 'SQL (Postgres & MySQL)', type: 'Database Query Optimization', status: 'Active • Live Engine', live: true, icon: '🗄️' },
    { name: 'HTML5 & CSS3', type: 'UI & Layout Architecture', status: 'Active • Live Sandbox', live: true, icon: '🎨' },
  ];

  const handlePracticeClick = (hubTitle: string) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'candidate',
        title: 'Ready to practice in the Learning Hub?',
        description: `Sign in or create an account to access ${hubTitle}, mock tests, and real-time multi-language coding sandboxes.`,
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

        {/* Multilingual & Multi-Language Ecosystem Showcase */}
        <div className="glass rounded-3xl p-6 sm:p-8 lg:p-10 border border-surface-container shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-surface-container mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-brand/10 text-indigo-brand text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-indigo-brand/20">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Multilingual &amp; Polyglot Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
                Languages Supported Across the GenuAI Ecosystem
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
                Removing bias across both human spoken languages and technical programming languages.
              </p>
            </div>

            {/* Toggle Switch between Spoken and Programming */}
            <div className="flex items-center p-1 rounded-2xl bg-surface border border-surface-container shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('spoken')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'spoken'
                    ? 'bg-indigo-brand text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Natural / Spoken ({spokenLanguages.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('programming')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'programming'
                    ? 'bg-indigo-brand text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Programming / Tech ({programmingLanguages.length})</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Spoken & Regional Languages Grid */}
          {activeTab === 'spoken' ? (
            <div className="animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Human Voice &amp; Communication Evaluation
                </span>
                <span className="text-[11px] font-semibold text-success-dark flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Continuous Speech AI &amp; Regional Dialect Calibration
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {spokenLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      lang.live
                        ? 'bg-surface border-indigo-brand/30 shadow-xs'
                        : 'bg-surface-bright/80 border-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                          <span>{lang.name}</span>
                          <span className="text-[11px] font-normal text-on-surface-variant font-sans">
                            ({lang.native})
                          </span>
                        </div>
                        <div className="text-[10px] text-on-surface-variant">Speech &amp; GD Coaching</div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        lang.live
                          ? 'bg-success/15 text-success-dark border-success/30'
                          : 'bg-surface-container text-on-surface-variant border-surface-container-high'
                      }`}
                    >
                      {lang.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Tab 2: Programming Languages & IDE Compilers Grid */
            <div className="animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Multi-Language Cloud Compiler &amp; Sandbox Engines
                </span>
                <span className="text-[11px] font-semibold text-indigo-brand flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-brand" />
                  Instant Automated Test Cases &amp; Complexity Analysis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {programmingLanguages.map((tech) => (
                  <div
                    key={tech.name}
                    className="p-3 rounded-2xl bg-surface border border-indigo-brand/20 shadow-xs hover:border-indigo-brand/50 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{tech.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-on-surface">{tech.name}</div>
                        <div className="text-[10px] text-on-surface-variant">{tech.type}</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20">
                      Live IDE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

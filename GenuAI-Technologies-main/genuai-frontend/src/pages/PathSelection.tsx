import { useState } from 'react';

interface Props { user: any; onSelect: (path: 'practice' | 'search' | 'test' | 'career-profile') => void; onLogout: () => void; }

export default function PathSelection({ user, onSelect, onLogout }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const name = user?.user?.name || user?.name || 'Candidate';

  return (
    <div className="min-h-screen bg-background quantum-gradient font-body-base text-on-background relative overflow-hidden">
      
      {/* Decorative background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-gold/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-brand/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="h-16 border-b border-surface-container/50 bg-surface/80 backdrop-blur-xl px-margin-mobile md:px-margin-desktop flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-sm">
          <img src="/logo.png" alt="GenuAI" className="w-11 h-11 object-contain gold-glow-subtle" />
          <div className="hidden sm:block">
            <div className="font-headline-md text-on-surface text-[16px] leading-tight">GenuAI Technologies</div>
            <div className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest">Recruitment Intelligence</div>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-brand to-indigo-brand-dark flex items-center justify-center text-white font-bold text-sm shadow-sm">{name[0]?.toUpperCase()}</div>
          <div className="text-sm font-bold text-on-surface hidden sm:block">{name}</div>
          <button onClick={onLogout} className="px-sm py-[6px] border border-error-crimson/30 text-error-crimson rounded-lg font-bold text-xs hover:bg-error-crimson/10 transition-colors ml-sm">Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop py-xxl relative z-10">
        <div className="text-center mb-xxl animate-[fadeIn_0.5s_ease]">
          <div className="inline-flex items-center gap-2 bg-indigo-brand/10 border border-indigo-brand/20 rounded-full px-sm py-[6px] mb-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-brand animate-pulse"></span>
            <span className="text-[11px] font-bold text-indigo-brand uppercase tracking-wider">Welcome, {name}</span>
          </div>
          <h1 className="text-[40px] md:text-[56px] font-display-md text-on-surface mb-sm hero-title-weight">Choose Your Path</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Select how you'd like to use the GenuAI platform today. Take your time to explore.</p>
        </div>

        {/* Cards — Spacious Vertical Layout */}
        <div className="flex flex-col gap-xl">

          {/* 1. Practice Path */}
          <div
            onMouseEnter={() => setHovered('practice')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('practice')}
            className={`glass p-xl md:p-xxl rounded-[32px] cursor-pointer transition-all duration-500 transform ${hovered === 'practice' ? '-translate-y-2 ring-2 ring-indigo-brand/50 shadow-[0_20px_50px_rgba(79,70,229,0.15)] bg-indigo-brand/5' : 'hover:shadow-xl border border-surface-container'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center w-full">
              <div className="flex-1 flex flex-col justify-between md:pr-xl">
                <div>
                  <div className="flex items-center justify-between w-full mb-xl gap-2 md:gap-4">
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${hovered === 'practice' ? 'bg-indigo-brand text-white shadow-lg shadow-indigo-brand/30' : 'bg-surface-bright text-indigo-brand border border-surface-container'}`}>
                      <span className="material-symbols-outlined text-4xl">psychology</span>
                    </div>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-indigo-brand/10 text-indigo-brand text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-indigo-brand/20 whitespace-nowrap text-center">Most Popular</span>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-surface-container-high/50 whitespace-nowrap text-center">6 Modules</span>
                  </div>
                  
                  <h2 className="text-[32px] md:text-[40px] font-headline-md text-on-surface mb-sm leading-tight tracking-tight">Practice Path</h2>
                  <p className="text-body-lg text-on-surface-variant leading-relaxed mb-xl">
                    Build skills at your own pace with AI-powered tools, mock interviews, and inclusive learning. 
                    This comprehensive suite of practice modules is designed to bridge your skill gaps and prepare you for top-tier tech roles.
                  </p>

                  <div className="space-y-md mb-xl md:mb-0">
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'practice' ? 'bg-indigo-brand text-white shadow-md shadow-indigo-brand/20' : 'bg-indigo-brand/10 text-indigo-brand'}`}>
                        <span className="material-symbols-outlined text-[18px]">insights</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'practice' ? 'text-indigo-brand' : 'text-on-surface'}`}>Data-Driven Insights</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Identify and bridge your skill gaps using AI analytics.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'practice' ? 'bg-indigo-brand text-white shadow-md shadow-indigo-brand/20' : 'bg-indigo-brand/10 text-indigo-brand'}`}>
                        <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'practice' ? 'text-indigo-brand' : 'text-on-surface'}`}>Confidence Building</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Gain confidence for real interviews through simulations.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'practice' ? 'bg-indigo-brand text-white shadow-md shadow-indigo-brand/20' : 'bg-indigo-brand/10 text-indigo-brand'}`}>
                        <span className="material-symbols-outlined text-[18px]">speed</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'practice' ? 'text-indigo-brand' : 'text-on-surface'}`}>Flexible Pacing</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Learn at your own pace with 24/7 access to AI tutors.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-surface-container/50 pt-lg md:pt-0 md:pl-xl flex flex-col justify-between">
                <div className="flex flex-col gap-sm mb-xl">
                  {[
                    {text: 'AI Mock Interview', icon: 'smart_toy', desc: 'Simulated technical & behavioral interviews with AI feedback.'},
                    {text: 'Skill Test Practice', icon: 'code', desc: 'Mock assessments for coding, aptitude, and automata.'},
                    {text: 'Project Building', icon: 'developer_board', desc: 'Hands-on practice building full-stack projects.'},
                    {text: 'Group Discussion', icon: 'groups', desc: 'AI-moderated group discussions to test leadership.'},
                    {text: 'SVAR Speaking', icon: 'record_voice_over', desc: 'Verbal communication and fluency exercises.'},
                    {text: 'Inclusive Learning', icon: 'school', desc: 'Curated courses, DSA sheets, and interview prep.'}
                  ].map((item, i) => (
                    <div key={i} className={`rounded-2xl p-sm flex items-start gap-md transition-colors ${hovered === 'practice' ? 'bg-white/60 shadow-sm border border-white' : 'bg-surface-bright border border-surface-container/50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${hovered === 'practice' ? 'bg-indigo-brand/10 text-indigo-brand' : 'bg-surface-container text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'practice' ? 'text-indigo-brand' : 'text-on-surface'}`}>{item.text}</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-md">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'practice' ? 'bg-indigo-brand/30' : 'bg-surface-container'}`} />
                  <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${hovered === 'practice' ? 'text-indigo-brand' : 'text-on-surface-variant'}`}>
                    Start Learning <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Search Path */}
          <div
            onMouseEnter={() => setHovered('search')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('search')}
            className={`glass p-xl md:p-xxl rounded-[32px] cursor-pointer transition-all duration-500 transform ${hovered === 'search' ? '-translate-y-2 ring-2 ring-accent-gold/50 shadow-[0_20px_50px_rgba(245,158,11,0.15)] bg-accent-gold/5' : 'hover:shadow-xl border border-surface-container'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center w-full">
              <div className="flex-1 flex flex-col justify-between md:pr-xl">
                <div>
                  <div className="flex items-center justify-between w-full mb-xl gap-2 md:gap-4">
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${hovered === 'search' ? 'bg-accent-gold text-on-tertiary shadow-lg shadow-accent-gold/30' : 'bg-surface-bright text-accent-gold border border-surface-container'}`}>
                      <span className="material-symbols-outlined text-4xl">public</span>
                    </div>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-accent-gold/10 text-accent-gold-dark text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-accent-gold/20 whitespace-nowrap text-center">Live Network</span>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-surface-container-high/50 whitespace-nowrap text-center">4 Features</span>
                  </div>
                  
                  <h2 className="text-[32px] md:text-[40px] font-headline-md text-on-surface mb-sm leading-tight tracking-tight">Search Hub</h2>
                  <p className="text-body-lg text-on-surface-variant leading-relaxed mb-xl">
                    Step into the GenuAI professional ecosystem. Connect directly with hiring managers, discover curated remote and hybrid opportunities, and stay ahead of the curve.
                  </p>

                  <div className="space-y-md mb-xl md:mb-0">
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'search' ? 'bg-accent-gold text-on-tertiary shadow-md shadow-accent-gold/20' : 'bg-accent-gold/10 text-accent-gold-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'search' ? 'text-accent-gold-dark' : 'text-on-surface'}`}>AI Role Matching</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Get instantly matched to roles that fit your exact skill profile.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'search' ? 'bg-accent-gold text-on-tertiary shadow-md shadow-accent-gold/20' : 'bg-accent-gold/10 text-accent-gold-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">diversity_3</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'search' ? 'text-accent-gold-dark' : 'text-on-surface'}`}>Direct Networking</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Cut through the noise and chat directly with top recruiters.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'search' ? 'bg-accent-gold text-on-tertiary shadow-md shadow-accent-gold/20' : 'bg-accent-gold/10 text-accent-gold-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">trending_up</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'search' ? 'text-accent-gold-dark' : 'text-on-surface'}`}>Career Growth</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Stay updated with industry trends, events, and hackathons.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-surface-container/50 pt-lg md:pt-0 md:pl-xl flex flex-col justify-between">
                <div className="flex flex-col gap-sm mb-xl">
                  {[
                    {text: 'Professional Network', icon: 'hub', desc: 'Connect with peers, recruiters, and industry leaders.'},
                    {text: 'Global Job Board', icon: 'work', desc: 'Explore AI-matched remote, hybrid, and on-site roles.'},
                    {text: 'Competitions & Events', icon: 'emoji_events', desc: 'Participate in hackathons and tech competitions.'},
                    {text: 'Instant Connect', icon: 'forum', desc: 'Directly message recruiters and hiring managers.'}
                  ].map((item, i) => (
                    <div key={i} className={`rounded-2xl p-sm flex items-start gap-md transition-colors ${hovered === 'search' ? 'bg-white/60 shadow-sm border border-white' : 'bg-surface-bright border border-surface-container/50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${hovered === 'search' ? 'bg-accent-gold/10 text-accent-gold-dark' : 'bg-surface-container text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'search' ? 'text-accent-gold-dark' : 'text-on-surface'}`}>{item.text}</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-md">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'search' ? 'bg-accent-gold/30' : 'bg-surface-container'}`} />
                  <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${hovered === 'search' ? 'text-accent-gold' : 'text-on-surface-variant'}`}>
                    Enter Search Hub <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Assessment Test */}
          <div
            onMouseEnter={() => setHovered('test')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('test')}
            className={`glass p-xl md:p-xxl rounded-[32px] cursor-pointer transition-all duration-500 transform ${hovered === 'test' ? '-translate-y-2 ring-2 ring-success-emerald/50 shadow-[0_20px_50px_rgba(16,185,129,0.15)] bg-success-emerald/5' : 'hover:shadow-xl border border-surface-container'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center w-full">
              <div className="flex-1 flex flex-col justify-between md:pr-xl">
                <div>
                  <div className="flex items-center justify-between w-full mb-xl gap-2 md:gap-4">
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${hovered === 'test' ? 'bg-success-emerald text-white shadow-lg shadow-success-emerald/30' : 'bg-surface-bright text-success-emerald border border-surface-container'}`}>
                      <span className="material-symbols-outlined text-4xl">timer</span>
                    </div>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-success-emerald/10 text-success-emerald-dark text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-success-emerald/20 whitespace-nowrap text-center">Official</span>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-surface-container-high/50 whitespace-nowrap text-center">Proctored</span>
                  </div>
                  
                  <h2 className="text-[32px] md:text-[40px] font-headline-md text-on-surface mb-sm leading-tight tracking-tight">Assessment Test</h2>
                  <p className="text-body-lg text-on-surface-variant leading-relaxed mb-xl">
                    Take the definitive GenuAI evaluation. Our AI-proctored, multi-stage assessment strictly measures your technical, verbal, and behavioral competencies.
                  </p>

                  <div className="space-y-md mb-xl md:mb-0">
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'test' ? 'bg-success-emerald text-white shadow-md shadow-success-emerald/20' : 'bg-success-emerald/10 text-success-emerald-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'test' ? 'text-success-emerald-dark' : 'text-on-surface'}`}>Verified Credentials</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Prove your authentic skills to top employers definitively.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'test' ? 'bg-success-emerald text-white shadow-md shadow-success-emerald/20' : 'bg-success-emerald/10 text-success-emerald-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">score</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'test' ? 'text-success-emerald-dark' : 'text-on-surface'}`}>Comprehensive Score</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Receive a multi-dimensional GenuAI evaluation score.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'test' ? 'bg-success-emerald text-white shadow-md shadow-success-emerald/20' : 'bg-success-emerald/10 text-success-emerald-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'test' ? 'text-success-emerald-dark' : 'text-on-surface'}`}>Fast-Track Hiring</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Top scorers skip initial screening rounds at partner companies.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-surface-container/50 pt-lg md:pt-0 md:pl-xl flex flex-col justify-between">
                <div className="flex flex-col gap-sm mb-xl">
                  {[
                    {text: 'Profile & Resume', icon: 'badge', desc: 'Initial screening based on your verified professional profile.'},
                    {text: 'GenuAI Skill Test', icon: 'quiz', desc: 'Timed coding and aptitude test with anti-cheat monitoring.'},
                    {text: 'SVAR Verbal', icon: 'record_voice_over', desc: 'Automated evaluation of spoken English and clarity.'},
                    {text: 'Hackathon', icon: 'terminal', desc: 'Real-world project building under a strict time limit.'},
                    {text: 'AI Interview', icon: 'videocam', desc: 'Final round technical and cultural fit interview with AI.'},
                    {text: 'Group Discussion', icon: 'groups', desc: 'Collaborative problem-solving with other candidates.'}
                  ].map((item, i) => (
                    <div key={i} className={`rounded-2xl p-sm flex items-start gap-md transition-colors ${hovered === 'test' ? 'bg-white/60 shadow-sm border border-white' : 'bg-surface-bright border border-surface-container/50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${hovered === 'test' ? 'bg-success-emerald/10 text-success-emerald-dark' : 'bg-surface-container text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'test' ? 'text-success-emerald-dark' : 'text-on-surface'}`}>{item.text}</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-md">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'test' ? 'bg-success-emerald/30' : 'bg-surface-container'}`} />
                  <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${hovered === 'test' ? 'text-success-emerald' : 'text-on-surface-variant'}`}>
                    Begin Assessment <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Career Profile Hub */}
          <div
            onMouseEnter={() => setHovered('career')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('career-profile')}
            className={`glass p-xl md:p-xxl rounded-[32px] cursor-pointer transition-all duration-500 transform ${hovered === 'career' ? '-translate-y-2 ring-2 ring-indigo-brand-dark/50 shadow-[0_20px_50px_rgba(49,46,129,0.15)] bg-indigo-brand-dark/5' : 'hover:shadow-xl border border-surface-container'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center w-full">
              <div className="flex-1 flex flex-col justify-between md:pr-xl">
                <div>
                  <div className="flex items-center justify-between w-full mb-xl gap-2 md:gap-4">
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${hovered === 'career' ? 'bg-indigo-brand-dark text-white shadow-lg shadow-indigo-brand-dark/30' : 'bg-surface-bright text-indigo-brand-dark border border-surface-container'}`}>
                      <span className="material-symbols-outlined text-4xl">badge</span>
                    </div>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-indigo-brand-dark/10 text-indigo-brand-dark text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-indigo-brand-dark/20 whitespace-nowrap text-center">Personal Brand</span>
                    <span className="px-3 md:px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-surface-container-high/50 whitespace-nowrap text-center">4 Tools</span>
                  </div>
                  
                  <h2 className="text-[32px] md:text-[40px] font-headline-md text-on-surface mb-sm leading-tight tracking-tight">Career Profile Hub</h2>
                  <p className="text-body-lg text-on-surface-variant leading-relaxed mb-xl">
                    Your professional identity, elevated. Use our AI drafting engines to instantly generate perfectly tailored resumes, cover letters, and portfolios.
                  </p>

                  <div className="space-y-md mb-xl md:mb-0">
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'career' ? 'bg-indigo-brand-dark text-white shadow-md shadow-indigo-brand-dark/20' : 'bg-indigo-brand-dark/10 text-indigo-brand-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'career' ? 'text-indigo-brand-dark' : 'text-on-surface'}`}>ATS Optimization</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Stand out automatically with system-friendly resumes.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'career' ? 'bg-indigo-brand-dark text-white shadow-md shadow-indigo-brand-dark/20' : 'bg-indigo-brand-dark/10 text-indigo-brand-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'career' ? 'text-indigo-brand-dark' : 'text-on-surface'}`}>Tailored Pitching</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Impress hiring managers with context-aware cover letters.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-md">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${hovered === 'career' ? 'bg-indigo-brand-dark text-white shadow-md shadow-indigo-brand-dark/20' : 'bg-indigo-brand-dark/10 text-indigo-brand-dark'}`}>
                        <span className="material-symbols-outlined text-[18px]">branding_watermark</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'career' ? 'text-indigo-brand-dark' : 'text-on-surface'}`}>Unified Branding</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">Showcase a cohesive, highly professional brand.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-surface-container/50 pt-lg md:pt-0 md:pl-xl flex flex-col justify-between">
                <div className="flex flex-col gap-sm mb-xl">
                  {[
                    {text: 'AI Resume Builder', icon: 'document_scanner', desc: 'Generate ATS-friendly markdown resumes instantly.'},
                    {text: 'Cover Letter Gen', icon: 'edit_document', desc: 'Draft highly tailored cover letters for specific roles.'},
                    {text: 'ATS Checker', icon: 'fact_check', desc: 'Analyze your resume against job descriptions.'},
                    {text: 'Portfolio Manager', icon: 'folder_special', desc: 'Showcase your GitHub projects and certifications.'}
                  ].map((item, i) => (
                    <div key={i} className={`rounded-2xl p-sm flex items-start gap-md transition-colors ${hovered === 'career' ? 'bg-white/60 shadow-sm border border-white' : 'bg-surface-bright border border-surface-container/50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${hovered === 'career' ? 'bg-indigo-brand-dark/10 text-indigo-brand-dark' : 'bg-surface-container text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${hovered === 'career' ? 'text-indigo-brand-dark' : 'text-on-surface'}`}>{item.text}</div>
                        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-md">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'career' ? 'bg-indigo-brand-dark/30' : 'bg-surface-container'}`} />
                  <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${hovered === 'career' ? 'text-indigo-brand-dark' : 'text-on-surface-variant'}`}>
                    Manage Profile <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-xxl pb-xl">
          © 2026 GenuAI Technologies · All Rights Reserved
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';

interface Props {
  user: any;
  onSelect: (path: 'practice' | 'search' | 'test' | 'career-profile') => void;
  onLogout: () => void;
}

export default function PathSelection({ user, onSelect, onLogout }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const name = user?.user?.name || user?.name || 'Candidate';

  return (
    <div className="min-h-screen bg-background quantum-gradient font-body-base text-on-background relative overflow-hidden">
      
      {/* Decorative background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-gold/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-indigo-brand/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="h-16 border-b border-surface-container/50 bg-surface/85 backdrop-blur-xl px-4 sm:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="GenuAI" className="w-10 h-10 object-contain drop-shadow-sm" />
          <div>
            <div className="font-extrabold text-on-surface text-sm sm:text-base leading-tight tracking-tight">
              Genu<span className="text-indigo-brand">AI</span> Technologies
            </div>
            <div className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest hidden sm:block">
              Recruitment Intelligence
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-brand to-indigo-brand-dark flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {name[0]?.toUpperCase()}
          </div>
          <div className="text-xs font-bold text-on-surface hidden sm:block">{name}</div>
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 border border-error-crimson/30 text-error-crimson rounded-xl font-bold text-xs hover:bg-error-crimson/10 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero & Broader Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 animate-[fadeIn_0.4s_ease]">
          <div className="inline-flex items-center gap-2 bg-indigo-brand/10 border border-indigo-brand/20 rounded-full px-4 py-1 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-brand animate-pulse"></span>
            <span className="text-[11px] font-bold text-indigo-brand uppercase tracking-wider">Welcome, {name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface tracking-tight leading-tight">
            Choose Your Candidate Path
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Select how you would like to leverage the GenuAI ecosystem today. Take your time to practice, evaluate, or discover opportunities.
          </p>
        </div>

        {/* 4 Broader Spacious Path Cards */}
        <div className="grid grid-cols-1 gap-8">

          {/* ─────────────────────────────────────────────
              1. PRACTICE PATH
          ───────────────────────────────────────────── */}
          <div
            onMouseEnter={() => setHovered('practice')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('practice')}
            className={`glass p-6 sm:p-8 lg:p-10 rounded-[32px] cursor-pointer transition-all duration-300 transform ${
              hovered === 'practice'
                ? '-translate-y-1.5 ring-2 ring-indigo-brand/50 shadow-2xl bg-indigo-brand/5'
                : 'hover:shadow-xl border border-surface-container/80'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full">
              
              {/* Left Details Column (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                      hovered === 'practice'
                        ? 'bg-indigo-brand text-white shadow-lg shadow-indigo-brand/30'
                        : 'bg-surface-bright text-indigo-brand border border-surface-container'
                    }`}>
                      <span className="material-symbols-outlined text-3xl">psychology</span>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider border border-indigo-brand/20">
                      Most Popular
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-wider border border-surface-container-high/50">
                      6 Modules Included
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 tracking-tight">
                    Practice Path
                  </h2>
                  <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
                    Build skills at your own pace with AI-powered mock interviews, adaptive coding tests, SVAR verbal fluency, and inclusive learning tracks designed to bridge your skill gaps.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      { icon: "insights", title: "Data Insights", desc: "Identify skill gaps with AI." },
                      { icon: "psychology_alt", title: "Confidence", desc: "Realistic interview prep." },
                      { icon: "speed", title: "24/7 Access", desc: "Learn at your own pace." },
                    ].map((feat, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/70 shadow-2xs space-y-1">
                        <span className="material-symbols-outlined text-indigo-brand text-xl">{feat.icon}</span>
                        <div className="text-xs font-bold text-on-surface">{feat.title}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{feat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'practice' ? 'bg-indigo-brand/40' : 'bg-surface-container'}`} />
                  <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    hovered === 'practice' ? 'text-indigo-brand' : 'text-on-surface-variant'
                  }`}>
                    Start Practice Hub <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </div>

              {/* Right Modules Grid (6 Cols) */}
              <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-surface-container/60 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { text: 'AI Mock Interview', icon: 'smart_toy', desc: 'Simulated technical & behavioral interviews with real-time feedback.' },
                    { text: 'Skill Test Practice', icon: 'code', desc: 'Coding, quantitative aptitude, and automata test simulations.' },
                    { text: 'Project Building', icon: 'developer_board', desc: 'Hands-on full-stack development challenges and reviews.' },
                    { text: 'Group Discussion', icon: 'groups', desc: 'AI-moderated group leadership and communication rooms.' },
                    { text: 'SVAR Speaking', icon: 'record_voice_over', desc: 'Verbal communication clarity and pronunciation evaluation.' },
                    { text: 'Inclusive Learning', icon: 'school', desc: 'Curated DSA sheets, theory courses, and prep roadmaps.' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl flex items-start gap-3 transition-all ${
                        hovered === 'practice'
                          ? 'bg-white shadow-xs border border-indigo-100'
                          : 'bg-surface-bright/80 border border-surface-container/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-on-surface">{item.text}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              2. SEARCH PATH / JOB & NETWORK HUB
          ───────────────────────────────────────────── */}
          <div
            onMouseEnter={() => setHovered('search')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('search')}
            className={`glass p-6 sm:p-8 lg:p-10 rounded-[32px] cursor-pointer transition-all duration-300 transform ${
              hovered === 'search'
                ? '-translate-y-1.5 ring-2 ring-accent-gold/50 shadow-2xl bg-accent-gold/5'
                : 'hover:shadow-xl border border-surface-container/80'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full">
              
              {/* Left Details Column */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                      hovered === 'search'
                        ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/30'
                        : 'bg-surface-bright text-accent-gold border border-surface-container'
                    }`}>
                      <span className="material-symbols-outlined text-3xl">public</span>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-accent-gold/10 text-accent-gold-dark text-xs font-bold uppercase tracking-wider border border-accent-gold/20">
                      Live Network
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-wider border border-surface-container-high/50">
                      4 Features Included
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 tracking-tight">
                    Search Hub
                  </h2>
                  <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
                    Connect directly with top tech recruiters, explore AI-matched remote and hybrid job openings, and participate in industry hackathons.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      { icon: "troubleshoot", title: "AI Matching", desc: "Matched by verified skills." },
                      { icon: "diversity_3", title: "Direct Connect", desc: "Message hiring managers." },
                      { icon: "trending_up", title: "Competitions", desc: "Hackathons & live events." },
                    ].map((feat, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/70 shadow-2xs space-y-1">
                        <span className="material-symbols-outlined text-accent-gold-dark text-xl">{feat.icon}</span>
                        <div className="text-xs font-bold text-on-surface">{feat.title}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{feat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'search' ? 'bg-accent-gold/40' : 'bg-surface-container'}`} />
                  <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    hovered === 'search' ? 'text-accent-gold-dark' : 'text-on-surface-variant'
                  }`}>
                    Enter Search Hub <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </div>

              {/* Right Modules Grid */}
              <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-surface-container/60 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { text: 'Professional Network', icon: 'hub', desc: 'Connect with peers, recruiters, and engineering leaders.' },
                    { text: 'Global Job Board', icon: 'work', desc: 'Explore AI-curated openings with salary benchmarks.' },
                    { text: 'Competitions & Hackathons', icon: 'emoji_events', desc: 'Participate in prize hackathons and tech contests.' },
                    { text: 'Instant Recruiter Connect', icon: 'forum', desc: 'Direct chat and application inquiries with employers.' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl flex items-start gap-3 transition-all ${
                        hovered === 'search'
                          ? 'bg-white shadow-xs border border-amber-200'
                          : 'bg-surface-bright/80 border border-surface-container/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-accent-gold/10 text-accent-gold-dark flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-on-surface">{item.text}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              3. OFFICIAL ASSESSMENT PIPELINE
          ───────────────────────────────────────────── */}
          <div
            onMouseEnter={() => setHovered('test')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('test')}
            className={`glass p-6 sm:p-8 lg:p-10 rounded-[32px] cursor-pointer transition-all duration-300 transform ${
              hovered === 'test'
                ? '-translate-y-1.5 ring-2 ring-emerald-500/50 shadow-2xl bg-emerald-50/20'
                : 'hover:shadow-xl border border-surface-container/80'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full">
              
              {/* Left Details Column */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                      hovered === 'test'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-surface-bright text-emerald-600 border border-surface-container'
                    }`}>
                      <span className="material-symbols-outlined text-3xl">verified</span>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                      Official Evaluation
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-wider border border-surface-container-high/50">
                      Proctored Pipeline
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 tracking-tight">
                    Assessment Pipeline
                  </h2>
                  <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
                    Take the 7-step proctored GenuAI evaluation. Qualify for top hiring partner roles with an unforgeable verified credential.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      { icon: "security", title: "Proctored", desc: "AI-verified integrity." },
                      { icon: "workspace_premium", title: "Passport", desc: "One test, multiple offers." },
                      { icon: "military_tech", title: "Direct Offers", desc: "Top tier placement pool." },
                    ].map((feat, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/70 shadow-2xs space-y-1">
                        <span className="material-symbols-outlined text-emerald-600 text-xl">{feat.icon}</span>
                        <div className="text-xs font-bold text-on-surface">{feat.title}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{feat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'test' ? 'bg-emerald-600/40' : 'bg-surface-container'}`} />
                  <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    hovered === 'test' ? 'text-emerald-700' : 'text-on-surface-variant'
                  }`}>
                    Enter Assessment Pipeline <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </div>

              {/* Right Modules Grid */}
              <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-surface-container/60 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { text: 'Profile & Resume Screening', icon: 'assignment', desc: 'Initial credential and background review.' },
                    { text: 'GenuAI Skill Test', icon: 'quiz', desc: 'Aptitude, logical reasoning, and coding accuracy.' },
                    { text: 'SVAR Verbal Assessment', icon: 'record_voice_over', desc: 'Professional spoken English and fluency testing.' },
                    { text: 'Hackathon Project', icon: 'terminal', desc: 'Timed hands-on full-stack application development.' },
                    { text: 'AI Technical Interview', icon: 'videocam', desc: 'In-depth domain questions and behavioral assessment.' },
                    { text: 'Group Discussion', icon: 'groups', desc: 'Collaborative problem solving and teamwork analysis.' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl flex items-start gap-3 transition-all ${
                        hovered === 'test'
                          ? 'bg-white shadow-xs border border-emerald-200'
                          : 'bg-surface-bright/80 border border-surface-container/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-on-surface">{item.text}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              4. CAREER PROFILE HUB
          ───────────────────────────────────────────── */}
          <div
            onMouseEnter={() => setHovered('career')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('career-profile')}
            className={`glass p-6 sm:p-8 lg:p-10 rounded-[32px] cursor-pointer transition-all duration-300 transform ${
              hovered === 'career'
                ? '-translate-y-1.5 ring-2 ring-indigo-900/50 shadow-2xl bg-indigo-900/5'
                : 'hover:shadow-xl border border-surface-container/80'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full">
              
              {/* Left Details Column */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                      hovered === 'career'
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                        : 'bg-surface-bright text-slate-800 border border-surface-container'
                    }`}>
                      <span className="material-symbols-outlined text-3xl">badge</span>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200">
                      Personal Brand
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-wider border border-surface-container-high/50">
                      4 AI Tools Included
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 tracking-tight">
                    Career Profile Hub
                  </h2>
                  <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
                    Elevate your professional presence. Generate ATS-optimized resumes, tailor cover letters, and build a unified technical portfolio.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      { icon: "document_scanner", title: "ATS Ready", desc: "Pass recruiter scans." },
                      { icon: "edit_note", title: "Tailored Pitch", desc: "Role-specific letters." },
                      { icon: "branding_watermark", title: "Unified Brand", desc: "Showcase code & credentials." },
                    ].map((feat, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/70 shadow-2xs space-y-1">
                        <span className="material-symbols-outlined text-slate-800 text-xl">{feat.icon}</span>
                        <div className="text-xs font-bold text-on-surface">{feat.title}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{feat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className={`flex-1 h-[2px] transition-colors ${hovered === 'career' ? 'bg-slate-900/40' : 'bg-surface-container'}`} />
                  <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    hovered === 'career' ? 'text-slate-900' : 'text-on-surface-variant'
                  }`}>
                    Manage Career Profile <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </div>

              {/* Right Modules Grid */}
              <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-surface-container/60 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { text: 'AI Resume Builder', icon: 'document_scanner', desc: 'Generate ATS-friendly markdown resumes instantly.' },
                    { text: 'Cover Letter Generator', icon: 'edit_document', desc: 'Draft tailored cover letters matching job descriptions.' },
                    { text: 'ATS Compatibility Checker', icon: 'fact_check', desc: 'Score your resume against industry benchmarks.' },
                    { text: 'Portfolio & Certifications', icon: 'folder_special', desc: 'Showcase verified GitHub projects and scores.' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl flex items-start gap-3 transition-all ${
                        hovered === 'career'
                          ? 'bg-white shadow-xs border border-slate-300'
                          : 'bg-surface-bright/80 border border-surface-container/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-on-surface">{item.text}</div>
                        <div className="text-[11px] text-on-surface-variant leading-snug">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest pt-6 pb-8">
          © 2026 GenuAI Technologies · All Rights Reserved
        </p>
      </div>
    </div>
  );
}

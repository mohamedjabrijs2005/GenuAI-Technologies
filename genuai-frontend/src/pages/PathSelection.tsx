import { useState, useEffect } from 'react';
import { getAvailableCompanies, getSavedSelections } from '../services/genuaiWorksService';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: any;
  onSelect: (path: 'practice' | 'search' | 'test' | 'career-profile' | 'companies') => void;
  onLogout: () => void;
}

export default function PathSelection({ user, onSelect, onLogout }: Props) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const name = user?.user?.name || user?.name || 'Candidate';

  useEffect(() => {
    getAvailableCompanies().then((list) => {
      setCompanyNames(list.slice(0, 3).map((c) => c.companyName));
    });
    const saved = getSavedSelections();
    setSavedCount(saved.length);
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="GenuAI" className="w-9 h-9 object-contain" />
          <div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight tracking-tight">
              Genu<span className="text-indigo-600">AI</span> Technologies
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              Recruitment Intelligence
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {name[0]?.toUpperCase()}
          </div>
          <div className="text-xs font-bold text-slate-700 hidden sm:block">{name}</div>
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 border border-red-200 text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Welcome back, {name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight">
            Your Candidate Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Select how you'd like to use GenuAI today — build skills, discover opportunities, or continue your personalized assessment.
          </p>
        </div>

        {/* ── GenuAI Works — Primary Card ── */}
        <div
          onClick={() => onSelect('companies')}
          className="bg-white border border-indigo-200 rounded-3xl p-6 sm:p-8 cursor-pointer shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all duration-300 group"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm text-indigo-600">auto_awesome</span>
                <span>GenuAI Works — Role-Aware Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Multi-Company Target Selection &amp; Dynamic Assessment
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Select target companies and roles. GenuAI Works aggregates locked requirements, performs Common / Majority analysis, checks verified assessment reuse, and generates your role-aware dynamic path.
              </p>
              {companyNames.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {companyNames.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                      <span className="material-symbols-outlined text-[13px] text-indigo-500">business</span>
                      {c}
                    </span>
                  ))}
                  <span className="inline-flex items-center text-slate-400 text-xs font-medium px-1">+ more</span>
                </div>
              )}
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <span className="inline-flex items-center justify-center gap-2 bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm uppercase tracking-wider w-full md:w-auto cursor-pointer">
                <span>Select Companies &amp; Roles</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Continue Your Assessment (smart card — replaces fixed Assessment Pipeline) ── */}
        <div
          onMouseEnter={() => setHovered('assessment')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => savedCount > 0 ? navigate('/my-assessment') : onSelect('companies')}
          className={`bg-white border rounded-3xl p-6 sm:p-8 cursor-pointer shadow-sm transition-all duration-300 ${
            hovered === 'assessment' ? 'border-emerald-400 shadow-lg' : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                    hovered === 'assessment'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                    {savedCount > 0 ? 'In Progress' : 'Official Evaluation'}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-200">
                    {savedCount > 0 ? `${savedCount}-Company Path` : 'Start with GenuAI Works'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
                  {savedCount > 0 ? 'Continue Your Assessment' : 'Your Personalized Assessment'}
                </h2>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-5">
                  {savedCount > 0
                    ? `Your personalized path is ready — one verified result, shared with your ${savedCount} selected ${savedCount === 1 ? 'company' : 'companies'}.`
                    : 'Use GenuAI Works above to select your target companies. Your personalized assessment path — one verified result, shared with your selected companies — will appear here.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { icon: 'security', title: 'Proctored', desc: 'AI-verified integrity.' },
                    { icon: 'route', title: 'Role-Aware', desc: 'Tailored to your selections.' },
                    { icon: 'military_tech', title: 'Verified Results', desc: 'Shared with hiring partners.' },
                  ].map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="material-symbols-outlined text-emerald-500 text-lg">{feat.icon}</span>
                      <div className="text-xs font-bold text-slate-700">{feat.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{feat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <div className={`flex-1 h-[2px] transition-colors ${hovered === 'assessment' ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  hovered === 'assessment' ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {savedCount > 0 ? 'Continue Assessment' : 'Start with GenuAI Works'}
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </div>
            </div>
            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { text: 'Profile & Resume Screening', icon: 'assignment', desc: 'Credential and background review.' },
                  { text: 'GenuAI Skill Test', icon: 'quiz', desc: 'Aptitude, logic, and coding accuracy.' },
                  { text: 'SVAR Verbal Assessment', icon: 'record_voice_over', desc: 'Spoken English and fluency testing.' },
                  { text: 'Hackathon Project', icon: 'terminal', desc: 'Timed full-stack development challenge.' },
                  { text: 'AI Technical Interview', icon: 'videocam', desc: 'Domain and behavioral assessment.' },
                  { text: 'Group Discussion', icon: 'groups', desc: 'Collaborative problem solving analysis.' },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-2xl flex items-start gap-3 transition-all ${
                    hovered === 'assessment' ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-emerald-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-700">{item.text}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 1. PRACTICE PATH ── */}
        <div
          onMouseEnter={() => setHovered('practice')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect('practice')}
          className={`bg-white border rounded-3xl p-6 sm:p-8 cursor-pointer shadow-sm transition-all duration-300 ${
            hovered === 'practice' ? 'border-indigo-400 shadow-lg' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                    hovered === 'practice'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">psychology</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200">Most Popular</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-200">6 Learning Modules</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Practice Path</h2>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-5">
                  Build skills at your own pace with AI-powered mock interviews, adaptive coding tests, SVAR verbal fluency, and inclusive learning tracks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { icon: 'insights', title: 'Data Insights', desc: 'Identify skill gaps with AI.' },
                    { icon: 'psychology_alt', title: 'Confidence', desc: 'Realistic interview prep.' },
                    { icon: 'speed', title: '24/7 Access', desc: 'Learn at your own pace.' },
                  ].map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="material-symbols-outlined text-indigo-500 text-lg">{feat.icon}</span>
                      <div className="text-xs font-bold text-slate-700">{feat.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{feat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <div className={`flex-1 h-[2px] transition-colors ${hovered === 'practice' ? 'bg-indigo-300' : 'bg-slate-200'}`} />
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  hovered === 'practice' ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  Start Practice Hub <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </div>
            </div>
            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { text: 'AI Mock Interview', icon: 'smart_toy', desc: 'Simulated interviews with real-time feedback.' },
                  { text: 'Skill Test Practice', icon: 'code', desc: 'Coding, aptitude, and automata simulations.' },
                  { text: 'Project Building', icon: 'developer_board', desc: 'Hands-on full-stack challenges.' },
                  { text: 'Group Discussion', icon: 'groups', desc: 'AI-moderated communication rooms.' },
                  { text: 'SVAR Speaking', icon: 'record_voice_over', desc: 'Verbal fluency and pronunciation evaluation.' },
                  { text: 'Inclusive Learning', icon: 'school', desc: 'DSA sheets, theory courses, and roadmaps.' },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-2xl flex items-start gap-3 transition-all ${
                    hovered === 'practice' ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-slate-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-indigo-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-700">{item.text}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. SEARCH HUB ── */}
        <div
          onMouseEnter={() => setHovered('search')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect('search')}
          className={`bg-white border rounded-3xl p-6 sm:p-8 cursor-pointer shadow-sm transition-all duration-300 ${
            hovered === 'search' ? 'border-amber-400 shadow-lg' : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                    hovered === 'search'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">public</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider border border-amber-200">Live Network</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-200">4 Hub Features</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Search Hub</h2>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-5">
                  Connect with top tech recruiters, explore AI-matched remote and hybrid job openings, and participate in industry hackathons.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { icon: 'troubleshoot', title: 'AI Matching', desc: 'Matched by verified skills.' },
                    { icon: 'diversity_3', title: 'Direct Connect', desc: 'Message hiring managers.' },
                    { icon: 'trending_up', title: 'Competitions', desc: 'Hackathons & live events.' },
                  ].map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="material-symbols-outlined text-amber-500 text-lg">{feat.icon}</span>
                      <div className="text-xs font-bold text-slate-700">{feat.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{feat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <div className={`flex-1 h-[2px] transition-colors ${hovered === 'search' ? 'bg-amber-300' : 'bg-slate-200'}`} />
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  hovered === 'search' ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  Enter Search Hub <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </div>
            </div>
            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { text: 'Professional Network', icon: 'hub', desc: 'Connect with peers and engineering leaders.' },
                  { text: 'Global Job Board', icon: 'work', desc: 'AI-curated openings with salary benchmarks.' },
                  { text: 'Competitions & Hackathons', icon: 'emoji_events', desc: 'Prize hackathons and tech contests.' },
                  { text: 'Instant Recruiter Connect', icon: 'forum', desc: 'Direct chat with employers.' },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-2xl flex items-start gap-3 transition-all ${
                    hovered === 'search' ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-amber-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-700">{item.text}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. CAREER PROFILE HUB ── */}
        <div
          onMouseEnter={() => setHovered('career')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect('career-profile')}
          className={`bg-white border rounded-3xl p-6 sm:p-8 cursor-pointer shadow-sm transition-all duration-300 ${
            hovered === 'career' ? 'border-violet-400 shadow-lg' : 'border-slate-200 hover:border-violet-300'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                    hovered === 'career'
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                      : 'bg-violet-50 text-violet-600 border border-violet-200'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">badge</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider border border-violet-200">Personal Brand</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-200">4 Profile Tools</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Career Profile Hub</h2>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-5">
                  Elevate your professional presence. Generate ATS-optimized resumes, tailor cover letters, and build a unified technical portfolio.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { icon: 'document_scanner', title: 'ATS Ready', desc: 'Pass recruiter scans.' },
                    { icon: 'edit_note', title: 'Tailored Pitch', desc: 'Role-specific letters.' },
                    { icon: 'branding_watermark', title: 'Unified Brand', desc: 'Showcase code & credentials.' },
                  ].map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="material-symbols-outlined text-violet-500 text-lg">{feat.icon}</span>
                      <div className="text-xs font-bold text-slate-700">{feat.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{feat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <div className={`flex-1 h-[2px] transition-colors ${hovered === 'career' ? 'bg-violet-300' : 'bg-slate-200'}`} />
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  hovered === 'career' ? 'text-violet-600' : 'text-slate-400'
                }`}>
                  Manage Career Profile <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </div>
            </div>
            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { text: 'AI Resume Builder', icon: 'document_scanner', desc: 'Generate ATS-friendly resumes instantly.' },
                  { text: 'Cover Letter Generator', icon: 'edit_document', desc: 'Tailored letters matching job descriptions.' },
                  { text: 'ATS Compatibility Checker', icon: 'fact_check', desc: 'Score your resume against benchmarks.' },
                  { text: 'Portfolio & Certifications', icon: 'folder_special', desc: 'Showcase verified GitHub projects and scores.' },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-2xl flex items-start gap-3 transition-all ${
                    hovered === 'career' ? 'bg-violet-50 border border-violet-200' : 'bg-slate-50 border border-slate-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-violet-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-700">{item.text}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-6 pb-8">
          © 2026 GenuAI Technologies · All Rights Reserved
        </p>
      </div>
    </div>
  );
}

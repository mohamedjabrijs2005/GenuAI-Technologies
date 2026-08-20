import { useState, useEffect } from 'react';
import { getJobs, getNetworkPosts, createNetworkPost, getEvents, getPMStatus, getNews } from '../services/api';

interface Props { user: any; onBack: () => void; }

// The actual Job Board component
function JobBoard({ user, onBack, initialFilter = 'All' }: { user: any, onBack: () => void, initialFilter?: string }) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState(initialFilter);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then(res => { setJobs(res.data.jobs || []); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filteredJobs = jobs.filter(j => {
    if (filterMode !== 'All' && filterMode !== 'Internships' && j.mode !== filterMode) return false;
    if (filterMode === 'Internships' && j.type !== 'Internship') return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !(j.skills || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1100px] mx-auto w-full p-lg md:p-xl">
      <button onClick={onBack} className="text-on-surface-variant font-bold text-xs sm:text-sm mb-4 sm:mb-6 hover:text-on-surface flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap cursor-pointer">
        <span className="material-symbols-outlined text-base">arrow_back</span> Back to Search Hub
      </button>
      <div className="bg-gradient-to-br from-warning to-error rounded-3xl p-xl text-white mb-xl flex justify-between items-center shadow-lg shadow-warning/20">
        <div>
          <h1 className="text-headline-sm font-headline-sm mb-xs">Find Your Next Opportunity</h1>
          <p className="text-sm opacity-90 font-medium max-w-lg leading-relaxed">Explore open roles at GenuAI Technologies and our partner network. Apply directly with your GenuAI profile.</p>
        </div>
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30 shrink-0">
          <img src="/icons/resume_gen.png" alt="Jobs" className="w-12 h-12 object-contain mix-blend-multiply" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-xl">
        <div>
          <div className="glass rounded-2xl border border-surface-container p-lg mb-lg">
            <div className="font-black text-title-sm text-on-surface mb-lg">Filters</div>
            <div className="mb-lg">
              <label className="text-xs font-bold text-on-surface-variant block mb-xs">Search Role or Skill</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="e.g. React" className="w-full pl-[40px] pr-md py-sm bg-background border border-surface-container rounded-xl text-sm font-medium focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand outline-none transition-all" />
              </div>
            </div>
            <div className="mb-lg">
              <label className="text-xs font-bold text-on-surface-variant block mb-xs">Work Mode</label>
              <div className="flex flex-col gap-sm">
                {['All', 'Remote', 'Hybrid', 'On-site', 'Internships'].map(mode => (
                  <label key={mode} className="flex items-center gap-sm text-sm font-medium text-on-surface cursor-pointer">
                    <input type="radio" checked={filterMode === mode} onChange={() => setFilterMode(mode)} className="cursor-pointer accent-indigo-brand" />
                    {mode}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-lg">
              <label className="text-xs font-bold text-on-surface-variant block mb-xs">Experience Level</label>
              <div className="flex flex-col gap-sm">
                {['Any Experience', 'Entry-level (0-2 yrs)', 'Mid-level (3-5 yrs)', 'Senior (5+ yrs)', 'Leadership'].map((exp, i) => (
                  <label key={exp} className="flex items-center gap-sm text-sm font-medium text-on-surface cursor-pointer">
                    <input type="radio" name="exp" defaultChecked={i === 0} className="cursor-pointer accent-indigo-brand" />
                    {exp}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-xs">Expected Salary</label>
              <select className="w-full px-md py-sm bg-background border border-surface-container rounded-xl text-sm font-medium focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand outline-none transition-all cursor-pointer">
                <option>Any Salary</option>
                <option>$50k - $100k</option>
                <option>$100k - $150k</option>
                <option>$150k+</option>
              </select>
            </div>
          </div>
          <div className="bg-info/10 rounded-2xl border border-info/20 p-lg mb-lg">
            <div className="text-2xl mb-xs text-info flex items-center"><span className="material-symbols-outlined text-[24px]">lightbulb</span></div>
            <div className="font-black text-sm text-info-dark mb-xs">AI Match Score</div>
            <div className="text-xs font-medium text-info-dark/80 leading-relaxed">We analyze your resume and test scores to show you how well you match each role.</div>
          </div>
          <div className="bg-[#7C3AED]/10 rounded-2xl border border-[#7C3AED]/20 p-lg">
            <div className="text-2xl mb-xs text-[#7C3AED] flex items-center"><span className="material-symbols-outlined text-[24px]">track_changes</span></div>
            <div className="font-black text-sm text-[#7C3AED] mb-xs">AI Skill Gap Analyzer</div>
            <div className="text-xs font-medium text-[#7C3AED]/80 leading-relaxed mb-md">See exactly which skills you need to learn to increase your match score for top roles.</div>
            <button className="w-full bg-[#7C3AED] text-white rounded-xl py-sm font-bold text-xs hover:bg-[#6D28D9] transition-all hover:shadow-md hover:-translate-y-0.5">Analyze My Gaps</button>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-md">
            <div className="font-bold text-sm text-on-surface-variant">Showing {filteredJobs.length} open roles</div>
          </div>
          <div className="flex flex-col gap-lg">
            {filteredJobs.length === 0 ? (
              <div className="glass rounded-2xl p-xxl text-center border border-surface-container">
                <div className="flex justify-center mb-md text-on-surface-variant"><span className="material-symbols-outlined text-[40px]">inbox</span></div>
                <div className="font-bold text-title-sm text-on-surface">No jobs found</div>
                <div className="text-sm font-medium text-on-surface-variant mt-xs">Try adjusting your filters</div>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id} className={`glass rounded-2xl border ${selectedJob === job.id ? 'border-indigo-brand shadow-md scale-[1.01]' : 'border-surface-container hover:border-surface-container-high hover:-translate-y-0.5'} p-lg transition-all duration-300`}>
                  <div className="flex justify-between items-start mb-md">
                    <div className="flex gap-md">
                      <div className="w-12 h-12 rounded-xl bg-surface-bright border border-surface-container flex items-center justify-center shrink-0">
                        <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <h3 className="text-title-sm font-title-sm text-on-surface mb-xs">{job.title}</h3>
                        <div className="text-xs font-medium text-on-surface-variant flex items-center gap-xs">
                          <span className="font-bold text-on-surface">{job.company_name || 'GenuAI Technologies'}</span><span>•</span><span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">location_on</span> {job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-xs">
                      <div className="bg-success/10 text-success-dark px-sm py-1 rounded-full text-xs font-black flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">stars</span> 90% Match
                      </div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{(new Date(job.created_at)).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-xs mb-lg">
                    <span className="bg-surface-bright text-on-surface-variant px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-surface-container">{job.salary_min && job.salary_max ? `$${job.salary_min/1000}k-$${job.salary_max/1000}k` : 'Competitive'}</span>
                    {job.skills && job.skills.split(',').slice(0,3).map((t: string) => <span key={t} className="bg-indigo-brand/10 text-indigo-brand px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-brand/20">{t.trim()}</span>)}
                  </div>
                  <div className="pt-md border-t border-surface-container flex justify-between items-center">
                    {selectedJob === job.id ? (
                      <div className="text-xs font-bold text-success flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">check_circle</span> Application submitted successfully!</div>
                    ) : (
                      <button onClick={() => setSelectedJob(job.id)} className="px-lg py-sm bg-gradient-to-br from-warning to-error text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Apply Now →</button>
                    )}
                    <button className="text-on-surface-variant hover:text-warning transition-colors"><span className="material-symbols-outlined text-[20px]">star</span></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Professional Network Component
function NetworkView({ user, onBack }: { user: any, onBack: () => void }) {
  const name = user?.user?.name || user?.name || 'Candidate';
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = () => {
    getNetworkPosts()
      .then(res => setPosts(res.data.posts || []))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = () => {
    if (!newPost.trim()) return;
    createNetworkPost({ content: newPost })
      .then(() => { setNewPost(''); fetchPosts(); })
      .catch(err => console.error(err));
  };
  
  return (
    <div className="max-w-[1200px] mx-auto p-lg md:p-xl grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-xl">
      {/* Left Column: Profile Snapshot */}
      <div className="flex flex-col gap-lg">
        <button onClick={onBack} className="text-on-surface-variant font-bold text-sm mb-xs hover:text-on-surface flex items-center gap-xs transition-colors self-start">← Back to Hub</button>
        
        {/* Profile Card */}
        <div className="glass rounded-2xl border border-surface-container overflow-hidden shadow-sm">
          <div className="h-20 bg-gradient-to-br from-info-dark to-indigo-brand"></div>
          <div className="px-lg pb-lg text-center -mt-10">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center mx-auto mb-sm shadow-md overflow-hidden shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-brand to-primary flex items-center justify-center text-white font-black text-headline-sm">{name[0]?.toUpperCase()}</div>
            </div>
            <h2 className="text-title-sm font-black text-on-surface mb-xs">{name}</h2>
            <div className="text-xs font-medium text-on-surface-variant mb-md">AI-Assessed Tech Professional</div>
            <div className="bg-info/10 text-info-dark px-sm py-1.5 rounded-lg text-xs font-bold mb-md">GenuAI Verified Profile</div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant border-t border-surface-container pt-sm pb-sm cursor-pointer hover:bg-surface-bright/50 transition-colors">
              <span className="font-medium">Profile Viewers</span>
                <span className="text-info-dark font-black">—</span>
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant cursor-pointer hover:bg-surface-bright/50 transition-colors pb-xs">
              <span className="font-medium">Network Connections</span>
                <span className="text-info-dark font-black">—</span>
            </div>
          </div>
        </div>

        {/* My Items Card */}
        <div className="glass rounded-2xl border border-surface-container overflow-hidden shadow-sm">
           <div className="p-md border-b border-surface-container font-black text-sm text-on-surface">My GenuAI Dashboard</div>
           <div className="flex flex-col">
             <div className="px-md py-sm flex items-center gap-sm cursor-pointer text-on-surface-variant text-xs font-bold hover:bg-surface-bright/50 transition-colors">
               <span className="material-symbols-outlined text-[18px]">bookmark</span> Saved Jobs (4)
             </div>
             <div className="px-md py-sm flex items-center gap-sm cursor-pointer text-on-surface-variant text-xs font-bold hover:bg-surface-bright/50 transition-colors">
               <span className="material-symbols-outlined text-[18px]">assignment</span> Active Assessments
             </div>
             <div className="px-md py-sm flex items-center gap-sm cursor-pointer text-on-surface-variant text-xs font-bold hover:bg-surface-bright/50 transition-colors">
               <span className="material-symbols-outlined text-[18px]">military_tech</span> Skill Badges (3)
             </div>
           </div>
        </div>

        {/* Communities Card */}
        <div className="glass rounded-2xl border border-surface-container overflow-hidden shadow-sm">
           <div className="p-md border-b border-surface-container font-black text-sm text-on-surface">Communities & Tags</div>
           <div className="p-md flex flex-col gap-sm">
             <div className="text-info-dark text-xs font-bold cursor-pointer hover:underline">Groups</div>
             <div className="flex items-center gap-xs text-on-surface-variant text-xs font-medium cursor-pointer hover:text-info-dark transition-colors"><span className="material-symbols-outlined text-[16px]">group</span> GenuAI Frontend Devs</div>
             <div className="flex items-center gap-xs text-on-surface-variant text-xs font-medium cursor-pointer hover:text-info-dark transition-colors"><span className="material-symbols-outlined text-[16px]">group</span> AI Engineers Hub</div>
             <div className="text-info-dark text-xs font-bold cursor-pointer mt-xs hover:underline">Followed Tags</div>
             <div className="flex flex-wrap gap-xs">
               <span className="text-[10px] font-bold text-on-surface-variant bg-surface-bright px-xs py-1 rounded-full border border-surface-container cursor-pointer hover:border-surface-container-high transition-colors">#ReactJS</span>
               <span className="text-[10px] font-bold text-on-surface-variant bg-surface-bright px-xs py-1 rounded-full border border-surface-container cursor-pointer hover:border-surface-container-high transition-colors">#SystemDesign</span>
             </div>
           </div>
           <div className="p-sm border-t border-surface-container text-center text-on-surface-variant text-xs font-bold cursor-pointer hover:bg-surface-bright/50 transition-colors">
             Discover More
           </div>
        </div>
      </div>

      {/* Middle Column: Feed */}
      <div className="flex flex-col gap-xl mt-xl lg:mt-10">
        <div className="glass rounded-2xl border border-surface-container p-lg shadow-sm">
          <div className="flex gap-md mb-md">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-brand to-primary flex items-center justify-center text-white font-black text-title-sm shrink-0 shadow-sm">{name[0]?.toUpperCase()}</div>
            <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Share your latest GenuAI achievement or technical project..." className="flex-1 bg-background border border-surface-container rounded-3xl px-lg py-sm text-sm font-medium outline-none resize-none min-h-[60px] focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand transition-all"></textarea>
          </div>
          <div className="flex justify-between items-center px-sm">
            <div className="flex gap-md">
              <button className="text-on-surface-variant font-bold text-xs flex items-center gap-xs cursor-pointer hover:text-info-dark transition-colors"><span className="material-symbols-outlined text-[18px]">image</span> Media</button>
              <button className="text-on-surface-variant font-bold text-xs flex items-center gap-xs cursor-pointer hover:text-info-dark transition-colors"><span className="material-symbols-outlined text-[18px]">work</span> Job Update</button>
            </div>
            <button onClick={handlePost} className="bg-info-dark hover:bg-info text-white rounded-full px-lg py-xs font-bold text-xs transition-colors shadow-sm">Post</button>
          </div>
        </div>
        
        {posts.map((post, i) => (
          <div key={post.id || i} className="glass rounded-2xl border border-surface-container p-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-md">
              <div className="flex gap-md">
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-white font-black text-title-sm shrink-0 shadow-sm">{(post.user_name || name)[0]?.toUpperCase()}</div>
                <div>
                  <div className="font-black text-on-surface text-sm">{post.user_name || name}</div>
                  <div className="text-xs font-medium text-on-surface-variant">Tech Professional • {new Date(post.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-on-surface cursor-pointer font-black px-xs"><span className="material-symbols-outlined">more_horiz</span></button>
            </div>
            <p className="text-on-surface text-sm font-medium leading-relaxed mb-md">
              {post.content}
            </p>
            <div className="flex gap-xl border-t border-surface-container pt-md">
               <button className="text-on-surface-variant font-bold text-xs cursor-pointer flex items-center gap-xs hover:text-info-dark transition-colors"><span className="material-symbols-outlined text-[18px]">thumb_up</span> {post.likes_count} Likes</button>
               <button className="text-on-surface-variant font-bold text-xs cursor-pointer flex items-center gap-xs hover:text-info-dark transition-colors"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> {post.comments_count} Comments</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: AI Connections & Trending */}
      <div className="mt-xl lg:mt-10 flex flex-col gap-xl">
        <div className="glass rounded-2xl border border-surface-container p-lg shadow-sm">
          <div className="font-black text-sm text-on-surface mb-md flex items-center justify-between">
            AI Match Connections
            <span className="text-[10px] bg-info/10 text-info-dark px-xs py-0.5 rounded-full font-bold uppercase tracking-wider border border-info/20">High Synergy</span>
          </div>
          <div className="flex flex-col gap-lg">
            {[{ n: 'Sarah Jenkins', r: 'Senior Recruiter', m: 'Hiring React Devs' }, { n: 'Amit Patel', r: 'Lead Engineer', m: 'Alumni Network' }, { n: 'Elena Rodriguez', r: 'Product Manager', m: 'Similar Skills' }].map((c, i) => (
              <div key={i} className={`flex flex-col gap-sm pb-lg ${i !== 2 ? 'border-b border-surface-container' : 'pb-0'}`}>
                <div className="flex gap-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-white font-black text-xs shrink-0 shadow-inner">{c.n[0]}</div>
                  <div>
                    <div className="font-bold text-on-surface text-xs">{c.n}</div>
                    <div className="text-[10px] font-medium text-on-surface-variant">{c.r}</div>
                    <div className="text-[10px] text-success-dark mt-0.5 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">stars</span> Match: {c.m}</div>
                  </div>
                </div>
                <div className="flex gap-xs">
                  <button className="flex-1 border border-info-dark text-info-dark rounded-full py-1 text-[10px] font-bold cursor-pointer hover:bg-info/10 transition-colors">Connect</button>
                  <button title="Let AI draft your first message!" className="flex-1 border-none bg-gradient-to-br from-[#7C3AED] to-indigo-brand text-white rounded-full py-1 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow"><span className="material-symbols-outlined text-[12px]">auto_fix_high</span> Icebreaker</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border border-surface-container p-lg shadow-sm">
          <div className="font-black text-sm text-on-surface mb-md">GenuAI Trending</div>
          <div className="flex flex-col gap-md">
            {[{ t: 'The rise of AI-driven technical interviews', p: '10.5k readers' }, { t: 'Why GenuAI Automata is replacing traditional whiteboarding', p: '8.2k readers' }, { t: 'Mastering the HR behavioral round with Voice AI', p: '5.1k readers' }].map((n, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="font-bold text-on-surface-variant text-xs mb-0.5 group-hover:text-info-dark transition-colors flex items-start gap-1"><span className="text-info-dark mt-[2px]">•</span> <span>{n.t}</span></div>
                <div className="text-[10px] font-medium text-on-surface-variant/70 pl-3">{n.p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// The Hub (6 cards)
function EventsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'hackathons' | 'team'>('hackathons');
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    getEvents()
      .then(res => setEvents(res.data.events || []))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <div className="max-w-[1200px] mx-auto w-full p-lg md:p-xl flex-1 flex flex-col gap-xl">
      <button onClick={onBack} className="text-on-surface-variant font-bold text-sm hover:text-on-surface flex items-center gap-xs transition-colors self-start">← Back to Search Hub</button>
      
      <div className="bg-gradient-to-br from-warning to-warning-dark rounded-3xl p-xl text-white flex justify-between items-center shadow-lg shadow-warning/20">
        <div>
          <h1 className="text-headline-sm font-headline-sm mb-xs">Competitions & Events</h1>
          <p className="text-sm opacity-90 font-medium">Participate in global hackathons and case studies with AI-matched teams.</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30 shrink-0">
          <img src="/icons/icon_hackathon.png" alt="Events" className="w-10 h-10 object-contain mix-blend-multiply" />
        </div>
      </div>

      <div className="flex gap-md border-b border-surface-container">
        <button onClick={() => setActiveTab('hackathons')} className={`pb-sm font-bold text-sm px-sm border-b-2 transition-colors ${activeTab === 'hackathons' ? 'border-warning-dark text-on-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>Active Hackathons</button>
        <button onClick={() => setActiveTab('team')} className={`pb-sm font-bold text-sm px-sm border-b-2 transition-colors flex items-center gap-1 ${activeTab === 'team' ? 'border-warning-dark text-on-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}><span className="material-symbols-outlined text-[16px] text-info">auto_awesome</span> AI Team Builder</button>
      </div>

      {activeTab === 'hackathons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {events.map((h, i) => (
            <div key={i} className="glass rounded-3xl p-xl border border-surface-container flex flex-col gap-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-surface-bright flex items-center justify-center border border-surface-container">
                  <span className="material-symbols-outlined text-warning-dark text-2xl">emoji_events</span>
                </div>
                <div className="bg-success/10 text-success-dark px-sm py-1 rounded-full text-xs font-black flex items-center gap-1 border border-success/20">
                  <span className="material-symbols-outlined text-[14px]">stars</span> {h.match}% Win Probability
                </div>
              </div>
              <div>
                <h3 className="text-title-md font-black text-on-surface">{h.title}</h3>
                <div className="text-sm font-medium text-on-surface-variant mt-1">{h.organization}</div>
              </div>
              <div className="flex items-center gap-md text-xs font-bold text-on-surface-variant">
                <span className="flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-[16px] text-success">payments</span> {h.prize}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-error">schedule</span> {h.deadline}</span>
              </div>
              <div className="flex gap-xs mt-auto pt-md border-t border-surface-container">
                {h.tags && (typeof h.tags === 'string' ? JSON.parse(h.tags) : h.tags).map((t: string) => <span key={t} className="bg-surface-bright text-on-surface-variant px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-surface-container">{t}</span>)}
              </div>
              <button className="w-full bg-warning hover:bg-warning-dark text-white rounded-xl py-sm font-bold text-sm mt-sm shadow-sm transition-colors">Register Now</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="glass rounded-3xl p-xl border border-surface-container flex flex-col md:flex-row gap-xl items-center shadow-sm">
          <div className="flex-1">
            <div className="text-info-dark flex items-center gap-xs mb-sm"><span className="material-symbols-outlined">auto_awesome</span> <span className="font-black text-xs uppercase tracking-widest">AI Synergy Matching</span></div>
            <h2 className="text-display-sm font-headline-md text-on-surface mb-md">Find Your Dream Team</h2>
            <p className="text-body-lg text-on-surface-variant mb-xl leading-relaxed">
              Our AI analyzes your skills (Frontend) and automatically finds candidates with complementary strengths (Backend, UI/UX) to maximize your chances of winning.
            </p>
            <button className="bg-info-dark hover:bg-info text-white rounded-xl px-lg py-sm font-bold text-sm shadow-md transition-all">Scan for Teammates</button>
          </div>
          <div className="w-full md:w-[350px] bg-surface-bright/50 border border-surface-container rounded-2xl p-lg flex flex-col gap-sm">
            <div className="font-bold text-sm text-on-surface mb-xs border-b border-surface-container pb-sm">Recommended Squad</div>
            <div className="flex items-center justify-between p-sm glass rounded-xl border border-surface-container">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-brand text-white flex items-center justify-center font-bold text-xs shadow-sm">Y</div>
                <div className="text-xs font-bold text-on-surface">You <span className="text-[10px] text-on-surface-variant font-medium block">Frontend</span></div>
              </div>
              <span className="material-symbols-outlined text-success">check_circle</span>
            </div>
            <div className="flex items-center justify-between p-sm bg-white rounded-xl border border-info/20 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-info-dark text-white flex items-center justify-center font-bold text-xs shadow-sm">S</div>
                <div className="text-xs font-bold text-on-surface">Sam K. <span className="text-[10px] text-info font-bold block">Backend (98% Synergy)</span></div>
              </div>
              <button className="text-[10px] bg-info/10 text-info-dark font-bold px-2 py-1 rounded-lg">Invite</button>
            </div>
            <div className="flex items-center justify-between p-sm bg-white rounded-xl border border-info/20 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-sm">A</div>
                <div className="text-xs font-bold text-on-surface">Anita M. <span className="text-[10px] text-[#8B5CF6] font-bold block">UI/UX (92% Synergy)</span></div>
              </div>
              <button className="text-[10px] bg-info/10 text-info-dark font-bold px-2 py-1 rounded-lg">Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PMInternshipView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'status' | 'analyzer'>('status');
  const [appStatus, setAppStatus] = useState<any>(null);

  useEffect(() => {
    getPMStatus()
      .then(res => setAppStatus(res.data.application))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <div className="max-w-[1200px] mx-auto w-full p-lg md:p-xl flex-1 flex flex-col gap-xl">
      <button onClick={onBack} className="text-on-surface-variant font-bold text-sm hover:text-on-surface flex items-center gap-xs transition-colors self-start">← Back to Search Hub</button>
      
      <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-3xl p-xl text-white flex justify-between items-center shadow-lg shadow-[#8B5CF6]/20">
        <div>
          <h1 className="text-headline-sm font-headline-sm mb-xs">PM Internship Cohort</h1>
          <p className="text-sm opacity-90 font-medium">Summer 2026 AI-based allocation scheme for Product Management.</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30 shrink-0">
          <img src="/icons/learning_brain.png" alt="PM" className="w-10 h-10 object-contain mix-blend-multiply" />
        </div>
      </div>

      <div className="flex gap-md border-b border-surface-container">
        <button onClick={() => setActiveTab('status')} className={`pb-sm font-bold text-sm px-sm border-b-2 transition-colors ${activeTab === 'status' ? 'border-[#8B5CF6] text-on-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>Allocation Status</button>
        <button onClick={() => setActiveTab('analyzer')} className={`pb-sm font-bold text-sm px-sm border-b-2 transition-colors flex items-center gap-1 ${activeTab === 'analyzer' ? 'border-[#8B5CF6] text-on-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}><span className="material-symbols-outlined text-[16px] text-[#8B5CF6]">document_scanner</span> AI Portfolio Analyzer</button>
      </div>

      {activeTab === 'status' && (
        <div className="glass rounded-3xl p-xl border border-surface-container shadow-sm flex flex-col gap-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-title-md text-on-surface">Your Application Journey</h3>
            <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-md py-1 rounded-full text-xs font-bold border border-[#8B5CF6]/20">Cohort S26</span>
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-md relative py-md">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-surface-container-high -translate-y-1/2 z-0"></div>
            <div className="hidden md:block absolute top-1/2 left-0 w-1/3 h-1 bg-[#8B5CF6] -translate-y-1/2 z-0"></div>
            
            <div className="flex-1 flex flex-row md:flex-col items-center gap-sm md:gap-md relative z-10 p-md">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold shadow-md ring-4 ring-[#8B5CF6]/20"><span className="material-symbols-outlined text-[20px]">check</span></div>
              <div className="text-left md:text-center">
                <div className="font-black text-sm text-on-surface">Profile Submitted</div>
                <div className="text-[10px] text-on-surface-variant font-medium mt-1">Oct 12, 2025</div>
              </div>
            </div>
            
            <div className={`flex-1 flex flex-row md:flex-col items-center gap-sm md:gap-md relative z-10 p-md ${!appStatus || appStatus.status === 'submitted' ? 'opacity-50' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] flex items-center justify-center font-bold shadow-sm ring-4 ring-[#8B5CF6]/20"><span className="material-symbols-outlined text-[20px]">pending</span></div>
              <div className="text-left md:text-center">
                <div className="font-black text-sm text-on-surface">PM Assessment</div>
                <div className="text-[10px] text-info font-bold mt-1">{appStatus?.status === 'assessment' ? 'Action Required' : 'Pending'}</div>
              </div>
            </div>
            
            <div className={`flex-1 flex flex-row md:flex-col items-center gap-sm md:gap-md relative z-10 p-md ${!appStatus || appStatus.status !== 'matched' ? 'opacity-50' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold"><span className="material-symbols-outlined text-[20px]">handshake</span></div>
              <div className="text-left md:text-center">
                <div className="font-black text-sm text-on-surface">Startup Matching</div>
                <div className="text-[10px] text-on-surface-variant font-medium mt-1">Pending Assessment</div>
              </div>
            </div>
          </div>
          
          <div className="mt-md bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-2xl p-lg flex flex-col md:flex-row items-center justify-between gap-lg">
             <div>
               <div className="font-black text-on-surface text-sm mb-xs flex items-center gap-xs"><span className="material-symbols-outlined text-[#8B5CF6] text-[18px]">assignment_turned_in</span> Complete the PM Assessment</div>
               <div className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-xl">This 45-minute simulation tests product sense, execution, and analytics. It is required to move to the matching phase.</div>
             </div>
             <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl px-xl py-sm font-bold text-sm shadow-md transition-colors whitespace-nowrap w-full md:w-auto">Start Assessment</button>
          </div>
        </div>
      )}

      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="glass rounded-3xl p-xl border border-surface-container flex flex-col gap-lg shadow-sm">
            <div>
              <div className="text-[#8B5CF6] flex items-center gap-xs mb-sm"><span className="material-symbols-outlined">document_scanner</span> <span className="font-black text-xs uppercase tracking-widest">Portfolio Review</span></div>
              <h3 className="font-headline-sm text-title-md text-on-surface mb-xs">Submit PRD or Case Study</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Our specialized AI reviews Product Requirements Documents, wireframes, and business cases to estimate your PM competency.</p>
            </div>
            <div className="border-2 border-dashed border-surface-container-high rounded-2xl p-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-bright/50 transition-colors">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-md opacity-50">cloud_upload</span>
              <div className="font-bold text-sm text-on-surface">Drop a PDF or Figma link</div>
              <div className="text-xs font-medium text-on-surface-variant mt-1">Supports PDF, DOCX, links</div>
            </div>
            <button className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl py-sm font-bold text-sm shadow-md transition-colors opacity-50 cursor-not-allowed">Analyze Portfolio</button>
          </div>
          <div className="glass rounded-3xl p-xl border border-surface-container shadow-sm flex flex-col items-center justify-center text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-20 mb-md">analytics</span>
            <div className="font-bold text-sm">Upload a document to see AI insights</div>
            <div className="text-xs mt-2 max-w-xs leading-relaxed">The analyzer will rate your Product Sense, Execution, and Technical Literacy out of 100.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// The Hub (6 cards)
const TOOLS = [
  { id:'network', imgSrc:'/icons/cat_english.png', title:'Professional Network', desc:'Connect with professionals, share updates, and build your profile.', classes: { bgLight: 'bg-info/10', text: 'text-info-dark', borderLight: 'border-info-dark/20', border: 'border-info-dark', bg: 'bg-info-dark' }, tags:['GenuAI Hub','Connections'], ready:true, filter:'All' },
  { id:'jobs', imgSrc:'/icons/icon_globe.png', title:'Global Job Board', desc:'Search thousands of job listings across top platforms.', classes: { bgLight: 'bg-indigo-brand/10', text: 'text-indigo-brand', borderLight: 'border-indigo-brand/20', border: 'border-indigo-brand', bg: 'bg-indigo-brand' }, tags:['Global Roles','Careers'], ready:true, filter:'All' },
  { id:'events', imgSrc:'/icons/icon_hackathon.png', title:'Competitions & Events', desc:'Participate in hackathons and university case studies.', classes: { bgLight: 'bg-warning/10', text: 'text-warning-dark', borderLight: 'border-warning-dark/20', border: 'border-warning-dark', bg: 'bg-warning-dark' }, tags:['Unstop Platform','Hackathons'], ready:true, filter:'All' },
  { id:'pm', imgSrc:'/icons/learning_brain.png', title:'PM Internship Allocation', desc:'AI-based matching scheme for Product Management internships.', classes: { bgLight: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]', borderLight: 'border-[#8B5CF6]/20', border: 'border-[#8B5CF6]', bg: 'bg-[#8B5CF6]' }, tags:['AI Matching','Product Management'], ready:true, filter:'All' },
  { id:'news', imgSrc:'/icons/cat_logical.png', title:'Tech & Company News', desc:'Stay updated with the latest in tech, business, and startups.', classes: { bgLight: 'bg-success/10', text: 'text-success-dark', borderLight: 'border-success-dark/20', border: 'border-success-dark', bg: 'bg-success-dark' }, tags:['Tech News','Company Updates'], ready:true, filter:'News' },
  { id:'chat', imgSrc:'/icons/svar_mic.png', title:'Instant Connect', desc:'Real-time messenger to connect with recruiters and peers.', classes: { bgLight: 'bg-success/10', text: 'text-[#25D366]', borderLight: 'border-[#25D366]/20', border: 'border-[#25D366]', bg: 'bg-[#25D366]' }, tags:['WhatsApp Style','Messaging'], ready:true, filter:'Chat' },
];

function NewsView({ onBack }: { onBack: () => void }) {
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    getNews()
      .then(res => setNewsList(res.data.news || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-[800px] mx-auto p-lg md:p-xl w-full">
      <button onClick={onBack} className="text-on-surface-variant font-bold text-sm mb-lg hover:text-on-surface flex items-center gap-xs transition-colors">← Back to Search Hub</button>
      <div className="bg-gradient-to-br from-success to-success-dark rounded-3xl p-xl text-white mb-xl flex justify-between items-center shadow-lg shadow-success/20">
        <div>
          <h1 className="text-headline-sm font-headline-sm mb-xs">Tech & Company News</h1>
          <p className="text-sm opacity-90 font-medium">The latest updates relevant to your career.</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30 shrink-0">
          <img src="/icons/cat_logical.png" alt="News" className="w-10 h-10 object-contain mix-blend-multiply" />
        </div>
      </div>
      <div className="flex flex-col gap-md">
        {newsList.map((news, i) => (
          <div key={news.id || i} className="glass rounded-2xl p-lg border border-surface-container flex flex-col gap-xs transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <span className="text-[10px] font-black text-success uppercase tracking-wider bg-success/10 px-sm py-0.5 rounded-full self-start border border-success/20">{news.tag}</span>
            <h4 className="text-title-md font-title-md text-on-surface">{news.title}</h4>
            <div className="text-xs font-medium text-on-surface-variant">{news.source} • {new Date(news.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchDashboard({ user, onBack }: Props) {
  const [active, setActive] = useState<string|null>(null);
  const [openTool, setOpenTool] = useState<typeof TOOLS[0] | null>(null);
  const [toast, setToast] = useState('');
  const name = user?.user?.name || user?.name || 'Candidate';

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleOpen = (tool: typeof TOOLS[0]) => {
    if (tool.ready) setOpenTool(tool);
    else showToast(`${tool.title} — Coming Soon!`);
  };

  return (
    <div className="min-h-screen bg-background quantum-gradient relative overflow-hidden flex flex-col">
      {toast && (
        <div className="fixed top-xl left-1/2 -translate-x-1/2 bg-surface-container-highest text-white px-xl py-sm rounded-xl font-bold text-sm z-50 shadow-md animate-[slideDown_0.3s_ease]">
          {toast}
        </div>
      )}

      {/* Header */}
      <nav className="glass border-b border-surface-container px-lg md:px-xl h-16 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-sm">
          <img src="/logo.png" alt="GenuAI" className="w-10 h-10 object-contain drop-shadow-md" />
          <div>
            <div className="font-black text-sm text-on-surface">GenuAI Technologies</div>
            <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Search Hub</div>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button onClick={onBack} className="bg-surface-bright border border-surface-container rounded-lg px-md py-xs text-xs font-bold text-on-surface-variant hover:text-on-surface hover:border-surface-container-high transition-colors">
            ← Change Path
          </button>
          <div className="flex items-center gap-xs">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning to-error flex items-center justify-center text-white font-black text-xs shadow-sm">
              {name[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-bold text-on-surface hidden sm:block">{name}</span>
          </div>
        </div>
      </nav>

      {openTool ? (
        openTool.id === 'network' ? (
          <NetworkView user={user} onBack={() => setOpenTool(null)} />
        ) : openTool.id === 'news' ? (
          <NewsView onBack={() => setOpenTool(null)} />
        ) : openTool.id === 'chat' ? (
          <div className="max-w-[1000px] mx-auto p-lg md:p-xl h-[85vh] flex flex-col w-full">
            <button onClick={() => setOpenTool(null)} className="text-on-surface-variant font-bold text-sm mb-lg hover:text-on-surface flex items-center gap-xs transition-colors self-start">← Back to Search Hub</button>
            <div className="flex flex-1 glass rounded-3xl border border-surface-container overflow-hidden shadow-sm">
              <div className="w-72 bg-surface-bright/50 border-r border-surface-container flex flex-col">
                <div className="p-lg border-b border-surface-container font-black text-title-sm text-on-surface bg-surface-bright">Instant Connect</div>
                <div className="p-md bg-surface-container/30 flex items-center gap-md border-b border-surface-container cursor-pointer hover:bg-surface-container/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">HR</div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-bold text-on-surface">GenuAI Recruiting</div>
                    <div className="text-xs font-medium text-on-surface-variant truncate">Are you available for an...</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-background/50 relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="p-lg bg-surface-bright/80 backdrop-blur-md border-b border-surface-container flex items-center gap-md relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">HR</div>
                  <div>
                    <div className="font-black text-title-sm text-on-surface">GenuAI Recruiting</div>
                    <div className="text-xs font-bold text-[#25D366]">Online</div>
                  </div>
                </div>
                <div className="flex-1 p-xl overflow-y-auto flex flex-col gap-md relative z-10">
                  <div className="self-center bg-surface-container text-on-surface-variant px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Today</div>
                  <div className="self-start glass px-md py-sm rounded-2xl rounded-tl-sm max-w-[70%] shadow-sm border border-surface-container">
                    <div className="text-sm font-medium text-on-surface leading-relaxed">Hi {name}! We reviewed your impressive assessment score and would love to schedule a technical interview. Are you available sometime tomorrow?</div>
                    <div className="text-[10px] font-bold text-on-surface-variant mt-xs text-right">10:42 AM</div>
                  </div>
                </div>
                <div className="p-lg bg-surface-bright/80 backdrop-blur-md border-t border-surface-container flex gap-md items-center relative z-10">
                  <button className="text-xl opacity-60 hover:opacity-100 transition-opacity flex items-center"><span className="material-symbols-outlined">attach_file</span></button>
                  <input placeholder="Type your message..." className="flex-1 px-lg py-sm bg-surface-container/50 border border-surface-container rounded-full outline-none text-sm font-medium focus:border-indigo-brand/50 focus:bg-white transition-all" />
                  <button className="bg-[#25D366] hover:bg-[#1DA851] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : openTool.id === 'events' ? (
          <EventsView onBack={() => setOpenTool(null)} />
        ) : openTool.id === 'pm' ? (
          <PMInternshipView onBack={() => setOpenTool(null)} />
        ) : (
          <JobBoard user={user} onBack={() => setOpenTool(null)} initialFilter={openTool.filter} />
        )
      ) : (
        <div className="max-w-[1200px] mx-auto w-full p-lg md:p-xl flex-1 flex flex-col">
          {/* Background decorations */}
          <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-info/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-success/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="text-center mb-xl relative z-10">
            <h1 className="text-[2.8rem] md:text-[3.5rem] font-black text-on-surface mb-3 drop-shadow-sm leading-tight tracking-tight">Global <span className="text-info-dark">Search Hub</span></h1>
            <p className="text-on-surface-variant font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Explore jobs, connect with peers, and discover new opportunities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xl relative z-10">
            {TOOLS.map(tool => {
              const isHover = active === tool.id;
              return (
                <div key={tool.id} onMouseEnter={() => setActive(tool.id)} onMouseLeave={() => setActive(null)}
                  className={`glass rounded-3xl p-xl flex flex-col relative transition-all duration-300 cursor-pointer border-2 ${isHover ? `${tool.classes.border} shadow-[0_16px_40px_rgba(0,0,0,0.08)] scale-[1.02] bg-white` : 'border-surface-container hover:border-surface-container-high'}`}>
                  
                  {!tool.ready && (
                    <div className="absolute top-md right-md bg-warning/20 text-warning-dark text-[10px] font-black px-xs py-0.5 rounded-full uppercase tracking-widest border border-warning/30">
                      SOON
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 rounded-2xl ${tool.classes.bgLight} flex items-center justify-center mb-md overflow-hidden shrink-0`}>
                    <img src={tool.imgSrc} alt={tool.title} className="w-10 h-10 object-contain mix-blend-multiply drop-shadow-sm" />
                  </div>
                  
                  <h3 className="text-title-md font-title-md text-on-surface mb-xs">{tool.title}</h3>
                  <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-md flex-1">{tool.desc}</p>
                  
                  <div className="flex flex-wrap gap-xs mb-lg">
                    {tool.tags.map((t,i) => (
                      <span key={i} className={`${tool.classes.bgLight} ${tool.classes.text} text-xs font-bold px-sm py-1 rounded-full border ${tool.classes.borderLight}`}>{t}</span>
                    ))}
                  </div>
                  
                  <button onClick={() => handleOpen(tool)} className={`w-full py-sm rounded-xl font-bold text-sm flex items-center justify-center gap-xs transition-all ${tool.ready ? (isHover ? `${tool.classes.bg} text-white shadow-md` : `bg-transparent ${tool.classes.text} border ${tool.classes.border}`) : 'bg-surface-bright text-on-surface-variant border border-surface-container cursor-not-allowed'}`}>
                    {tool.ready ? (isHover ? <>Launch <span className="material-symbols-outlined text-[16px]">rocket_launch</span></> : 'Open Tool') : 'Coming Soon'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Search Hub Overview Banner */}
          <div className="glass rounded-3xl p-xl md:p-xxl border border-surface-container shadow-sm flex flex-col md:flex-row items-center gap-xl relative overflow-hidden z-10 mt-auto">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-info/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-success/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-md mb-md">
                <div className="w-14 h-14 bg-info/10 rounded-2xl flex items-center justify-center border border-info/20">
                   <img src="/icons/icon_globe.png" alt="Globe" className="w-8 h-8 object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h2 className="text-headline-sm font-headline-sm text-on-surface m-0 mb-1">Global Search Hub</h2>
                  <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Your AI-powered career launchpad</p>
                </div>
              </div>
              
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-lg max-w-3xl">
                Welcome to the GenuAI Search Hub. This powerful ecosystem utilizes our proprietary matching algorithms to connect you with top-tier opportunities. Whether you're networking with industry professionals, exploring our curated Global Job Board, or staying updated on the latest AI trends, your next career move starts here.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md max-w-4xl">
                <div className="bg-surface-bright/80 backdrop-blur-sm p-md rounded-2xl border border-surface-container">
                  <div className="text-on-surface font-black text-sm mb-1 flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-info">ads_click</span> Precision Matching</div>
                  <div className="text-on-surface-variant text-xs font-medium">Our AI analyzes your skills and resume for the perfect fit.</div>
                </div>
                <div className="bg-surface-bright/80 backdrop-blur-sm p-md rounded-2xl border border-surface-container">
                  <div className="text-on-surface font-black text-sm mb-1 flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-indigo-brand">group</span> GenuAI Network</div>
                  <div className="text-on-surface-variant text-xs font-medium">Connect seamlessly with peers and tech recruiters.</div>
                </div>
                <div className="bg-surface-bright/80 backdrop-blur-sm p-md rounded-2xl border border-surface-container">
                  <div className="text-on-surface font-black text-sm mb-1 flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-success">trending_up</span> Career Insights</div>
                  <div className="text-on-surface-variant text-xs font-medium">Stay informed with tailored technology and company news.</div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-80 bg-surface-bright/90 backdrop-blur-md rounded-2xl border border-surface-container p-xl flex flex-col relative z-10 shadow-sm shrink-0 gap-md">
              <div className="text-on-surface-variant font-bold text-[11px] uppercase tracking-[0.18em] mb-xs text-center">Hub Overview</div>
              <div className="flex flex-col gap-sm">
                <div className="flex items-center justify-between bg-info/8 border border-info/15 rounded-xl px-md py-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-info-dark text-[18px]">grid_view</span>
                    <span className="text-sm font-bold text-on-surface">Search Modules</span>
                  </div>
                  <span className="text-xl font-black text-info-dark">{TOOLS.length}</span>
                </div>
                <div className="flex items-center justify-between bg-success/8 border border-success/15 rounded-xl px-md py-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
                    <span className="text-sm font-bold text-on-surface">Available Now</span>
                  </div>
                  <span className="text-xl font-black text-success">{TOOLS.filter(t => t.ready).length}/{TOOLS.length}</span>
                </div>
                <div className="flex items-center justify-between bg-indigo-brand/8 border border-indigo-brand/15 rounded-xl px-md py-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-indigo-brand text-[18px]">auto_awesome</span>
                    <span className="text-sm font-bold text-on-surface">AI-Powered</span>
                  </div>
                  <span className="text-sm font-black text-indigo-brand">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

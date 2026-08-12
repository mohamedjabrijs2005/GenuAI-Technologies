import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  Calendar,
  ShieldCheck,
  AlertCircle,
  FileText,
  Code,
  GraduationCap,
  ExternalLink,
  RefreshCw,
  Bell,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Video,
  Award,
  Layers,
  Search,
  Compass,
} from "lucide-react";

interface Props {
  user: any;
  onSelect: (path: "practice" | "search" | "test" | "career-profile") => void;
  onLogout: () => void;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PathSelection({ user, onSelect, onLogout }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userId = user?.user?.id || user?.id;
  const candidateName = user?.user?.name || user?.name || "Candidate";
  const candidateEmail = user?.user?.email || user?.email || "";
  const token = user?.token || "";

  const loadCandidateTelemetry = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const headers = token ? { Authorization: "Bearer " + token } : {};
      const res = await axios.get(`${API}/candidate/overview/${userId}`, { headers });
      setCandidateData(res.data);
    } catch (err) {
      console.warn("[CandidateDashboard] Overview fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidateTelemetry();
  }, [userId]);

  const profilePct = candidateData?.profileCompletion?.percentage ?? 40;
  const isProfileComplete = candidateData?.profileCompletion?.isComplete ?? false;
  const missingProfile = candidateData?.profileCompletion?.missing || [];
  const latestAssessment = candidateData?.latestAssessment || null;
  const applications = candidateData?.applications || [];
  const interviews = candidateData?.interviews || [];
  const recommendedJobs = candidateData?.recommendedJobs || [];
  const notifications = candidateData?.notifications || [];
  const aiInsight = candidateData?.aiInsight || "Complete your profile to maximize recruiter discovery.";

  return (
    <div className="min-h-screen bg-background quantum-gradient font-body-base text-on-background relative overflow-x-hidden selection:bg-indigo-brand selection:text-white">
      
      {/* ─────────────────────────────────────────────
          1. TOP NAVBAR
      ───────────────────────────────────────────── */}
      <nav className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="GenuAI" className="w-9 h-9 object-contain drop-shadow-xs" />
          <div>
            <div className="font-black text-slate-900 text-sm sm:text-base leading-tight tracking-tight">
              Genu<span className="text-indigo-600">AI</span> Technologies
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
              Candidate Career Hub
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-[fadeIn_0.15s_ease] space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] font-semibold text-slate-400">{notifications.length} recent</span>
                </div>
                {notifications.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.map((n: any) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 text-xs space-y-0.5">
                        <div className="font-bold text-slate-900">{n.title}</div>
                        <div className="text-[11px] text-slate-500 leading-snug">{n.message}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">No new notifications.</div>
                )}
              </div>
            )}
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/80">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              {candidateName.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs font-bold text-slate-800 hidden sm:block truncate max-w-[120px]">
              {candidateName}
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1.5 border border-rose-200 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────
          MAIN CONTENT CONTAINER
      ───────────────────────────────────────────── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-[fadeIn_0.3s_ease]">
        
        {/* ─────────────────────────────────────────────
            1. HEADER & QUICK ACTIONS
        ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Good morning, {candidateName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Your GenuAI career journey starts here.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect("practice")}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Practice
            </button>
            <button
              type="button"
              onClick={() => onSelect("search")}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Search Jobs
            </button>
            <button
              type="button"
              onClick={() => onSelect("test")}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Continue Assessment
            </button>
            <button
              type="button"
              onClick={() => onSelect("career-profile")}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            2. CAREER PROFILE STATUS CARD
        ───────────────────────────────────────────── */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Career Profile Status
              </span>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {profilePct}% Complete
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden max-w-md">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profilePct}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-500">
              {isProfileComplete ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Your career profile is complete
                </span>
              ) : (
                <>Missing: <span className="font-semibold text-slate-700">{missingProfile.join(", ")}</span></>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelect("career-profile")}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer shrink-0"
          >
            {isProfileComplete ? "View Profile →" : "Complete Profile →"}
          </button>
        </div>

        {/* ─────────────────────────────────────────────
            3. FOUR CORE HUBS (The Primary 4 Pillars)
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 01 — PRACTICE HUB */}
          <div
            onMouseEnter={() => setHovered("practice")}
            onMouseLeave={() => setHovered(null)}
            className={`bg-white p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-5 ${
              hovered === "practice" ? "border-indigo-500 shadow-md ring-2 ring-indigo-500/20" : "border-slate-200 shadow-2xs"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  01 — Practice Hub
                </span>
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Practice Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build your skills before your next opportunity. AI mock interviews, coding tests, SVAR verbal fluency, and inclusive learning tracks.
              </p>

              {/* Categories */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-700">Coding</div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-700">Aptitude</div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-700">Interview</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelect("practice")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 02 — SEARCH HUB */}
          <div
            onMouseEnter={() => setHovered("search")}
            onMouseLeave={() => setHovered(null)}
            className={`bg-white p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-5 ${
              hovered === "search" ? "border-amber-500 shadow-md ring-2 ring-amber-500/20" : "border-slate-200 shadow-2xs"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  02 — Search Hub
                </span>
                <Compass className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Search Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Discover jobs and opportunities that match your skills. Connect directly with hiring managers, explore verified openings, and join hackathons.
              </p>

              {/* Recommended Jobs count / sample */}
              <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-amber-900 font-medium">
                {recommendedJobs.length > 0
                  ? `${recommendedJobs.length} active opportunities available for application.`
                  : "Explore live openings across partner tech companies."}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelect("search")}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 03 — ASSESSMENT HUB */}
          <div
            onMouseEnter={() => setHovered("test")}
            onMouseLeave={() => setHovered(null)}
            className={`bg-white p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-5 ${
              hovered === "test" ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "border-slate-200 shadow-2xs"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  03 — Assessment Hub
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Assessment Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete assessments and demonstrate your skills. Full-spectrum 7-module proctored evaluation yielding an unforgeable verified scorecard.
              </p>

              <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-900 font-medium">
                Status: <span className="font-bold">{latestAssessment ? (latestAssessment.overall_score ? "Scorecard Verified" : "In Progress") : "Not Started"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelect("test")}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 04 — CAREER PROFILE HUB */}
          <div
            onMouseEnter={() => setHovered("profile")}
            onMouseLeave={() => setHovered(null)}
            className={`bg-white p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-5 ${
              hovered === "profile" ? "border-purple-500 shadow-md ring-2 ring-purple-500/20" : "border-slate-200 shadow-2xs"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  04 — Career Profile Hub
                </span>
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Career Profile Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build a professional profile that represents your skills. AI resume optimizer, ATS checker, project showcase, and recruiter portfolio.
              </p>

              <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-900 font-medium">
                Profile Completion: <span className="font-bold">{profilePct}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelect("career-profile")}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Manage Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            4. CURRENT ACTIONS ("What's Next?")
        ───────────────────────────────────────────── */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            What's Next?
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-slate-900">
                {!isProfileComplete
                  ? "Complete your Career Profile"
                  : !latestAssessment
                  ? "Take your GenuAI Assessment"
                  : interviews.some((i: any) => i.status === "scheduled")
                  ? "Prepare for your upcoming interview"
                  : "Explore matching job openings"}
              </div>
              <p className="text-xs text-slate-500">
                {!isProfileComplete
                  ? "Add missing details to increase visibility to hiring employers."
                  : !latestAssessment
                  ? "One assessment connects your score to multiple partner companies."
                  : interviews.some((i: any) => i.status === "scheduled")
                  ? "Review your project architecture and technical notes."
                  : "Apply directly with your verified assessment scorecard."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isProfileComplete) onSelect("career-profile");
                else if (!latestAssessment) onSelect("test");
                else onSelect("search");
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              {!isProfileComplete ? "Complete Profile" : !latestAssessment ? "Start Assessment" : "Explore Search Hub"}
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            5. MY APPLICATIONS & ASSESSMENT PROGRESS GRID
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Applications */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">My Applications</h3>
              {applications.length > 0 && (
                <button
                  type="button"
                  onClick={() => onSelect("search")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Explore More →
                </button>
              )}
            </div>

            {applications.length > 0 ? (
              <div className="space-y-2.5">
                {applications.slice(0, 4).map((app: any) => (
                  <div key={app.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{app.company_name || "GenuAI Partner Company"}</div>
                      <div className="text-[10px] text-slate-500">{app.role || "Software Engineer"}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        app.verdict === "HIRE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : app.verdict === "SHORTLIST"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : app.verdict === "REJECT"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {app.verdict || "Under Review"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Briefcase className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">You haven't applied to any opportunities yet</div>
                <p className="text-[11px] text-slate-500">
                  Explore verified openings in the Search Hub and apply with one click.
                </p>
                <button
                  type="button"
                  onClick={() => onSelect("search")}
                  className="mt-1 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Explore Search Hub
                </button>
              </div>
            )}
          </div>

          {/* Assessment Progress */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Assessment Progress</h3>
              <button
                type="button"
                onClick={() => onSelect("test")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                View Hub →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: "Resume & ATS Screening", status: latestAssessment?.ats_score ? "Completed" : "Not Started" },
                { name: "Aptitude & Coding Test", status: latestAssessment?.test_score ? "Completed" : "Not Started" },
                { name: "SVAR Verbal Communication", status: latestAssessment?.communication_score ? "Completed" : "Not Started" },
                { name: "AI Technical Interview", status: latestAssessment?.interview_score ? "Completed" : "Not Started" },
                { name: "Hackathon Project Challenge", status: latestAssessment?.coding_score ? "Completed" : "Not Started" },
              ].map((mod, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{mod.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      mod.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            6. ONE ASSESSMENT → MULTIPLE OPPORTUNITIES
        ───────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-200">
                One Assessment. Multiple Opportunities.
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Complete your GenuAI assessment and, where applicable, share your verified assessment profile with selected partner companies instead of repeatedly completing similar assessments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelect("test")}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-indigo-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            Continue Assessment →
          </button>
        </div>

        {/* ─────────────────────────────────────────────
            7. UPCOMING INTERVIEWS
        ───────────────────────────────────────────── */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Upcoming Interviews</h3>

          {interviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {interviews.map((iv: any) => (
                <div key={iv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {iv.interview_type || "Technical Round"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(iv.scheduled_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{iv.company_name || "Employer"}</div>
                    <div className="text-[10px] text-slate-500">{iv.job_title || "Software Engineer"}</div>
                  </div>
                  {iv.meeting_link && (
                    <a
                      href={iv.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Call
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
              <Calendar className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-700">No upcoming interviews</div>
              <p className="text-[11px] text-slate-500">
                Scheduled interview invitations from employers will appear here.
              </p>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────
            8. AI CAREER INSIGHT (Single Compact Card)
        ───────────────────────────────────────────── */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              AI Career Insight
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {aiInsight}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

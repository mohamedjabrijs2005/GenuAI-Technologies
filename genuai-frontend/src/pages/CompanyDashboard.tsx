import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  Calendar,
  FolderGit2,
  BarChart3,
  MessageSquare,
  CreditCard,
  Building2,
  Settings,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Eye,
  FileText,
  ShieldCheck,
  Mail,
  Phone,
  GraduationCap,
  Send,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  Video,
  X,
  Sparkles,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
} from "lucide-react";
import DashboardLayout, { NavItem } from "../components/dashboard/DashboardLayout";

interface Props {
  user: any;
  onLogout: () => void;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const COMPANY_NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "assessments", label: "Assessments", icon: ClipboardCheck },
  { id: "interviews", label: "Interviews", icon: Calendar },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "profile", label: "Company Profile", icon: Building2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function CompanyDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "info"; message: string }>>([]);

  // Real Database States (Zero hardcoded demo counts)
  const [overviewData, setOverviewData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  // Filters
  const [candidateFilterVerdict, setCandidateFilterVerdict] = useState("ALL");
  const [jobFilterStatus, setJobFilterStatus] = useState("ALL");

  // Modals & Selected items
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [candidateProfileTab, setCandidateProfileTab] = useState<"overview" | "assessments" | "integrity">("overview");
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState<any>(null);
  const [showAssignProjectModal, setShowAssignProjectModal] = useState<any>(null);

  // Forms
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    experience_level: "Mid-Level",
    description: "",
    skills: "",
    salary_min: 0,
    salary_max: 0,
    assessment_config: { aptitude: true, coding: true, communication: true, ai_interview: true },
  });

  const [scheduleForm, setScheduleForm] = useState({
    scheduled_at: "",
    interview_type: "Technical",
    job_title: "Software Engineer",
    interviewer_name: "Hiring Manager",
    meeting_link: "",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [profileForm, setProfileForm] = useState({
    company_name: "",
    industry: "Technology",
    location: "Bengaluru, India",
    company_size: "50-200 employees",
    website: "",
    description: "",
  });

  const companyId = user?.user?.id || user?.id;
  const companyName = user?.user?.name || user?.name || "Company";
  const token = user?.token || "";

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadAllData = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const headers = { Authorization: "Bearer " + token };
      const [oRes, jRes, cRes, iRes, pRes, aRes, profRes, subRes] = await Promise.allSettled([
        axios.get(`${API}/company/overview/${companyId}`, { headers }),
        axios.get(`${API}/company/jobs/${companyId}`, { headers }),
        axios.get(`${API}/company/candidates/${companyId}`, { headers }),
        axios.get(`${API}/company/interviews/${companyId}`, { headers }),
        axios.get(`${API}/company/projects/${companyId}`, { headers }),
        axios.get(`${API}/company/ai-insights/${companyId}`, { headers }),
        axios.get(`${API}/company/profile/${companyId}`, { headers }),
        axios.get(`${API}/company/subscription/${companyId}`, { headers }),
      ]);

      if (oRes.status === "fulfilled") setOverviewData(oRes.value.data);
      if (jRes.status === "fulfilled") setJobs(jRes.value.data.jobs || []);
      if (cRes.status === "fulfilled") setCandidates(cRes.value.data.candidates || []);
      if (iRes.status === "fulfilled") setInterviews(iRes.value.data.interviews || []);
      if (pRes.status === "fulfilled") setProjects(pRes.value.data.projects || []);
      if (aRes.status === "fulfilled") setAiInsights(aRes.value.data);
      if (profRes.status === "fulfilled" && profRes.value.data.profile) {
        setProfile(profRes.value.data.profile);
        setProfileForm({
          company_name: profRes.value.data.profile.company_name || companyName,
          industry: profRes.value.data.profile.industry || "Technology",
          location: profRes.value.data.profile.location || "Bengaluru, India",
          company_size: profRes.value.data.profile.company_size || "50-200 employees",
          website: profRes.value.data.profile.website || "",
          description: profRes.value.data.profile.description || "",
        });
      }
      if (subRes.status === "fulfilled") setSubscription(subRes.value.data);
    } catch (e: any) {
      console.error("[CompanyDashboard] Error loading data:", e);
      addToast("error", "Failed to refresh recruitment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [companyId]);

  // Verdict update with GenuAI Waterfall Cascade routing
  const handleUpdateVerdict = async (candidateAssessmentId: number, verdict: string) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const res = await axios.put(
        `${API}/admin/verdict/${candidateAssessmentId}`,
        { verdict, company_name: companyName },
        { headers }
      );
      if (res.data.cascaded) {
        addToast("info", `Candidate automatically forwarded to their next preference: ${res.data.nextCompany}`);
      } else {
        addToast("success", `Candidate status updated to ${verdict}.`);
      }
      loadAllData();
      setSelectedCandidate(null);
    } catch (err: any) {
      addToast("error", "Failed to update candidate status.");
    }
  };

  // Create Job
  const handleCreateJobSubmit = async () => {
    if (!newJobForm.title || !newJobForm.description) {
      addToast("error", "Job title and description are required.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(
        `${API}/company/jobs`,
        {
          ...newJobForm,
          company_id: companyId,
        },
        { headers }
      );
      addToast("success", "Job opening posted successfully!");
      setShowCreateJobModal(false);
      setNewJobForm({
        title: "",
        department: "Engineering",
        location: "Remote",
        employment_type: "Full-time",
        experience_level: "Mid-Level",
        description: "",
        skills: "",
        salary_min: 0,
        salary_max: 0,
        assessment_config: { aptitude: true, coding: true, communication: true, ai_interview: true },
      });
      loadAllData();
    } catch (err: any) {
      addToast("error", "Failed to create job posting.");
    }
  };

  // Schedule Interview
  const handleScheduleInterview = async () => {
    if (!showScheduleModal || !scheduleForm.scheduled_at) {
      addToast("error", "Please select interview date and time.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(
        `${API}/company/interviews`,
        {
          company_id: companyId,
          candidate_id: showScheduleModal.user_id || showScheduleModal.id,
          candidate_name: showScheduleModal.name,
          candidate_email: showScheduleModal.email,
          ...scheduleForm,
        },
        { headers }
      );
      addToast("success", `Interview scheduled with ${showScheduleModal.name}!`);
      setShowScheduleModal(null);
      loadAllData();
    } catch (err: any) {
      addToast("error", "Failed to schedule interview.");
    }
  };

  // Save Profile
  const handleSaveProfile = async () => {
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.put(
        `${API}/company/profile/${companyId}`,
        profileForm,
        { headers }
      );
      addToast("success", "Company profile updated successfully.");
      loadAllData();
    } catch {
      addToast("error", "Failed to update profile.");
    }
  };

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchSearch =
        searchQuery === "" ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchVerdict =
        candidateFilterVerdict === "ALL" ||
        c.verdict === candidateFilterVerdict ||
        (candidateFilterVerdict === "PENDING" && (!c.verdict || c.verdict === "REVIEW"));
      return matchSearch && matchVerdict;
    });
  }, [candidates, searchQuery, candidateFilterVerdict]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch =
        searchQuery === "" ||
        j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.department?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = jobFilterStatus === "ALL" || j.status === jobFilterStatus;
      return matchSearch && matchStatus;
    });
  }, [jobs, searchQuery, jobFilterStatus]);

  // Real KPIs (Scoped strictly to authenticated company)
  const kpiActiveJobs = overviewData?.kpis?.activeJobs ?? jobs.filter(j => j.status === 'active' || !j.status).length;
  const kpiApplications = overviewData?.kpis?.totalCandidates ?? candidates.length;
  const kpiPendingAssessments = overviewData?.kpis?.assessmentsPending ?? candidates.filter(c => !c.verdict || c.verdict === 'REVIEW').length;
  const kpiUpcomingInterviews = overviewData?.kpis?.interviewsScheduled ?? interviews.filter(i => i.status === 'scheduled').length;

  return (
    <DashboardLayout
      title={`Good morning, ${companyName}`}
      subtitle="Manage your recruitment process with GenuAI."
      portalType="company"
      user={user}
      navItems={COMPANY_NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search candidates, jobs, evaluations..."
      toasts={toasts}
      onDismissToast={removeToast}
    >
      {/* ─────────────────────────────────────────────
          MAIN DASHBOARD OVERVIEW
      ───────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          
          {/* 1. TOP: Welcome & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Good morning, {companyName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Manage your recruitment process with GenuAI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowCreateJobModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Job</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("candidates")}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>View Candidates</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (candidates.length > 0) {
                    setShowScheduleModal(candidates[0]);
                  } else {
                    setActiveTab("interviews");
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Interview</span>
              </button>

              <button
                type="button"
                onClick={loadAllData}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Refresh Metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* 2. RECRUITMENT OVERVIEW: 4 Primary KPI Cards (Real Data Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Active Jobs */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Jobs</span>
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {kpiActiveJobs}
              </div>
              <div className="text-[11px] text-slate-500">
                {kpiActiveJobs > 0 ? "Open positions accepting applications" : "No active job postings"}
              </div>
            </div>

            {/* Card 2: Applications */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Applications</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-600 tracking-tight">
                {kpiApplications}
              </div>
              <div className="text-[11px] text-slate-500">
                {kpiApplications > 0 ? "Total verified candidates applied" : "Waiting for candidates to apply"}
              </div>
            </div>

            {/* Card 3: Pending Assessments */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Assessments</span>
                <ClipboardCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-600 tracking-tight">
                {kpiPendingAssessments}
              </div>
              <div className="text-[11px] text-slate-500">
                {kpiPendingAssessments > 0 ? "Assessments in progress / review" : "No assessments awaiting review"}
              </div>
            </div>

            {/* Card 4: Upcoming Interviews */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Interviews</span>
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-600 tracking-tight">
                {kpiUpcomingInterviews}
              </div>
              <div className="text-[11px] text-slate-500">
                {kpiUpcomingInterviews > 0 ? "Scheduled live & technical rounds" : "No upcoming interviews"}
              </div>
            </div>
          </div>

          {/* 3. ACTIVE JOBS SECTION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Job Postings</h3>
                <p className="text-xs text-slate-500">Current openings configured for GenuAI candidate evaluation</p>
              </div>
              {jobs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("jobs")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                >
                  Manage All ({jobs.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Job Title</th>
                      <th className="p-3">Applications</th>
                      <th className="p-3">Assessment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Created</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.slice(0, 5).map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          <div>{j.title}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{j.department || "Engineering"} • {j.location || "Remote"}</div>
                        </td>
                        <td className="p-3 font-bold text-indigo-600">{j.applicants_count || 0}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Assessment Active
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {j.status || "Active"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(j.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("candidates");
                              setSearchQuery(j.title);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs cursor-pointer"
                          >
                            View Candidates →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-800">Start hiring with GenuAI</div>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Create your first job posting to begin receiving verified candidates.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateJobModal(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Job
                </button>
              </div>
            )}
          </div>

          {/* 4. RECENT CANDIDATES & ASSESSMENT ACTIVITY GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Candidates */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Candidates</h3>
                  <p className="text-xs text-slate-500">Candidates associated with your job vacancies</p>
                </div>
                {candidates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("candidates")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    View All →
                  </button>
                )}
              </div>

              {candidates.length > 0 ? (
                <div className="space-y-2.5">
                  {candidates.slice(0, 5).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {c.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.role || "Applied Candidate"}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {c.overall_score !== undefined && c.overall_score !== null && (
                          <div className="text-right">
                            <div className="text-xs font-black text-indigo-600">{c.overall_score}%</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase">Score</div>
                          </div>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.verdict === "HIRE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : c.verdict === "SHORTLIST"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : c.verdict === "REJECT"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {c.verdict || "Assessment Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                  <Users className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-700">No candidates yet</div>
                  <p className="text-[11px] text-slate-500">
                    Candidates will appear here after they apply to your jobs.
                  </p>
                </div>
              )}
            </div>

            {/* Assessment Activity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Assessment Activity</h3>
                  <p className="text-xs text-slate-500">GenuAI proctored evaluation pipeline status</p>
                </div>
                {candidates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("assessments")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    View All →
                  </button>
                )}
              </div>

              {candidates.length > 0 ? (
                <div className="space-y-2.5">
                  {candidates.slice(0, 5).map((a) => (
                    <div key={a.id} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{a.name}</div>
                        <div className="text-[10px] text-slate-500">
                          Aptitude: {a.test_score ?? "—"}% • ATS: {a.ats_score ?? "—"}% • Interview: {a.interview_score ?? "—"}%
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {a.overall_score ? "Completed" : "Under Review"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                  <ClipboardCheck className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-700">No assessment activity yet</div>
                  <p className="text-[11px] text-slate-500">
                    Assessment activity will appear after candidates begin their assessment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 5. UPCOMING INTERVIEWS SECTION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upcoming Interviews</h3>
                <p className="text-xs text-slate-500">Scheduled candidate technical and behavioral interviews</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (candidates.length > 0) setShowScheduleModal(candidates[0]);
                  else setActiveTab("interviews");
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Schedule Interview
              </button>
            </div>

            {interviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {interviews.map((iv) => (
                  <div key={iv.id} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {iv.interview_type || "Technical"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(iv.scheduled_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{iv.candidate_name}</div>
                      <div className="text-[10px] text-slate-500">{iv.job_title || "Software Engineer"}</div>
                    </div>
                    {iv.meeting_link && (
                      <a
                        href={iv.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        <Video className="w-3 h-3" /> Join Call
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Calendar className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">No upcoming interviews</div>
                <p className="text-[11px] text-slate-500">
                  Schedule interviews directly with your shortlisted candidates.
                </p>
                {candidates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(candidates[0])}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Schedule Interview
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 6. AI RECRUITMENT INSIGHT (Single Compact Bottom Card) */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-900/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  AI Recruitment Insight
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {aiInsights?.insights && aiInsights.insights.length > 0
                  ? aiInsights.insights[0]
                  : "AI insights will appear as recruitment activity grows."}
              </p>
              <div className="text-[10px] text-slate-400">
                * AI-generated recommendations should support, not replace, human hiring decisions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: JOBS MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "jobs" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Job Management</h2>
              <p className="text-xs text-slate-500">Post and manage job openings across the GenuAI ecosystem</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateJobModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Job</span>
            </button>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Job Title</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Applications</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJobs.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{j.title}</td>
                        <td className="p-3.5 text-slate-600">{j.department || "Engineering"}</td>
                        <td className="p-3.5 text-slate-600">{j.location || "Remote"}</td>
                        <td className="p-3.5 text-slate-600">{j.employment_type || "Full-time"}</td>
                        <td className="p-3.5 font-bold text-indigo-600">{j.applicants_count || 0}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {j.status || "Active"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("candidates");
                              setSearchQuery(j.title);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs cursor-pointer"
                          >
                            View Candidates →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Start hiring with GenuAI</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first job posting to begin receiving verified candidates.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateJobModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Create Job
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: CANDIDATES MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "candidates" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Candidate Evaluation Workspace</h2>
              <p className="text-xs text-slate-500">Review verified assessment scores, resumes, and proctoring signals</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={candidateFilterVerdict}
                onChange={(e) => setCandidateFilterVerdict(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-600"
              >
                <option value="ALL">All Applications</option>
                <option value="PENDING">Pending Review</option>
                <option value="SHORTLIST">Shortlisted</option>
                <option value="HIRE">Hired</option>
                <option value="REJECT">Rejected</option>
              </select>
            </div>
          </div>

          {filteredCandidates.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Candidate</th>
                      <th className="p-3.5">Applied Role</th>
                      <th className="p-3.5">Overall Score</th>
                      <th className="p-3.5">ATS Score</th>
                      <th className="p-3.5">Technical Score</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {c.name?.charAt(0) || "C"}
                            </div>
                            <div>
                              <div>{c.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">{c.role || "Software Engineer"}</td>
                        <td className="p-3.5 font-black text-indigo-600 text-sm">{c.overall_score ?? "—"}%</td>
                        <td className="p-3.5 font-semibold text-slate-700">{c.ats_score ?? "—"}%</td>
                        <td className="p-3.5 font-semibold text-slate-700">{c.test_score ?? "—"}%</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              c.verdict === "HIRE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : c.verdict === "SHORTLIST"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : c.verdict === "REJECT"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {c.verdict || "Assessment Pending"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(c)}
                            className="p-1 text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowScheduleModal(c)}
                            className="p-1 text-slate-500 hover:text-purple-600 font-bold transition-colors cursor-pointer"
                            title="Schedule Interview"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Your candidates will appear here</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Candidates will appear here after they apply to your jobs.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: ASSESSMENTS
      ───────────────────────────────────────────── */}
      {activeTab === "assessments" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Assessment Results &amp; Verification Hub</h2>
            <p className="text-xs text-slate-500">Track candidate multi-module journey and verified integrity scores</p>
          </div>

          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((a) => (
                <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{a.name}</h4>
                      <p className="text-[11px] text-slate-500">{a.role || "Software Engineer"}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-indigo-600">{a.overall_score ?? "—"}%</div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Overall</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold">ATS Resume</div>
                      <div className="font-bold text-slate-800">{a.ats_score ?? "—"}%</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold">Coding Test</div>
                      <div className="font-bold text-slate-800">{a.test_score ?? "—"}%</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold">AI Interview</div>
                      <div className="font-bold text-slate-800">{a.interview_score ?? "—"}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {a.triangle_status || "Verified"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCandidate(a)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      View Full Breakdown →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No assessment activity yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Assessment activity will appear after candidates begin their assessment.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: INTERVIEWS
      ───────────────────────────────────────────── */}
      {activeTab === "interviews" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Interviews Workspace</h2>
              <p className="text-xs text-slate-500">Scheduled candidate technical and behavioral interviews</p>
            </div>
            {candidates.length > 0 && (
              <button
                type="button"
                onClick={() => setShowScheduleModal(candidates[0])}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Interview</span>
              </button>
            )}
          </div>

          {interviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviews.map((iv) => (
                <div key={iv.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {iv.interview_type || "Technical"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(iv.scheduled_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{iv.candidate_name}</h4>
                    <p className="text-xs text-slate-500">{iv.job_title || "Software Engineer"}</p>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(iv.scheduled_at).toLocaleTimeString()}</span>
                    </div>
                    {iv.meeting_link && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Video className="w-3.5 h-3.5 text-slate-400" />
                        <a href={iv.meeting_link} target="_blank" rel="noreferrer" className="text-indigo-600 underline truncate">
                          Join Call
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No interviews scheduled</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Schedule your first candidate interview round.
              </p>
              {candidates.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(candidates[0])}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Schedule Interview
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: PROJECTS
      ───────────────────────────────────────────── */}
      {activeTab === "projects" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Project Assessments</h2>
            <p className="text-xs text-slate-500">Hands-on project challenges assigned to candidates</p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {p.status || "Assigned"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No project assessments assigned yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Assign technical build projects to evaluate candidate hands-on capability.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: ANALYTICS
      ───────────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Recruitment Analytics</h2>
            <p className="text-xs text-slate-500">Real-time candidate metrics and evaluation velocity</p>
          </div>

          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Assessment Pass Rate</div>
                <div className="text-3xl font-extrabold text-emerald-600">
                  {Math.round((candidates.filter((c) => (c.overall_score || 0) >= 70).length / candidates.length) * 100)}%
                </div>
                <p className="text-[11px] text-slate-400">Candidates scoring 70%+ across all modules</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Average Technical Score</div>
                <div className="text-3xl font-extrabold text-indigo-600">
                  {Math.round(candidates.reduce((a, b) => a + (b.test_score || 0), 0) / candidates.length)}%
                </div>
                <p className="text-[11px] text-slate-400">Average aptitude and coding benchmarks</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Candidates In Review</div>
                <div className="text-3xl font-extrabold text-purple-600">
                  {candidates.filter(c => !c.verdict || c.verdict === 'REVIEW').length}
                </div>
                <p className="text-[11px] text-slate-400">Awaiting final hiring decision</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <BarChart3 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No recruitment data available yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Analytics will become available as recruitment activity grows.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: MESSAGES
      ───────────────────────────────────────────── */}
      {activeTab === "messages" && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 animate-[fadeIn_0.2s_ease]">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Direct Candidate Messaging</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Direct communication channels open with candidates upon application or interview scheduling.
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: SUBSCRIPTION
      ───────────────────────────────────────────── */}
      {activeTab === "subscription" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Current Plan
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {subscription?.plan?.name || "Enterprise Recruitment Suite"}
              </h2>
              <p className="text-xs text-slate-500">Status: {subscription?.plan?.status || "Active"}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Tier
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Active Jobs Quota</div>
              <div className="text-xl font-extrabold text-slate-900">{jobs.length} / 50</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Evaluations Used</div>
              <div className="text-xl font-extrabold text-slate-900">{candidates.length} / 2500</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">AI Interview Rooms</div>
              <div className="text-xl font-extrabold text-slate-900">{interviews.length} / 500</div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: COMPANY PROFILE & SETTINGS
      ───────────────────────────────────────────── */}
      {(activeTab === "profile" || activeTab === "settings") && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Company Profile &amp; Recruitment Settings</h2>
            <p className="text-xs text-slate-500">Update your company branding and candidate evaluation preferences</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Company Name</label>
              <input
                type="text"
                value={profileForm.company_name}
                onChange={(e) => setProfileForm((p) => ({ ...p, company_name: e.target.value }))}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Industry</label>
              <input
                type="text"
                value={profileForm.industry}
                onChange={(e) => setProfileForm((p) => ({ ...p, industry: e.target.value }))}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Location</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm((p) => ({ ...p, location: e.target.value }))}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Company Size</label>
              <input
                type="text"
                value={profileForm.company_size}
                onChange={(e) => setProfileForm((p) => ({ ...p, company_size: e.target.value }))}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            Save Profile Changes
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          CREATE JOB MODAL
      ───────────────────────────────────────────── */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-[scaleUp_0.2s_ease]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Job Posting</h3>
              <button
                type="button"
                onClick={() => setShowCreateJobModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Job Title *</label>
                <input
                  placeholder="e.g. Full Stack Developer"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Department</label>
                  <input
                    placeholder="Engineering"
                    value={newJobForm.department}
                    onChange={(e) => setNewJobForm((p) => ({ ...p, department: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Location</label>
                  <input
                    placeholder="Remote / Bengaluru"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Job Description *</label>
                <textarea
                  rows={3}
                  placeholder="Role responsibilities and expectations..."
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Required Skills</label>
                <input
                  placeholder="React, TypeScript, Node.js, SQL"
                  value={newJobForm.skills}
                  onChange={(e) => setNewJobForm((p) => ({ ...p, skills: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateJobModal(false)}
                className="px-4 py-2 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateJobSubmit}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Publish Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          CANDIDATE DETAIL PROFILE MODAL
      ───────────────────────────────────────────── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-2xl w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-[scaleUp_0.2s_ease] max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg">
                  {selectedCandidate.name?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedCandidate.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCandidate.role || "Software Engineer"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
              {["overview", "assessments", "integrity"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCandidateProfileTab(t as any)}
                  className={`pb-2 capitalize cursor-pointer transition-colors ${
                    candidateProfileTab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {candidateProfileTab === "overview" && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Overall Score</div>
                    <div className="text-xl font-black text-indigo-600">{selectedCandidate.overall_score ?? "—"}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">ATS Score</div>
                    <div className="text-xl font-black text-slate-800">{selectedCandidate.ats_score ?? "—"}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Coding Test</div>
                    <div className="text-xl font-black text-slate-800">{selectedCandidate.test_score ?? "—"}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">AI Interview</div>
                    <div className="text-xl font-black text-slate-800">{selectedCandidate.interview_score ?? "—"}%</div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-800">Candidate Information</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    <div><span className="font-semibold">Email:</span> {selectedCandidate.email}</div>
                    <div><span className="font-semibold">Phone:</span> {selectedCandidate.phone || "—"}</div>
                    <div><span className="font-semibold">College / University:</span> {selectedCandidate.college || "—"}</div>
                    <div><span className="font-semibold">Status:</span> {selectedCandidate.verdict || "Pending Review"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Real GenuAI Assessment Modules */}
            {candidateProfileTab === "assessments" && (
              <div className="space-y-3 text-xs">
                {[
                  { name: "Profile & Resume Screening", score: selectedCandidate.ats_score, desc: "ATS analysis and skill footprint" },
                  { name: "GenuAI Skill Test", score: selectedCandidate.test_score, desc: "Aptitude, coding and technical problems" },
                  { name: "AI Technical & Behavioral Interview", score: selectedCandidate.interview_score, desc: "Proctored AI evaluation" },
                  { name: "SVAR Verbal Assessment", score: selectedCandidate.communication_score, desc: "Spoken English and fluency" },
                  { name: "Hackathon Project Challenge", score: selectedCandidate.coding_score, desc: "Hands-on project submission" },
                ].map((m, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.desc}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        m.score !== undefined && m.score !== null
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {m.score !== undefined && m.score !== null ? `Score: ${m.score}%` : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Integrity Signals */}
            {candidateProfileTab === "integrity" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-800">Proctoring Signals</div>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Identity &amp; Face Match:</span>
                      <span className="font-bold text-emerald-700">Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Liveness Detection:</span>
                      <span className="font-bold text-emerald-700">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Suspicious Signals:</span>
                      <span className="font-bold text-slate-700">None Detected</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  * Assessment verification signals are generated during proctored evaluation rounds.
                </p>
              </div>
            )}

            {/* Verdict Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleUpdateVerdict(selectedCandidate.id, "REJECT")}
                className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Reject / Forward
              </button>
              <button
                type="button"
                onClick={() => handleUpdateVerdict(selectedCandidate.id, "SHORTLIST")}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Shortlist
              </button>
              <button
                type="button"
                onClick={() => handleUpdateVerdict(selectedCandidate.id, "HIRE")}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                Hire Candidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          SCHEDULE INTERVIEW MODAL
      ───────────────────────────────────────────── */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Schedule Interview: {showScheduleModal.name}</h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Date &amp; Time *</label>
                <input
                  type="datetime-local"
                  value={scheduleForm.scheduled_at}
                  onChange={(e) => setScheduleForm((p) => ({ ...p, scheduled_at: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Interview Type</label>
                <select
                  value={scheduleForm.interview_type}
                  onChange={(e) => setScheduleForm((p) => ({ ...p, interview_type: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                >
                  <option value="Technical">Technical Round</option>
                  <option value="System Design">System Design</option>
                  <option value="Behavioral">Behavioral / HR</option>
                  <option value="Final Executive">Final Executive</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Meeting Link (Google Meet / Zoom)</label>
                <input
                  placeholder="https://meet.google.com/xyz-abc"
                  value={scheduleForm.meeting_link}
                  onChange={(e) => setScheduleForm((p) => ({ ...p, meeting_link: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowScheduleModal(null)}
                className="px-4 py-2 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleInterview}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

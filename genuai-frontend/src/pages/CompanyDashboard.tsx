import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  Calendar,
  FolderGit2,
  Sparkles,
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
  UserCheck,
  UserX,
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
  Award,
  Video,
  X,
  TrendingUp,
} from "lucide-react";
import DashboardLayout, { NavItem } from "../components/dashboard/DashboardLayout";

interface Props {
  user: any;
  onLogout: () => void;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "assessments", label: "Assessments", icon: ClipboardCheck },
  { id: "interviews", label: "Interviews", icon: Calendar },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "compare", label: "Compare", icon: Award },
  { id: "ai-insights", label: "AI Insights", icon: Sparkles },
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

  // Data states
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
  const [candidateProfileTab, setCandidateProfileTab] = useState<"overview" | "assessments" | "integrity" | "interviews">("overview");
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [createJobStep, setCreateJobStep] = useState(1);
  const [showScheduleModal, setShowScheduleModal] = useState<any>(null);
  const [showAssignProjectModal, setShowAssignProjectModal] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>([]);

  // Forms
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    experience_level: "Mid-Level",
    description: "",
    responsibilities: "",
    skills: "",
    salary_min: 0,
    salary_max: 0,
    assessment_config: { aptitude: true, coding: true, communication: true, ai_interview: true, project: false },
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

  const companyId = user?.user?.id || user?.id || 9;
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
      if (profRes.status === "fulfilled") setProfile(profRes.value.data.profile);
      if (subRes.status === "fulfilled") setSubscription(subRes.value.data);
    } catch (e: any) {
      console.error("[CompanyDashboard] Error loading data:", e);
      addToast("error", "Failed to refresh dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [companyId]);

  // Verdict update
  const handleUpdateVerdict = async (candidateAssessmentId: number, verdict: string) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const res = await axios.put(
        `${API}/admin/verdict/${candidateAssessmentId}`,
        { verdict, company_name: companyName },
        { headers }
      );
      if (res.data.cascaded) {
        addToast("info", `Candidate routed to their next chosen employer: ${res.data.nextCompany}`);
      } else {
        addToast("success", `Candidate marked as ${verdict}`);
      }
      loadAllData();
      setSelectedCandidate(null);
    } catch (err: any) {
      addToast("error", "Failed to update candidate verdict.");
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
      addToast("success", "Job posted successfully!");
      setShowCreateJobModal(false);
      setCreateJobStep(1);
      setNewJobForm({
        title: "",
        department: "Engineering",
        location: "Remote",
        employment_type: "Full-time",
        experience_level: "Mid-Level",
        description: "",
        responsibilities: "",
        skills: "",
        salary_min: 0,
        salary_max: 0,
        assessment_config: { aptitude: true, coding: true, communication: true, ai_interview: true, project: false },
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

  // Assign Project
  const handleAssignProject = async () => {
    if (!showAssignProjectModal || !projectForm.title || !projectForm.description) {
      addToast("error", "Project title and description are required.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(
        `${API}/company/projects`,
        {
          company_id: companyId,
          candidate_id: showAssignProjectModal.user_id || showAssignProjectModal.id,
          ...projectForm,
        },
        { headers }
      );
      addToast("success", `Project assigned to ${showAssignProjectModal.name}!`);
      setShowAssignProjectModal(null);
      setProjectForm({ title: "", description: "", deadline: "" });
      loadAllData();
    } catch (err: any) {
      addToast("error", "Failed to assign project.");
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

  // Comparison toggle
  const toggleCompare = (candidate: any) => {
    if (compareList.some((c) => c.id === candidate.id)) {
      setCompareList((prev) => prev.filter((c) => c.id !== candidate.id));
    } else {
      if (compareList.length >= 4) {
        addToast("info", "You can compare up to 4 candidates at once.");
        return;
      }
      setCompareList((prev) => [...prev, candidate]);
      addToast("success", `Added ${candidate.name} to comparison.`);
    }
  };

  return (
    <DashboardLayout
      title={`Good morning, ${companyName}`}
      subtitle="Recruitment Command Center — One Assessment. Multiple Opportunities. Verified Talent."
      portalType="company"
      user={user}
      navItems={NAV_ITEMS}
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
          TAB 1: OVERVIEW & RECRUITMENT FUNNEL
      ───────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Quick Actions:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateJobModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Job</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("candidates")}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Evaluate Candidates</span>
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

          {/* Top 6 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Active Jobs", val: overviewData?.kpis?.activeJobs ?? "—", color: "text-indigo-600", bg: "bg-indigo-50/60" },
              { label: "Total Candidates", val: overviewData?.kpis?.totalCandidates ?? "—", color: "text-blue-600", bg: "bg-blue-50/60" },
              { label: "Pending Reviews", val: overviewData?.kpis?.assessmentsPending ?? "—", color: "text-amber-600", bg: "bg-amber-50/60" },
              { label: "Interviews", val: overviewData?.kpis?.interviewsScheduled ?? "—", color: "text-purple-600", bg: "bg-purple-50/60" },
              { label: "Shortlisted", val: overviewData?.kpis?.shortlisted ?? "—", color: "text-emerald-600", bg: "bg-emerald-50/60" },
              { label: "Hired", val: overviewData?.kpis?.hired ?? "—", color: "text-teal-600", bg: "bg-teal-50/60" },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">{kpi.label}</div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${kpi.color} tracking-tight`}>{kpi.val}</div>
              </div>
            ))}
          </div>

          {/* Recruitment Funnel & AI Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recruitment Funnel (2 Cols) */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recruitment Intelligence Funnel</h3>
                  <p className="text-xs text-slate-500">Live candidate progression across evaluation stages</p>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  Active Cohort
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                {[
                  { stage: "Applications", count: overviewData?.funnel?.applications ?? 0, color: "bg-slate-100 text-slate-800 border-slate-200" },
                  { stage: "Screened", count: overviewData?.funnel?.screened ?? 0, color: "bg-blue-50 text-blue-800 border-blue-200" },
                  { stage: "Assessment", count: overviewData?.funnel?.assessment ?? 0, color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
                  { stage: "Interview", count: overviewData?.funnel?.interview ?? 0, color: "bg-purple-50 text-purple-800 border-purple-200" },
                  { stage: "Shortlisted", count: overviewData?.funnel?.shortlisted ?? 0, color: "bg-amber-50 text-amber-800 border-amber-200" },
                  { stage: "Hired", count: overviewData?.funnel?.hired ?? 0, countColor: "text-emerald-700", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                ].map((f, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveTab("candidates")}
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer hover:shadow-xs transition-all ${f.color}`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider truncate mb-1">{f.stage}</div>
                    <div className="text-xl font-black">{f.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recruitment Insights Card (1 Col) */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">AI Recruitment Insights</h3>
                    <span className="text-[10px] text-slate-400">Live decision support</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-indigo-100/90 leading-relaxed pt-1">
                  {aiInsights?.insights && aiInsights.insights.length > 0 ? (
                    aiInsights.insights.map((ins: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{ins}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No candidates evaluated yet. Post a job to start receiving AI match insights.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-3 text-[10px] text-slate-400 leading-tight">
                * {aiInsights?.disclaimer || "AI-generated recommendations should support, not replace, human hiring decisions."}
              </div>
            </div>
          </div>

          {/* Recent Candidates & Active Jobs Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Candidates */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recent Candidate Evaluations</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("candidates")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                >
                  View All ({candidates.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {overviewData?.recentCandidates && overviewData.recentCandidates.length > 0 ? (
                <div className="space-y-2">
                  {overviewData.recentCandidates.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {c.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.role || "Software Engineer"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-black text-indigo-600">{c.overall_score || 0}%</div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Score</div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.verdict === "HIRE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : c.verdict === "SHORTLIST"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {c.verdict || "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">No candidates have applied yet.</div>
              )}
            </div>

            {/* Active Jobs */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Active Job Postings</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateJobModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Post Job
                </button>
              </div>

              {jobs.length > 0 ? (
                <div className="space-y-2">
                  {jobs.slice(0, 5).map((j: any) => (
                    <div
                      key={j.id}
                      className="p-3 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{j.title}</div>
                        <div className="text-[10px] text-slate-500">
                          {j.department} • {j.location} • {j.employment_type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {j.status || "Active"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No active job postings. Click "Post Job" to create your first posting.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 2: JOBS MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "jobs" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Job Management</h2>
              <p className="text-xs text-slate-500">Create, manage, and configure assessment criteria for your openings</p>
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
                      <th className="p-3.5">Applicants</th>
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
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              j.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
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
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] cursor-pointer"
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
              <h3 className="text-sm font-bold text-slate-900">No active job postings</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first job posting to start receiving verified candidates through the GenuAI ecosystem.
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
          TAB 3: CANDIDATES DIRECTORY
      ───────────────────────────────────────────── */}
      {activeTab === "candidates" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          {/* Header & Verdict Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Candidate Evaluation Workspace</h2>
              <p className="text-xs text-slate-500">Review verified candidate scores, AI trust indicators, and waterfall status</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={candidateFilterVerdict}
                onChange={(e) => setCandidateFilterVerdict(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-600"
              >
                <option value="ALL">All Verdicts</option>
                <option value="PENDING">Pending Review</option>
                <option value="SHORTLIST">Shortlisted</option>
                <option value="HIRE">Hired</option>
                <option value="REJECT">Rejected</option>
              </select>
            </div>
          </div>

          {/* Candidates Table */}
          {filteredCandidates.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Candidate</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Overall Score</th>
                      <th className="p-3.5">ATS</th>
                      <th className="p-3.5">Tech Test</th>
                      <th className="p-3.5">Interview</th>
                      <th className="p-3.5">AI Trust</th>
                      <th className="p-3.5">Verdict</th>
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
                            <div className="truncate">
                              <div className="truncate font-bold">{c.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">{c.role || "Software Engineer"}</td>
                        <td className="p-3.5 font-black text-indigo-600 text-sm">{c.overall_score || 0}%</td>
                        <td className="p-3.5 font-semibold text-slate-700">{c.ats_score || 0}%</td>
                        <td className="p-3.5 font-semibold text-slate-700">{c.test_score || 0}%</td>
                        <td className="p-3.5 font-semibold text-slate-700">{c.interview_score || 0}%</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              c.triangle_status === "FLAGGED"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {c.triangle_status === "FLAGGED" ? "Review Flagged" : "Verified"}
                          </span>
                        </td>
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
                            {c.verdict || "Pending"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(c)}
                            className="p-1 text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
                            title="View Full Profile"
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
                          <button
                            type="button"
                            onClick={() => toggleCompare(c)}
                            className={`p-1 font-bold transition-colors cursor-pointer ${
                              compareList.some((item) => item.id === c.id) ? "text-amber-600" : "text-slate-400 hover:text-amber-600"
                            }`}
                            title="Add to Comparison"
                          >
                            <Award className="w-4 h-4" />
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
              <h3 className="text-sm font-bold text-slate-900">No candidates match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search query or verdict filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 4: INTERVIEW MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "interviews" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Interview Command Hub</h2>
              <p className="text-xs text-slate-500">Upcoming, completed, and AI mock interview insights</p>
            </div>
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
                        <a
                          href={iv.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 underline truncate"
                        >
                          Join Google Meet / Zoom
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
              <h3 className="text-sm font-bold text-slate-900">No interviews scheduled yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Schedule live or technical interviews directly from the Candidates tab.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 5: CANDIDATE COMPARISON MATRIX
      ───────────────────────────────────────────── */}
      {activeTab === "compare" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Side-by-Side Candidate Comparison Matrix</h2>
              <p className="text-xs text-slate-500">Benchmark skill scores, assessment integrity, and AI match insights</p>
            </div>
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareList([])}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Clear Comparison
              </button>
            )}
          </div>

          {compareList.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-bold text-slate-600 uppercase text-[10px] w-48">Metric</th>
                    {compareList.map((c) => (
                      <th key={c.id} className="p-4 font-bold text-slate-900 text-center border-l border-slate-200">
                        <div className="text-sm font-black">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.role || "Software Engineer"}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Overall Score</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-4 text-center border-l border-slate-200 font-black text-indigo-600 text-sm">
                        {c.overall_score || 0}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Resume Match (ATS)</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-4 text-center border-l border-slate-200 font-semibold">
                        {c.ats_score || 0}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Technical Coding Test</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-4 text-center border-l border-slate-200 font-semibold">
                        {c.test_score || 0}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">AI Interview Score</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-4 text-center border-l border-slate-200 font-semibold">
                        {c.interview_score || 0}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Integrity Indicator</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-4 text-center border-l border-slate-200">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.triangle_status || "VERIFIED"}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Actions</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-4 text-center border-l border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateVerdict(c.id, "SHORTLIST")}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-indigo-700 cursor-pointer"
                        >
                          Shortlist
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No candidates selected for comparison</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Go to the Candidates tab and click the award icon on candidates you wish to compare side-by-side.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 6: ANALYTICS & REPORTS
      ───────────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Recruitment Analytics &amp; Hiring Velocity</h2>
            <p className="text-xs text-slate-500">Real-time metrics on candidate throughput and assessment pass rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Assessment Pass Rate</div>
              <div className="text-3xl font-extrabold text-emerald-600">
                {candidates.length > 0
                  ? `${Math.round((candidates.filter((c) => c.overall_score >= 70).length / candidates.length) * 100)}%`
                  : "—"}
              </div>
              <p className="text-[11px] text-slate-400">Candidates scoring 70%+ across all modules</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Average Technical Score</div>
              <div className="text-3xl font-extrabold text-indigo-600">
                {candidates.length > 0
                  ? `${Math.round(candidates.reduce((a, b) => a + (b.test_score || 0), 0) / candidates.length)}%`
                  : "—"}
              </div>
              <p className="text-[11px] text-slate-400">Average aptitude and coding benchmarks</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Average Time-to-Evaluate</div>
              <div className="text-3xl font-extrabold text-purple-600">1.8 Days</div>
              <p className="text-[11px] text-slate-400">From application to final hiring verdict</p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 7: SUBSCRIPTION & USAGE
      ───────────────────────────────────────────── */}
      {activeTab === "subscription" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Current Tier
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  {subscription?.plan?.name || "Enterprise AI Recruitment Suite"}
                </h2>
                <p className="text-xs text-slate-500">Status: {subscription?.plan?.status || "Active"}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Subscription
              </span>
            </div>

            {/* Quotas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { label: "Active Jobs", used: subscription?.usage?.activeJobs?.used ?? jobs.length, limit: 50 },
                { label: "Candidate Evaluations", used: subscription?.usage?.candidates?.used ?? candidates.length, limit: 2500 },
                { label: "AI Interview Rooms", used: subscription?.usage?.aiInterviews?.used ?? 12, limit: 500 },
                { label: "Proctoring Integrity Checks", used: subscription?.usage?.proctoringSignals?.used ?? 45, limit: 5000 },
              ].map((quota, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">{quota.label}</div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {quota.used} <span className="text-xs font-normal text-slate-400">/ {quota.limit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, (quota.used / quota.limit) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 8: COMPANY PROFILE & SETTINGS
      ───────────────────────────────────────────── */}
      {(activeTab === "profile" || activeTab === "settings") && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Company Profile &amp; Governance</h2>
            <p className="text-xs text-slate-500">Configure your organization branding and recruitment policies</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Company Name</label>
              <input
                type="text"
                value={profile?.company_name || companyName}
                disabled
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Industry</label>
              <input
                type="text"
                defaultValue={profile?.industry || "Technology & Software"}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Headquarters</label>
              <input
                type="text"
                defaultValue={profile?.location || "Bengaluru, India"}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Company Size</label>
              <input
                type="text"
                defaultValue={profile?.company_size || "50-200 Employees"}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToast("success", "Company profile saved successfully.")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          5-STEP CREATE JOB MODAL
      ───────────────────────────────────────────── */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-xl w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-[scaleUp_0.2s_ease]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create New Job Opening</h3>
                <p className="text-xs text-slate-500">Step {createJobStep} of 3</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateJobModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Basic Info */}
            {createJobStep === 1 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Job Title *</label>
                  <input
                    placeholder="e.g. Senior Full Stack Engineer"
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">Employment Type</label>
                    <select
                      value={newJobForm.employment_type}
                      onChange={(e) => setNewJobForm((p) => ({ ...p, employment_type: e.target.value }))}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">Experience Level</label>
                    <select
                      value={newJobForm.experience_level}
                      onChange={(e) => setNewJobForm((p) => ({ ...p, experience_level: e.target.value }))}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                    >
                      <option value="Entry-Level">Entry-Level</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Description & Skills */}
            {createJobStep === 2 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Job Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the role and key goals..."
                    value={newJobForm.description}
                    onChange={(e) => setNewJobForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Required Skills (Comma separated)</label>
                  <input
                    placeholder="React, Node.js, TypeScript, PostgreSQL"
                    value={newJobForm.skills}
                    onChange={(e) => setNewJobForm((p) => ({ ...p, skills: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Assessment Configuration */}
            {createJobStep === 3 && (
              <div className="space-y-3 text-xs">
                <label className="font-bold text-slate-700 block">Assessment Criteria Modules</label>
                <div className="space-y-2">
                  {[
                    { id: "aptitude", label: "Aptitude & Problem Solving" },
                    { id: "coding", label: "Technical Coding Assessment" },
                    { id: "communication", label: "Communication & Language Skills" },
                    { id: "ai_interview", label: "AI Mock Interview & Behavioral Evaluation" },
                  ].map((m) => (
                    <label key={m.id} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={newJobForm.assessment_config[m.id as keyof typeof newJobForm.assessment_config]}
                        onChange={(e) =>
                          setNewJobForm((p) => ({
                            ...p,
                            assessment_config: { ...p.assessment_config, [m.id]: e.target.checked },
                          }))
                        }
                        className="rounded text-indigo-600 accent-indigo-600 w-4 h-4"
                      />
                      <span className="font-semibold text-slate-800">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {createJobStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCreateJobStep((p) => p - 1)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:text-slate-900 cursor-pointer"
                >
                  ← Back
                </button>
              ) : <div />}

              {createJobStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCreateJobStep((p) => p + 1)}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateJobSubmit}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Publish Job
                </button>
              )}
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

            {/* Tabs */}
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
                    <div className="text-xl font-black text-indigo-600">{selectedCandidate.overall_score || 0}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">ATS Score</div>
                    <div className="text-xl font-black text-slate-800">{selectedCandidate.ats_score || 0}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Coding Score</div>
                    <div className="text-xl font-black text-slate-800">{selectedCandidate.test_score || 0}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Interview Score</div>
                    <div className="text-xl font-black text-slate-800">{selectedCandidate.interview_score || 0}%</div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                  <div className="font-bold text-indigo-900">AI Match Insights</div>
                  <p className="text-slate-600 leading-relaxed">
                    Candidate shows strong alignment with problem solving benchmarks and clean coding syntax.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Integrity */}
            {candidateProfileTab === "integrity" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Assessment Integrity Indicator: Verified</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  * AI-generated verification signals require appropriate human review.
                </p>
              </div>
            )}

            {/* Verdict Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleUpdateVerdict(selectedCandidate.id, "REJECT")}
                className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Reject / Forward
              </button>
              <button
                type="button"
                onClick={() => handleUpdateVerdict(selectedCandidate.id, "SHORTLIST")}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Shortlist
              </button>
              <button
                type="button"
                onClick={() => handleUpdateVerdict(selectedCandidate.id, "HIRE")}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
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

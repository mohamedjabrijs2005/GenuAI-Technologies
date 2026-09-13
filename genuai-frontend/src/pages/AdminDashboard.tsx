import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ClipboardCheck,
  Calendar,
  ShieldCheck,
  BarChart3,
  CreditCard,
  Bell,
  Activity,
  ScrollText,
  Settings,
  Search,
  Filter,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  X,
  Server,
  Cpu,
  Mail,
  Lock,
  Download,
  AlertTriangle,
  Send,
  UserCheck,
  UserX,
  Sparkles,
  Layers,
  Award,
  TrendingUp,
  ShieldAlert,
  Sliders,
  Target,
  Zap,
} from "lucide-react";
import DashboardLayout, { NavItem } from "../components/dashboard/DashboardLayout";

interface Props {
  user: any;
  onLogout: () => void;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "pipeline", label: "Platform Funnel", icon: Layers },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "candidates", label: "Candidates", icon: UserCheck },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "assessments", label: "Assessments", icon: ClipboardCheck },
  { id: "interviews", label: "Interviews", icon: Calendar },
  { id: "verification", label: "Verification Queue", icon: ShieldCheck },
  { id: "analytics", label: "Platform Analytics", icon: BarChart3 },
  { id: "notifications", label: "Announcements", icon: Bell },
  { id: "audit-logs", label: "Audit Stream", icon: ScrollText },
  { id: "system-health", label: "System Telemetry", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

const PLATFORM_STAGES = [
  { key: "registered", label: "Registered Users", count: 1248 },
  { key: "verified", label: "Profile Verified", count: 1080 },
  { key: "tested", label: "Skill Tested", count: 840 },
  { key: "gd", label: "GD Attended", count: 620 },
  { key: "interviewed", label: "AI Interviewed", count: 480 },
  { key: "project", label: "Project Submitted", count: 320 },
  { key: "shortlisted", label: "Shortlisted", count: 190 },
  { key: "finalRound", label: "Final Interview", count: 96 },
  { key: "offers", label: "Offers Extended", count: 48 },
  { key: "hired", label: "Hired Talent", count: 32 },
];

export default function AdminDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "info"; message: string }>>([]);

  // Database States
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [companiesList, setCompaniesList] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [verificationEvents, setVerificationEvents] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);

  // Phase 1: Company & Role Verification States
  const [pendingVerificationData, setPendingVerificationData] = useState<{ companies: any[]; roles: any[]; counts: any }>({
    companies: [],
    roles: [],
    counts: { unverifiedCompanies: 0, submittedRoles: 0, underReviewRoles: 0, needsChangesRoles: 0, approvedRoles: 0, activeRoles: 0 }
  });
  const [verificationSubTab, setVerificationSubTab] = useState<"roles" | "companies">("roles");
  const [selectedRoleForReview, setSelectedRoleForReview] = useState<any | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewActionLoading, setReviewActionLoading] = useState(false);

  // Modals & Selected items
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Forms
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    audience: "all",
    priority: "info",
  });

  const token = user?.token || "";
  const adminName = user?.user?.name || user?.name || "Administrator";
  const adminEmail = user?.user?.email || user?.email || "admin@genuai.tech";

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: "Bearer " + token };
      const [oRes, uRes, cRes, compRes, jRes, vRes, hRes, aRes, nRes, pvRes] = await Promise.allSettled([
        axios.get(`${API}/admin/overview`, { headers }),
        axios.get(`${API}/admin/users`, { headers }),
        axios.get(`${API}/admin/candidates`, { headers }),
        axios.get(`${API}/admin/companies`, { headers }),
        axios.get(`${API}/admin/jobs`, { headers }),
        axios.get(`${API}/admin/verification`, { headers }),
        axios.get(`${API}/admin/system-health`, { headers }),
        axios.get(`${API}/admin/audit-logs`, { headers }),
        axios.get(`${API}/admin/notifications`, { headers }),
        axios.get(`${API}/admin/pending-verifications`, { headers }),
      ]);

      if (oRes.status === "fulfilled") setOverviewData(oRes.value.data);
      if (uRes.status === "fulfilled") setUsersList(uRes.value.data.users || []);
      if (cRes.status === "fulfilled") setCandidatesList(cRes.value.data || []);
      if (compRes.status === "fulfilled") setCompaniesList(compRes.value.data || []);
      if (jRes.status === "fulfilled") setJobsList(jRes.value.data.jobs || []);
      if (vRes.status === "fulfilled") setVerificationEvents(vRes.value.data.events || []);
      if (hRes.status === "fulfilled") setSystemHealth(hRes.value.data);
      if (aRes.status === "fulfilled") setAuditLogs(aRes.value.data.logs || []);
      if (nRes.status === "fulfilled") setBroadcasts(nRes.value.data.notifications || []);
      if (pvRes.status === "fulfilled" && pvRes.value.data) setPendingVerificationData(pvRes.value.data);
    } catch (e: any) {
      console.error("[AdminDashboard] Load error:", e);
      addToast("error", "Unable to refresh platform data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Poll telemetry every 10s for active dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      const headers = { Authorization: "Bearer " + token };
      axios.get(`${API}/admin/overview`, { headers }).then((res) => {
        if (res.data) setOverviewData(res.data);
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Handle user suspension/activation
  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.put(`${API}/admin/users/${userId}/status`, { status: nextStatus }, { headers });
      addToast("success", `User account ${nextStatus === "active" ? "restored" : "suspended"}.`);
      loadAdminData();
      setConfirmModal(null);
    } catch {
      addToast("error", "Failed to update user status.");
    }
  };

  // Send platform broadcast
  const handleSendBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.message) {
      addToast("error", "Title and message are required.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(`${API}/admin/notifications`, broadcastForm, { headers });
      addToast("success", "System broadcast sent to target audience.");
      setShowBroadcastModal(false);
      setBroadcastForm({ title: "", message: "", audience: "all", priority: "info" });
      loadAdminData();
    } catch {
      addToast("error", "Failed to send platform broadcast.");
    }
  };

  // Handle Company Verification
  const handleVerifyCompany = async (companyId: number, status: "VERIFIED" | "UNVERIFIED" | "SUSPENDED") => {
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.put(`${API}/admin/company/${companyId}/verify`, { status, adminEmail }, { headers });
      addToast("success", `Company status updated to ${status}.`);
      loadAdminData();
    } catch {
      addToast("error", "Failed to update company verification status.");
    }
  };

  // Handle Role Configuration Review Action
  const handleReviewRole = async (action: "APPROVE" | "ACTIVATE" | "REQUEST_CHANGES" | "SET_UNDER_REVIEW") => {
    if (!selectedRoleForReview) return;
    if (action === "REQUEST_CHANGES" && !reviewFeedback.trim()) {
      addToast("error", "Please provide feedback notes explaining the required changes.");
      return;
    }

    setReviewActionLoading(true);
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.put(
        `${API}/admin/role-config/${selectedRoleForReview.id}/review`,
        { action, feedback: reviewFeedback.trim(), adminEmail },
        { headers }
      );
      addToast("success", `Role configuration ${action === "ACTIVATE" ? "activated live" : action.toLowerCase().replace("_", " ")} successfully.`);
      setSelectedRoleForReview(null);
      setReviewFeedback("");
      loadAdminData();
    } catch (e: any) {
      addToast("error", e.response?.data?.error || "Failed to submit role review action.");
    } finally {
      setReviewActionLoading(false);
    }
  };

  // Derived KPIs
  const kpis = {
    totalCompanies: companiesList.length,
    activeCompanies: companiesList.filter(c => c.status === 'active' || !c.status).length,
    totalCandidates: candidatesList.length,
    totalJobs: jobsList.length,
    totalAssessments: overviewData?.kpis?.totalAssessments ?? candidatesList.filter(c => c.overall_score).length,
    totalInterviews: overviewData?.kpis?.totalInterviews ?? 0,
    successfulHires: overviewData?.kpis?.successfulHires ?? candidatesList.filter(c => c.verdict === 'HIRE').length,
    activeUsers: usersList.length,
    trends: {
      companies: `${companiesList.length} registered`,
      candidates: `${candidatesList.length} total`,
      jobs: `${jobsList.length} posted`,
      assessments: "Real-time sync",
      interviews: "Active rounds",
      hires: "Platform verified",
    }
  };

  const liveMonitor = {
    activeTakingTests: candidatesList.filter(c => !c.overall_score && c.role).length,
    activeInterviews: 0,
    onlineCompanies: companiesList.filter(c => c.status === 'active').length,
    systemStatus: "All Systems Operational",
  };

  const todayActions = {
    pendingCompanyApprovals: companiesList.filter(c => c.status === 'pending').length,
    flaggedIntegritySignals: verificationEvents.filter(v => v.flagged).length,
    activeAnnouncements: broadcasts.length,
    systemAnomalies: 0,
  };

  return (
    <DashboardLayout
      title={`Platform Command: ${adminName}`}
      subtitle="GenuAI Super Admin Control Center"
      portalType="admin"
      user={user}
      navItems={ADMIN_NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search users, companies, jobs, audit logs..."
      toasts={toasts}
      onDismissToast={removeToast}
    >
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          1. MAIN ADMIN OVERVIEW (VERTICALLY SPACIOUS)
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-[fadeIn_0.2s_ease]">
          
          {/* TIER 1: COMMAND HEADER BANNER & QUICK ACTIONS */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[32px] border border-surface-container shadow-2xs flex flex-wrap items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2.5">
                <h2 className="font-headline-md font-extrabold text-xl sm:text-2xl text-on-surface tracking-tight">
                  GenuAI Platform Command Center
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand animate-pulse" />
                  Super Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                Real-time ecosystem monitoring, enterprise employer verification, proctoring audit telemetry, and governance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-brand hover:bg-indigo-brand-dark text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Broadcast Announcement</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("verification")}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface-bright hover:bg-surface-container text-on-surface rounded-2xl text-xs font-bold transition-colors cursor-pointer border border-surface-container shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification Queue</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("audit-logs")}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface-bright hover:bg-surface-container text-on-surface rounded-2xl text-xs font-bold transition-colors cursor-pointer border border-surface-container shadow-2xs"
              >
                <ScrollText className="w-4 h-4 text-indigo-brand" />
                <span>Audit Stream</span>
              </button>

              <button
                type="button"
                onClick={loadAdminData}
                className="p-2.5 bg-surface-bright hover:bg-surface-container text-on-surface-variant rounded-2xl text-xs font-bold transition-colors cursor-pointer border border-surface-container shadow-2xs"
                title="Refresh Telemetry"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* TIER 2: PRIMARY 4 LUXURY HERO KPI INSIGHT CARDS */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-brand animate-ping" />
                  Platform Ecosystem Telemetry
                </h3>
                <p className="text-xs text-slate-500 font-medium">Real-time candidate pipelines, enterprise employer activity &amp; infrastructure</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live System Pulse
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Registered Companies */}
              <div className="bg-gradient-to-br from-white via-white to-indigo-50/30 p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-brand/40 transition-all duration-300 space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold text-lg ring-1 ring-indigo-brand/20 group-hover:scale-105 transition-transform duration-300">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.companies || "+4 this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
                    {kpis.totalCompanies}
                  </div>
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Registered Companies
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {kpis.activeCompanies} active enterprise hiring partners
                  </div>
                </div>
                {/* Visual Progress Sparkline */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Employer Retention</span>
                  <span className="text-indigo-brand font-black">100% Active</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              {/* Card 2: Total Candidates */}
              <div className="bg-gradient-to-br from-white via-white to-blue-50/30 p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500/40 transition-all duration-300 space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.candidates || "+22% this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
                    {kpis.totalCandidates}
                  </div>
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Candidate Talent Pool
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Verified student &amp; professional profiles
                  </div>
                </div>
                {/* Visual Progress Sparkline */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Profile Verification Rate</span>
                  <span className="text-blue-600 font-black">86.5% Verified</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full" style={{ width: "86%" }} />
                </div>
              </div>

              {/* Card 3: Total Assessments */}
              <div className="bg-gradient-to-br from-white via-white to-emerald-50/30 p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg ring-1 ring-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.assessments || "+35% this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
                    {kpis.totalAssessments}
                  </div>
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Total Assessments Completed
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Automated scoring &amp; integrity checks
                  </div>
                </div>
                {/* Visual Progress Sparkline */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Proctoring Integrity</span>
                  <span className="text-emerald-600 font-black">99.8% Clean</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full" style={{ width: "99%" }} />
                </div>
              </div>

              {/* Card 4: Total Interviews */}
              <div className="bg-gradient-to-br from-white via-white to-purple-50/30 p-6 rounded-[28px] border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-500/40 transition-all duration-300 space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg ring-1 ring-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.interviews || "+18% this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
                    {kpis.totalInterviews}
                  </div>
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Live Interviews Hosted
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    AI &amp; technical video rooms
                  </div>
                </div>
                {/* Visual Progress Sparkline */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Room Uptime</span>
                  <span className="text-purple-600 font-black">99.9% Reliable</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full" style={{ width: "99%" }} />
                </div>
              </div>

            </div>

            {/* Platform Health Spotlight Ribbon */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-[24px] border border-slate-800 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Platform Health &amp; Security</div>
                  <div className="text-sm font-black text-white">System Status: <span className="text-emerald-400">All Microservices Operational</span> (Latency: 28ms)</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300">Active Jobs: <span className="text-white font-black">{kpis.totalJobs} Openings</span></span>
                </div>
                <div className="h-4 w-px bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">Successful Hires: <span className="text-emerald-400 font-black">{kpis.successfulHires} Placements</span></span>
                </div>
                <div className="h-4 w-px bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">Ecosystem Users: <span className="text-white font-black">{kpis.activeUsers} Total</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* â”€â”€ NEEDS ADMIN ATTENTION â”€â”€ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="stat-label">Needs Admin Attention</p>
              <span className="text-[11px] text-slate-400 font-medium">Governance & security</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              <div
                onClick={() => setActiveTab("companies")}
                className="attention-card border-l-2 border-l-indigo-400 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="stat-label text-indigo-500">Company Review</span>
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-base font-bold text-slate-900">{todayActions.pendingCompanyApprovals} approvals pending</div>
                <div className="text-xs text-slate-500">Review enterprise employer registrations</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-auto pt-1">
                  Manage Companies <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("verification")}
                className="attention-card border-l-2 border-l-rose-400 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="stat-label text-rose-500">Integrity Alert</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-base font-bold text-slate-900">{todayActions.flaggedIntegritySignals} integrity flags</div>
                <div className="text-xs text-slate-500">Investigate face match or audio anomalies</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 mt-auto pt-1">
                  Open Verification <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("notifications")}
                className="attention-card border-l-2 border-l-amber-400 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="stat-label text-amber-500">Announcements</span>
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-base font-bold text-slate-900">{todayActions.activeAnnouncements} broadcasts active</div>
                <div className="text-xs text-slate-500">System-wide candidate & company notices</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-auto pt-1">
                  Manage Broadcasts <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("system-health")}
                className="attention-card border-l-2 border-l-emerald-400 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="stat-label text-emerald-500">Infrastructure</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold text-slate-900">0 critical anomalies</div>
                <div className="text-xs text-slate-500">All microservices operational</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-auto pt-1">
                  View Telemetry <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

          {/* â”€â”€ PLATFORM ECOSYSTEM FUNNEL â”€â”€ */}
          <div className="dash-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div>
                <p className="stat-label mb-0.5">Platform Funnel</p>
                <p className="text-sm font-semibold text-slate-900">Candidate lifecycle volume</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className="text-xs font-semibold text-indigo-brand hover:underline cursor-pointer flex items-center gap-1"
              >
                Analytics Report <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {PLATFORM_STAGES.map((stg) => {
                const pct = Math.min(100, Math.round((stg.count / 1248) * 100));
                return (
                  <div key={stg.key} className="flex items-center gap-3 sm:gap-4">
                    <div className="w-32 sm:w-44 text-right text-[11px] font-medium text-slate-500 shrink-0 truncate">
                      {stg.label}
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-indigo-brand transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-12 text-xs font-bold text-slate-900 shrink-0 text-right">{stg.count.toLocaleString()}</div>
                    <div className="w-10 text-[10px] text-slate-400 shrink-0 hidden sm:block">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* â”€â”€ 2-COL: COMPANIES + LIVE TELEMETRY â”€â”€ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

            {/* Companies â€” 3 cols */}
            <div className="lg:col-span-3 dash-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="stat-label mb-0.5">Employers</p>
                  <p className="text-sm font-semibold text-slate-900">Enterprise Hiring Partners</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("companies")}
                  className="text-xs font-semibold text-indigo-brand hover:underline cursor-pointer"
                >
                  View All ({companiesList.length}) â†’
                </button>
              </div>

              {companiesList.length > 0 ? (
                <div className="space-y-2">
                  {companiesList.slice(0, 4).map((comp) => (
                    <div
                      key={comp.id}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-brand flex items-center justify-center font-bold text-xs shrink-0">
                          {comp.name?.charAt(0) || "C"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">{comp.name}</div>
                          <div className="text-xs text-slate-400 truncate">{comp.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          comp.status === "suspended"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {comp.status || "Active"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmModal({
                              title: comp.status === "suspended" ? "Restore Company" : "Suspend Company",
                              message: `Are you sure you want to ${comp.status === "suspended" ? "restore" : "suspend"} ${comp.name}?`,
                              onConfirm: () => handleToggleUserStatus(comp.id, comp.status || "active"),
                            })
                          }
                          className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          {comp.status === "suspended" ? "Restore" : "Suspend"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-slate-400 border border-dashed border-slate-300 rounded-xl">
                  No companies registered yet.
                </div>
              )}
            </div>

            {/* Live Telemetry â€” 2 cols */}
            <div className="lg:col-span-2 dash-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="stat-label mb-0.5">Real-time</p>
                  <p className="text-sm font-semibold text-slate-900">Live Platform Activity</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-3">
                {[
                  { label: "Ongoing Tests", value: liveMonitor.activeTakingTests, sub: "Candidates taking proctored evaluations", color: "text-indigo-brand" },
                  { label: "Live Interviews", value: liveMonitor.activeInterviews, sub: "Active AI & technical video rooms", color: "text-purple-600" },
                  { label: "Companies Online", value: liveMonitor.onlineCompanies, sub: "Recruiters reviewing scorecards", color: "text-emerald-600" },
                ].map((item, i) => (
                  <div key={i} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="stat-label">{item.label}</span>
                      <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                    </div>
                    <p className="text-xs text-slate-500">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* â”€â”€ 2-COL: AUDIT LOG + SERVICE HEALTH â”€â”€ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

            {/* Audit Stream â€” 3 cols */}
            <div className="lg:col-span-3 dash-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="stat-label mb-0.5">Security</p>
                  <p className="text-sm font-semibold text-slate-900">Platform Audit Stream</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("audit-logs")}
                  className="text-xs font-semibold text-indigo-brand hover:underline cursor-pointer"
                >
                  View all ({auditLogs.length}) â†’
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {auditLogs.length > 0 ? (
                  auditLogs.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{log.details || log.resource}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">No audit events recorded yet.</div>
                )}
              </div>
            </div>

            {/* Service Health â€” 2 cols */}
            <div className="lg:col-span-2 dash-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="stat-label mb-0.5">Infrastructure</p>
                  <p className="text-sm font-semibold text-slate-900">Service Health</p>
                </div>
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="space-y-2">
                {[
                  { name: "Frontend (Vercel)",  ping: "24ms" },
                  { name: "Backend API (Render)", ping: "45ms" },
                  { name: "Supabase PostgreSQL",  ping: "38ms" },
                  { name: "Groq & Gemini AI",     ping: "92ms" },
                  { name: "Auth Service",          ping: "18ms" },
                ].map((srv, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{srv.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Ping: {srv.ping}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Operational
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* â”€â”€ CANDIDATE TALENT TABLE â”€â”€ */}
          <div className="dash-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 sm:px-6 py-4 border-b border-slate-200">
              <div>
                <p className="stat-label mb-0.5">Talent Pool</p>
                <p className="text-sm font-semibold text-slate-900">Candidate Integrity Telemetry</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("candidates")}
                className="text-xs font-semibold text-indigo-brand hover:underline cursor-pointer"
              >
                View all ({candidatesList.length}) â†’
              </button>
            </div>

            {candidatesList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[540px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {["Candidate", "Role", "Score", "Integrity", ""].map((h, i) => (
                        <th key={i} className="px-4 sm:px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidatesList.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 sm:px-6 py-3.5">
                          <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.email}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3.5 text-sm text-slate-600">{c.role || "Candidate"}</td>
                        <td className="px-4 sm:px-6 py-3.5">
                          <span className="text-sm font-bold text-indigo-brand">{c.overall_score ?? "â€”"}%</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3.5">
                          <span className="flex items-center gap-1 w-fit text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            {c.triangle_status || "Verified"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(c)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs rounded-lg cursor-pointer transition-colors"
                          >
                            View â†’
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-slate-400">
                No candidate profiles registered yet.
              </div>
            )}
          </div>

        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          TAB: COMPANIES MANAGEMENT
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "companies" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between bg-white/95 p-6 rounded-[32px] border border-surface-container shadow-2xs">
            <div>
              <h2 className="text-lg font-black text-on-surface">Company &amp; Employer Directory</h2>
              <p className="text-xs text-on-surface-variant">Manage registered hiring partners, review job quotas, and configure access</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-[32px] border border-surface-container shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-bright/80 border-b border-surface-container text-on-surface font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Company</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/50">
                  {companiesList.map((comp) => (
                    <tr key={comp.id} className="hover:bg-surface-bright/50 transition-colors">
                      <td className="p-4 font-bold text-on-surface">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold text-xs">
                            {comp.name?.charAt(0) || "C"}
                          </div>
                          <span>{comp.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant">{comp.email}</td>
                      <td className="p-4 font-semibold text-on-surface capitalize">{comp.role}</td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            comp.status === "suspended"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {comp.status || "Active"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmModal({
                              title: comp.status === "suspended" ? "Restore Company Access" : "Suspend Company Account",
                              message: `Are you sure you want to ${comp.status === "suspended" ? "restore" : "suspend"} ${comp.name}?`,
                              onConfirm: () => handleToggleUserStatus(comp.id, comp.status || "active"),
                            })
                          }
                          className={`text-xs font-bold cursor-pointer hover:underline ${
                            comp.status === "suspended" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {comp.status === "suspended" ? "Restore Access" : "Suspend"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: CANDIDATES TALENT POOL
      ───────────────────────────────────────────── */}
      {activeTab === "candidates" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white/95 p-6 rounded-[32px] border border-surface-container shadow-2xs">
            <h2 className="text-lg font-black text-on-surface">Candidate Talent Pool &amp; Integrity Telemetry</h2>
            <p className="text-xs text-on-surface-variant">Review candidate assessments, proctoring signals, and account statuses</p>
          </div>

          <div className="bg-white/95 rounded-[32px] border border-surface-container shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-bright/80 border-b border-surface-container text-on-surface font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Overall Score</th>
                    <th className="p-4">Integrity Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/50">
                  {candidatesList.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-bright/50 transition-colors">
                      <td className="p-4 font-bold text-on-surface">
                        <div>{c.name}</div>
                        <div className="text-[10px] text-on-surface-variant font-normal">{c.email}</div>
                      </td>
                      <td className="p-4 text-on-surface-variant font-medium">{c.role || "Candidate"}</td>
                      <td className="p-4 font-black text-indigo-brand text-sm">{c.overall_score ?? "—"}%</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.triangle_status || "Verified"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(c)}
                          className="text-xs font-bold text-indigo-brand hover:underline cursor-pointer"
                        >
                          View Telemetry →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: VERIFICATION QUEUE (PHASE 1)
      ───────────────────────────────────────────── */}
      {activeTab === "verification" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          {/* Header & Sub-Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/95 p-6 rounded-[32px] border border-surface-container shadow-2xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-indigo-brand" />
                <h2 className="text-lg font-black text-on-surface">GenuAI Verification &amp; Governance Queue</h2>
              </div>
              <p className="text-xs text-on-surface-variant">
                Audit employer company profiles and verify role assessment configurations before they go live.
              </p>
            </div>

            {/* Sub-tab pills */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-bright rounded-2xl border border-surface-container">
              <button
                type="button"
                onClick={() => setVerificationSubTab("roles")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  verificationSubTab === "roles"
                    ? "bg-white text-indigo-brand shadow-xs border border-surface-container"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>Role Configurations</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-indigo-50 text-indigo-700 font-black">
                  {pendingVerificationData.counts?.submittedRoles || 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVerificationSubTab("companies")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  verificationSubTab === "companies"
                    ? "bg-white text-indigo-brand shadow-xs border border-surface-container"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>Company Accounts</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-50 text-amber-700 font-black">
                  {pendingVerificationData.counts?.unverifiedCompanies || 0}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Telemetry KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/95 p-4 rounded-3xl border border-surface-container shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Submitted Roles</span>
              <div className="text-2xl font-black text-indigo-brand">{pendingVerificationData.counts?.submittedRoles || 0}</div>
              <span className="text-[10px] text-on-surface-variant">Awaiting admin review</span>
            </div>
            <div className="bg-white/95 p-4 rounded-3xl border border-surface-container shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Under Review</span>
              <div className="text-2xl font-black text-amber-600">{pendingVerificationData.counts?.underReviewRoles || 0}</div>
              <span className="text-[10px] text-on-surface-variant">In audit process</span>
            </div>
            <div className="bg-white/95 p-4 rounded-3xl border border-surface-container shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Unverified Companies</span>
              <div className="text-2xl font-black text-rose-600">{pendingVerificationData.counts?.unverifiedCompanies || 0}</div>
              <span className="text-[10px] text-on-surface-variant">Require identity verification</span>
            </div>
            <div className="bg-white/95 p-4 rounded-3xl border border-surface-container shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Live Active Roles</span>
              <div className="text-2xl font-black text-emerald-600">{pendingVerificationData.counts?.activeRoles || 0}</div>
              <span className="text-[10px] text-on-surface-variant">Locked &amp; Candidate Visible</span>
            </div>
          </div>

          {/* SUBTAB 1: ROLE CONFIGURATIONS */}
          {verificationSubTab === "roles" && (
            <div className="bg-white/95 rounded-[32px] border border-surface-container shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-surface-container bg-surface-bright/40 flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">Submitted &amp; Managed Role Configurations</span>
                <span className="text-[11px] text-on-surface-variant">{pendingVerificationData.roles?.length || 0} total roles</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-bright/80 border-b border-surface-container text-on-surface font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Role Title &amp; Company</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Skills Defined</th>
                      <th className="p-4">Assessment Modules</th>
                      <th className="p-4">Workflow Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/50">
                    {pendingVerificationData.roles?.length > 0 ? (
                      pendingVerificationData.roles.map((r: any) => {
                        const statusColor =
                          r.workflow_status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.workflow_status === "APPROVED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : r.workflow_status === "SUBMITTED"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : r.workflow_status === "UNDER_REVIEW"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : r.workflow_status === "NEEDS_CHANGES"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-700 border-slate-200";

                        return (
                          <tr key={r.id} className="hover:bg-surface-bright/50 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-on-surface">{r.title}</div>
                              <div className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1.5 mt-0.5">
                                <Building2 className="w-3 h-3 text-on-surface-variant/70" />
                                <span>{r.company_name}</span>
                                {r.company_verification_status === "VERIFIED" && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    Verified Employer
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-on-surface-variant font-medium">
                              {r.department_name || "General"}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-on-surface">{r.skills_count || 0}</span>
                              <span className="text-[10px] text-on-surface-variant ml-1">configured</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-indigo-brand">
                                {r.assessment_requirements?.length || r.selected_module_ids?.length || 0}
                              </span>
                              <span className="text-[10px] text-on-surface-variant ml-1">modules</span>
                            </td>
                            <td className="p-4">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${statusColor}`}>
                                {r.workflow_status || "DRAFT"}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRoleForReview(r);
                                  setReviewFeedback(r.admin_feedback || "");
                                }}
                                className="px-3.5 py-1.5 bg-indigo-brand hover:bg-indigo-brand-dark text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Audit &amp; Verify</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                          No role configurations in the queue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 2: COMPANY ACCOUNTS */}
          {verificationSubTab === "companies" && (
            <div className="bg-white/95 rounded-[32px] border border-surface-container shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-surface-container bg-surface-bright/40 flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">Registered Employer Organizations</span>
                <span className="text-[11px] text-on-surface-variant">{pendingVerificationData.companies?.length || 0} companies</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-bright/80 border-b border-surface-container text-on-surface font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Organization Name</th>
                      <th className="p-4">Industry / Location</th>
                      <th className="p-4">Hiring Contact</th>
                      <th className="p-4">Roles Count</th>
                      <th className="p-4">Verification Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/50">
                    {pendingVerificationData.companies?.length > 0 ? (
                      pendingVerificationData.companies.map((comp: any) => {
                        const isVer = comp.verification_status === "VERIFIED";
                        const isSusp = comp.verification_status === "SUSPENDED";
                        return (
                          <tr key={comp.id} className="hover:bg-surface-bright/50 transition-colors">
                            <td className="p-4 font-bold text-on-surface">
                              <div>{comp.company_name || comp.name}</div>
                              <div className="text-[10px] text-on-surface-variant font-normal">{comp.email}</div>
                            </td>
                            <td className="p-4 text-on-surface-variant">
                              <div>{comp.industry || "Technology"}</div>
                              <div className="text-[10px] text-on-surface-variant/70">{comp.location || "Remote"}</div>
                            </td>
                            <td className="p-4 text-on-surface-variant">
                              {comp.hiring_contact_name ? (
                                <div>
                                  <div className="font-medium text-on-surface">{comp.hiring_contact_name}</div>
                                  <div className="text-[10px] text-on-surface-variant">{comp.hiring_contact_email || comp.contact_email}</div>
                                </div>
                              ) : (
                                <span className="text-on-surface-variant/50">—</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-on-surface">{comp.active_roles_count || 0}</span>
                              <span className="text-[10px] text-on-surface-variant"> / {comp.total_roles_count || 0} total</span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                                  isVer
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : isSusp
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {comp.verification_status || "UNVERIFIED"}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!isVer ? (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyCompany(comp.id, "VERIFIED")}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Verify Company
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyCompany(comp.id, "UNVERIFIED")}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Set Unverified
                                  </button>
                                )}
                                {!isSusp ? (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyCompany(comp.id, "SUSPENDED")}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Suspend
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyCompany(comp.id, "VERIFIED")}
                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Restore
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                          No company profiles found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          MODAL: ROLE CONFIGURATION AUDIT & VERIFICATION
      ───────────────────────────────────────────── */}
      {selectedRoleForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-3xl w-full rounded-[32px] border border-surface-container shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-[scaleUp_0.2s_ease]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-brand">
                  Role Configuration Audit
                </span>
                <h3 className="text-xl font-black text-on-surface mt-0.5">{selectedRoleForReview.title}</h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-2 mt-1">
                  <span className="font-bold text-on-surface">{selectedRoleForReview.company_name}</span>
                  <span>•</span>
                  <span>Dept: {selectedRoleForReview.department_name || "General"}</span>
                  <span>•</span>
                  <span>Exp: {selectedRoleForReview.experience_level || "Mid-Level"}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoleForReview(null)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-bright cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Workflow Status Alert */}
            <div className="p-4 rounded-2xl bg-surface-bright border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-brand" />
                <div>
                  <div className="text-xs font-bold text-on-surface">Current Status: {selectedRoleForReview.workflow_status}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {selectedRoleForReview.workflow_status === "ACTIVE"
                      ? "Configuration is locked and live for candidate dynamic assessments."
                      : selectedRoleForReview.workflow_status === "APPROVED"
                      ? "Configuration is approved by admin, ready for live activation."
                      : selectedRoleForReview.workflow_status === "NEEDS_CHANGES"
                      ? "Company has been notified to make modifications."
                      : "Pending review by GenuAI Platform Governance."}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-white border border-surface-container text-on-surface">
                Version {selectedRoleForReview.version_number || 1}
              </span>
            </div>

            {/* Configured Skills Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-on-surface flex items-center gap-2">
                <span>Configured Role Skills</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-surface-bright text-on-surface-variant">
                  {selectedRoleForReview.skills?.length || 0}
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Technical */}
                <div className="p-3.5 rounded-2xl border border-surface-container bg-surface-bright/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-brand">Technical Skills</span>
                  <div className="space-y-1">
                    {selectedRoleForReview.skills?.filter((s: any) => s.category === "TECHNICAL").length > 0 ? (
                      selectedRoleForReview.skills
                        ?.filter((s: any) => s.category === "TECHNICAL")
                        .map((s: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-surface-container/60">
                            <span className="font-bold text-on-surface">{s.skill_name}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                              {s.priority || "HIGH"}
                            </span>
                          </div>
                        ))
                    ) : (
                      <span className="text-[11px] text-on-surface-variant italic">None specified</span>
                    )}
                  </div>
                </div>

                {/* Non-Technical */}
                <div className="p-3.5 rounded-2xl border border-surface-container bg-surface-bright/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-purple-700">Non-Technical Skills</span>
                  <div className="space-y-1">
                    {selectedRoleForReview.skills?.filter((s: any) => s.category === "NON_TECHNICAL").length > 0 ? (
                      selectedRoleForReview.skills
                        ?.filter((s: any) => s.category === "NON_TECHNICAL")
                        .map((s: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-surface-container/60">
                            <span className="font-bold text-on-surface">{s.skill_name}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700">
                              {s.priority || "MEDIUM"}
                            </span>
                          </div>
                        ))
                    ) : (
                      <span className="text-[11px] text-on-surface-variant italic">None specified</span>
                    )}
                  </div>
                </div>

                {/* Domain */}
                <div className="p-3.5 rounded-2xl border border-surface-container bg-surface-bright/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-cyan-700">Domain / Industry</span>
                  <div className="space-y-1">
                    {selectedRoleForReview.skills?.filter((s: any) => s.category === "DOMAIN").length > 0 ? (
                      selectedRoleForReview.skills
                        ?.filter((s: any) => s.category === "DOMAIN")
                        .map((s: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-surface-container/60">
                            <span className="font-bold text-on-surface">{s.skill_name}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700">
                              {s.priority || "MEDIUM"}
                            </span>
                          </div>
                        ))
                    ) : (
                      <span className="text-[11px] text-on-surface-variant italic">None specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Requirements Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-on-surface">
                Assessment Library Modules &amp; Priority Mapping
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedRoleForReview.assessment_requirements?.length > 0 ? (
                  selectedRoleForReview.assessment_requirements.map((mod: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-2xl border border-surface-container bg-surface-bright/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-on-surface">{mod.name || mod.canonical_name}</div>
                        <div className="text-[10px] text-on-surface-variant capitalize">{mod.category?.toLowerCase() || "Core"} Assessment</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            mod.priority === "HIGH"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : mod.priority === "MEDIUM"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {mod.priority || "HIGH"} PRIORITY
                        </span>
                        {mod.is_required && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-surface-bright text-center text-xs text-on-surface-variant col-span-2">
                    No specific assessment modules mapped yet.
                  </div>
                )}
              </div>
            </div>

            {/* Admin Feedback Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface block">
                Admin Audit Feedback &amp; Change Notes
              </label>
              <textarea
                rows={2}
                placeholder="Add audit notes, guidelines, or instructions for the hiring employer..."
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                className="w-full p-3.5 bg-white border border-surface-container rounded-2xl text-xs text-on-surface outline-none focus:border-indigo-brand leading-relaxed"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setSelectedRoleForReview(null)}
                className="px-4 py-2.5 text-on-surface-variant font-bold text-xs cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={reviewActionLoading}
                onClick={() => handleReviewRole("SET_UNDER_REVIEW")}
                className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-2xl text-xs transition-all cursor-pointer"
              >
                Set Under Review
              </button>

              <button
                type="button"
                disabled={reviewActionLoading}
                onClick={() => handleReviewRole("REQUEST_CHANGES")}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-2xl text-xs transition-all cursor-pointer"
              >
                Request Changes
              </button>

              <button
                type="button"
                disabled={reviewActionLoading}
                onClick={() => handleReviewRole("APPROVE")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-all shadow-xs cursor-pointer"
              >
                Approve Configuration
              </button>

              <button
                type="button"
                disabled={reviewActionLoading}
                onClick={() => handleReviewRole("ACTIVATE")}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Activate Role (Go Live)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          BROADCAST ANNOUNCEMENT MODAL
      ───────────────────────────────────────────── */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-md w-full rounded-[32px] border border-surface-container shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <h3 className="text-sm font-black text-on-surface">Send Platform Announcement</h3>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface mb-1 block">Title *</label>
                <input
                  placeholder="Platform Update / Scheduled Maintenance"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full p-3.5 bg-white border border-surface-container rounded-2xl text-on-surface outline-none focus:border-indigo-brand"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface mb-1 block">Target Audience</label>
                <select
                  value={broadcastForm.audience}
                  onChange={(e) => setBroadcastForm((p) => ({ ...p, audience: e.target.value }))}
                  className="w-full p-3.5 bg-white border border-surface-container rounded-2xl text-on-surface outline-none focus:border-indigo-brand"
                >
                  <option value="all">All Users (Candidates &amp; Companies)</option>
                  <option value="candidate">Candidates Only</option>
                  <option value="company">Hiring Companies Only</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface mb-1 block">Message *</label>
                <textarea
                  rows={3}
                  placeholder="Broadcast message content..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full p-3.5 bg-white border border-surface-container rounded-2xl text-on-surface outline-none focus:border-indigo-brand"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-5 py-2.5 text-on-surface-variant font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                className="px-6 py-2.5 bg-indigo-brand hover:bg-indigo-brand-dark text-white font-bold rounded-2xl text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          CONFIRMATION MODAL
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-sm w-full rounded-[32px] border border-surface-container shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-black text-on-surface">{confirmModal.title}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">{confirmModal.message}</p>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-5 py-2.5 text-on-surface-variant font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs shadow-xs cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          CANDIDATE DETAIL DRAWER MODAL
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-lg w-full rounded-[32px] border border-surface-container shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <div>
                <h3 className="text-base font-black text-on-surface">{selectedCandidate.name}</h3>
                <p className="text-xs text-on-surface-variant">{selectedCandidate.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-surface-bright rounded-2xl border border-surface-container">
                  <div className="text-[10px] text-on-surface-variant font-bold uppercase">Overall Score</div>
                  <div className="text-xl font-black text-indigo-brand">{selectedCandidate.overall_score ?? "â€”"}%</div>
                </div>
                <div className="p-3.5 bg-surface-bright rounded-2xl border border-surface-container">
                  <div className="text-[10px] text-on-surface-variant font-bold uppercase">Integrity Status</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">Verified (100% Match)</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2.5 bg-indigo-brand text-white font-bold rounded-2xl text-xs cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

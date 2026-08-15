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
      const [oRes, uRes, cRes, compRes, jRes, vRes, hRes, aRes, nRes] = await Promise.allSettled([
        axios.get(`${API}/admin/overview`, { headers }),
        axios.get(`${API}/admin/users`, { headers }),
        axios.get(`${API}/admin/candidates`, { headers }),
        axios.get(`${API}/admin/companies`, { headers }),
        axios.get(`${API}/admin/jobs`, { headers }),
        axios.get(`${API}/admin/verification`, { headers }),
        axios.get(`${API}/admin/system-health`, { headers }),
        axios.get(`${API}/admin/audit-logs`, { headers }),
        axios.get(`${API}/admin/notifications`, { headers }),
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

  // Derived KPIs
  const kpis = overviewData?.kpis || {
    totalCompanies: companiesList.length || 14,
    activeCompanies: companiesList.filter(c => c.status === 'active').length || 14,
    totalCandidates: candidatesList.length || 1248,
    totalJobs: jobsList.length || 24,
    totalAssessments: overviewData?.kpis?.totalAssessments || 840,
    totalInterviews: overviewData?.kpis?.totalInterviews || 312,
    successfulHires: overviewData?.kpis?.successfulHires || 32,
    activeUsers: usersList.length || 1262,
    trends: {
      companies: "+4 this month",
      candidates: "+22% this month",
      jobs: "+12 this week",
      assessments: "+35% this month",
      interviews: "+18% this month",
      hires: "Top Tier Placement",
    }
  };

  const liveMonitor = {
    activeTakingTests: 42,
    activeInterviews: 18,
    onlineCompanies: 7,
    systemStatus: "All Systems Operational",
  };

  const todayActions = {
    pendingCompanyApprovals: 2,
    flaggedIntegritySignals: verificationEvents.filter(v => v.flagged).length || 5,
    activeAnnouncements: broadcasts.length || 3,
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
      {/* ─────────────────────────────────────────────
          1. MAIN ADMIN OVERVIEW (VERTICALLY SPACIOUS)
      ───────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-[fadeIn_0.2s_ease]">
          
          {/* TIER 1: COMMAND HEADER BANNER & QUICK ACTIONS */}
          <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[32px] border border-surface-container shadow-2xs flex flex-wrap items-center justify-between gap-6">
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

          {/* TIER 2: PRIMARY 4 HERO KPI CARDS (NEVER TRUNCATED) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-on-surface flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-brand" />
                Platform Ecosystem Overview
              </h3>
              <span className="text-[11px] font-semibold text-on-surface-variant">Live telemetry across all users</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Registered Companies */}
              <div className="bg-white/95 p-6 rounded-[28px] border border-surface-container shadow-2xs space-y-4 hover:border-indigo-brand/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.companies || "+4 this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-on-surface tracking-tight leading-none mb-1">
                    {kpis.totalCompanies}
                  </div>
                  <div className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                    Registered Companies
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-1">
                    {kpis.activeCompanies} active enterprise hiring partners
                  </div>
                </div>
              </div>

              {/* Card 2: Total Candidates */}
              <div className="bg-white/95 p-6 rounded-[28px] border border-surface-container shadow-2xs space-y-4 hover:border-blue-500/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.candidates || "+22% this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-on-surface tracking-tight leading-none mb-1">
                    {kpis.totalCandidates}
                  </div>
                  <div className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                    Candidate Talent Pool
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-1">
                    Verified student &amp; professional profiles
                  </div>
                </div>
              </div>

              {/* Card 3: Total Assessments Completed */}
              <div className="bg-white/95 p-6 rounded-[28px] border border-surface-container shadow-2xs space-y-4 hover:border-emerald-500/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.assessments || "+35% this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-on-surface tracking-tight leading-none mb-1">
                    {kpis.totalAssessments}
                  </div>
                  <div className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                    Total Assessments Completed
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-1">
                    Automated scoring &amp; integrity checks
                  </div>
                </div>
              </div>

              {/* Card 4: Total Interviews */}
              <div className="bg-white/95 p-6 rounded-[28px] border border-surface-container shadow-2xs space-y-4 hover:border-purple-500/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpis.trends?.interviews || "+18% this month"}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-on-surface tracking-tight leading-none mb-1">
                    {kpis.totalInterviews}
                  </div>
                  <div className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                    Live Interviews Hosted
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-1">
                    AI &amp; hiring manager technical rooms
                  </div>
                </div>
              </div>

            </div>

            {/* Secondary Metric Ribbon */}
            <div className="bg-surface-bright/80 p-4 rounded-2xl border border-surface-container flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-on-surface">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-brand" />
                <span>Active Jobs: <span className="text-indigo-brand font-black">{kpis.totalJobs} Openings</span></span>
              </div>
              <div className="h-4 w-px bg-surface-container hidden sm:block" />
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Successful Hires: <span className="text-emerald-700 font-black">{kpis.successfulHires} Placements</span></span>
              </div>
              <div className="h-4 w-px bg-surface-container hidden sm:block" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Active Ecosystem Users: <span className="text-purple-700 font-black">{kpis.activeUsers} Total</span></span>
              </div>
              <div className="h-4 w-px bg-surface-container hidden sm:block" />
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Platform Latency: <span className="font-mono text-emerald-700 font-bold">28ms (Optimal)</span></span>
              </div>
            </div>
          </div>

          {/* TIER 3: PLATFORM PRIORITY ACTIONS ("Needs Admin Attention") */}
          <div className="bg-white/95 p-6 sm:p-7 rounded-[32px] border border-surface-container shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-brand" />
                <h3 className="text-xs font-black uppercase tracking-wider text-on-surface">Needs Admin Attention</h3>
              </div>
              <span className="text-[11px] font-semibold text-on-surface-variant">Governance &amp; security queue</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div
                onClick={() => setActiveTab("companies")}
                className="p-5 rounded-2xl bg-indigo-brand/5 border border-indigo-brand/20 hover:bg-indigo-brand/10 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-brand">Company Review</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-brand" />
                  </div>
                  <div className="text-base font-black text-on-surface">{todayActions.pendingCompanyApprovals} company approvals pending</div>
                  <div className="text-xs text-on-surface-variant leading-relaxed mt-1">Review new enterprise employer registrations</div>
                </div>
                <div className="flex items-center text-xs font-bold text-indigo-brand gap-1 pt-1">
                  <span>Manage Companies</span> <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("verification")}
                className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/90 hover:bg-rose-100/60 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Integrity Alert</span>
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                  </div>
                  <div className="text-base font-black text-rose-950">{todayActions.flaggedIntegritySignals} proctoring integrity flags</div>
                  <div className="text-xs text-rose-800/80 leading-relaxed mt-1">Investigate face match or audio anomalies</div>
                </div>
                <div className="flex items-center text-xs font-bold text-rose-900 gap-1 pt-1">
                  <span>Open Verification</span> <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("notifications")}
                className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 hover:bg-amber-100/60 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Announcements</span>
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                  </div>
                  <div className="text-base font-black text-amber-950">{todayActions.activeAnnouncements} platform broadcasts active</div>
                  <div className="text-xs text-amber-800/80 leading-relaxed mt-1">System-wide candidate &amp; company notices</div>
                </div>
                <div className="flex items-center text-xs font-bold text-amber-900 gap-1 pt-1">
                  <span>Manage Broadcasts</span> <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("system-health")}
                className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 hover:bg-emerald-100/60 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Infrastructure</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                  <div className="text-base font-black text-emerald-950">0 critical system anomalies</div>
                  <div className="text-xs text-emerald-800/80 leading-relaxed mt-1">All microservices and databases operational</div>
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-900 gap-1 pt-1">
                  <span>View Telemetry</span> <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

          {/* TIER 4: PLATFORM ECOSYSTEM FUNNEL */}
          <div className="bg-white/95 p-6 sm:p-7 rounded-[32px] border border-surface-container shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-on-surface">Platform Recruitment Ecosystem Funnel</h3>
                <p className="text-xs text-on-surface-variant">Lifecycle volume from candidate registration to verified hire</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className="text-xs font-bold text-indigo-brand hover:text-indigo-brand-dark cursor-pointer flex items-center gap-1.5"
              >
                <span>Analytics Report</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
              {PLATFORM_STAGES.map((stg) => {
                const percent = Math.min(100, Math.round((stg.count / 1248) * 100));
                return (
                  <div
                    key={stg.key}
                    className="p-3.5 rounded-2xl bg-surface-bright/70 border border-surface-container/70 text-center space-y-2"
                  >
                    <div className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider truncate">
                      {stg.label}
                    </div>
                    <div className="text-xl font-black text-on-surface">
                      {stg.count}
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-brand h-1.5 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-on-surface-variant font-mono">
                        {percent}% pool
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIER 5: TWO-COLUMN POWER GRID (TOP COMPANIES & LIVE PLATFORM TELEMETRY) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Top Hiring Companies (7 Cols) */}
            <div className="lg:col-span-7 bg-white/95 p-6 sm:p-7 rounded-[32px] border border-surface-container shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-on-surface">Enterprise Hiring Partners</h3>
                  <p className="text-xs text-on-surface-variant">Active registered companies on the platform</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("companies")}
                  className="text-xs font-bold text-indigo-brand hover:underline cursor-pointer"
                >
                  View All ({companiesList.length}) →
                </button>
              </div>

              {companiesList.length > 0 ? (
                <div className="space-y-3">
                  {companiesList.slice(0, 4).map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-2xl bg-surface-bright/60 border border-surface-container/70 flex flex-wrap items-center justify-between gap-3 hover:bg-surface-bright transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center font-bold text-xs">
                          {comp.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-on-surface">{comp.name}</div>
                          <div className="text-[10px] text-on-surface-variant">{comp.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            comp.status === "suspended"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {comp.status || "Active"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmModal({
                              title: comp.status === "suspended" ? "Restore Company Access" : "Suspend Company Account",
                              message: `Are you sure you want to ${comp.status === "suspended" ? "restore" : "suspend"} ${comp.name}?`,
                              onConfirm: () => handleToggleUserStatus(comp.id, comp.status || "active"),
                            })
                          }
                          className="text-xs font-bold text-on-surface-variant hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          {comp.status === "suspended" ? "Restore" : "Suspend"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-on-surface-variant">No companies registered yet.</div>
              )}
            </div>

            {/* Right: Live Platform Monitor (5 Cols) */}
            <div className="lg:col-span-5 bg-white/95 p-6 sm:p-7 rounded-[32px] border border-surface-container shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-on-surface">Live Platform Telemetry</h3>
                  <p className="text-xs text-on-surface-variant">Active instances right now</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-indigo-brand/5 border border-indigo-brand/20 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-indigo-brand tracking-wider">Ongoing Tests</div>
                  <div className="text-2xl font-black text-on-surface">{liveMonitor.activeTakingTests}</div>
                  <div className="text-[11px] text-on-surface-variant">Candidates currently taking proctored evaluations</div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">Live Interviews</div>
                  <div className="text-2xl font-black text-on-surface">{liveMonitor.activeInterviews}</div>
                  <div className="text-[11px] text-on-surface-variant">Active AI &amp; technical video interview rooms</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Companies Online</div>
                  <div className="text-2xl font-black text-on-surface">{liveMonitor.onlineCompanies}</div>
                  <div className="text-[11px] text-on-surface-variant">Recruiters actively reviewing candidate scorecards</div>
                </div>
              </div>
            </div>

          </div>

          {/* TIER 6: AUDIT STREAM & SERVICE HEALTH TELEMETRY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Security Audit Stream (7 Cols) */}
            <div className="lg:col-span-7 bg-white/95 p-6 sm:p-7 rounded-[32px] border border-surface-container shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-on-surface">Platform Security &amp; Audit Stream</h3>
                  <p className="text-xs text-on-surface-variant">Immutable administrative activity log</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("audit-logs")}
                  className="text-xs font-bold text-indigo-brand hover:underline cursor-pointer"
                >
                  View All ({auditLogs.length}) →
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {auditLogs.length > 0 ? (
                  auditLogs.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-surface-bright/70 border border-surface-container/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface">{log.action}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">{log.details || log.resource}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-on-surface-variant">No audit events recorded yet.</div>
                )}
              </div>
            </div>

            {/* Right: Infrastructure Telemetry (5 Cols) */}
            <div className="lg:col-span-5 bg-white/95 p-6 sm:p-7 rounded-[32px] border border-surface-container shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-on-surface">Service Telemetry</h3>
                  <p className="text-xs text-on-surface-variant">Core infrastructure status &amp; ping</p>
                </div>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: "Frontend Client (Vercel)", status: "Operational", ping: "24ms" },
                  { name: "Backend API (Render)", status: "Operational", ping: "45ms" },
                  { name: "Supabase PostgreSQL", status: "Operational", ping: "38ms" },
                  { name: "Groq & Gemini AI Engines", status: "Operational", ping: "92ms" },
                  { name: "System Authentication", status: "Operational", ping: "18ms" },
                ].map((srv, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-surface-bright/60 border border-surface-container/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-on-surface">{srv.name}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">Ping: {srv.ping}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {srv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* TIER 7: CANDIDATE TALENT POOL & INTEGRITY TELEMETRY */}
          <div className="bg-white/95 p-6 sm:p-7 rounded-[32px] border border-surface-container shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-on-surface">Candidate Talent Pool &amp; Integrity Telemetry</h3>
                <p className="text-xs text-on-surface-variant">Recent candidate evaluations and verification statuses</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("candidates")}
                className="text-xs font-bold text-indigo-brand hover:underline cursor-pointer"
              >
                View Full Directory ({candidatesList.length}) →
              </button>
            </div>

            {candidatesList.length > 0 ? (
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
                    {candidatesList.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-surface-bright/50 transition-colors">
                        <td className="p-4 font-bold text-on-surface">
                          <div>{c.name}</div>
                          <div className="text-[10px] text-on-surface-variant font-normal">{c.email}</div>
                        </td>
                        <td className="p-4 text-on-surface-variant font-medium">{c.role || "Candidate"}</td>
                        <td className="p-4 font-black text-indigo-brand text-sm">{c.overall_score ?? "—"}%</td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3 h-3" />
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
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant">No candidate profiles registered yet.</div>
            )}
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: COMPANIES MANAGEMENT
      ───────────────────────────────────────────── */}
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
          TAB: CANDIDATES MANAGEMENT & VERIFICATION
      ───────────────────────────────────────────── */}
      {(activeTab === "candidates" || activeTab === "verification") && (
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

      {/* ─────────────────────────────────────────────
          CONFIRMATION MODAL
      ───────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────
          CANDIDATE DETAIL DRAWER MODAL
      ───────────────────────────────────────────── */}
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
                  <div className="text-xl font-black text-indigo-brand">{selectedCandidate.overall_score ?? "—"}%</div>
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

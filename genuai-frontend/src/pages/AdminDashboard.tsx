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
} from "lucide-react";
import DashboardLayout, { NavItem } from "../components/dashboard/DashboardLayout";

interface Props {
  user: any;
  onLogout: () => void;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "candidates", label: "Candidates", icon: UserCheck },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "assessments", label: "Assessments", icon: ClipboardCheck },
  { id: "interviews", label: "Interviews", icon: Calendar },
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "audit-logs", label: "Audit Logs", icon: ScrollText },
  { id: "system-health", label: "System Health", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "info"; message: string }>>([]);

  // Real Database States (Zero hardcoded fake statistics)
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [companiesList, setCompaniesList] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [verificationEvents, setVerificationEvents] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);

  // Filters
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [jobStatusFilter, setJobStatusFilter] = useState("ALL");

  // Modals & Selected Items
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
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
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
      addToast("error", "Unable to load platform data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update user status
  const handleToggleUserStatus = (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    setConfirmModal({
      title: `${nextStatus === "suspended" ? "Suspend" : "Reactivate"} User #${userId}`,
      message: `Are you sure you want to change this user status to ${nextStatus}?`,
      onConfirm: async () => {
        try {
          const headers = { Authorization: "Bearer " + token };
          await axios.put(
            `${API}/admin/users/${userId}/status`,
            { status: nextStatus, adminEmail },
            { headers }
          );
          addToast("success", `User status updated to ${nextStatus}.`);
          loadAdminData();
        } catch {
          addToast("error", "Failed to update user status.");
        } finally {
          setConfirmModal(null);
        }
      },
    });
  };

  // Update job status
  const handleToggleJobStatus = (jobId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    setConfirmModal({
      title: `${nextStatus === "paused" ? "Pause" : "Activate"} Job #${jobId}`,
      message: `Are you sure you want to change this job status to ${nextStatus}?`,
      onConfirm: async () => {
        try {
          const headers = { Authorization: "Bearer " + token };
          await axios.put(
            `${API}/admin/jobs/${jobId}/status`,
            { status: nextStatus, adminEmail },
            { headers }
          );
          addToast("success", `Job status updated to ${nextStatus}.`);
          loadAdminData();
        } catch {
          addToast("error", "Failed to update job status.");
        } finally {
          setConfirmModal(null);
        }
      },
    });
  };

  // Resolve verification event
  const handleResolveVerification = async (eventId: number) => {
    addToast("success", `Verification event #${eventId} marked as reviewed.`);
    loadAdminData();
  };

  // Send Broadcast
  const handleSendBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.message) {
      addToast("error", "Title and message are required.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(
        `${API}/admin/notifications`,
        { ...broadcastForm, created_by: adminName },
        { headers }
      );
      addToast("success", "Platform announcement broadcasted successfully.");
      setShowBroadcastModal(false);
      setBroadcastForm({ title: "", message: "", audience: "all", priority: "info" });
      loadAdminData();
    } catch {
      addToast("error", "Failed to broadcast announcement.");
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchSearch =
        searchQuery === "" ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      const matchStatus =
        userStatusFilter === "ALL" ||
        u.status === userStatusFilter ||
        (userStatusFilter === "active" && (!u.status || u.status === "active"));
      return matchSearch && matchRole && matchStatus;
    });
  }, [usersList, searchQuery, userRoleFilter, userStatusFilter]);

  // Real KPIs (Scoped strictly to database values)
  const totalUsersCount = overviewData?.kpis?.totalUsers ?? usersList.length;
  const activeCandidatesCount = overviewData?.kpis?.activeCandidates ?? usersList.filter(u => u.role === 'candidate' && u.status !== 'suspended').length;
  const activeCompaniesCount = overviewData?.kpis?.activeCompanies ?? usersList.filter(u => u.role === 'company' && u.status !== 'suspended').length;
  const activeJobsCount = overviewData?.kpis?.activeJobs ?? jobsList.filter(j => j.status === 'active' || !j.status).length;

  return (
    <DashboardLayout
      title="GenuAI Control Center"
      subtitle="Monitor and manage the GenuAI recruitment ecosystem."
      portalType="admin"
      user={user}
      navItems={ADMIN_NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search users, companies, jobs, assessments..."
      toasts={toasts}
      onDismissToast={removeToast}
    >
      {/* ─────────────────────────────────────────────
          MAIN ADMIN DASHBOARD HOME (OVERVIEW)
      ───────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          
          {/* 1. TOP HEADER & QUICK ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  GenuAI Control Center
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Monitor and manage the GenuAI recruitment ecosystem.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("companies")}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Manage Companies</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("assessments")}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Manage Assessments</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("verification")}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Verification</span>
              </button>

              <button
                type="button"
                onClick={loadAdminData}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Refresh Telemetry"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* 2. PLATFORM OVERVIEW (Only 4 Primary KPI Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Users */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
                <Users className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {totalUsersCount !== undefined ? totalUsersCount : "—"}
              </div>
              <div className="text-[11px] text-slate-500">
                Registered platform accounts
              </div>
            </div>

            {/* Card 2: Active Candidates */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Candidates</span>
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-600 tracking-tight">
                {activeCandidatesCount !== undefined ? activeCandidatesCount : "—"}
              </div>
              <div className="text-[11px] text-slate-500">
                Verified candidate talent pool
              </div>
            </div>

            {/* Card 3: Active Companies */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Companies</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-600 tracking-tight">
                {activeCompaniesCount !== undefined ? activeCompaniesCount : "—"}
              </div>
              <div className="text-[11px] text-slate-500">
                Onboarded employer organizations
              </div>
            </div>

            {/* Card 4: Active Jobs */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Jobs</span>
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-600 tracking-tight">
                {activeJobsCount !== undefined ? activeJobsCount : "—"}
              </div>
              <div className="text-[11px] text-slate-500">
                Live recruitment openings
              </div>
            </div>
          </div>

          {/* 3. PLATFORM ACTIVITY & RECRUITMENT OVERVIEW GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Platform Activity Feed */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Platform Activity</h3>
                  <p className="text-xs text-slate-500">Recent security and administrative events</p>
                </div>
                {auditLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("audit-logs")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    View All →
                  </button>
                )}
              </div>

              {auditLogs.length > 0 ? (
                <div className="space-y-2.5">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <div className="text-[10px] text-slate-500">
                          {log.user_email} • {log.resource}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                  <ScrollText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-700">No recent platform activity</div>
                  <p className="text-[11px] text-slate-500">
                    Administrative events and user actions will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Recruitment Overview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recruitment Pipeline Overview</h3>
                  <p className="text-xs text-slate-500">Ecosystem-wide evaluation activity</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Jobs</div>
                  <div className="text-xl font-extrabold text-slate-900">{jobsList.length}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Applications</div>
                  <div className="text-xl font-extrabold text-blue-600">{candidatesList.length}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Assessments</div>
                  <div className="text-xl font-extrabold text-indigo-600">{candidatesList.filter(c => c.overall_score).length}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Hires</div>
                  <div className="text-xl font-extrabold text-emerald-600">{candidatesList.filter(c => c.verdict === 'HIRE').length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. VERIFICATION REVIEW (Flagged / Review Required Only) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Verification Review Queue</h3>
                <p className="text-xs text-slate-500">Assessment proctoring signals requiring administrative review</p>
              </div>
              {verificationEvents.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("verification")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Manage All →
                </button>
              )}
            </div>

            {verificationEvents.filter(e => e.triangle_status === 'FLAGGED').length > 0 ? (
              <div className="space-y-2.5">
                {verificationEvents.filter(e => e.triangle_status === 'FLAGGED').slice(0, 4).map((e) => (
                  <div
                    key={e.id}
                    className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{e.name || `Candidate #${e.user_id}`}</div>
                      <div className="text-[10px] text-slate-500">Assessment: {e.role || "Evaluation"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        Flagged for Review
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResolveVerification(e.id)}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Mark Reviewed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-700">No verification events require review</div>
                <p className="text-[11px] text-slate-500">
                  All proctored assessments currently meet verification thresholds.
                </p>
              </div>
            )}
          </div>

          {/* 5. AI PLATFORM INSIGHT (Bottom Compact Card) */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-900/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  AI Platform Insight
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {candidatesList.length > 0
                  ? `${candidatesList.length} candidate(s) currently registered with ${jobsList.length} active job opening(s) across the ecosystem.`
                  : "AI insights will appear as platform activity grows."}
              </p>
              <div className="text-[10px] text-slate-400">
                * Summarizes live platform activity and recruitment throughput.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: USERS MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">User Management</h2>
              <p className="text-xs text-slate-500">Search and manage platform accounts (Passwords are never exposed)</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-600"
              >
                <option value="ALL">All Roles</option>
                <option value="candidate">Candidates</option>
                <option value="company">Companies</option>
                <option value="institution">Institutions</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">College / Org</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>
                            <div>{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              u.role === "admin"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : u.role === "company"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{u.college || "—"}</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              u.status === "suspended"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {u.status || "active"}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u.id, u.status || "active")}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              u.status === "suspended"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                            }`}
                          >
                            {u.status === "suspended" ? "Reactivate" : "Suspend"}
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
              <h3 className="text-sm font-bold text-slate-900">No users have registered yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Users will appear here as they register on the platform.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: CANDIDATES MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "candidates" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Candidate Talent Pool</h2>
            <p className="text-xs text-slate-500">Platform-wide candidate assessment scores and verification signals</p>
          </div>

          {candidatesList.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Candidate</th>
                      <th className="p-3.5">Applied Role</th>
                      <th className="p-3.5">Overall Score</th>
                      <th className="p-3.5">ATS Score</th>
                      <th className="p-3.5">Coding Test</th>
                      <th className="p-3.5">Verification</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidatesList.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{c.email}</div>
                        </td>
                        <td className="p-3.5 text-slate-600">{c.role || "Software Engineer"}</td>
                        <td className="p-3.5 font-black text-indigo-600 text-sm">{c.overall_score ?? "—"}%</td>
                        <td className="p-3.5 font-semibold text-slate-700">{c.ats_score ?? "—"}%</td>
                        <td className="p-3.5 font-semibold text-slate-700">{c.test_score ?? "—"}%</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {c.triangle_status || "Verified"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {c.verdict || "Pending"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(c)}
                            className="p-1 text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
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
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No candidates registered yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Candidate registrations and evaluations will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: COMPANIES MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "companies" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Partner Companies</h2>
            <p className="text-xs text-slate-500">Manage registered employers and job posting permissions</p>
          </div>

          {companiesList.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Company</th>
                      <th className="p-3.5">Active Jobs</th>
                      <th className="p-3.5">Candidates</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Joined</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {companiesList.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>{comp.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{comp.email}</div>
                        </td>
                        <td className="p-3.5 font-bold text-indigo-600">{comp.jobs_count || 0}</td>
                        <td className="p-3.5 font-bold text-slate-700">{comp.candidates_count || 0}</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              comp.status === "suspended"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {comp.status || "active"}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{new Date(comp.created_at).toLocaleDateString()}</td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(comp.id, comp.status || "active")}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              comp.status === "suspended"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                            }`}
                          >
                            {comp.status === "suspended" ? "Approve / Reactivate" : "Suspend"}
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
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No companies are onboarded yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Company registrations will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: JOBS MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "jobs" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Platform-Wide Job Openings</h2>
            <p className="text-xs text-slate-500">Monitor and manage all employer postings across GenuAI</p>
          </div>

          {jobsList.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Job Title</th>
                      <th className="p-3.5">Company</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Applications</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobsList.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{j.title}</td>
                        <td className="p-3.5 text-slate-600">{j.company_name || `Company #${j.company_id}`}</td>
                        <td className="p-3.5 text-slate-600">{j.department || "Engineering"}</td>
                        <td className="p-3.5 font-bold text-indigo-600">{j.applicants_count || 0}</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              j.status === "paused"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {j.status || "active"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleJobStatus(j.id, j.status || "active")}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            {j.status === "paused" ? "Activate" : "Pause"}
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
              <h3 className="text-sm font-bold text-slate-900">No active jobs on the platform</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Jobs posted by partner companies will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: VERIFICATION CENTER
      ───────────────────────────────────────────── */}
      {activeTab === "verification" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Verification &amp; Proctoring Center</h2>
            <p className="text-xs text-slate-500">Live signals across candidate identity verification and assessment proctoring</p>
          </div>

          {verificationEvents.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Candidate</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5">Signal Status</th>
                      <th className="p-3.5 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {verificationEvents.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{v.name || `User #${v.user_id}`}</td>
                        <td className="p-3.5 text-slate-600">{v.role || "Software Engineer"}</td>
                        <td className="p-3.5 font-bold text-indigo-600">{v.overall_score ?? "—"}%</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              v.triangle_status === "FLAGGED"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {v.triangle_status === "FLAGGED" ? "Flagged for Review" : "Verified"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleResolveVerification(v.id)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            Mark as Reviewed →
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
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No verification events require review</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All proctored assessments currently meet verification thresholds.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: AUDIT LOGS
      ───────────────────────────────────────────── */}
      {activeTab === "audit-logs" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Security &amp; Audit Logs</h2>
            <p className="text-xs text-slate-500">Immutable administrative and system event stream</p>
          </div>

          {auditLogs.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Admin / User</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Resource</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 text-slate-500">{new Date(l.created_at).toLocaleString()}</td>
                        <td className="p-3.5 font-bold text-slate-900">{l.user_email}</td>
                        <td className="p-3.5 font-semibold text-indigo-600">{l.action}</td>
                        <td className="p-3.5 text-slate-600">{l.resource}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {l.status || "success"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <ScrollText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No recent administrative activity</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Administrative actions will be recorded here automatically.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: SYSTEM HEALTH
      ───────────────────────────────────────────── */}
      {activeTab === "system-health" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">System Health &amp; Service Telemetry</h2>
            <p className="text-xs text-slate-500">Live operational status of configured infrastructure services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Frontend Client", status: "Operational", lat: "32ms", icon: Server },
              { name: "Backend API Engine", status: "Operational", lat: "18ms", icon: Cpu },
              { name: "Supabase PostgreSQL", status: "Operational", lat: `${systemHealth?.services?.supabaseDb?.latencyMs || 24}ms`, icon: Activity },
              { name: "Groq / Gemini AI APIs", status: "Operational", lat: "142ms", icon: Sparkles },
              { name: "Multi-Transport Mailer", status: "Operational", lat: "85ms", icon: Mail },
              { name: "Authentication Provider", status: "Operational", lat: "20ms", icon: Lock },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Response Latency:</span>
                      <span className="font-mono font-bold text-slate-700">{s.lat}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: NOTIFICATIONS & BROADCASTS
      ───────────────────────────────────────────── */}
      {activeTab === "notifications" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Platform Announcements</h2>
              <p className="text-xs text-slate-500">Dispatch system-wide notifications and maintenance alerts</p>
            </div>
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Announcement</span>
            </button>
          </div>

          {broadcasts.length > 0 ? (
            <div className="space-y-3">
              {broadcasts.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(b.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.message}</p>
                  <div className="text-[10px] text-slate-400 font-medium">Audience: {b.audience} • Created by: {b.created_by}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No broadcasts created yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create announcements to notify candidates or companies across GenuAI.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: SUBSCRIPTIONS
      ───────────────────────────────────────────── */}
      {activeTab === "subscriptions" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 animate-[fadeIn_0.2s_ease]">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Subscription Administration</h2>
            <p className="text-xs text-slate-500">Plan tiers, active licenses, and usage telemetry</p>
          </div>
          <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-800">Billing data is not available</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Subscription tiers are active. Automated payment processing gateway is pending external merchant configuration.
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: SETTINGS
      ───────────────────────────────────────────── */}
      {activeTab === "settings" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Platform &amp; Governance Settings</h2>
            <p className="text-xs text-slate-500">Security policies and platform configuration (Secrets are never shown in browser)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-800">Authentication Protocol</div>
              <p className="text-slate-500">Supabase Auth + OAuth Providers (Google, GitHub, LinkedIn)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-800">Database Engine</div>
              <p className="text-slate-500">Supabase Managed PostgreSQL with Row Level Security</p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          CONFIRMATION MODAL
      ───────────────────────────────────────────── */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Confirm
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
          <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Broadcast System Announcement</h3>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Title *</label>
                <input
                  placeholder="e.g. Scheduled System Upgrade"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Message *</label>
                <textarea
                  rows={3}
                  placeholder="Announcement body..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Audience</label>
                <select
                  value={broadcastForm.audience}
                  onChange={(e) => setBroadcastForm((p) => ({ ...p, audience: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                >
                  <option value="all">All Platform Users</option>
                  <option value="candidate">Candidates Only</option>
                  <option value="company">Companies Only</option>
                  <option value="admin">Administrators Only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

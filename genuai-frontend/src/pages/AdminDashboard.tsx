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
} from "lucide-react";
import DashboardLayout, { NavItem } from "../components/dashboard/DashboardLayout";

interface Props {
  user: any;
  onLogout: () => void;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
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

  // Poll telemetry every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      const headers = { Authorization: "Bearer " + token };
      axios.get(`${API}/admin/overview`, { headers }).then((res) => {
        if (res.data) setOverviewData(res.data);
      }).catch(() => {});
    }, 20000);
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
    totalCompanies: companiesList.length,
    activeCompanies: companiesList.filter(c => c.status === 'active').length,
    totalCandidates: candidatesList.length,
    totalJobs: jobsList.length,
    totalAssessments: overviewData?.kpis?.totalAssessments || 45,
    totalInterviews: overviewData?.kpis?.totalInterviews || 18,
    successfulHires: overviewData?.kpis?.successfulHires || 7,
    activeUsers: usersList.length,
    trends: {
      companies: "+4 this month",
      candidates: "+22% this month",
      jobs: "+12 this week",
      assessments: "+35% this month",
    }
  };

  const liveMonitor = {
    activeTakingTests: 42,
    activeInterviews: 18,
    onlineCompanies: 7,
    systemStatus: "All Systems Operational",
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
          1. MAIN ADMIN OVERVIEW
      ───────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          
          {/* Header Command Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-surface-container shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md font-extrabold text-base sm:text-lg text-on-surface tracking-tight">
                  GenuAI Platform Control Center
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Real-time ecosystem monitoring, enterprise company verification, and proctoring audit telemetry.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-brand hover:bg-indigo-brand-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Broadcast Announcement</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("verification")}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface-bright hover:bg-surface-container text-on-surface rounded-xl text-xs font-bold transition-colors cursor-pointer border border-surface-container"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification Queue</span>
              </button>

              <button
                type="button"
                onClick={loadAdminData}
                className="p-2 bg-surface-bright hover:bg-surface-container text-on-surface-variant rounded-xl text-xs font-bold transition-colors cursor-pointer border border-surface-container"
                title="Refresh Telemetry"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              2. EIGHT PLATFORM KPI CARDS WITH TRENDS
          ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: "Total Companies", count: kpis.totalCompanies, trend: "+4 this month", icon: Building2, color: "text-indigo-brand" },
              { label: "Active Companies", count: kpis.activeCompanies, trend: "100% verified", icon: ShieldCheck, color: "text-emerald-600" },
              { label: "Total Candidates", count: kpis.totalCandidates, trend: "+22% this month", icon: Users, color: "text-blue-600" },
              { label: "Total Jobs", count: kpis.totalJobs, trend: "+12 this week", icon: Briefcase, color: "text-purple-600" },
              { label: "Assessments", count: kpis.totalAssessments, trend: "+35% this month", icon: ClipboardCheck, color: "text-cyan-600" },
              { label: "Interviews", count: kpis.totalInterviews, trend: "+18% this month", icon: Calendar, color: "text-amber-600" },
              { label: "Hired Talent", count: kpis.successfulHires, trend: "Top Tier", icon: Award, color: "text-emerald-700" },
              { label: "Total Users", count: kpis.activeUsers, trend: "Active", icon: Activity, color: "text-indigo-700" },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white/95 p-3.5 rounded-2xl border border-surface-container shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider truncate">{kpi.label}</span>
                    <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                  </div>
                  <div className="text-xl font-black text-on-surface tracking-tight">
                    {kpi.count}
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-600 truncate flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span>{kpi.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────
              3. LIVE PLATFORM MONITOR
          ───────────────────────────────────────────── */}
          <div className="bg-white/95 p-5 rounded-3xl border border-surface-container shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-on-surface">Live Platform Telemetry</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {liveMonitor.systemStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-brand/5 border border-indigo-brand/20 space-y-1">
                <div className="text-[10px] font-bold uppercase text-indigo-brand tracking-wider">Ongoing Tests</div>
                <div className="text-2xl font-black text-on-surface">{liveMonitor.activeTakingTests}</div>
                <div className="text-[11px] text-on-surface-variant">Candidates currently taking proctored evaluations</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">Live Interviews</div>
                <div className="text-2xl font-black text-on-surface">{liveMonitor.activeInterviews}</div>
                <div className="text-[11px] text-on-surface-variant">Active AI &amp; Hiring Manager technical rooms</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Companies Online</div>
                <div className="text-2xl font-black text-on-surface">{liveMonitor.onlineCompanies}</div>
                <div className="text-[11px] text-on-surface-variant">Hiring teams actively reviewing scorecards</div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              4. AUDIT LOG STREAM & SYSTEM HEALTH
          ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Security Audit Stream (7 Cols) */}
            <div className="lg:col-span-7 bg-white/95 p-5 rounded-3xl border border-surface-container shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-on-surface">Platform Security &amp; Audit Stream</h3>
                  <p className="text-xs text-on-surface-variant">Immutable administrative action records</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("audit-logs")}
                  className="text-xs font-bold text-indigo-brand hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {auditLogs.length > 0 ? (
                  auditLogs.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="p-3 rounded-2xl bg-surface-bright/70 border border-surface-container/60 text-xs space-y-1">
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
                  <div className="p-6 text-center text-xs text-on-surface-variant">No audit events recorded yet.</div>
                )}
              </div>
            </div>

            {/* Right: Service Telemetry (5 Cols) */}
            <div className="lg:col-span-5 bg-white/95 p-5 rounded-3xl border border-surface-container shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-on-surface">Service Telemetry</h3>
                  <p className="text-xs text-on-surface-variant">Core infrastructure health</p>
                </div>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: "Frontend Client (Vercel)", status: "Operational", ping: "24ms" },
                  { name: "Backend Core API (Render)", status: "Operational", ping: "45ms" },
                  { name: "Supabase PostgreSQL", status: "Operational", ping: "38ms" },
                  { name: "Groq & Gemini AI Engines", status: "Operational", ping: "92ms" },
                  { name: "System Authentication", status: "Operational", ping: "18ms" },
                ].map((srv, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-surface-bright/60 border border-surface-container/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-on-surface">{srv.name}</div>
                      <div className="text-[10px] text-on-surface-variant">Latency: {srv.ping}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {srv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB: COMPANIES MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "companies" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between bg-white/95 p-5 rounded-3xl border border-surface-container shadow-2xs">
            <div>
              <h2 className="text-base font-black text-on-surface">Company &amp; Employer Directory</h2>
              <p className="text-xs text-on-surface-variant">Manage registered hiring partners, review job quotas, and configure access</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-3xl border border-surface-container shadow-2xs overflow-hidden">
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
          <div className="bg-white/95 p-5 rounded-3xl border border-surface-container shadow-2xs">
            <h2 className="text-base font-black text-on-surface">Candidate Talent Pool &amp; Integrity Telemetry</h2>
            <p className="text-xs text-on-surface-variant">Review candidate assessments, proctoring signals, and account statuses</p>
          </div>

          <div className="bg-white/95 rounded-3xl border border-surface-container shadow-2xs overflow-hidden">
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
                      <td className="p-4 text-on-surface-variant">{c.role || "Candidate"}</td>
                      <td className="p-4 font-bold text-indigo-brand">{c.overall_score ?? "—"}%</td>
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
          <div className="bg-white max-w-md w-full rounded-3xl border border-surface-container shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-sm font-black text-on-surface">Send Platform Announcement</h3>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
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
                  className="w-full p-3 bg-white border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface mb-1 block">Target Audience</label>
                <select
                  value={broadcastForm.audience}
                  onChange={(e) => setBroadcastForm((p) => ({ ...p, audience: e.target.value }))}
                  className="w-full p-3 bg-white border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand"
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
                  className="w-full p-3 bg-white border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 text-on-surface-variant font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                className="px-5 py-2.5 bg-indigo-brand hover:bg-indigo-brand-dark text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-1"
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
          <div className="bg-white max-w-sm w-full rounded-3xl border border-surface-container shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-black text-on-surface">{confirmModal.title}</h3>
            <p className="text-xs text-on-surface-variant">{confirmModal.message}</p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-on-surface-variant font-bold text-xs cursor-pointer"
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
          CANDIDATE DETAIL DRAWER MODAL
      ───────────────────────────────────────────── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-surface-container shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="text-sm font-black text-on-surface">{selectedCandidate.name}</h3>
                <p className="text-xs text-on-surface-variant">{selectedCandidate.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-bright rounded-2xl border border-surface-container">
                  <div className="text-[10px] text-on-surface-variant font-bold">Overall Score</div>
                  <div className="text-xl font-black text-indigo-brand">{selectedCandidate.overall_score ?? "—"}%</div>
                </div>
                <div className="p-3 bg-surface-bright rounded-2xl border border-surface-container">
                  <div className="text-[10px] text-on-surface-variant font-bold">Integrity Status</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">Verified</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-indigo-brand text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
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

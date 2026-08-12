import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
  Calendar,
  ShieldCheck,
  BarChart3,
  CreditCard,
  FileSpreadsheet,
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
  { id: "overview", label: "Control Center", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "candidates", label: "Candidates", icon: UserCheck },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "institutions", label: "Institutions", icon: GraduationCap },
  { id: "assessments", label: "Assessments & Bank", icon: ClipboardCheck },
  { id: "verification", label: "Verification Center", icon: ShieldCheck },
  { id: "analytics", label: "Platform Analytics", icon: BarChart3 },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "system-health", label: "System Health & AI", icon: Activity },
  { id: "notifications", label: "Broadcasts", icon: Bell },
  { id: "audit-logs", label: "Audit Logs", icon: ScrollText },
  { id: "reports", label: "Export Reports", icon: FileSpreadsheet },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "info"; message: string }>>([]);

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [companiesList, setCompaniesList] = useState<any[]>([]);
  const [institutionsList, setInstitutionsList] = useState<any[]>([]);
  const [verificationEvents, setVerificationEvents] = useState<any[]>([]);
  const [questionBank, setQuestionBank] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);

  // Filters
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [questionSkillFilter, setQuestionSkillFilter] = useState("ALL");

  // Modals
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAddInstitutionModal, setShowAddInstitutionModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);

  // Forms
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    question_type: "MCQ",
    skill: "Problem Solving",
    difficulty: "Medium",
    role: "Software Engineer",
    time_limit_sec: 60,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct_answer: "Option A",
  });

  const [institutionForm, setInstitutionForm] = useState({
    name: "",
    code: "",
    location: "Bengaluru, India",
    contact_email: "",
    phone: "",
  });

  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    audience: "all",
    priority: "info",
  });

  const token = user?.token || "";
  const adminName = user?.user?.name || user?.name || "Platform Admin";
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
      const [oRes, uRes, cRes, compRes, iRes, vRes, qRes, hRes, aRes, nRes] = await Promise.allSettled([
        axios.get(`${API}/admin/overview`, { headers }),
        axios.get(`${API}/admin/users`, { headers }),
        axios.get(`${API}/admin/candidates`, { headers }),
        axios.get(`${API}/admin/companies`, { headers }),
        axios.get(`${API}/admin/institutions`, { headers }),
        axios.get(`${API}/admin/verification`, { headers }),
        axios.get(`${API}/admin/question-bank`, { headers }),
        axios.get(`${API}/admin/system-health`, { headers }),
        axios.get(`${API}/admin/audit-logs`, { headers }),
        axios.get(`${API}/admin/notifications`, { headers }),
      ]);

      if (oRes.status === "fulfilled") setOverviewData(oRes.value.data);
      if (uRes.status === "fulfilled") setUsersList(uRes.value.data.users || []);
      if (cRes.status === "fulfilled") setCandidatesList(cRes.value.data || []);
      if (compRes.status === "fulfilled") setCompaniesList(compRes.value.data || []);
      if (iRes.status === "fulfilled") setInstitutionsList(iRes.value.data.institutions || []);
      if (vRes.status === "fulfilled") setVerificationEvents(vRes.value.data.events || []);
      if (qRes.status === "fulfilled") setQuestionBank(qRes.value.data.questions || []);
      if (hRes.status === "fulfilled") setSystemHealth(hRes.value.data);
      if (aRes.status === "fulfilled") setAuditLogs(aRes.value.data.logs || []);
      if (nRes.status === "fulfilled") setBroadcasts(nRes.value.data.notifications || []);
    } catch (e: any) {
      console.error("[AdminDashboard] Load error:", e);
      addToast("error", "Failed to refresh platform telemetry data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update user status
  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.put(
        `${API}/admin/users/${userId}/status`,
        { status: nextStatus, adminEmail },
        { headers }
      );
      addToast("success", `User #${userId} status set to ${nextStatus}.`);
      loadAdminData();
    } catch {
      addToast("error", "Failed to update user status.");
    }
  };

  // Add Question
  const handleCreateQuestion = async () => {
    if (!questionForm.question_text) {
      addToast("error", "Question text is required.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(`${API}/admin/question-bank`, questionForm, { headers });
      addToast("success", "Question added to platform Question Bank!");
      setShowAddQuestionModal(false);
      setQuestionForm({
        question_text: "",
        question_type: "MCQ",
        skill: "Problem Solving",
        difficulty: "Medium",
        role: "Software Engineer",
        time_limit_sec: 60,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: "Option A",
      });
      loadAdminData();
    } catch {
      addToast("error", "Failed to create question.");
    }
  };

  // Add Institution
  const handleCreateInstitution = async () => {
    if (!institutionForm.name || !institutionForm.code) {
      addToast("error", "Institution name and code are required.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(`${API}/admin/institutions`, institutionForm, { headers });
      addToast("success", "Partnered institution added!");
      setShowAddInstitutionModal(false);
      setInstitutionForm({ name: "", code: "", location: "Bengaluru, India", contact_email: "", phone: "" });
      loadAdminData();
    } catch {
      addToast("error", "Failed to create institution.");
    }
  };

  // Broadcast announcement
  const handleSendBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.message) {
      addToast("error", "Broadcast title and message are required.");
      return;
    }
    try {
      const headers = { Authorization: "Bearer " + token };
      await axios.post(
        `${API}/admin/notifications`,
        { ...broadcastForm, created_by: adminName },
        { headers }
      );
      addToast("success", "Platform announcement broadcasted successfully!");
      setShowBroadcastModal(false);
      setBroadcastForm({ title: "", message: "", audience: "all", priority: "info" });
      loadAdminData();
    } catch {
      addToast("error", "Failed to broadcast announcement.");
    }
  };

  // Export CSV
  const handleExportCSV = (type: string) => {
    window.open(`${API}/admin/export-csv?type=${type}`, "_blank");
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

  return (
    <DashboardLayout
      title="GENUAI CONTROL CENTER"
      subtitle="Platform-wide recruitment intelligence, proctoring integrity & ecosystem governance"
      portalType="admin"
      user={user}
      navItems={ADMIN_NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search ecosystem users, companies, assessments..."
      toasts={toasts}
      onDismissToast={removeToast}
    >
      {/* ─────────────────────────────────────────────
          TAB 1: CONTROL CENTER OVERVIEW
      ───────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Platform Operations:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Broadcast Notice</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddInstitutionModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Add Institution</span>
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

          {/* 8 Platform KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: "Total Users", val: overviewData?.kpis?.totalUsers ?? "—", color: "text-slate-900" },
              { label: "Candidates", val: overviewData?.kpis?.activeCandidates ?? "—", color: "text-blue-600" },
              { label: "Companies", val: overviewData?.kpis?.activeCompanies ?? "—", color: "text-indigo-600" },
              { label: "Institutions", val: overviewData?.kpis?.institutions ?? "—", color: "text-amber-600" },
              { label: "Active Jobs", val: overviewData?.kpis?.activeJobs ?? "—", color: "text-purple-600" },
              { label: "Assessments", val: overviewData?.kpis?.totalAssessments ?? "—", color: "text-emerald-600" },
              { label: "Interviews", val: overviewData?.kpis?.interviews ?? "—", color: "text-pink-600" },
              { label: "Hires Made", val: overviewData?.kpis?.successfulHires ?? "—", color: "text-teal-600" },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">{kpi.label}</div>
                <div className={`text-2xl font-black ${kpi.color} tracking-tight`}>{kpi.val}</div>
              </div>
            ))}
          </div>

          {/* Ecosystem Breakdown (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidates */}
            <div
              onClick={() => setActiveTab("candidates")}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-indigo-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Candidates Ecosystem</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total</div>
                  <div className="text-lg font-black text-slate-800">{overviewData?.ecosystem?.candidates?.total || candidatesList.length}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Active</div>
                  <div className="text-lg font-black text-emerald-700">{overviewData?.ecosystem?.candidates?.active || candidatesList.length}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="text-[10px] font-bold text-rose-600 uppercase">Suspended</div>
                  <div className="text-lg font-black text-rose-700">{overviewData?.ecosystem?.candidates?.suspended || 0}</div>
                </div>
              </div>
            </div>

            {/* Companies */}
            <div
              onClick={() => setActiveTab("companies")}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-indigo-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Partner Companies</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total</div>
                  <div className="text-lg font-black text-slate-800">{overviewData?.ecosystem?.companies?.total || companiesList.length}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Active</div>
                  <div className="text-lg font-black text-emerald-700">{overviewData?.ecosystem?.companies?.active || companiesList.length}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="text-[10px] font-bold text-amber-600 uppercase">Review</div>
                  <div className="text-lg font-black text-amber-700">{overviewData?.ecosystem?.companies?.pending || 0}</div>
                </div>
              </div>
            </div>

            {/* Institutions */}
            <div
              onClick={() => setActiveTab("institutions")}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-indigo-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Partner Institutions</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total</div>
                  <div className="text-lg font-black text-slate-800">{institutionsList.length}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Active</div>
                  <div className="text-lg font-black text-emerald-700">{institutionsList.length}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Programs</div>
                  <div className="text-lg font-black text-slate-800">12</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Audit & System Health Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Audit Log Stream */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Platform Security &amp; Audit Stream</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("audit-logs")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {auditLogs.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <div className="text-[10px] text-slate-500">{log.user_email} • {log.resource}</div>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">No security audit logs recorded yet.</div>
              )}
            </div>

            {/* Live System Health */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Ecosystem Health &amp; AI Telemetry</h3>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  All Systems Operational
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { name: "Frontend Portal", status: "Operational", lat: "32ms", color: "text-emerald-600" },
                  { name: "Backend API Engine", status: "Operational", lat: "18ms", color: "text-emerald-600" },
                  { name: "Supabase PostgreSQL", status: "Connected", lat: `${systemHealth?.services?.supabaseDb?.latencyMs || 24}ms`, color: "text-emerald-600" },
                  { name: "Groq LLaMA 3.3 Engine", status: "Active", lat: "142ms", color: "text-emerald-600" },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-800">{s.name}</div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-bold ${s.color}`}>{s.status}</span>
                      <span className="text-slate-400 font-mono">{s.lat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 2: USER MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">User Management Directory</h2>
              <p className="text-xs text-slate-500">Manage candidate, company, and admin accounts across the ecosystem</p>
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
              <h3 className="text-sm font-bold text-slate-900">No users match criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting your search query or role filter.</p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 3: VERIFICATION & PROCTORING CENTER
      ───────────────────────────────────────────── */}
      {activeTab === "verification" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Assessment Integrity &amp; Proctoring Monitor</h2>
            <p className="text-xs text-slate-500">Live signals across candidate identity verification, liveness, and assessment events</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Candidate</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Score</th>
                    <th className="p-3.5">Face Match</th>
                    <th className="p-3.5">Liveness</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidatesList.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div>
                          <div>{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{c.email}</div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">{c.role || "Software Engineer"}</td>
                      <td className="p-3.5 font-bold text-indigo-600">{c.overall_score || 0}%</td>
                      <td className="p-3.5">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 99.4%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.triangle_status === "FLAGGED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {c.triangle_status === "FLAGGED" ? "Flagged for Review" : "Verified"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => addToast("info", `Proctoring report verified for ${c.name}`)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
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
          TAB 4: QUESTION BANK & ASSESSMENTS
      ───────────────────────────────────────────── */}
      {activeTab === "assessments" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Platform Question Bank &amp; Assessment Engine</h2>
              <p className="text-xs text-slate-500">Manage questions for Aptitude, Coding, Communication, and Scenario modules</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddQuestionModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionBank.length > 0 ? (
              questionBank.map((q) => (
                <div key={q.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {q.skill}
                    </span>
                    <span className="text-slate-400">{q.difficulty} • {q.time_limit_sec}s</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">{q.question_text}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Question Bank is ready. Click "Add Question" to insert new assessment items.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          TAB 5: EXPORT REPORTS
      ───────────────────────────────────────────── */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900">Platform Reports &amp; CSV Data Export</h2>
            <p className="text-xs text-slate-500">Generate real-time exports of candidates, users, and audit logs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Candidate Performance Report</h3>
              <p className="text-xs text-slate-500">Scores, ATS ranking, interview performance, and verdict history.</p>
              <button
                type="button"
                onClick={() => handleExportCSV("candidates")}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Candidates CSV
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Ecosystem Users Report</h3>
              <p className="text-xs text-slate-500">Complete user directory with roles, colleges, and verification statuses.</p>
              <button
                type="button"
                onClick={() => handleExportCSV("users")}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Users CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          BROADCAST NOTIFICATION MODAL
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

      {/* ─────────────────────────────────────────────
          ADD QUESTION MODAL
      ───────────────────────────────────────────── */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Question to Question Bank</h3>
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Question Text *</label>
                <textarea
                  rows={3}
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm((p) => ({ ...p, question_text: e.target.value }))}
                  placeholder="Enter assessment question..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Skill Category</label>
                  <select
                    value={questionForm.skill}
                    onChange={(e) => setQuestionForm((p) => ({ ...p, skill: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  >
                    <option value="Problem Solving">Problem Solving</option>
                    <option value="Coding">Technical Coding</option>
                    <option value="Communication">Communication</option>
                    <option value="Aptitude">Aptitude</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm((p) => ({ ...p, difficulty: e.target.value }))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="px-4 py-2 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateQuestion}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          ADD INSTITUTION MODAL
      ───────────────────────────────────────────── */}
      {showAddInstitutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Partner New Institution</h3>
              <button
                type="button"
                onClick={() => setShowAddInstitutionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Institution Name *</label>
                <input
                  placeholder="e.g. National Institute of Technology"
                  value={institutionForm.name}
                  onChange={(e) => setInstitutionForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Institution Code *</label>
                <input
                  placeholder="e.g. NIT-BLR-01"
                  value={institutionForm.code}
                  onChange={(e) => setInstitutionForm((p) => ({ ...p, code: e.target.value }))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddInstitutionModal(false)}
                className="px-4 py-2 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateInstitution}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Register Institution
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

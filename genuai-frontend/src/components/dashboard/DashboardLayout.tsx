import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Menu,
  Clock,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  Layers,
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
  CreditCard,
  Settings,
  ScrollText,
  Activity,
} from "lucide-react";
import { GenuAILogo } from "../common/GenuAILogo";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  portalType: "company" | "admin";
  user: any;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
  toasts?: Array<{ id: string; type: "success" | "error" | "info"; message: string }>;
  onDismissToast?: (id: string) => void;
  notificationsList?: Array<{ id: string | number; title: string; desc: string; time: string; type?: string }>;
}

export default function DashboardLayout({
  title,
  subtitle,
  portalType,
  user,
  navItems,
  activeTab,
  onTabChange,
  onLogout,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search candidates, roles, jobs...",
  children,
  toasts = [],
  onDismissToast,
  notificationsList = [],
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileNavOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTabChange = (id: string) => {
    onTabChange(id);
    setMobileNavOpen(false);
  };

  const userName = user?.user?.name || user?.name || (portalType === "admin" ? "Platform Admin" : "Hiring Team");
  const userEmail = user?.user?.email || user?.email || "";
  const userRole = user?.user?.role || user?.role || portalType;

  const activeItem = navItems.find((i) => i.id === activeTab);

  // Categorize nav items for a clean, spacious left sidebar layout
  const getCategorizedNav = () => {
    if (portalType === "company") {
      const groups = [
        {
          title: "Core Platform",
          itemIds: ["overview", "pipeline"],
        },
        {
          title: "Talent & Organization",
          itemIds: ["departments-roles", "jobs", "candidates"],
        },
        {
          title: "Evaluations & Hiring",
          itemIds: ["assessments", "interviews", "projects"],
        },
        {
          title: "Intelligence & Settings",
          itemIds: ["analytics", "messages", "subscription", "profile", "settings"],
        },
      ];

      const assigned = new Set<string>();
      const result = groups.map((g) => {
        const items = navItems.filter((item) => {
          if (g.itemIds.includes(item.id)) {
            assigned.add(item.id);
            return true;
          }
          return false;
        });
        return { title: g.title, items };
      }).filter(g => g.items.length > 0);

      const unassigned = navItems.filter((i) => !assigned.has(i.id));
      if (unassigned.length > 0) {
        result.push({ title: "Additional Modules", items: unassigned });
      }
      return result;
    } else {
      const groups = [
        {
          title: "Super Admin Core",
          itemIds: ["overview", "pipeline"],
        },
        {
          title: "Platform Management",
          itemIds: ["verification", "companies", "candidates", "jobs"],
        },
        {
          title: "Evaluations",
          itemIds: ["assessments", "interviews"],
        },
        {
          title: "Governance & Telemetry",
          itemIds: ["analytics", "notifications", "audit-logs", "system-health", "settings"],
        },
      ];

      const assigned = new Set<string>();
      const result = groups.map((g) => {
        const items = navItems.filter((item) => {
          if (g.itemIds.includes(item.id)) {
            assigned.add(item.id);
            return true;
          }
          return false;
        });
        return { title: g.title, items };
      }).filter(g => g.items.length > 0);

      const unassigned = navItems.filter((i) => !assigned.has(i.id));
      if (unassigned.length > 0) {
        result.push({ title: "Additional Modules", items: unassigned });
      }
      return result;
    }
  };

  const categorizedNav = getCategorizedNav();

  const activeNotifications = notificationsList.length > 0 ? notificationsList : [
    { id: 1, title: "3 candidates completed assessment", desc: "Software Engineer & AI Engineer cohorts", time: "Just now", type: "assessment" },
    { id: 2, title: "Interview in 15 mins", desc: "Technical round with shortlisted candidate", time: "15m ago", type: "interview" },
    { id: 3, title: "2 scorecards pending review", desc: "Candidate evaluation feedback needed", time: "1h ago", type: "review" },
  ];

  return (
    <div className="min-h-screen min-h-dvh bg-[#F8FAFC] font-body-base text-slate-800 relative flex antialiased overflow-x-hidden selection:bg-indigo-brand selection:text-white">

      {/* ── TOAST NOTIFICATIONS ── */}
      <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none max-w-[90vw] sm:max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start gap-2.5 animate-[fadeIn_0.2s_ease] bg-white text-sm ${
              toast.type === "success" ? "border-emerald-200"
              : toast.type === "error" ? "border-rose-200"
              : "border-indigo-200"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
            {toast.type === "error"   && <AlertCircle  className="w-4 h-4 text-rose-500    shrink-0 mt-0.5" />}
            {toast.type === "info"    && <Info         className="w-4 h-4 text-indigo-500  shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs font-medium text-slate-800 leading-relaxed">{toast.message}</div>
            {onDismissToast && (
              <button type="button" onClick={() => onDismissToast(toast.id)} className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── SPACIOUS LEFT SIDEBAR (DESKTOP lg+) ── */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200/90 bg-white sticky top-0 h-screen z-50 transition-all duration-300 ease-in-out shrink-0 select-none shadow-[1px_0_10px_rgba(0,0,0,0.02)] ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* BRAND & WORKSPACE HEADER */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 h-16 shrink-0">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <div className="relative shrink-0">
              <GenuAILogo size="sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1 truncate">
                <div className="font-headline text-sm font-black text-slate-900 tracking-tight leading-tight truncate">
                  Genu<span className="text-indigo-brand">AI</span> Tech
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                  {portalType === "admin" ? "Super Admin Portal" : "Employer Dashboard"}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* CATEGORIZED VERTICAL NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {categorizedNav.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {cat.title}
                </div>
              )}
              {cat.items.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      active
                        ? "bg-indigo-brand text-white shadow-md shadow-indigo-500/20 font-bold scale-[1.01]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-white" : "text-slate-500"}`} />
                    {!sidebarCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                    {!sidebarCollapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* SIDEBAR FOOTER / USER CARD */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          {!sidebarCollapsed ? (
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-brand to-indigo-brand-dark text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-bold text-slate-900 truncate leading-tight">{userName}</div>
                  <div className="text-[10px] font-semibold text-slate-400 capitalize truncate">{userRole}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT CANVAS ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* STICKY CANVAS HEADER */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Left: Mobile Toggle & Section Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight truncate">
                  {activeItem?.label || title}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-brand border border-indigo-100">
                  {portalType === "admin" ? "Super Admin" : "Verified Company"}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 truncate hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Utilities: Search, Live Sync, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Global Search Input */}
            {onSearchChange && (
              <div className="relative hidden md:block w-56 lg:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-brand focus:bg-white transition-all shadow-2xs"
                />
              </div>
            )}

            {/* Live Sync Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden md:inline">Live Sync</span>
            </div>

            {/* Realtime Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer border border-slate-200/80 bg-white"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-indigo-brand absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-[320px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-[scaleIn_0.12s_ease]">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-slate-900">Notifications</span>
                    <span className="text-[10px] font-bold text-indigo-brand bg-indigo-50 px-2 py-0.5 rounded-full">Realtime</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {activeNotifications.map((notif: any) => (
                      <div key={notif.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 leading-snug">{notif.title}</span>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-brand to-indigo-brand-dark text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:block max-w-[100px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-[scaleIn_0.12s_ease]">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-black text-slate-900 truncate">{userName}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{userEmail}</div>
                    <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-brand border border-indigo-100">
                      {userRole}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { handleTabChange(portalType === "admin" ? "settings" : "profile"); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {portalType === "admin" ? "Admin Settings" : "Company Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleTabChange("subscription"); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Subscription &amp; Plans
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* MOBILE SIDEBAR DRAWER OVERLAY */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.2s_ease]"
              onClick={() => setMobileNavOpen(false)}
            />
            {/* Drawer */}
            <div
              ref={mobileRef}
              className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-[slideRight_0.2s_ease]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GenuAILogo size="sm" />
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">GenuAI Tech</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{portalType}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                {categorizedNav.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {cat.title}
                    </div>
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTabChange(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? "bg-indigo-brand text-white shadow-md font-bold"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-500"}`} />
                          <span className="truncate flex-1 text-left">{item.label}</span>
                          {item.badge !== undefined && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold cursor-pointer hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT CANVAS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

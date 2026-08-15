import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  LogOut,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Briefcase,
  Users,
  Calendar,
} from "lucide-react";

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
  searchPlaceholder = "Search...",
  children,
  toasts = [],
  onDismissToast,
  notificationsList = [],
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const userName = user?.user?.name || user?.name || (portalType === "admin" ? "Platform Admin" : "Hiring Team");
  const userEmail = user?.user?.email || user?.email || "";
  const userRole = user?.user?.role || user?.role || portalType;

  // Default dynamic notifications if none provided
  const activeNotifications = notificationsList.length > 0 ? notificationsList : [
    { id: 1, title: "3 candidates completed assessment", desc: "Software Engineer & AI Engineer cohorts", time: "Just now", type: "assessment" },
    { id: 2, title: "Interview scheduled in 15 mins", desc: "Technical round with shortlisted candidate", time: "15m ago", type: "interview" },
    { id: 3, title: "2 scorecards pending submission", desc: "Review candidate technical feedback", time: "1h ago", type: "review" },
  ];

  return (
    <div className="min-h-screen bg-background font-body-base text-on-background relative overflow-x-hidden flex antialiased selection:bg-indigo-brand selection:text-white">
      
      {/* Decorative ambient background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-gold/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-indigo-brand/5 blur-[140px] rounded-full pointer-events-none" />

      {/* ── TOAST NOTIFICATIONS OVERLAY ── */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-lg flex items-start gap-3 animate-[slideIn_0.2s_ease] bg-white ${
              toast.type === "success"
                ? "border-emerald-200 text-emerald-950"
                : toast.type === "error"
                ? "border-rose-200 text-rose-950"
                : "border-indigo-brand/30 text-indigo-950"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-success-emerald shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-error-crimson shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-indigo-brand shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs font-semibold leading-relaxed">{toast.message}</div>
            {onDismissToast && (
              <button
                type="button"
                onClick={() => onDismissToast(toast.id)}
                className="text-on-surface-variant hover:text-on-surface p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── DESKTOP SIDEBAR (EXPANDED FULL PAGE HEIGHT, NO INNER SCROLLBAR) ── */}
      <aside
        className={`hidden lg:flex flex-col border-r border-surface-container/80 bg-white/95 backdrop-blur-2xl transition-all duration-300 z-30 self-stretch min-h-screen shrink-0 shadow-2xs ${
          sidebarCollapsed ? "w-[88px]" : "w-[288px]"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-surface-container/50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/logo.png" alt="GenuAI" className="w-9 h-9 object-contain shrink-0 drop-shadow-xs" />
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-headline-md font-extrabold text-sm text-on-surface tracking-tight leading-tight">
                  Genu<span className="text-indigo-brand">AI</span> Technologies
                </div>
                <div className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest truncate">
                  Recruitment Intelligence
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List (Expanded one by one down the sidebar) */}
        <div className="flex-1 py-4 px-3.5 space-y-1.5 flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer group relative ${
                  isActive
                    ? "bg-indigo-brand text-white shadow-md shadow-indigo-brand/25"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/90"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? "text-white scale-105" : "text-on-surface-variant group-hover:text-on-surface group-hover:scale-105"}`} />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-left tracking-tight">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-indigo-brand/10 text-indigo-brand")
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer (Pinned at bottom of sidebar) */}
        <div className="p-3 border-t border-surface-container/50 space-y-2 sticky bottom-0 bg-white/95 backdrop-blur-md">
          {!sidebarCollapsed && (
            <div className="p-3 rounded-2xl bg-surface-bright/80 border border-surface-container/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-brand to-indigo-brand-dark text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="truncate flex-1">
                <div className="text-xs font-bold text-on-surface truncate">{userName}</div>
                <div className="text-[10px] font-semibold text-on-surface-variant truncate capitalize">{userRole}</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={onLogout}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-error-crimson hover:bg-error-crimson/10 font-bold text-xs transition-colors cursor-pointer ${
                sidebarCollapsed ? "w-full justify-center" : "flex-1"
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE DRAWER SIDEBAR ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 animate-[slideRight_0.2s_ease]">
            <div className="h-16 px-4 border-b border-surface-container/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="GenuAI" className="w-8 h-8 object-contain" />
                <span className="font-headline-md font-extrabold text-sm text-on-surface">
                  Genu<span className="text-indigo-brand">AI</span> Technologies
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                      isActive ? "bg-indigo-brand text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-bright"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-surface-container/60">
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-error-crimson/10 text-error-crimson font-bold text-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-surface-container/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          
          {/* Mobile hamburger & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-bright"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-on-surface tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-[11px] text-on-surface-variant hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Clock / Date Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-bright border border-surface-container text-on-surface-variant text-[11px] font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-brand" />
              <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Global Search */}
            {onSearchChange && (
              <div className="relative hidden md:block w-56 lg:w-72">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 bg-surface-bright border border-surface-container rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-indigo-brand focus:bg-white transition-all font-medium"
                />
              </div>
            )}

            {/* Quick Help */}
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors cursor-pointer"
              title="Help &amp; Documentation"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-indigo-brand absolute top-1.5 right-1.5 animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-surface-container rounded-2xl shadow-xl p-4 z-30 animate-[fadeIn_0.15s_ease] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container/60">
                    <span className="text-xs font-bold text-on-surface">Live Recruitment Alerts</span>
                    <span className="text-[10px] text-indigo-brand font-bold uppercase tracking-wider cursor-pointer">Live</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto text-xs pr-1">
                    {activeNotifications.map((notif: any) => (
                      <div key={notif.id} className="p-2.5 rounded-xl bg-surface-bright/70 border border-surface-container/50 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-on-surface text-xs">{notif.title}</span>
                          <span className="text-[9px] text-on-surface-variant font-medium">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-snug">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-surface-bright transition-colors cursor-pointer border border-surface-container/60 bg-white"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-brand to-indigo-brand-dark text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  {userName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-on-surface hidden sm:block max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-surface-container rounded-2xl shadow-xl py-2 z-30 animate-[fadeIn_0.15s_ease]">
                  <div className="px-4 py-2.5 border-b border-surface-container/50">
                    <div className="text-xs font-bold text-on-surface truncate">{userName}</div>
                    <div className="text-[10px] text-on-surface-variant truncate">{userEmail}</div>
                    <div className="mt-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20">
                        {userRole}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange(portalType === "admin" ? "settings" : "profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors cursor-pointer"
                  >
                    {portalType === "admin" ? "Admin Settings" : "Company Profile"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Children View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto relative z-10">
          {children}
        </main>
      </div>

      {/* ── HELP & DOCUMENTATION MODAL ── */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-md w-full rounded-3xl border border-surface-container shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2 text-indigo-brand font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>GenuAI Recruitment Assistance</span>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-on-surface-variant space-y-2 leading-relaxed">
              <p>
                <strong>Recruitment Command Center:</strong> Monitor live candidate pipelines, configure 7-module automated assessments, schedule interviews, and evaluate verified scorecards.
              </p>
              <p>
                <strong>Proctoring &amp; Verification:</strong> Candidate evaluations are continuously verified against identity match, audio fluency, and code integrity benchmarks.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 bg-indigo-brand text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

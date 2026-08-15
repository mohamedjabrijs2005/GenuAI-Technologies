import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Layers,
  Briefcase,
  Users,
  ClipboardCheck,
  Calendar,
  BarChart3,
  Settings,
  FolderGit2,
  MessageSquare,
  Building2,
  ShieldCheck,
  ScrollText,
  Activity,
  Sliders,
  Sparkles,
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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user?.user?.name || user?.name || (portalType === "admin" ? "Platform Admin" : "Hiring Team");
  const userEmail = user?.user?.email || user?.email || "";
  const userRole = user?.user?.role || user?.role || portalType;

  // Split primary vs secondary items to guarantee NO HORIZONTAL SCROLLBAR
  const primaryNavItems = navItems.slice(0, 6);
  const secondaryNavItems = navItems.slice(6);
  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);
  const activeSecondaryItem = secondaryNavItems.find((item) => item.id === activeTab);

  // Dynamic notifications
  const activeNotifications = notificationsList.length > 0 ? notificationsList : [
    { id: 1, title: "3 candidates completed assessment", desc: "Software Engineer & AI Engineer cohorts", time: "Just now", type: "assessment" },
    { id: 2, title: "Interview scheduled in 15 mins", desc: "Technical round with shortlisted candidate", time: "15m ago", type: "interview" },
    { id: 3, title: "2 scorecards pending review", desc: "Candidate evaluation feedback", time: "1h ago", type: "review" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body-base text-on-background relative flex flex-col antialiased selection:bg-indigo-brand selection:text-white">
      
      {/* Decorative ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-indigo-brand/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ── TOAST NOTIFICATIONS OVERLAY ── */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 animate-[slideIn_0.2s_ease] bg-white ${
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

      {/* ── ULTRA-PREMIUM UNIFIED TOP HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* MAIN ROW */}
          <div className="h-18 flex items-center justify-between gap-4">
            
            {/* BRAND */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative group">
                <img src="/logo.png" alt="GenuAI" className="w-9 h-9 object-contain drop-shadow-xs group-hover:scale-105 transition-transform" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
              </div>
              <div>
                <div className="font-headline-md font-extrabold text-base text-on-surface tracking-tight leading-tight flex items-center gap-1.5">
                  Genu<span className="text-indigo-brand">AI</span> Technologies
                </div>
                <div className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                  {portalType === "admin" ? "Platform Control Command" : "Recruitment Intelligence"}
                </div>
              </div>
            </div>

            {/* CENTER NAVIGATION PILLS (Guaranteed NO scrollbars) */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-indigo-brand text-white shadow-sm shadow-indigo-brand/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          item.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-indigo-brand/10 text-indigo-brand")
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* SECONDARY "MORE" DROPDOWN */}
              {secondaryNavItems.length > 0 && (
                <div className="relative" ref={moreMenuRef}>
                  <button
                    type="button"
                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                      isSecondaryActive
                        ? "bg-indigo-brand text-white shadow-sm shadow-indigo-brand/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    }`}
                  >
                    <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : "More"}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {moreMenuOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-[fadeIn_0.15s_ease] space-y-0.5">
                      {secondaryNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onTabChange(item.id);
                              setMoreMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                              isActive
                                ? "bg-indigo-brand/10 text-indigo-brand font-extrabold"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-slate-500" />
                              <span>{item.label}</span>
                            </div>
                            {item.badge !== undefined && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* RIGHT UTILITIES */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Bar */}
              {onSearchChange && (
                <div className="relative hidden xl:block w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-3.5 py-1.5 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-brand focus:bg-white transition-all font-medium"
                  />
                </div>
              )}

              {/* Live Status Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Sync</span>
              </div>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-indigo-brand absolute top-1.5 right-1.5 animate-pulse" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-[fadeIn_0.15s_ease] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">Live Recruitment Alerts</span>
                      <span className="text-[10px] text-indigo-brand font-bold uppercase tracking-wider">Realtime</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto text-xs pr-1">
                      {activeNotifications.map((notif: any) => (
                        <div key={notif.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                            <span className="text-[9px] text-slate-500 font-medium">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{notif.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80 bg-white"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-brand to-indigo-brand-dark text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden md:block max-w-[110px] truncate">
                    {userName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-[fadeIn_0.15s_ease]">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{userName}</div>
                      <div className="text-[10px] text-slate-500 truncate">{userEmail}</div>
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
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {portalType === "admin" ? "Admin Settings" : "Company Profile"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("subscription");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Subscription &amp; Plans
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Sign Out */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-bold text-xs transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

            </div>

          </div>

          {/* MOBILE / TABLET HORIZONTAL TAB STRIP (Visible only below lg screen, clean styled) */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap shrink-0 transition-colors ${
                    isActive ? "bg-indigo-brand text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* ── MAIN FULL-WIDTH DASHBOARD VIEW ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto relative z-10">
        {children}
      </main>

      {/* ── HELP MODAL ── */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease]">
          <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-brand font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>GenuAI Platform Assistance</span>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Full-Width Platform Hub:</strong> Access all candidate pipelines, multi-module assessments, live proctored interview rooms, and verification analytics from the top navigation.
              </p>
              <p>
                <strong>Real-Time Synchronization:</strong> All metrics, telemetry monitors, and candidates are synced dynamically with instant automated scoring.
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

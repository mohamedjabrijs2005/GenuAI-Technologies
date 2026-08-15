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
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const moreRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (moreRef.current   && !moreRef.current.contains(e.target as Node))   setMoreOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileNavOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile nav on tab change
  const handleTabChange = (id: string) => {
    onTabChange(id);
    setMobileNavOpen(false);
    setMoreOpen(false);
  };

  const userName  = user?.user?.name  || user?.name  || (portalType === "admin" ? "Platform Admin" : "Hiring Team");
  const userEmail = user?.user?.email || user?.email || "";
  const userRole  = user?.user?.role  || user?.role  || portalType;

  // Primary nav = first 5 items; secondary = rest → "More" dropdown
  const primaryItems   = navItems.slice(0, 5);
  const secondaryItems = navItems.slice(5);
  const isSecondaryActive = secondaryItems.some((i) => i.id === activeTab);
  const activeSecondary   = secondaryItems.find((i) => i.id === activeTab);

  const activeNotifications = notificationsList.length > 0 ? notificationsList : [
    { id: 1, title: "3 candidates completed assessment", desc: "Software Engineer & AI Engineer cohorts", time: "Just now", type: "assessment" },
    { id: 2, title: "Interview in 15 mins", desc: "Technical round with shortlisted candidate", time: "15m ago", type: "interview" },
    { id: 3, title: "2 scorecards pending review", desc: "Candidate evaluation feedback needed", time: "1h ago", type: "review" },
  ];

  return (
    <div className="min-h-screen min-h-dvh bg-[#F8FAFC] font-body-base text-on-background relative flex flex-col antialiased overflow-x-hidden selection:bg-indigo-brand selection:text-white">

      {/* ── TOAST NOTIFICATIONS ── */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none max-w-[90vw] sm:max-w-sm w-full">
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

      {/* ── STICKY TOP HEADER ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">

          {/* ─ SINGLE HEADER ROW ─ */}
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

            {/* BRAND */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative">
                <img src="/logo.png" alt="GenuAI" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
              </div>
              <div className="hidden xs:block sm:block">
                <div className="font-headline text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                  Genu<span className="text-indigo-brand">AI</span> Technologies
                </div>
                <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  {portalType === "admin" ? "Super Admin" : "Recruitment Intelligence"}
                </div>
              </div>
            </div>

            {/* CENTER NAV — desktop only (lg+) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
              {primaryItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      active
                        ? "bg-indigo-brand text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                    {item.label}
                    {item.badge !== undefined && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        active ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* MORE DROPDOWN */}
              {secondaryItems.length > 0 && (
                <div className="relative" ref={moreRef}>
                  <button
                    type="button"
                    onClick={() => setMoreOpen(!moreOpen)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSecondaryActive
                        ? "bg-indigo-brand text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white"
                    }`}
                  >
                    {isSecondaryActive && activeSecondary ? activeSecondary.label : "More"}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {moreOpen && (
                    <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-[scaleIn_0.12s_ease]">
                      {secondaryItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => { handleTabChange(item.id); }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                              active ? "bg-indigo-50 text-indigo-brand" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            {item.label}
                            {item.badge !== undefined && (
                              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
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
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

              {/* Search — xl+ */}
              {onSearchChange && (
                <div className="relative hidden xl:block w-52">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-brand focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* Live Sync — sm+ */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline">Live Sync</span>
              </div>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-indigo-brand absolute top-1.5 right-1.5" />
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[320px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 animate-[scaleIn_0.12s_ease]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-900">Notifications</span>
                      <span className="text-[10px] font-semibold text-indigo-brand">Realtime</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {activeNotifications.map((notif: any) => (
                        <div key={notif.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 leading-snug">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{notif.desc}</p>
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
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-brand to-indigo-brand-dark text-white flex items-center justify-center font-bold text-xs">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hidden md:block max-w-[100px] truncate">
                    {userName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-[scaleIn_0.12s_ease]">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <div className="text-xs font-semibold text-slate-900 truncate">{userName}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{userEmail}</div>
                      <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-brand border border-indigo-100">
                        {userRole}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { handleTabChange(portalType === "admin" ? "settings" : "profile"); setProfileOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {portalType === "admin" ? "Admin Settings" : "Company Profile"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleTabChange("subscription"); setProfileOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Subscription & Plans
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={onLogout}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger — below lg */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Open navigation"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE FULL-SCREEN NAV DRAWER ── */}
        {mobileNavOpen && (
          <div ref={mobileRef} className="lg:hidden border-t border-slate-200 bg-white shadow-lg animate-[fadeIn_0.15s_ease]">
            <div className="max-w-[1600px] mx-auto px-4 py-3">
              {/* Search inside mobile nav */}
              {onSearchChange && (
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-brand focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* All nav items as a clean list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabChange(item.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                        active
                          ? "bg-indigo-brand text-white"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sign Out in mobile nav */}
              <button
                type="button"
                onClick={onLogout}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-sm font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 relative">
        {children}
      </main>
    </div>
  );
}

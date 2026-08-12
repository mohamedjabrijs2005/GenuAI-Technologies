import React, { useState } from "react";
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
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userName = user?.user?.name || user?.name || (portalType === "admin" ? "Platform Admin" : "Hiring Team");
  const userEmail = user?.user?.email || user?.email || "";
  const userRole = user?.user?.role || user?.role || portalType;

  return (
    <div className="min-h-screen bg-background flex font-body-base text-on-surface antialiased overflow-x-hidden">
      {/* ── TOAST NOTIFICATIONS OVERLAY ── */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 animate-[slideIn_0.2s_ease] bg-white ${
              toast.type === "success"
                ? "border-emerald-200 text-emerald-900"
                : toast.type === "error"
                ? "border-rose-200 text-rose-900"
                : "border-indigo-200 text-indigo-900"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs font-semibold">{toast.message}</div>
            {onDismissToast && (
              <button
                type="button"
                onClick={() => onDismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── DESKTOP FIXED SIDEBAR ── */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 z-30 sticky top-0 h-screen shrink-0 ${
          sidebarCollapsed ? "w-[80px]" : "w-[260px]"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/logo.png" alt="GenuAI" className="w-8 h-8 object-contain shrink-0 drop-shadow-sm" />
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                  Genu<span className="text-indigo-600">AI</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {portalType === "admin" ? "Control" : "Command"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate">
                  {portalType === "admin" ? "GenuAI Control Center" : "Recruitment Intelligence"}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"}`} />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700")
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="truncate flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{userName}</div>
                <div className="text-[10px] text-slate-500 truncate capitalize">{userRole}</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={onLogout}
              className={`flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer ${
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

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[280px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-[slideInLeft_0.2s_ease]">
            <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="GenuAI" className="w-7 h-7 object-contain" />
                <span className="font-extrabold text-sm text-slate-900">
                  Genu<span className="text-indigo-600">AI</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                      isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs"
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
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          {/* Mobile hamburger & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onSearchChange && (
              <div className="relative hidden md:block w-64 lg:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 animate-[fadeIn_0.15s_ease]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-indigo-600 font-bold cursor-pointer">Mark all as read</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs text-slate-600">
                    <div className="p-2 rounded-lg bg-indigo-50/50 border border-indigo-100/50 flex gap-2 items-start">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">AI Intelligence Engine Active</div>
                        <div className="text-[10px] text-slate-500">Real-time candidate matching and proctoring integrity monitoring active.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:block max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-30 animate-[fadeIn_0.15s_ease]">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900 truncate">{userName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{userEmail}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange(portalType === "admin" ? "settings" : "profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {portalType === "admin" ? "Admin Settings" : "Company Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange("subscription");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Subscription &amp; Plans
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

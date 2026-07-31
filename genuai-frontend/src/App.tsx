import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

// ── Feature Pages ──────────────────────────────────────────────────────────
import { AuthPage as Auth } from "./features/auth";
import { PathSelectionPage as PathSelection } from "./features/dashboard";
import { CompanyOverviewPage as CompanyOverview, CompanyDashboardPage as CompanyDashboard } from "./features/company";
import { PracticeDashboardPage as PracticeDashboard } from "./features/practiceHub";
import { CandidatePipelinePage as CandidatePipeline } from "./features/recruitment";
import { SearchDashboardPage as SearchDashboard } from "./features/jobs";
import { CareerProfileDashboardPage as CareerProfileDashboard } from "./features/profile";
import { AdminDashboardPage as AdminDashboard } from "./features/admin";
import { AMCATTestPage as AMCATTest } from "./features/skillTest";
import { AIMockInterviewPage } from "./features/interview";

// ── Auth guard ─────────────────────────────────────────────────────────────
function RequireAuth({ user, children, role }: { user: any; children: React.ReactElement; role?: string | string[] }) {
  const location = useLocation();
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  const userRole = user?.user?.role || user?.role;
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(userRole)) return <Navigate to="/" replace />;
  }
  return children;
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);
  const [amcatRole, setAmcatRole] = useState("Software Engineer");
  const [amcatAssessmentId, setAmcatAssessmentId] = useState<number | undefined>();
  const [sessionRestored, setSessionRestored] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const saved = localStorage.getItem("genuai_user");
    if (saved) {
      try {
        const ud = JSON.parse(saved);
        setUser(ud);
        if (location.pathname === "/auth" || location.pathname === "/") {
          routeAfterLogin(ud, navigate);
        }
      } catch {
        localStorage.removeItem("genuai_user");
      }
    }
    setSessionRestored(true);
  }, []);

  const routeAfterLogin = (ud: any, nav: typeof navigate) => {
    const role = ud?.user?.role || ud?.role;
    if (role === "admin") { nav("/admin"); return; }
    if (role === "company") { nav("/company"); return; }
    nav("/dashboard");
  };

  const handleLogin = (ud: any) => {
    setUser(ud);
    localStorage.setItem("genuai_user", JSON.stringify(ud));
    routeAfterLogin(ud, navigate);
  };

  const handleLogout = () => {
    localStorage.removeItem("genuai_user");
    setUser(null);
    navigate("/auth", { replace: true });
  };

  const goToInterview = () => {
    navigate("/interview");
  };

  if (!sessionRestored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="GenuAI" className="w-16 h-16 object-contain animate-pulse" />
          <p className="text-on-surface-variant text-sm font-medium">Loading GenuAI...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth onLogin={handleLogin} />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />

      {/* Candidate dashboard hub */}
      <Route path="/dashboard" element={
        <RequireAuth user={user} role={["candidate"]}>
          <PathSelection user={user} onLogout={handleLogout} onSelect={(path) => {
            if (path === "practice") navigate("/practice");
            else if (path === "search") navigate("/search");
            else if (path === "career-profile") navigate("/career-profile");
            else navigate("/company-overview");
          }} />
        </RequireAuth>
      } />

      {/* Practice hub */}
      <Route path="/practice" element={
        <RequireAuth user={user} role={["candidate"]}>
          <PracticeDashboard user={user} onBack={() => navigate("/dashboard")} />
        </RequireAuth>
      } />

      {/* Search hub */}
      <Route path="/search" element={
        <RequireAuth user={user} role={["candidate"]}>
          <SearchDashboard user={user} onBack={() => navigate("/dashboard")} />
        </RequireAuth>
      } />

      {/* Career Profile hub */}
      <Route path="/career-profile" element={
        <RequireAuth user={user} role={["candidate"]}>
          <CareerProfileDashboard user={user} onBack={() => navigate("/dashboard")} />
        </RequireAuth>
      } />

      {/* Company Overview */}
      <Route path="/company-overview" element={
        <RequireAuth user={user} role={["candidate"]}>
          <CompanyOverview user={user} onStartTest={() => navigate("/pipeline")} />
        </RequireAuth>
      } />

      {/* 6-Module pipeline */}
      <Route path="/pipeline" element={
        <RequireAuth user={user} role={["candidate"]}>
          <CandidatePipeline user={user} onLogout={handleLogout} onInterview={goToInterview} />
        </RequireAuth>
      } />

      {/* AMCAT test */}
      <Route path="/amcat" element={
        <RequireAuth user={user} role={["candidate"]}>
          <AMCATTest
            user={user?.user || user}
            role={amcatRole}
            assessmentId={amcatAssessmentId}
            onComplete={(scores: any) => {
              sessionStorage.setItem("amcat_scores", JSON.stringify(scores));
              navigate("/pipeline");
            }}
            onTerminate={() => navigate("/pipeline")}
          />
        </RequireAuth>
      } />

      {/* AI Mock Interview Room */}
      <Route path="/interview" element={
        <RequireAuth user={user}>
          <AIMockInterviewPage user={user} onBack={() => navigate("/pipeline")} />
        </RequireAuth>
      } />

      {/* Admin dashboard */}
      <Route path="/admin" element={
        <RequireAuth user={user} role={["admin"]}>
          <AdminDashboard user={user} onLogout={handleLogout} />
        </RequireAuth>
      } />

      {/* Company/HR dashboard */}
      <Route path="/company" element={
        <RequireAuth user={user} role={["company", "admin"]}>
          <CompanyDashboard user={user} onLogout={handleLogout} />
        </RequireAuth>
      } />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
    </Routes>
  );
}

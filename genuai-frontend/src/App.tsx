import React, { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

// ── Feature Pages (lazy-loaded per route for optimal code splitting) ────────
const Auth                 = lazy(() => import("./features/auth").then(m => ({ default: m.AuthPage })));
const PathSelection        = lazy(() => import("./features/dashboard").then(m => ({ default: m.PathSelectionPage })));
const CompanyOverview      = lazy(() => import("./features/company").then(m => ({ default: m.CompanyOverviewPage })));
const CompanyDashboard     = lazy(() => import("./features/company").then(m => ({ default: m.CompanyDashboardPage })));
const PracticeDashboard    = lazy(() => import("./features/practiceHub").then(m => ({ default: m.PracticeDashboardPage })));
const CandidatePipeline    = lazy(() => import("./features/recruitment").then(m => ({ default: m.CandidatePipelinePage })));
const SearchDashboard      = lazy(() => import("./features/jobs").then(m => ({ default: m.SearchDashboardPage })));
const CareerProfileDashboard = lazy(() => import("./features/profile").then(m => ({ default: m.CareerProfileDashboardPage })));
const AdminDashboard       = lazy(() => import("./features/admin").then(m => ({ default: m.AdminDashboardPage })));
const AMCATTest            = lazy(() => import("./features/skillTest").then(m => ({ default: m.AMCATTestPage })));
const AIMockInterviewPage  = lazy(() => import("./features/interview").then(m => ({ default: m.AIMockInterviewPage })));

// ── Suspense fallback ───────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo.png" alt="GenuAI" className="w-16 h-16 object-contain animate-pulse" />
        <p className="text-on-surface-variant text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

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
    sessionStorage.clear();
    setUser(ud);
    localStorage.setItem("genuai_user", JSON.stringify(ud));
    routeAfterLogin(ud, navigate);
  };

  const handleLogout = () => {
    localStorage.removeItem("genuai_user");
    sessionStorage.clear();
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
    <Suspense fallback={<PageLoader />}>
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
            else {
              sessionStorage.setItem('genuai_pipeline_stage', 'interest');
              navigate("/pipeline");
            }
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

      {/* Candidate Official Assessment Overview */}
      <Route path="/assessment" element={
        <RequireAuth user={user} role={["candidate"]}>
          <CompanyOverview user={user} onStartTest={() => navigate("/pipeline")} />
        </RequireAuth>
      } />
      <Route path="/company-overview" element={<Navigate to="/assessment" replace />} />

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
    </Suspense>
  );
}

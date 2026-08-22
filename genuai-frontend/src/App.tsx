import React, { useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const HomePage             = lazy(() => import("./pages/HomePage"));
const EcosystemOverviewPage = lazy(() => import("./pages/EcosystemOverviewPage"));
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

const CandidateCompanySelector = lazy(() => import("./pages/CandidateCompanySelector"));
const DynamicAssessmentPage    = lazy(() => import("./pages/DynamicAssessmentPage"));
const CompanyMatchPage         = lazy(() => import("./pages/CompanyMatchPage"));
const CandidateReadinessPage   = lazy(() => import("./pages/CandidateReadinessPage"));

const TermsPage                = lazy(() => import("./pages/TermsPage"));
const PrivacyPage              = lazy(() => import("./pages/PrivacyPage"));
const PricingPage              = lazy(() => import("./pages/PricingPage"));
const RoadmapPage              = lazy(() => import("./pages/RoadmapPage"));
const SecurityPage             = lazy(() => import("./pages/SecurityPage"));
const LearningHubPage          = lazy(() => import("./pages/LearningHubPage"));
const AgreementsPage           = lazy(() => import("./pages/AgreementsPage"));

// ── Suspense fallback ───────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo.png" alt="GenuAI Technologies" className="w-16 h-16 object-contain animate-pulse" />
        <p className="text-on-surface-variant text-sm font-medium">Loading GenuAI...</p>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const [amcatRole] = useState("Software Engineer");
  const [amcatAssessmentId] = useState<number | undefined>();

  const handleLogout = () => {
    signOut();
    navigate("/auth", { replace: true });
  };

  const goToInterview = () => {
    navigate("/interview");
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Home Page & Auth Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ecosystem" element={<EcosystemOverviewPage />} />

        {/* Dedicated Reference Routes */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/learning-hub" element={<LearningHubPage />} />
        <Route path="/agreements" element={<AgreementsPage />} />
        <Route path="/technology" element={<Navigate to="/agreements" replace />} />
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate
                to={user.role === "company" ? "/company" : user.role === "admin" ? "/admin" : "/dashboard"}
                replace
              />
            ) : (
              <Auth />
            )
          }
        />

        {/* Candidate dashboard hub */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <PathSelection
                user={user}
                onLogout={handleLogout}
                onSelect={(path) => {
                  if (path === "practice") navigate("/practice");
                  else if (path === "search") navigate("/search");
                  else if (path === "career-profile") navigate("/career-profile");
                  else if (path === "companies") navigate("/companies");
                  else {
                    sessionStorage.setItem("genuai_pipeline_stage", "interest");
                    navigate("/pipeline");
                  }
                }}
              />
            </ProtectedRoute>
          }
        />

        {/* Practice hub */}
        <Route
          path="/practice"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <PracticeDashboard user={user} onBack={() => navigate("/dashboard")} />
            </ProtectedRoute>
          }
        />

        {/* Search hub */}
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <SearchDashboard user={user} onBack={() => navigate("/dashboard")} />
            </ProtectedRoute>
          }
        />

        {/* Career Profile hub */}
        <Route
          path="/career-profile"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <CareerProfileDashboard user={user} onBack={() => navigate("/dashboard")} />
            </ProtectedRoute>
          }
        />

        {/* Candidate Official Assessment Overview */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <CompanyOverview user={user} onStartTest={() => navigate("/pipeline")} />
            </ProtectedRoute>
          }
        />
        <Route path="/company-overview" element={<Navigate to="/assessment" replace />} />

        {/* GenuAI Works Thin Slice Flow */}
        <Route
          path="/companies"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <CandidateCompanySelector user={user} onBack={() => navigate("/dashboard")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-assessment"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <DynamicAssessmentPage user={user} onBack={() => navigate("/companies")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <CompanyMatchPage user={user} onBack={() => navigate("/my-assessment")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/readiness"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <CandidateReadinessPage />
            </ProtectedRoute>
          }
        />

        {/* 6-Module pipeline */}
        <Route
          path="/pipeline"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <CandidatePipeline user={user} onLogout={handleLogout} onInterview={goToInterview} />
            </ProtectedRoute>
          }
        />

        {/* AMCAT test */}
        <Route
          path="/amcat"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <AMCATTest
                user={user}
                role={amcatRole}
                assessmentId={amcatAssessmentId}
                onComplete={(scores: any) => {
                  sessionStorage.setItem("amcat_scores", JSON.stringify(scores));
                  navigate("/pipeline");
                }}
                onTerminate={() => navigate("/pipeline")}
              />
            </ProtectedRoute>
          }
        />

        {/* AI Mock Interview Room */}
        <Route
          path="/interview"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <AIMockInterviewPage user={user} onBack={() => navigate("/pipeline")} />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Company/HR dashboard */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={["company", "admin"]}>
              <CompanyDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? (user.role === "company" ? "/company" : user.role === "admin" ? "/admin" : "/dashboard") : "/auth"} replace />}
        />
      </Routes>
    </Suspense>
  );
}

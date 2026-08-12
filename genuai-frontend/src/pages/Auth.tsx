import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Lock, Mail, CheckCircle2, User, Building2, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Props {
  onLogin?: (user: any) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Auth({ onLogin }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, verifyOtpAndRegister, forgotPassword, resetPasswordWithOtp, handleOAuthLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | "linkedin" | "microsoft" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP & Reset States
  const [showOtp, setShowOtp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [showHumanCheck, setShowHumanCheck] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
    phone: "",
    college: "",
    github: "",
    linkedin: "",
  });

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [agreedTerms, setAgreedTerms] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Handle OAuth callbacks and query errors ──────────────────────────
  useEffect(() => {
    setOauthLoading(null);
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("oauth_error");
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const oauthUserStr = params.get("oauth_user");
    if (oauthUserStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(oauthUserStr));
        handleOAuthLogin(userData);
        window.history.replaceState({}, document.title, window.location.pathname);
        if (onLogin) onLogin(userData);
        dispatchPostAuth(userData);
      } catch {
        setError("OAuth authentication failed. Please try again.");
      }
    }
  }, [handleOAuthLogin, onLogin]);

  const handleTabSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError("");
    setSuccess("");
    setShowOtp(false);
    setIsForgotPassword(false);
    setResetOtpSent(false);
    setOtpCode("");
    setDevOtp(null);
    setAgreedTerms(false);
    setForm((p) => ({
      name: "",
      email: loginMode ? p.email : "",
      password: "",
      confirmPassword: "",
      role: "candidate",
      phone: "",
      college: "",
      github: "",
      linkedin: "",
    }));
  };

  const handleBackToLogin = () => {
    setShowOtp(false);
    setIsForgotPassword(false);
    setResetOtpSent(false);
    setOtpCode("");
    setDevOtp(null);
    setError("");
    setSuccess("");
    setForm((p) => ({ ...p, password: "", confirmPassword: "" }));
  };

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (error) setError("");
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validate = () => {
    if (!form.email || !form.email.trim()) {
      return "Please enter your email address.";
    }
    if (!validateEmail(form.email)) {
      return "Please enter a valid email address.";
    }
    if (!form.password || !form.password.trim()) {
      return "Please enter your password.";
    }

    if (!isLogin) {
      if (!agreedTerms) {
        return "Please agree to the Terms and Conditions.";
      }
      if (!form.name.trim()) {
        return "Full name is required.";
      }
      if (form.password.length < 6) {
        return "Password must be at least 6 characters.";
      }
      if (form.password !== form.confirmPassword) {
        return "Passwords do not match.";
      }
      if (!form.phone.trim()) {
        return "Phone number is required.";
      }
      if (!form.college.trim()) {
        return "College or company is required.";
      }
    } else {
      if (!agreedTerms) {
        return "Please agree to the Terms and Conditions.";
      }
    }
    return null;
  };

  const dispatchPostAuth = (authenticatedUser: any) => {
    const params = new URLSearchParams(window.location.search);
    const intent = params.get("intent");
    const role = authenticatedUser.role || authenticatedUser.user?.role;

    if (intent === "company" || role === "company") {
      navigate("/company", { replace: true });
      return;
    }
    if (intent === "admin" || intent === "genuai" || role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
    if (intent === "practice") {
      navigate("/practice", { replace: true });
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Clear any old or stale tokens before attempting authentication
        localStorage.removeItem("genuai_user");
        sessionStorage.clear();

        // Real Login against Supabase / Backend
        const user = await signIn(form.email.trim(), form.password);
        setSuccess("Signed in successfully!");
        if (onLogin) onLogin(user);
        setTimeout(() => {
          dispatchPostAuth(user);
        }, 300);
      } else {
        // Real Registration via OTP
        const res = await signUp({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          phone: form.phone.trim(),
          college: form.college.trim(),
          github: form.github.trim(),
          linkedin: form.linkedin.trim(),
        });
        if (res?.data?.devOtp) {
          setDevOtp(res.data.devOtp);
          setOtpCode(res.data.devOtp);
        }
        setSuccess("Verification OTP sent! Check your inbox and spam folder.");
        setShowOtp(true);
        setResendCountdown(30);
      }
    } catch (e: any) {
      // On ANY failure, ensure storage is completely wiped
      localStorage.removeItem("genuai_user");
      sessionStorage.clear();
      const msg = e.response?.data?.error || e.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        phone: form.phone.trim(),
        college: form.college.trim(),
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),
      });
      if (res?.data?.devOtp) {
        setDevOtp(res.data.devOtp);
        setOtpCode(res.data.devOtp);
      }
      setSuccess("New verification code sent!");
      setResendCountdown(30);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = await verifyOtpAndRegister(form.email.trim(), otpCode.trim());
      setSuccess("Account created successfully!");
      if (onLogin) onLogin(user);
      setTimeout(() => {
        dispatchPostAuth(user);
      }, 300);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    if (!form.email || !validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forgotPassword(form.email.trim());
      setSuccess("Password reset code sent to your email!");
      setResetOtpSent(true);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await resetPasswordWithOtp(form.email.trim(), otpCode.trim(), form.password);
      setSuccess("Password reset successfully! You can now sign in.");
      setIsForgotPassword(false);
      setResetOtpSent(false);
      setOtpCode("");
      setForm((p) => ({ ...p, password: "" }));
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "github" | "linkedin" | "microsoft") => {
    if (provider === "microsoft") {
      setError("Microsoft Enterprise SSO is under provision. Please sign in with Google, GitHub, LinkedIn, or Email.");
      return;
    }
    setOauthLoading(provider);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const STATS = [
    { val: "AI-Powered", label: "Evaluation", icon: "psychology", color: "text-indigo-brand", bg: "bg-indigo-brand/10", border: "border-indigo-brand/20", desc: "Multi-dimensional candidate profiling" },
    { val: "6D", label: "Assessment Profile", icon: "view_in_ar", color: "text-accent-gold", bg: "bg-accent-gold/10", border: "border-accent-gold/20", desc: "Comprehensive skill & behavior evaluation" },
    { val: "Real-Time", label: "Dynamic Scoring", icon: "bolt", color: "text-success-emerald", bg: "bg-success-emerald/10", border: "border-success-emerald/20", desc: "Instant assessment insights" },
    { val: "AI-Assisted", label: "Fair Evaluation", icon: "shield", color: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[#10B981]/20", desc: "Consistent, data-driven candidate assessment" },
  ];

  const TESTIMONIALS = [
    {
      quote: "GenuAI helped us reduce hiring turnaround significantly. The multi-dimensional evaluation provides actionable insights — we found our best engineers through this ecosystem.",
      name: "Rahul Mehta",
      role: "HR Director · TechCorp India",
      initial: "R",
    },
    {
      quote: "The 6-dimension scoring gives us a complete picture of technical and communication ability. It provides clear, consistent signal across candidate pools.",
      name: "Sarah Jenkins",
      role: "Talent Acquisition · GlobalNet",
      initial: "S",
    },
    {
      quote: "Verification and proctoring features are reliable. We can confidently conduct remote assessments with verifiable candidate integrity.",
      name: "Arjun Desai",
      role: "Engineering Manager · Innovate",
      initial: "A",
    },
  ];

  return (
    <div className="w-full bg-background font-body-base overflow-x-hidden text-on-background">
      <div className="min-h-screen flex flex-col lg:flex-row relative quantum-gradient text-on-background overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-brand/10 blur-[100px] rounded-full pointer-events-none" />

        {/* MOBILE BRAND HEADER */}
        <div className="lg:hidden flex flex-col items-center text-center pt-8 pb-4 px-4 relative z-10">
          <div className="relative group inline-block mb-3">
            <img src="/logo.png" alt="GenuAI Shield" className="relative w-16 h-16 object-contain gold-glow-subtle" />
          </div>
          <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#667EEA] via-[#764BA2] to-[#0891B2] tracking-tight mb-1">
            GenuAI Technologies
          </h2>
          <div className="inline-flex items-center px-3 py-1 glass rounded-lg shadow-xs bg-surface-bright/50 mb-3">
            <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">
              AI-Powered Recruitment Intelligence Ecosystem
            </span>
          </div>
        </div>

        {/* LEFT - Brand Hero Panel (Desktop) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-8 lg:px-12 py-12 relative z-10 border-r border-surface-container/50">
          <div className="max-w-xl mx-auto w-full">
            {/* Logo & Badge */}
            <div className="flex flex-col items-start mb-8">
              <div className="relative group inline-block mb-4">
                <div className="absolute -inset-4 bg-accent-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src="/logo.png" alt="GenuAI Shield" className="relative w-20 h-20 object-contain gold-glow-subtle transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#667EEA] via-[#764BA2] to-[#0891B2] tracking-tight">
                  GenuAI Technologies
                </h2>
                <div className="inline-flex items-center px-3 py-1 glass rounded-lg border-surface-container self-start shadow-xs bg-surface-bright/50">
                  <span className="text-[11px] font-black text-[#F59E0B] uppercase tracking-wider">
                    AI-Powered Recruitment Intelligence Ecosystem
                  </span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-black text-on-surface mb-3 leading-tight tracking-tight">
              Hire Smarter.<br />
              <span className="text-accent-gold">Get Hired Faster.</span>
            </h1>

            <p className="text-base text-on-surface-variant/90 mb-6 leading-relaxed">
              AI-powered recruitment intelligence for verified, skill-based hiring.
            </p>

            {/* Core USP Ribbon Card */}
            <div className="glass p-4 rounded-2xl border border-indigo-brand/20 bg-indigo-brand/5 mb-8 flex items-start gap-3.5 shadow-xs">
              <span className="material-symbols-outlined text-indigo-brand text-[24px] shrink-0 mt-0.5">hub</span>
              <div>
                <div className="text-sm font-bold text-on-surface">One Assessment → Multiple Companies</div>
                <div className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                  Complete one verified assessment and unlock multiple relevant opportunities across participating employers.
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {STATS.map((s, i) => (
                <div key={i} className="glass p-4 rounded-2xl border border-surface-container hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">
                        <span className={s.color}>{s.val}</span> {s.label}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="glass p-4 rounded-2xl border border-accent-gold/20">
              <p className="text-xs italic text-on-surface mb-3 leading-relaxed">
                "{TESTIMONIALS[testimonialIdx].quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold-dark flex items-center justify-center font-bold text-xs">
                  {TESTIMONIALS[testimonialIdx].initial}
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">{TESTIMONIALS[testimonialIdx].name}</div>
                  <div className="text-[10px] text-on-surface-variant">{TESTIMONIALS[testimonialIdx].role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Form Panel */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
          <div className="w-full max-w-[500px] glass p-6 sm:p-8 rounded-3xl border border-surface-container shadow-2xl relative">
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 tracking-tight">
                {isForgotPassword
                  ? "Reset Password"
                  : isLogin
                  ? "Sign In to GenuAI"
                  : "Create GenuAI Account"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {isForgotPassword
                  ? "Follow the instructions below to reset your account password"
                  : "One Assessment. Multiple Opportunities. Verified Talent."}
              </p>
            </div>

            {!showOtp && !isForgotPassword && (
              <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
                {["Login", "Register"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTabSwitch(t === "Login")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      (t === "Login") === isLogin
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t === "Login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3 rounded-xl mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {showOtp ? (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Verify Your Email</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    We sent a 6-digit verification code to <strong>{form.email}</strong>.<br />
                    <span className="text-[11px] text-slate-500 font-medium">Please check your inbox and <strong>Spam / Junk</strong> folder.</span>
                  </p>
                </div>

                {devOtp && (
                  <div className="bg-indigo-50/80 border border-indigo-200 p-3 rounded-xl flex items-center justify-between text-xs text-indigo-900 shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Code: <strong className="font-mono text-sm tracking-widest bg-white px-2 py-0.5 rounded border border-indigo-200 ml-1">{devOtp}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpCode(devOtp)}
                      className="text-[11px] font-bold text-indigo-600 underline hover:text-indigo-800 cursor-pointer"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Verification Code *</label>
                  <input
                    placeholder="000000"
                    value={otpCode}
                    maxLength={6}
                    autoComplete="one-time-code"
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-center text-xl tracking-[0.4em] font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-md text-sm"
                >
                  {loading ? "Verifying..." : "Verify & Complete Registration"}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-slate-600 font-bold text-xs hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    ← Change Details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || resendCountdown > 0}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                  </button>
                </div>
              </div>
            ) : isForgotPassword ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Reset Your Password</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {resetOtpSent ? `Enter the 6-digit code sent to ${form.email}` : "Enter your email to receive a password reset code"}
                  </p>
                </div>

                {!resetOtpSent ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address *</label>
                      <input
                        placeholder="your@email.com"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPasswordSubmit}
                      disabled={loading || !form.email}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-md text-sm"
                    >
                      {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">6-Digit Code *</label>
                      <input
                        placeholder="000000"
                        value={otpCode}
                        maxLength={6}
                        autoComplete="one-time-code"
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-center text-xl tracking-[0.4em] font-bold text-slate-900 outline-none focus:border-indigo-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">New Password *</label>
                      <div className="relative">
                        <input
                          placeholder="Enter new password (min 6 chars)"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={form.password}
                          onChange={(e) => set("password", e.target.value)}
                          className="w-full p-3 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading || otpCode.length !== 6 || form.password.length < 6}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-md text-sm"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-slate-600 font-bold text-xs py-2 hover:text-slate-900 transition-colors cursor-pointer text-center"
                >
                  ← Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Registration Fields */}
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name *</label>
                        <input
                          placeholder="John Doe"
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">Phone *</label>
                        <input
                          placeholder="+1 234 567 8900"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">College / Company *</label>
                      <input
                        placeholder="University / Organization Inc."
                        autoComplete="organization"
                        value={form.college}
                        onChange={(e) => set("college", e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                      />
                    </div>

                    {form.role !== "admin" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">GitHub Profile</label>
                          <input
                            placeholder="github.com/username"
                            autoComplete="off"
                            value={form.github}
                            onChange={(e) => set("github", e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">LinkedIn Profile</label>
                          <input
                            placeholder="linkedin.com/in/username"
                            autoComplete="off"
                            value={form.linkedin}
                            onChange={(e) => set("linkedin", e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Register As *</label>
                      <select
                        value={form.role}
                        onChange={(e) => set("role", e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                      >
                        <option value="candidate">Candidate — Looking for jobs &amp; assessments</option>
                        <option value="company">Company — Hiring &amp; evaluating talent</option>
                        <option value="admin">Admin — Ecosystem governance</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address *</label>
                  <input
                    placeholder="your@email.com"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                  />
                </div>

                {/* Password Field with Show/Hide Eye Button */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Password *</label>
                    {isLogin && (
                      <span
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        Forgot Password?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      className="w-full p-3 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field for Registration */}
                {!isLogin && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Confirm Password *</label>
                    <div className="relative">
                      <input
                        placeholder="Re-enter password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={(e) => set("confirmPassword", e.target.value)}
                        className="w-full p-3 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Mandatory Terms & Conditions Agreement Checkbox */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 transition-all select-none cursor-pointer ${
                    agreedTerms
                      ? "bg-indigo-50/50 border-indigo-300 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    setAgreedTerms(!agreedTerms);
                    if (error && error.includes("Terms")) setError("");
                  }}
                >
                  <input
                    type="checkbox"
                    id="agree-terms-checkbox"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (error && error.includes("Terms")) setError("");
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600 shrink-0"
                  />
                  <label htmlFor="agree-terms-checkbox" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/home#terms-and-conditions");
                      }}
                      className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition-colors cursor-pointer"
                    >
                      Terms and Conditions
                    </span>{" "}
                    and candidate assessment policies.
                  </label>
                </div>

                {/* Real Authentication Submission Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl disabled:opacity-50 hover:shadow-lg transition-all text-sm cursor-pointer shadow-md"
                >
                  {loading
                    ? isLogin
                      ? "Signing in..."
                      : "Sending OTP..."
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </button>

                {/* OAuth Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or continue with</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* OAuth Provider Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOAuth("google")}
                    disabled={oauthLoading !== null}
                    className="w-full bg-white border border-slate-200 flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 hover:border-indigo-500 hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 shrink-0" />
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth("microsoft")}
                    disabled={oauthLoading !== null}
                    className="w-full bg-white border border-slate-200 flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 hover:border-[#00A4EF] hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    <span>Continue with Microsoft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth("github")}
                    disabled={oauthLoading !== null}
                    className="w-full bg-white border border-slate-200 flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 hover:border-slate-800 hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-4 h-4 shrink-0" />
                    <span>Continue with GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth("linkedin")}
                    disabled={oauthLoading !== null}
                    className="w-full bg-white border border-slate-200 flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 hover:border-[#0A66C2] hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" className="w-4 h-4 shrink-0" />
                    <span>Continue with LinkedIn</span>
                  </button>
                </div>
              </div>
            )}

            {/* Compliance Footer */}
            <div className="mt-6 flex justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Supabase Auth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { login, register, sendOtp, verifyOtp, requestPasswordReset, resetPassword } from "../services/api";

interface Props { onLogin: (user: any) => void; }

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Auth({ onLogin }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | "linkedin" | "microsoft" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "candidate", phone: "", college: "", github: "", linkedin: "" });
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [liveUserCount, setLiveUserCount] = useState(2042);
  const [agreedTerms, setAgreedTerms] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx(prev => (prev + 1) % 3);
    }, 5000);

    // Simulate real-time signups
    const userInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        setLiveUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 3500);

    return () => {
      clearInterval(interval);
      clearInterval(userInterval);
    };
  }, []);
  const handlePhotoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const storePhoto = (email: string) => {
    if (profilePhoto) {
      localStorage.setItem(`profilePhoto_${email}`, profilePhoto);
    }
  };

  // ── Detect OAuth redirect from backend ──────────────────────────
  useEffect(() => {
    // Reset OAuth loading state when returning to the page
    setOauthLoading(null);

    // Check for error in query string
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("oauth_error");
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Check for successful oauth_user
    const oauthUserStr = params.get("oauth_user");
    if (oauthUserStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(oauthUserStr));
        localStorage.setItem("genuai_user", JSON.stringify(userData));
        window.history.replaceState({}, document.title, window.location.pathname);
        onLogin(userData);
      } catch {
        setError("OAuth login failed. Please try again.");
      }
    }

    const handlePageShow = () => {
      setOauthLoading(null);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [onLogin]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    if (!agreedTerms) return "Please check the box to agree to the Terms & Conditions and Privacy Policy.";
    if (!form.email || !form.email.includes("@")) return "Valid email is required.";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters.";
    if (!isLogin) {
      if (!form.name.trim()) return "Full name is required.";
      if (!form.phone.trim()) return "Phone number is required.";
      if (!form.college.trim()) return "College or company is required.";
      if (form.role !== 'admin') {
        if (!form.github.trim()) return "GitHub profile URL is required.";
        if (!form.linkedin.trim()) return "LinkedIn profile URL is required.";
      }
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      if (isLogin) {
        const res = await login({ email: form.email, password: form.password });
        localStorage.setItem("genuai_user", JSON.stringify(res.data));
        storePhoto(res.data.user?.email || form.email);
        onLogin(res.data);
      } else {
        await sendOtp({ name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone, college: form.college, github: form.github, linkedin: form.linkedin });
        setSuccess("OTP sent to your email!");
        setShowOtp(true);
      }
    } catch (e: any) { setError(e.response?.data?.error || "Something went wrong."); }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await verifyOtp({ email: form.email, otp: otpCode });
      localStorage.setItem("genuai_user", JSON.stringify(res.data));
      storePhoto(res.data.user?.email || form.email);
      onLogin(res.data);
    } catch (e: any) { setError(e.response?.data?.error || "Invalid or expired OTP."); }
    setLoading(false);
  };

  const handleForgotPasswordSubmit = async () => {
    if (!form.email || !form.email.includes("@")) { setError("Valid email is required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await requestPasswordReset({ email: form.email });
      setSuccess("Reset code sent to your email!");
      setResetOtpSent(true);
    } catch (e: any) { setError(e.response?.data?.error || "Failed to send reset code."); }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!otpCode || otpCode.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    if (!form.password || form.password.length < 6) { setError("New password must be at least 6 characters."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await resetPassword({ email: form.email, otp: otpCode, newPassword: form.password });
      setSuccess("Password reset successfully! You can now log in.");
      setIsForgotPassword(false);
      setResetOtpSent(false);
      setOtpCode("");
      setForm(p => ({ ...p, password: "" }));
    } catch (e: any) { setError(e.response?.data?.error || "Failed to reset password."); }
    setLoading(false);
  };

  const handleOAuth = (provider: "google" | "github" | "linkedin" | "microsoft") => {
    if (provider === "microsoft") {
      setError("Microsoft Enterprise SSO is currently being provisioned. Please sign in with Google, GitHub, LinkedIn, or Email & Password.");
      return;
    }
    setOauthLoading(provider);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const inp: any = { width: "100%", padding: "14px 18px", marginBottom: "16px", background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: "12px", color: "#1E293B", fontSize: "15px", boxSizing: "border-box", outline: "none", transition: "all 0.2s" };
  const lbl: any = { color: "#64748B", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" };

  const STATS = [
    { val: "AI-Powered", label: "Evaluation", icon: "psychology", color: "text-indigo-brand", bg: "bg-indigo-brand/10", border: "border-indigo-brand/20", desc: "Multi-dimensional candidate profiling" },
    { val: "6D", label: "Assessment Profile", icon: "view_in_ar", color: "text-accent-gold", bg: "bg-accent-gold/10", border: "border-accent-gold/20", desc: "Comprehensive skill & behavior evaluation" },
    { val: "Real-Time", label: "Dynamic Scoring", icon: "bolt", color: "text-success-emerald", bg: "bg-success-emerald/10", border: "border-success-emerald/20", desc: "Instant assessment insights" },
    { val: "AI-Assisted", label: "Fair Evaluation", icon: "shield", color: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[#10B981]/20", desc: "Consistent, data-driven candidate assessment" },
  ];

  const TESTIMONIALS: { quote: any; name: string; role: string; initial: string; photo?: string }[] = [
    {
      quote: <>GenuAI helped us reduce hiring turnaround significantly. The multi-dimensional evaluation provides actionable insights — we found our best engineers through this platform.</>,
      name: "Rahul Mehta", role: "HR Director · TechCorp India", initial: "R"
    },
    {
      quote: <>The 6-dimension scoring gives us a complete picture of technical and communication ability. It provides clear, consistent signal across candidate pools.</>,
      name: "Sarah Jenkins", role: "Talent Acquisition · GlobalNet", initial: "S"
    },
    {
      quote: <>Verification and proctoring features are reliable. We can confidently conduct remote assessments with verifiable candidate integrity.</>,
      name: "Arjun Desai", role: "Engineering Manager · Innovate", initial: "A"
    }
  ];

  return (
    <div className="w-full bg-background font-body-base overflow-x-hidden text-on-background">
      <div className="min-h-screen flex flex-col lg:flex-row relative quantum-gradient text-on-background overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-gold/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-brand/10 blur-[100px] rounded-full pointer-events-none" />

      {/* MOBILE BRAND HEADER — visible only on small screens */}
      <div className="lg:hidden flex flex-col items-center text-center pt-10 pb-6 px-margin-mobile relative z-10">
        <div className="relative group inline-block mb-4">
          <div className="absolute -inset-4 bg-accent-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <img src="/logo.png" alt="GenuAI Shield" className="relative w-20 h-20 object-contain gold-glow-subtle" />
        </div>
        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#667EEA] via-[#764BA2] to-[#0891B2] tracking-tighter mb-2" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
          GenuAI Technologies
        </h2>
        <div className="inline-flex items-center px-3 py-1.5 glass rounded-lg shadow-sm bg-surface-bright/50 mb-4">
          <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif" }}>
            AI-Powered Recruitment Intelligence Platform
          </span>
        </div>
        <h1 className="text-3xl font-black text-on-surface mb-2 leading-tight">
          Hire Smarter.<br/>
          <span className="text-accent-gold">Get Hired Faster.</span>
        </h1>
        <p className="text-sm text-on-surface-variant/90 leading-relaxed max-w-xs mb-3">
          AI-powered recruitment intelligence for verified, skill-based hiring.
        </p>

        {/* USP on mobile */}
        <div className="glass px-3 py-2 rounded-xl border border-indigo-brand/20 bg-indigo-brand/5 max-w-xs text-left mb-4">
          <div className="text-[11px] font-bold text-on-surface">One Assessment → Multiple Companies</div>
          <div className="text-[10px] text-on-surface-variant">Complete one verified assessment and unlock multiple relevant opportunities.</div>
        </div>

        {/* Mini stats on mobile */}
        <div className="grid grid-cols-2 gap-3 mt-2 w-full max-w-xs">
          {STATS.map((s, i) => (
            <div key={i} className="glass px-3 py-3 rounded-xl flex items-center gap-2 border border-surface-container">
              <span className={`material-symbols-outlined text-[18px] ${s.color} shrink-0`}>{s.icon}</span>
              <div>
                <div className={`font-black text-[11px] ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-on-surface-variant font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEFT - Brand Hero Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-margin-desktop py-xl relative z-10 border-r border-surface-container/50">
        <div className="max-w-2xl mx-auto w-full">
          {/* Logo & Badge */}
          <div className="flex flex-col items-start mb-lg">
            <div className="relative group inline-block mb-md">
              <div className="absolute -inset-4 bg-accent-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img src="/logo.png" alt="GenuAI Shield" className="relative w-24 h-24 object-contain gold-glow-subtle transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col gap-2 mb-md mt-sm">
              <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#667EEA] via-[#764BA2] to-[#0891B2] tracking-tighter drop-shadow-sm" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                GenuAI Technologies
              </h2>
              <div className="inline-flex items-center px-sm py-1.5 glass rounded-lg border-surface-container self-start shadow-sm bg-surface-bright/50">
                <span className="text-[11px] font-black text-[#F59E0B] flex items-center gap-1.5 uppercase tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  AI-Powered Recruitment Intelligence Platform
                </span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-display-lg-mobile hero-title-weight text-on-surface mb-sm leading-[1.05]">
            Hire Smarter.<br/>
            <span className="text-accent-gold">Get Hired Faster.</span>
          </h1>
          
          <p className="text-body-lg font-body-lg text-on-surface-variant/90 mb-md leading-relaxed max-w-xl">
            AI-powered recruitment intelligence for verified, skill-based hiring.
          </p>

          {/* Core USP Ribbon Card */}
          <div className="glass p-4 rounded-2xl border border-indigo-brand/20 bg-indigo-brand/5 mb-lg flex items-start gap-3.5 shadow-xs">
            <span className="material-symbols-outlined text-indigo-brand text-[24px] shrink-0 mt-0.5">hub</span>
            <div>
              <div className="text-sm font-bold text-on-surface">One Assessment → Multiple Companies</div>
              <div className="text-[12px] text-on-surface-variant leading-relaxed">
                Complete one verified assessment and unlock multiple relevant opportunities across participating employers.
              </div>
            </div>
          </div>

          {/* Stats Grid - Credible & Value-Driven */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mb-xl">
            {STATS.map((s, i) => (
              <div key={i} className={`glass p-md rounded-2xl hover:-translate-y-1 transition-all duration-300 group cursor-default border border-surface-container hover:shadow-lg hover:border-surface-container-high relative overflow-hidden`}>
                <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${s.bg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10 flex items-start gap-md">
                  <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} border ${s.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-black text-[15px] text-on-surface leading-snug mb-1">
                      <span className={`${s.color}`}>{s.val}</span> {s.label}
                    </h3>
                    <p className="text-[12px] font-medium text-on-surface-variant/80 leading-relaxed pr-2">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="glass-gold p-md rounded-xl border border-accent-gold/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div key={testimonialIdx} className="animate-[fadeIn_0.5s_ease]">
                <p className="text-body-base italic text-on-surface mb-sm leading-relaxed">{TESTIMONIALS[testimonialIdx].quote}</p>
                <div className="flex items-center gap-sm">
                  {TESTIMONIALS[testimonialIdx].photo ? (
                    <img src={TESTIMONIALS[testimonialIdx].photo} alt={TESTIMONIALS[testimonialIdx].name} className="w-11 h-11 rounded-full object-cover ring-2 ring-accent-gold/20" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-surface-bright flex items-center justify-center text-accent-gold font-black text-sm ring-2 ring-accent-gold/20">{TESTIMONIALS[testimonialIdx].initial}</div>
                  )}
                  <div>
                    <div className="text-label-caps font-bold text-on-surface">{TESTIMONIALS[testimonialIdx].name}</div>
                    <div className="text-[10px] text-on-surface-variant/80">{TESTIMONIALS[testimonialIdx].role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined text-accent-gold text-[12px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Profile Moved to Landing Section */}
        </div>
      </div>

      {/* RIGHT - Form Panel */}
      <div className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10">
        <div className="w-full max-w-[550px] glass p-lg md:p-xl rounded-xxl relative">
          
          <div className="mb-lg">
            <h2 className="text-3xl md:text-4xl font-black text-on-surface mb-xs tracking-tight drop-shadow-sm">
              {isForgotPassword ? "Reset Password" : "Welcome to GenuAI"}
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant font-medium leading-relaxed">
              {isForgotPassword ? "Follow the steps below to reset your password" : "Choose how you want to continue."}
            </p>
          </div>

          {!showOtp && !isForgotPassword && (
            <div className="flex mb-lg bg-surface-container/50 rounded-xl p-1">
              {["Login", "Register"].map(t => (
                <button key={t} onClick={() => { setIsLogin(t === "Login"); setError(""); setSuccess(""); }}
                  className={`flex-1 py-sm rounded-lg text-label-caps font-bold transition-all ${
                    (t === "Login") === isLogin 
                      ? "bg-surface text-on-surface shadow-sm" 
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}>
                  {t === "Login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>
          )}

          {error && <div className="bg-error-crimson/10 border border-error-crimson/20 text-error-crimson text-sm font-bold p-sm rounded-xl mb-md">{error}</div>}
          {success && <div className="bg-success-emerald/10 border border-success-emerald/20 text-success-emerald text-sm font-bold p-sm rounded-xl mb-md">{success}</div>}

          {showOtp ? (
            <div className="animate-[fadeIn_0.3s_ease]">
              <div className="text-center mb-md">
                <div className="w-16 h-16 rounded-full bg-indigo-brand/10 text-indigo-brand flex items-center justify-center mx-auto mb-sm">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <h3 className="text-headline-sm text-on-surface mb-xs">Check your email</h3>
                <p className="text-on-surface-variant text-sm">We sent a 6-digit code to <strong>{form.email}</strong></p>
              </div>
              <label className="text-label-caps text-on-surface-variant mb-xs block">Verification Code *</label>
              <input placeholder="000000" value={otpCode} maxLength={6} onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} 
                className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-center text-headline-md tracking-[0.5em] font-bold text-on-surface outline-none focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand transition-all mb-md" />
              
              <button onClick={handleVerifyOtp} disabled={loading || otpCode.length !== 6}
                className="w-full gradient-button text-white font-bold py-sm rounded-xl mb-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[0.98] transition-transform">
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
              <button onClick={() => setShowOtp(false)} className="w-full text-on-surface-variant font-bold text-sm py-sm hover:text-on-surface transition-colors">
                ← Back to registration
              </button>
            </div>
          ) : isForgotPassword ? (
            <div className="animate-[fadeIn_0.3s_ease]">
              <div className="text-center mb-md">
                <div className="w-16 h-16 rounded-full bg-error-crimson/10 text-error-crimson flex items-center justify-center mx-auto mb-sm">
                  <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>
                <h3 className="text-headline-sm text-on-surface mb-xs">Reset Password</h3>
                <p className="text-on-surface-variant text-sm">{resetOtpSent ? `Enter code sent to ${form.email}` : "Enter your email to receive a code"}</p>
              </div>

              {!resetOtpSent ? (
                <>
                  <label className="text-label-caps text-on-surface-variant mb-xs block">Email Address *</label>
                  <input placeholder="your@email.com" type="email" value={form.email} onChange={e => set("email", e.target.value)} 
                    className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand mb-md transition-all" />
                  <button onClick={handleForgotPasswordSubmit} disabled={loading || !form.email}
                    className="w-full gradient-button text-white font-bold py-sm rounded-xl mb-sm disabled:opacity-50 hover:scale-[0.98] transition-transform">
                    {loading ? "Sending..." : "Send Reset Code"}
                  </button>
                </>
              ) : (
                <>
                  <label className="text-label-caps text-on-surface-variant mb-xs block">Verification Code *</label>
                  <input placeholder="000000" value={otpCode} maxLength={6} onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} 
                    className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-center text-headline-md tracking-[0.5em] font-bold text-on-surface outline-none focus:border-indigo-brand mb-md transition-all" />
                  <label className="text-label-caps text-on-surface-variant mb-xs block">New Password *</label>
                  <input placeholder="Enter new password" type="password" value={form.password} onChange={e => set("password", e.target.value)} 
                    className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand mb-md transition-all" />
                  <button onClick={handleResetPassword} disabled={loading || otpCode.length !== 6 || form.password.length < 6}
                    className="w-full gradient-button text-white font-bold py-sm rounded-xl mb-sm disabled:opacity-50 hover:scale-[0.98] transition-transform">
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}
              <button onClick={() => { setIsForgotPassword(false); setResetOtpSent(false); }} className="w-full text-on-surface-variant font-bold text-sm py-sm hover:text-on-surface transition-colors">
                ← Back to Login
              </button>
            </div>
          ) : (
            <>
              {!isLogin && (
                <div className="animate-[fadeIn_0.3s_ease]">
                  <div className="flex flex-col items-center mb-md">
                    <div onClick={() => document.getElementById("auth-photo-input")?.click()}
                      className={`w-20 h-20 ${form.role === "company" ? "rounded-xl" : "rounded-full"} overflow-hidden border-2 border-dashed border-surface-container flex items-center justify-center cursor-pointer bg-surface-bright mb-2 hover:border-indigo-brand transition-colors`}>
                      {profilePhoto ? <img src={profilePhoto} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-3xl text-on-surface-variant">{form.role === "company" ? "domain" : "add_a_photo"}</span>}
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Upload Photo</span>
                    <input id="auth-photo-input" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </div>
                  <div className="grid grid-cols-2 gap-sm mb-sm">
                    <div>
                      <label className="text-label-caps text-on-surface-variant mb-xs block">Full Name *</label>
                      <input placeholder="John Doe" value={form.name} onChange={e => set("name", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
                    </div>
                    <div>
                      <label className="text-label-caps text-on-surface-variant mb-xs block">Phone *</label>
                      <input placeholder="+1 234 567" value={form.phone} onChange={e => set("phone", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
                    </div>
                  </div>
                  <div className="mb-sm">
                    <label className="text-label-caps text-on-surface-variant mb-xs block">College / Company *</label>
                    <input placeholder="University / Inc." value={form.college} onChange={e => set("college", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
                  </div>
                  {form.role !== 'admin' && (
                    <div className="grid grid-cols-2 gap-sm mb-sm">
                      <div>
                        <label className="text-label-caps text-on-surface-variant mb-xs block">GitHub *</label>
                        <input placeholder="url" value={form.github} onChange={e => set("github", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
                      </div>
                      <div>
                        <label className="text-label-caps text-on-surface-variant mb-xs block">LinkedIn *</label>
                        <input placeholder="url" value={form.linkedin} onChange={e => set("linkedin", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
                      </div>
                    </div>
                  )}
                  <div className="mb-sm">
                    <label className="text-label-caps text-on-surface-variant mb-xs block">Register As *</label>
                    <select value={form.role} onChange={e => set("role", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm">
                      <option value="candidate">Candidate - Looking for jobs</option>
                      <option value="company">Company - Hiring talent</option>
                      <option value="admin">Admin - Platform management</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mb-sm">
                <label className="text-label-caps text-on-surface-variant mb-xs block">Email Address *</label>
                <input placeholder="your@email.com" type="email" value={form.email} onChange={e => set("email", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
              </div>

              <div className="mb-md">
                <div className="flex justify-between items-center mb-xs">
                  <label className="text-label-caps text-on-surface-variant">Password *</label>
                  {isLogin && <span onClick={() => setIsForgotPassword(true)} className="text-[11px] font-bold text-indigo-brand cursor-pointer hover:underline">Forgot?</span>}
                </div>
                <input placeholder="Min 6 characters" type="password" value={form.password} onChange={e => set("password", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
              </div>

              {!isLogin && (
                <div className="mb-md">
                  <label className="text-label-caps text-on-surface-variant mb-xs block">Confirm Password *</label>
                  <input placeholder="Re-enter password" type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface outline-none focus:border-indigo-brand transition-all text-sm" />
                </div>
              )}

              {/* Mandatory Terms & Conditions Agreement Checkbox */}
              <div
                className={`mb-md p-3.5 rounded-xl border flex items-start gap-2.5 transition-all select-none cursor-pointer ${
                  agreedTerms
                    ? 'bg-indigo-brand/5 border-indigo-brand/40 shadow-xs'
                    : 'bg-surface-bright border-surface-container hover:border-surface-container-high'
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
                  className="mt-0.5 w-4 h-4 rounded text-indigo-brand focus:ring-indigo-brand border-surface-container cursor-pointer accent-indigo-600 shrink-0"
                />
                <label htmlFor="agree-terms-checkbox" className="text-xs text-on-surface-variant leading-relaxed cursor-pointer">
                  I agree to the <a href="/#terms" target="_blank" rel="noopener noreferrer" className="text-indigo-brand font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Terms &amp; Conditions</a>, Assessment Integrity Rules, and <span className="font-semibold text-on-surface">Candidate Privacy Policy</span>.
                </label>
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full gradient-button text-white font-bold py-sm rounded-xl mb-lg disabled:opacity-50 hover:scale-[0.98] transition-transform text-sm cursor-pointer shadow-md">
                {loading ? (isLogin ? "Signing in..." : "Sending OTP...") : (isLogin ? "Sign in to GenuAI" : "Create Account")}
              </button>

              <div className="flex items-center gap-sm mb-lg">
                <div className="flex-1 h-px bg-surface-container"></div>
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">or continue with</span>
                <div className="flex-1 h-px bg-surface-container"></div>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => handleOAuth("google")} disabled={oauthLoading !== null} className="w-full bg-surface border border-surface-container flex items-center justify-center gap-md py-3.5 rounded-xl font-bold text-sm text-on-surface hover:border-indigo-brand/50 hover:shadow-[0_0_15px_rgba(102,126,234,0.15)] transition-all disabled:opacity-50 group">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Continue with Google
                </button>
                <button onClick={() => handleOAuth("microsoft")} disabled={oauthLoading !== null} className="w-full bg-surface border border-surface-container flex items-center justify-center gap-md py-3.5 rounded-xl font-bold text-sm text-on-surface hover:border-[#00A4EF] hover:shadow-[0_0_15px_rgba(0,164,239,0.15)] transition-all disabled:opacity-50 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Continue with Microsoft
                </button>
                <button onClick={() => handleOAuth("github")} disabled={oauthLoading !== null} className="w-full bg-surface border border-surface-container flex items-center justify-center gap-md py-3.5 rounded-xl font-bold text-sm text-on-surface hover:border-on-surface hover:shadow-[0_0_15px_rgba(15,23,42,0.1)] transition-all disabled:opacity-50 group">
                  <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Continue with GitHub
                </button>
                <button onClick={() => handleOAuth("linkedin")} disabled={oauthLoading !== null} className="w-full bg-surface border border-surface-container flex items-center justify-center gap-md py-3.5 rounded-xl font-bold text-sm text-on-surface hover:border-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.15)] transition-all disabled:opacity-50 group">
                  <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Continue with LinkedIn
                </button>
              </div>
            </>
          )}

          <div className="mt-lg flex justify-center gap-sm">
             <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <span className="material-symbols-outlined text-[12px] text-success-emerald">verified_user</span>
                SSL Secured
             </div>
             <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <span className="material-symbols-outlined text-[12px] text-success-emerald">policy</span>
                ISO 27001
             </div>
           </div>
         </div>
       </div>
      </div>
    </div>
  );
}
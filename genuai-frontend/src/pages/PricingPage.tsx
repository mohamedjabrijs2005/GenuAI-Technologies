import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, Building2, GraduationCap, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-body-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Subscription Plans</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Ecosystem Pricing &amp; Plans
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Role-aware assessment orchestration for candidates, locked requirement configuration for companies, and campus analytics for institutions.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate Tier */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Candidate Tier</span>
                <h3 className="text-2xl font-bold text-white mt-1">Free Forever</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Your assessment path, built from your selected companies' requirements — accepted across all of them.
                </p>
              </div>
              <div className="text-3xl font-black text-white font-mono">
                ₹0 <span className="text-xs text-slate-500 font-normal">/ candidate</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Target Company &amp; Role Selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dynamic Assessment Path Generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Result Reuse across Target Roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Explainable Company Match Scores</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Get Started Free
            </button>
          </div>

          {/* Company Tier */}
          <div className="bg-slate-900 border border-indigo-500/50 ring-1 ring-indigo-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular for Employers
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Employer Partner Tier</span>
                <h3 className="text-2xl font-bold text-white mt-1">Growth Config Pack</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Access to the full assessment module library — configure 4–6 per role.
                </p>
              </div>
              <div className="text-3xl font-black text-white font-mono">
                ₹7,999 <span className="text-xs text-slate-500 font-normal">/ 60 days</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Configure &amp; Lock 4–6 Requirements per Role</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Version-Bound Candidate Scorecard Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 Configuration Change Requests Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Anti-Proxy Evidentiary Proctoring Logs</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 italic mb-3">
                * Target capacity at full scale — current pilot capacity available on request
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Start Employer Trial
              </button>
            </div>
          </div>

          {/* Institution Tier */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Campus Tier</span>
                <h3 className="text-2xl font-bold text-white mt-1">Campus Partnership</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Campus-wide skill verification &amp; placement analytics dashboard.
                </p>
              </div>
              <div className="text-3xl font-black text-white font-mono">
                Custom <span className="text-xs text-slate-500 font-normal">/ annual campus</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cohort Skill Gap Analytics &amp; Benchmark Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bulk Candidate Onboarding &amp; Verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Placement Officer Governance Dashboard</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 italic mb-3">
                * Target capacity at full scale — current pilot capacity available on request
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer border border-slate-700"
              >
                Contact Campus Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

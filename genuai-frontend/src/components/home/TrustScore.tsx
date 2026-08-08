import React from 'react';
import { CheckCircle2, ShieldCheck, Activity, Award, AlertCircle } from 'lucide-react';

export const TrustScore: React.FC = () => {
  const checks = [
    { label: 'IDENTITY VERIFIED', status: 'Passed', icon: CheckCircle2 },
    { label: 'VOICE VERIFIED', status: 'Passed', icon: CheckCircle2 },
    { label: 'LIVENESS VERIFIED', status: 'Passed', icon: CheckCircle2 },
    { label: 'SECOND PERSON NOT DETECTED', status: 'Clear', icon: CheckCircle2 },
    { label: 'PHONE NOT DETECTED', status: 'Clear', icon: CheckCircle2 },
  ];

  return (
    <section id="trust-score" className="py-12 sm:py-16 lg:py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text (6 cols) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-success/10 text-success-dark text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-success/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trust Index Engine</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface leading-tight">
              AI Trust Score &amp; Integrity Verification
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
              "The AI Trust Score summarizes multiple verification signals to help recruiters evaluate assessment authenticity." Instead of watching hours of raw video, recruiters receive a consolidated authenticity index.
            </p>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-bright border border-surface-container space-y-1.5 sm:space-y-2">
              <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-brand" />
                <span>Multi-Signal Fusion</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Aggregates facial landmarks, voice timbre stability, continuous gaze vectors, and device reflections into a single weighted score.
              </p>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-2xl bg-surface border border-surface-container text-[11px] text-on-surface-variant">
              <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span>
                <strong>Clarification:</strong> AI-generated indicator; not a guarantee of perfect fraud detection. Designed to augment and accelerate human recruiter decision-making.
              </span>
            </div>
          </div>

          {/* Right Dashboard Card (6 cols) */}
          <div className="lg:col-span-6">
            <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-surface-container shadow-xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-surface-container pb-5 mb-8">
                <div>
                  <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider">
                    Candidate Integrity Record
                  </div>
                  <div className="text-lg font-bold text-on-surface">Official Verification Card</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-success/15 text-success-dark text-xs font-bold border border-success/30">
                  Authenticated ✓
                </span>
              </div>

              {/* Big Score Gauge */}
              <div className="text-center py-6 bg-surface-bright rounded-2xl border border-surface-container mb-8">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Assessment Integrity Score
                </div>
                <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-success to-emerald-600">
                  94%
                </div>
                <div className="text-xs font-semibold text-indigo-brand mt-1">
                  AI TRUST SCORE • TIER 1 VERIFIED
                </div>
              </div>

              {/* Verified Checklist */}
              <div className="space-y-3">
                {checks.map((c) => (
                  <div
                    key={c.label}
                    className="p-3 rounded-xl bg-surface border border-surface-container flex items-center justify-between text-xs font-bold text-on-surface"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span>{c.label}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-success/10 text-success-dark font-mono">
                      {c.status} ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
